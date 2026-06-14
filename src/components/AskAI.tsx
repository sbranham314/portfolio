import { Fragment, useEffect, useRef, useState } from 'react';
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
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import { ACCENT } from '../theme';

type Action = {
  action: 'scroll_to_section' | 'open_case_study' | 'open_contact_form' | 'download_resume';
  target?: string;
  label: string;
};
type Msg = { role: 'user' | 'assistant'; content: string; actions?: Action[] };

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

// Contextual opener: tailor the greeting + suggested questions to the section
// the visitor is viewing when they open the chat.
const SECTION_IDS = ['about', 'experience', 'projects', 'skills', 'certifications', 'writing', 'contact'];
const OPENERS: Record<string, { greeting: string; suggestions: string[] }> = {
  projects: {
    greeting: 'Checking out his projects? Ask me how any of them work.',
    suggestions: [
      'How does the autonomous build pipeline work?',
      'Tell me about RetroStoreManager.',
      'What is StayRecap and how is it built?',
      'What is he building with AI?',
    ],
  },
  experience: {
    greeting: 'Want to dig into his experience? Ask away.',
    suggestions: [
      'What does he do at Victra?',
      'Tell me about his work at DC DES.',
      'What is his most significant impact?',
      'How many years has he been engineering?',
    ],
  },
  skills: {
    greeting: 'Curious about his skills? Ask me anything technical.',
    suggestions: [
      'What is his strongest tech stack?',
      'What is his experience with Azure and the cloud?',
      'What is his database experience?',
      'What is he building with AI?',
    ],
  },
  certifications: {
    greeting: 'Looking at his certifications? Ask me about them.',
    suggestions: [
      'What certifications does he hold?',
      'What is his Azure certification status?',
      'What cloud experience does he have?',
    ],
  },
  writing: {
    greeting: 'Interested in his writing? Ask me about it.',
    suggestions: [
      'What does he write about?',
      'What did he learn building software with AI agents?',
      'What is he building with AI?',
    ],
  },
  contact: {
    greeting: 'Want to reach Samuel? You can leave him a message right here.',
    suggestions: [
      'How can I get in touch with Samuel?',
      'Can I get a copy of his resume?',
      'Give me a 30-second summary of Samuel.',
    ],
  },
};

// Which section's midpoint is closest to the viewport center right now.
function detectSection(): string | null {
  if (typeof document === 'undefined') return null;
  const mid = window.innerHeight / 2;
  let best: string | null = null;
  let bestDist = Infinity;
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.top <= mid && r.bottom >= mid) return id;
    const center = (r.top + r.bottom) / 2;
    const dist = Math.abs(center - mid);
    if (dist < bestDist) {
      bestDist = dist;
      best = id;
    }
  }
  return best;
}

const MAX_LEN = 600;
const MAX_MESSAGE_LEN = 2000;
const MAX_JD_LEN = 8000;
const STORAGE_KEY = 'askai:messages';

type ContactStatus = 'idle' | 'sending' | 'sent' | 'error';
type JobFitStatus = 'idle' | 'loading' | 'done' | 'error';

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

