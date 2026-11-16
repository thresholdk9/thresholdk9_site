// Cloudflare Worker: serves the static site from dist/ and handles form submissions.
// Static files are served first; only requests that match no file reach this code.
//
// Settings (Cloudflare dashboard → Workers & Pages → thresholdk9-site → Settings → Variables and Secrets):
//   RESEND_API_KEY    secret. Without it the contact form reports "not set up yet" and shows the email address.
//   TURNSTILE_SECRET  secret. Without it the Cloudflare test key is used (accepts the test widget only).
//   MAIL_TO / MAIL_FROM are plain vars set in wrangler.jsonc.

const TURNSTILE_TEST_SECRET = '1x0000000000000000000000000000000AA';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
      try {
        return await handleContact(request, env);
      } catch (err) {
        console.error('contact form error', err);
        return json({ ok: false, error: 'server' }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  },
};

const clean = (v, max) => String(v ?? '').replace(/\r\n?/g, '\n').trim().slice(0, max);

async function verifyTurnstile(token, ip, env) {
  if (!token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET || TURNSTILE_TEST_SECRET, response: token, remoteip: ip }),
  });
  const out = await res.json();
  return out.success === true;
}

export async function handleContact(request, env) {
  const form = await request.formData();

  // Honeypot: real visitors never see or fill this field.
  if (clean(form.get('website'), 200)) return json({ ok: true });

  const data = {
    name: clean(form.get('name'), 120),
    email: clean(form.get('email'), 200),
    dog: clean(form.get('dog'), 200),
    message: clean(form.get('message'), 5000),
  };
  if (!data.name || !data.dog || !data.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (!(await verifyTurnstile(form.get('cf-turnstile-response'), ip, env))) {
    return json({ ok: false, error: 'verify' }, 400);
  }

  if (!env.RESEND_API_KEY) return json({ ok: false, error: 'not-configured' }, 503);

  const text = [
    'New message from the Threshold K9 website contact form.',
    '',
    `The Handler: ${data.name}`,
    `The Frequency: ${data.email}`,
    `The Dog: ${data.dog}`,
    '',
    'The Current Reality:',
    data.message,
    '',
    'Reply to this email to answer them directly.',
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: [env.MAIL_TO],
      reply_to: data.email,
      subject: `Website message from ${data.name} (${data.dog})`.slice(0, 200),
      text,
    }),
  });
  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return json({ ok: false, error: 'send' }, 502);
  }
  return json({ ok: true });
}
