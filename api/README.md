# Portfolio API — "Ask AI about Samuel"

Azure Functions backend (Node 20, v4 programming model) for the chat assistant on samuelbranham.com. It proxies questions to the Claude API so the API key never reaches the browser, and enforces input/rate/cost guardrails.

## Endpoint

`POST /api/chat`

```json
// request
{ "message": "What's his Azure experience?", "history": [{ "role": "user", "content": "..." }, { "role": "assistant", "content": "..." }] }
// response
{ "reply": "..." }            // 200
{ "error": "..." }            // 4xx / 5xx
```

## Required configuration (Azure)

Set these as **Application settings** in the Static Web App (Portal → your SWA → *Configuration* → *Application settings*, or `az staticwebapp appsettings set`). They are secrets — never commit them.

| Setting | Required | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | **Yes** | Your Claude API key. Without it the endpoint returns 503. |
| `TURNSTILE_SECRET` | No | Cloudflare Turnstile secret. If set, requests must include a valid `turnstileToken`. If unset, the bot check is skipped. |

## Model & limits (edit in `src/functions/chat.js`)

- **Model:** `claude-haiku-4-5`
- **Max output:** 400 tokens
- **Input cap:** 600 chars/message, last 6 turns of history
- **Rate limits (best-effort, in-memory):** 8/min and 40/day per IP; 1,500/day global

> ⚠️ The in-memory limits reset on cold start and aren't shared across instances — they're a speed bump, not a hard ceiling. **Set a monthly spend limit in the Anthropic Console** as the real cost backstop. For durable limits, move the counters to Azure Table Storage.

## The résumé context

`resume-context.md` (in this folder) is the only knowledge the assistant has about Samuel. Edit it to change what the AI knows or how it describes him — it's read at cold start and injected into the system prompt. Keep it lean: every token is billed on each question.

## Local development

```bash
npm install
# create local.settings.json with { "Values": { "ANTHROPIC_API_KEY": "sk-ant-..." } }
func start          # requires Azure Functions Core Tools
```
