import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Box,
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
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ACCENT } from '../theme';

type Msg = { role: 'user' | 'assistant'; content: string };

const SUGGESTED = [
  'Give me a 30-second summary of Samuel.',
  'What is his experience with Azure and the cloud?',
  'Tell me about his leadership and team-lead work.',
  'What is he building with AI?',
];

const MAX_LEN = 600;

const pulse = keyframes`
  0% { box-shadow: 0 8px 24px ${ACCENT}55, 0 0 0 0 ${ACCENT}66; }
  70% { box-shadow: 0 8px 24px ${ACCENT}55, 0 0 0 16px ${ACCENT}00; }
  100% { box-shadow: 0 8px 24px ${ACCENT}55, 0 0 0 0 ${ACCENT}00; }
`;

export default function AskAI() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  // Let other parts of the site (e.g. the Projects card) open the chat.
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-ask-ai', handler);
    return () => window.removeEventListener('open-ask-ai', handler);
  }, []);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
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
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'I could not reach the server. Please try again in a moment.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

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
        aria-label="Ask AI about Samuel"
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
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  Ask about Samuel
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  AI answers from his résumé
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => setOpen(false)} sx={{ ml: 'auto' }} aria-label="Close">
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Box>

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
                      <Chip
                        key={q}
                        label={q}
                        variant="outlined"
                        onClick={() => send(q)}
                        sx={{
                          justifyContent: 'flex-start',
                          height: 'auto',
                          py: 0.75,
                          borderColor: 'rgba(255,255,255,0.15)',
                          '& .MuiChip-label': { whiteSpace: 'normal' },
                        }}
                      />
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
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {m.content}
                  </Typography>
                </Box>
              ))}

              {loading && (
                <Box sx={{ alignSelf: 'flex-start', px: 1.5, py: 1.25 }}>
                  <CircularProgress size={16} thickness={5} />
                </Box>
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
                disabled={loading || !input.trim()}
                aria-label="Send"
              >
                <SendRoundedIcon />
              </IconButton>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ px: 2, pb: 1, textAlign: 'center' }}>
              AI can make mistakes. For specifics, email Samuel.
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
