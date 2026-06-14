import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Chip,
  CircularProgress,
  Stack,
  Fab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@emotion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { ACCENT } from '../theme';

type Msg = { role: 'user' | 'assistant'; content: string };

const SUGGESTED = [
  'Give me a 30-second summary of Samuel.',
  'What is his experience with Azure and the cloud?',
  'Tell me about his leadership and team-lead work.',
  'What is he building with AI?',
];

// Contextual follow-ups: if the last answer mentions a topic, offer a relevant
// next question. Falls back to DEFAULT_FOLLOWUPS to always show a few.
const FOLLOWUP_RULES: { kw: RegExp; q: string }[] = [
  { kw: /azure|cloud|devops|ci\/cd|pipeline|deploy/i, q: 'What cloud and DevOps tools does he use?' },
  { kw: /lead|team|scrum|manage|mentor/i, q: 'Tell me about his leadership experience.' },
  { kw: /\bai\b|claude|llm|machine learning|\bml\b/i, q: 'What is he building with AI?' },
  { kw: /project|retro|game|store|portfolio|built/i, q: 'What projects has he built?' },
  { kw: /cert|certification|az-|exam/i, q: 'What certifications does he hold?' },
  { kw: /\.net|c#|react|typescript|python|sql|code|develop/i, q: 'What is his strongest tech stack?' },
];
const DEFAULT_FOLLOWUPS = [
  'What are his strongest technical skills?',
  'What is he building with AI?',
  'Give me a 30-second summary of Samuel.',
];

const MAX_LEN = 600;
const MAX_MESSAGE_LEN = 2000;
const STORAGE_KEY = 'askai:messages';

type ContactStatus = 'idle' | 'sending' | 'sent' | 'error';

// Styling for the markdown Claude returns (bold, lists, links, inline code).
const mdSx = {
  fontSize: '0.875rem',
  lineHeight: 1.6,
  '& > :first-of-type': { mt: 0 },
  '& > :last-child': { mb: 0 },
  '& p': { m: 0, mb: 1 },
  '& ul, & ol': { m: 0, mb: 1, pl: 2.5 },
  '& li': { mb: 0.25 },
  '& a': { color: ACCENT, textDecoration: 'underline' },
  '& strong': { fontWeight: 700 },
  '& em': { fontStyle: 'italic' },
  '& code': {
    fontFamily: 'monospace',
    fontSize: '0.85em',
    bgcolor: 'rgba(255,255,255,0.08)',
    px: 0.5,
    py: '1px',
    borderRadius: '4px',
  },
  '& h1, & h2, & h3, & h4': { fontSize: '0.95rem', fontWeight: 700, m: 0, mb: 0.5, mt: 1 },
} as const;

const chipSx = {
  justifyContent: 'flex-start',
  height: 'auto',
  py: 0.75,
  borderColor: 'rgba(255,255,255,0.15)',
  '& .MuiChip-label': { whiteSpace: 'normal' },
} as const;

const pulse = keyframes`
  0% { box-shadow: 0 8px 24px ${ACCENT}55, 0 0 0 0 ${ACCENT}66; }
  70% { box-shadow: 0 8px 24px ${ACCENT}55, 0 0 0 16px ${ACCENT}00; }
  100% { box-shadow: 0 8px 24px ${ACCENT}55, 0 0 0 0 ${ACCENT}00; }
`;

function loadMessages(): Msg[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AskAI() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(loadMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<number | null>(null);

  // Contact form state.
  const [showContact, setShowContact] = useState(false);
  const [cName, setCName] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cMessage, setCMessage] = useState('');
  const [cCompany, setCCompany] = useState(''); // honeypot
  const [contactStatus, setContactStatus] = useState<ContactStatus>('idle');
  const [contactError, setContactError] = useState('');

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open, showContact]);

  // Let other parts of the site (e.g. the Projects card) open the chat.
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-ask-ai', handler);
    return () => window.removeEventListener('open-ask-ai', handler);
  }, []);

  // Stop the typewriter timer if the component unmounts mid-reveal.
  useEffect(() => () => {
    if (typingRef.current) window.clearInterval(typingRef.current);
  }, []);

  // Persist the conversation so reopening the widget keeps context. Skip while
  // the typewriter is running to avoid writing on every animation tick.
  useEffect(() => {
    if (typing) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      /* storage full or unavailable — non-fatal */
    }
  }, [messages, typing]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading || typing) return;
    setInput('');
    const history = messages.slice(-6);
    setMessages((m) => [...m, { role: 'user', content }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: content, history }),
      });
      const data = await res.json().catch(() => ({}));
      const reply =
        res.ok && data?.reply ? data.reply : data?.error || 'Something went wrong. Please try again.';
      setLoading(false);
      revealReply(reply);
    } catch {
      setLoading(false);
      revealReply('I could not reach the server. Please try again in a moment.');
    }
  }

  // Reveal the reply progressively so it reads like it's being typed in real
  // time. The backend returns the full reply at once — SWA managed functions
  // don't support true token streaming — so this is a client-side effect.
  function revealReply(full: string) {
    if (typingRef.current) window.clearInterval(typingRef.current);
    setTyping(true);
    setMessages((m) => [...m, { role: 'assistant', content: '' }]);
    const total = full.length;
    const perTick = Math.max(1, Math.ceil(total / 60));
    let i = 0;
    typingRef.current = window.setInterval(() => {
      i = Math.min(total, i + perTick);
      const slice = full.slice(0, i);
      setMessages((m) => {
        const copy = m.slice();
        copy[copy.length - 1] = { role: 'assistant', content: slice };
        return copy;
      });
      if (i >= total) {
        if (typingRef.current) window.clearInterval(typingRef.current);
        typingRef.current = null;
        setTyping(false);
      }
    }, 18);
  }

  function followUps(): string[] {
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'assistant') return [];
    const asked = new Set(
      messages.filter((m) => m.role === 'user').map((m) => m.content.trim().toLowerCase()),
    );
    const text = last.content.toLowerCase();
    const picks: string[] = [];
    const add = (q: string) => {
      if (picks.length < 3 && !picks.includes(q) && !asked.has(q.toLowerCase())) picks.push(q);
    };
    for (const r of FOLLOWUP_RULES) if (r.kw.test(text)) add(r.q);
    for (const q of DEFAULT_FOLLOWUPS) add(q);
    return picks;
  }

  function clearChat() {
    if (typingRef.current) window.clearInterval(typingRef.current);
    typingRef.current = null;
    setTyping(false);
    setLoading(false);
    setMessages([]);
  }

  function openContact() {
    setContactStatus('idle');
    setContactError('');
    setShowContact(true);
  }

  async function submitContact() {
    if (contactStatus === 'sending') return;
    const email = cEmail.trim();
    const message = cMessage.trim();
    if (!EMAIL_RE.test(email)) {
      setContactError('Please enter a valid email address.');
      return;
    }
    if (!message) {
      setContactError('Please enter a message.');
      return;
    }
    setContactError('');
    setContactStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: cName.trim(), email, message, company: cCompany }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setContactStatus('sent');
        setCName('');
        setCEmail('');
        setCMessage('');
      } else {
        setContactStatus('error');
        setContactError(data?.error || 'Could not send your message. Please try again.');
      }
    } catch {
      setContactStatus('error');
      setContactError('Could not reach the server. Please try again in a moment.');
    }
  }

  const suggestions = followUps();
  const showSuggestions =
    !showContact && !loading && !typing && messages.length > 0 && suggestions.length > 0;

  const panelStyle: CSSProperties = {
    position: 'fixed',
    zIndex: 1299,
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    ...(isMobile
      ? { left: 0, right: 0, bottom: 0, width: '100%', height: '85vh', borderRadius: '16px 16px 0 0' }
      : { right: 24, bottom: 96, width: 380, height: 540, maxHeight: '78vh', borderRadius: 16 }),
  };

  return (
    <>
      <Fab
        variant="extended"
        color="primary"
        onClick={() => setOpen((o) => !o)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
          color: '#0A0E1A',
          fontWeight: 700,
          px: 2.5,
          boxShadow: `0 8px 24px ${ACCENT}55`,
          ...(open ? {} : { animation: `${pulse} 2.4s ease-out infinite` }),
          // On mobile the full-height panel has its own header close button; the
          // floating button would overlap the send button, so hide it when open.
          ...(isMobile && open ? { display: 'none' } : {}),
        }}
      >
        {open ? (
          <>
            <CloseRoundedIcon sx={{ mr: 1 }} />
            Close
          </>
        ) : (
          <>
            <AutoAwesomeRoundedIcon sx={{ mr: 1 }} />
            Ask AI about me
          </>
        )}
      </Fab>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={panelStyle}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
              }}
            >
              {showContact ? (
                <IconButton
                  size="small"
                  onClick={() => setShowContact(false)}
                  sx={{ flexShrink: 0 }}
                  aria-label="Back to chat"
                >
                  <ArrowBackRoundedIcon fontSize="small" />
                </IconButton>
              ) : (
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    bgcolor: ACCENT,
                    display: 'grid',
                    placeItems: 'center',
                    color: '#0A0E1A',
                    flexShrink: 0,
                  }}
                >
                  <AutoAwesomeRoundedIcon fontSize="small" />
                </Box>
              )}
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {showContact ? 'Leave a message' : 'Ask about Samuel'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {showContact ? 'It goes straight to his inbox' : 'AI answers from his résumé'}
                </Typography>
              </Box>
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                {!showContact && (
                  <IconButton size="small" onClick={openContact} aria-label="Leave a message">
                    <MailOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                )}
                {!showContact && messages.length > 0 && (
                  <IconButton size="small" onClick={clearChat} aria-label="Clear conversation">
                    <RestartAltRoundedIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton size="small" onClick={() => setOpen(false)} aria-label="Close">
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {showContact ? (
              /* Contact form */
              <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                {contactStatus === 'sent' ? (
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <CheckCircleRoundedIcon sx={{ fontSize: 48, color: ACCENT, mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                      Message sent!
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Thanks for reaching out. Samuel will get back to you soon.
                    </Typography>
                    <Button variant="outlined" onClick={() => setShowContact(false)}>
                      Back to chat
                    </Button>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Send Samuel a note and he'll reply to your email.
                    </Typography>
                    <TextField
                      label="Your name (optional)"
                      size="small"
                      fullWidth
                      value={cName}
                      onChange={(e) => setCName(e.target.value.slice(0, 120))}
                      disabled={contactStatus === 'sending'}
                    />
                    <TextField
                      label="Your email"
                      type="email"
                      size="small"
                      fullWidth
                      required
                      value={cEmail}
                      onChange={(e) => setCEmail(e.target.value.slice(0, 200))}
                      disabled={contactStatus === 'sending'}
                    />
                    <TextField
                      label="Message"
                      size="small"
                      fullWidth
                      required
                      multiline
                      minRows={4}
                      value={cMessage}
                      onChange={(e) => setCMessage(e.target.value.slice(0, MAX_MESSAGE_LEN))}
                      disabled={contactStatus === 'sending'}
                    />
                    {/* Honeypot — hidden from real users, catches bots */}
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={cCompany}
                      onChange={(e) => setCCompany(e.target.value)}
                      style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }}
                      aria-hidden="true"
                    />
                    {contactError && (
                      <Typography variant="caption" color="error">
                        {contactError}
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      onClick={submitContact}
                      disabled={contactStatus === 'sending'}
                      startIcon={
                        contactStatus === 'sending' ? (
                          <CircularProgress size={16} thickness={5} color="inherit" />
                        ) : (
                          <SendRoundedIcon />
                        )
                      }
                      sx={{ color: '#0A0E1A', fontWeight: 700 }}
                    >
                      {contactStatus === 'sending' ? 'Sending…' : 'Send message'}
                    </Button>
                  </Stack>
                )}
              </Box>
            ) : (
              <>
                {/* Messages */}
                <Box
                  ref={listRef}
                  sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}
                >
                  {messages.length === 0 && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        Hi! Ask me anything about Samuel's experience, skills, or projects.
                      </Typography>
                      <Stack spacing={1}>
                        {SUGGESTED.map((q) => (
                          <Chip key={q} label={q} variant="outlined" onClick={() => send(q)} sx={chipSx} />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {messages.map((m, i) => (
                    <Box
                      key={i}
                      sx={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,
                        bgcolor: m.role === 'user' ? ACCENT : 'rgba(255,255,255,0.05)',
                        color: m.role === 'user' ? '#0A0E1A' : 'text.primary',
                        whiteSpace: m.role === 'user' ? 'pre-wrap' : 'normal',
                        wordBreak: 'break-word',
                      }}
                    >
                      {m.role === 'user' ? (
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                          {m.content}
                        </Typography>
                      ) : (
                        <Box sx={mdSx}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {typing && i === messages.length - 1 ? `${m.content}▍` : m.content}
                          </ReactMarkdown>
                        </Box>
                      )}
                    </Box>
                  ))}

                  {loading && (
                    <Box sx={{ alignSelf: 'flex-start', px: 1.5, py: 1.25 }}>
                      <CircularProgress size={16} thickness={5} />
                    </Box>
                  )}

                  {showSuggestions && (
                    <Stack spacing={1} sx={{ mt: 0.5 }}>
                      {suggestions.map((q) => (
                        <Chip
                          key={q}
                          label={q}
                          variant="outlined"
                          size="small"
                          onClick={() => send(q)}
                          sx={{ ...chipSx, py: 0.5, alignSelf: 'flex-start', maxWidth: '90%' }}
                        />
                      ))}
                    </Stack>
                  )}
                </Box>

                {/* Input */}
                <Box
                  sx={{
                    p: 1.5,
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    gap: 1,
                    alignItems: 'flex-end',
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    maxRows={4}
                    placeholder="Ask a question…"
                    value={input}
                    onChange={(e) => setInput(e.target.value.slice(0, MAX_LEN))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    disabled={loading}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => send()}
                    disabled={loading || typing || !input.trim()}
                    aria-label="Send"
                  >
                    <SendRoundedIcon />
                  </IconButton>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ px: 2, pb: 1, textAlign: 'center' }}>
                  AI can make mistakes. For specifics, email Samuel.
                </Typography>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