// Subtle "Thinking…" shimmer shown while a reply is in flight.
const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;
const shimmerSx = {
  display: 'inline-block',
  fontSize: '0.875rem',
  fontWeight: 500,
  background:
    'linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.22) 100%)',
  backgroundSize: '200% 100%',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  animation: `${shimmer} 1.6s linear infinite`,
} as const;

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
  const [section, setSection] = useState<string | null>(null);
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

  // Job-fit state.
  const [showJobFit, setShowJobFit] = useState(false);
  const [jobDesc, setJobDesc] = useState('');
  const [jobFitStatus, setJobFitStatus] = useState<JobFitStatus>('idle');
  const [jobFitResult, setJobFitResult] = useState('');
  const [jobFitError, setJobFitError] = useState('');

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open, showContact, showJobFit]);

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

  // On open, note which section the visitor is on for a contextual greeting.
  useEffect(() => {
    if (open) setSection(detectSection());
  }, [open]);

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
      const actions: Action[] | undefined =
        res.ok && Array.isArray(data?.actions) ? data.actions : undefined;
      setLoading(false);
      revealReply(reply, actions);
    } catch {
      setLoading(false);
      revealReply('I could not reach the server. Please try again in a moment.');
    }
  }

  // Reveal the reply progressively so it reads like it's being typed in real
  // time. The backend returns the full reply at once — SWA managed functions
  // don't support true token streaming — so this is a client-side effect.
  function revealReply(full: string, actions?: Action[]) {
    if (typingRef.current) window.clearInterval(typingRef.current);
    setTyping(true);
    setMessages((m) => [...m, { role: 'assistant', content: '', actions }]);
    const total = full.length;
    const perTick = Math.max(2, Math.ceil(total / 45));
    let i = 0;
    typingRef.current = window.setInterval(() => {
      i = Math.min(total, i + perTick);
      const slice = full.slice(0, i);
      setMessages((m) => {
        const copy = m.slice();
        copy[copy.length - 1] = { ...copy[copy.length - 1], content: slice };
        return copy;
      });
      if (i >= total) {
        if (typingRef.current) window.clearInterval(typingRef.current);
        typingRef.current = null;
        setTyping(false);
      }
    }, 12);
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

  // Run a navigation action the assistant offered. On mobile the chat is
  // full-screen, so for page-driving actions we first minimize the chat (back
  // to the floating button) so the result is visible; desktop acts in place.
  function executeAction(a: Action) {
    if (a.action === 'open_contact_form') {
      openContact();
      return;
    }
    if (a.action === 'download_resume') {
      window.open('/resume.pdf', '_blank', 'noopener,noreferrer');
      return;
    }
    const run = () => {
      if (a.action === 'scroll_to_section' && a.target) {
        document.getElementById(a.target)?.scrollIntoView({ behavior: 'smooth' });
      } else if (a.action === 'open_case_study') {
        window.dispatchEvent(new CustomEvent('open-case-study', { detail: a.target }));
      }
    };
    if (isMobile) {
      setOpen(false);
      window.setTimeout(run, 280);
    } else {
      run();
    }
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

  function openJobFit() {
    setJobFitError('');
    if (jobFitStatus === 'error') setJobFitStatus('idle');
    setShowJobFit(true);
  }

  function resetJobFit() {
    setJobDesc('');
    setJobFitResult('');
    setJobFitError('');
    setJobFitStatus('idle');
  }

  function backToChat() {
    setShowContact(false);
    setShowJobFit(false);
  }

  async function submitJobFit() {
    if (jobFitStatus === 'loading') return;
    const jd = jobDesc.trim();
    if (jd.length < 40) {
      setJobFitError('Please paste a full job description.');
      return;
    }
    setJobFitError('');
    setJobFitStatus('loading');
    try {
      const res = await fetch('/api/jobfit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.result) {
        setJobFitResult(data.result);
        setJobFitStatus('done');
      } else {
        setJobFitStatus('error');
        setJobFitError(data?.error || 'Could not analyze this right now. Please try again.');
      }
    } catch {
      setJobFitStatus('error');
      setJobFitError('Could not reach the server. Please try again in a moment.');
    }
  }

  const altView = showContact || showJobFit;
  const opener = (section && OPENERS[section]) || null;
  const greeting = opener?.greeting ?? "Hi! Ask me anything about Samuel's experience, skills, or projects.";
  const openerSuggestions = opener?.suggestions ?? SUGGESTED;
  const suggestions = followUps();
  const showSuggestions =
    !altView && !loading && !typing && messages.length > 0 && suggestions.length > 0;

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
              {altView ? (
                <IconButton
                  size="small"
                  onClick={backToChat}
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
                  {showContact ? 'Leave a message' : showJobFit ? 'Job fit check' : 'Ask about Samuel'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {showContact
                    ? 'It goes straight to his inbox'
                    : showJobFit
                      ? 'See how Samuel matches a role'
                      : 'AI answers from his résumé'}
                </Typography>
              </Box>
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                {!altView && (
                  <IconButton size="small" onClick={openJobFit} aria-label="Check a job description">
                    <WorkOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                )}
                {!altView && (
                  <IconButton size="small" onClick={openContact} aria-label="Leave a message">
                    <MailOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                )}
                {!altView && messages.length > 0 && (
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
            ) : showJobFit ? (
              /* Job-fit view */
              <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                {jobFitStatus === 'done' ? (
                  <Stack spacing={2}>
                    <Box sx={mdSx}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{jobFitResult}</ReactMarkdown>
                    </Box>
                    <Button variant="outlined" onClick={resetJobFit} sx={{ alignSelf: 'flex-start' }}>
                      Check another role
                    </Button>
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    <Typography variant="body2" color="text.secondary">
                      Paste a job description and I'll map Samuel's experience to it: strong matches,
                      transferable strengths, and any gaps.
                    </Typography>
                    <TextField
                      placeholder="Paste the job description here…"
                      size="small"
                      fullWidth
                      multiline
                      minRows={8}
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value.slice(0, MAX_JD_LEN))}
                      disabled={jobFitStatus === 'loading'}
                    />
                    {jobFitStatus === 'loading' && (
                      <Box component="span" sx={shimmerSx}>
                        Analyzing fit…
                      </Box>
                    )}
                    {jobFitError && (
                      <Typography variant="caption" color="error">
                        {jobFitError}
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      onClick={submitJobFit}
                      disabled={jobFitStatus === 'loading' || !jobDesc.trim()}
                      startIcon={
                        jobFitStatus === 'loading' ? (
                          <CircularProgress size={16} thickness={5} color="inherit" />
                        ) : (
                          <AutoAwesomeRoundedIcon />
                        )
                      }
                      sx={{ color: '#0A0E1A', fontWeight: 700, alignSelf: 'flex-start' }}
                    >
                      {jobFitStatus === 'loading' ? 'Analyzing…' : 'Analyze fit'}
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
                        {greeting}
                      </Typography>
                      <Stack spacing={1}>
                        {openerSuggestions.map((q) => (
                          <Chip key={q} label={q} variant="outlined" onClick={() => send(q)} sx={chipSx} />
                        ))}
                      </Stack>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<WorkOutlineRoundedIcon />}
                        onClick={openJobFit}
                        sx={{ mt: 1.5, borderColor: `${ACCENT}55`, color: ACCENT }}
                      >
                        Check a job description
                      </Button>
                    </Box>
                  )}

                  {messages.map((m, i) => (
                    <Fragment key={i}>
                      <Box
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
                      {m.role === 'assistant' &&
                        m.actions &&
                        m.actions.length > 0 &&
                        !(typing && i === messages.length - 1) && (
                          <Stack spacing={0.75} sx={{ alignSelf: 'flex-start', maxWidth: '90%' }}>
                            {m.actions.map((a, j) => (
                              <Chip
                                key={j}
                                label={a.label}
                                icon={<AutoAwesomeRoundedIcon />}
                                onClick={() => executeAction(a)}
                                sx={{
                                  alignSelf: 'flex-start',
                                  height: 'auto',
                                  py: 0.5,
                                  bgcolor: `${ACCENT}14`,
                                  color: ACCENT,
                                  border: `1px solid ${ACCENT}55`,
                                  '& .MuiChip-icon': { color: ACCENT },
                                  '& .MuiChip-label': { whiteSpace: 'normal' },
                                  '&:hover': { bgcolor: `${ACCENT}22` },
                                }}
                              />
                            ))}
                          </Stack>
                        )}
                    </Fragment>
                  ))}

                  {loading && (
                    <Box sx={{ alignSelf: 'flex-start', px: 1.5, py: 1 }}>
                      <Box component="span" sx={shimmerSx}>
                        Thinking…
                      </Box>
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
