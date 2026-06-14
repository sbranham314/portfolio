import { app } from '@azure/functions';
import { EmailClient } from '@azure/communication-email';

// --- Configuration ---
const MAX_NAME_LEN = 120;
const MAX_EMAIL_LEN = 200;
const MAX_MESSAGE_LEN = 2000;

// Where lead notifications are sent. Override with the LEAD_TO app setting.
const TO_ADDRESS = process.env.LEAD_TO || 'sbranham314@gmail.com';

// Best-effort, in-memory rate limits (reset on cold start, per-instance). A
// speed bump against spam bursts — the hard backstop is the per-IP/day cap plus
// the honeypot field. See api/README.md.
const PER_IP_PER_HOUR = 3;
const PER_IP_PER_DAY = 8;
const GLOBAL_PER_DAY = 100;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- In-memory rate-limit state ---
let currentDay = todayStamp();
let globalCount = 0;
const ipHourHits = new Map();
const ipDayHits = new Map();

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

function rollDayIfNeeded() {
  const today = todayStamp();
  if (today !== currentDay) {
    currentDay = today;
    globalCount = 0;
    ipDayHits.clear();
  }
}

function checkAndRecord(ip) {
  rollDayIfNeeded();
  const now = Date.now();

  if (globalCount >= GLOBAL_PER_DAY) {
    return { ok: false, status: 429, error: 'The contact form has reached its limit for today. Please email Samuel directly at sbranham314@gmail.com.' };
  }

  const recent = (ipHourHits.get(ip) || []).filter((t) => now - t < 3_600_000);
  if (recent.length >= PER_IP_PER_HOUR) {
    return { ok: false, status: 429, error: "You've sent a few messages already — please wait a bit before sending another." };
  }

  const dayCount = ipDayHits.get(ip) || 0;
  if (dayCount >= PER_IP_PER_DAY) {
    return { ok: false, status: 429, error: "You've reached today's limit. Please email Samuel directly at sbranham314@gmail.com." };
  }

  recent.push(now);
  ipHourHits.set(ip, recent);
  ipDayHits.set(ip, dayCount + 1);
  globalCount += 1;
  return { ok: true };
}

function clientIp(request) {
  const fwd = request.headers.get('x-forwarded-for') || '';
  return fwd.split(',')[0].trim() || 'unknown';
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

app.http('contact', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const ip = clientIp(request);

    let body;
    try {
      body = await request.json();
    } catch {
      return { status: 400, jsonBody: { error: 'Invalid request body.' } };
    }

    // Honeypot: real users never fill the hidden "company" field. Silently
    // accept (so bots don't learn) but do nothing.
    if (typeof body?.company === 'string' && body.company.trim()) {
      return { status: 200, jsonBody: { ok: true } };
    }

    const name = (typeof body?.name === 'string' ? body.name.trim() : '').slice(0, MAX_NAME_LEN);
    const email = (typeof body?.email === 'string' ? body.email.trim() : '').slice(0, MAX_EMAIL_LEN);
    const message = (typeof body?.message === 'string' ? body.message.trim() : '').slice(0, MAX_MESSAGE_LEN);

    if (!EMAIL_RE.test(email)) {
      return { status: 400, jsonBody: { error: 'Please enter a valid email address.' } };
    }
    if (!message) {
      return { status: 400, jsonBody: { error: 'Please enter a message.' } };
    }

    const connectionString = process.env.ACS_CONNECTION_STRING;
    const senderAddress = process.env.ACS_SENDER_ADDRESS;
    if (!connectionString || !senderAddress) {
      context.error('ACS_CONNECTION_STRING or ACS_SENDER_ADDRESS is not configured.');
      return { status: 503, jsonBody: { error: 'The contact form is not configured yet. Please email Samuel at sbranham314@gmail.com.' } };
    }

    const limit = checkAndRecord(ip);
    if (!limit.ok) {
      return { status: limit.status, jsonBody: { error: limit.error } };
    }

    const who = name ? `${name} <${email}>` : email;
    const plainText = `New message from the portfolio chat\n\nFrom: ${who}\n\n${message}`;
    const html = `<p><strong>New message from the portfolio chat</strong></p>
<p><strong>From:</strong> ${escapeHtml(who)}</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;

    try {
      const client = new EmailClient(connectionString);
      const poller = await client.beginSend({
        senderAddress,
        content: {
          subject: `Portfolio message from ${name || email}`,
          plainText,
          html,
        },
        recipients: { to: [{ address: TO_ADDRESS }] },
        replyTo: [{ address: email, displayName: name || email }],
      });
      await poller.pollUntilDone();
      return { status: 200, jsonBody: { ok: true } };
    } catch (err) {
      context.error('ACS email send failed:', err);
      return { status: 502, jsonBody: { error: 'Could not send your message right now. Please email Samuel at sbranham314@gmail.com.' } };
    }
  },
});
