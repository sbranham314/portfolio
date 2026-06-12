import { useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Dialog, Box, InputBase, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';

type Cmd = { id: string; label: string; hint?: string; icon: ReactNode; run: () => void };

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const commands = useMemo<Cmd[]>(() => {
    const nav = (label: string, id: string): Cmd => ({
      id,
      label: `Go to ${label}`,
      hint: 'Section',
      icon: <ArrowForwardRoundedIcon fontSize="small" />,
      run: () => go(id),
    });
    return [
      nav('About', 'about'),
      nav('Skills', 'skills'),
      nav('Experience', 'experience'),
      nav('Projects', 'projects'),
      nav('GitHub Activity', 'github'),
      nav('Writing', 'writing'),
      nav('Certifications', 'certifications'),
      nav('Contact', 'contact'),
      {
        id: 'ask',
        label: 'Ask the AI about Samuel',
        hint: 'Chat',
        icon: <AutoAwesomeRoundedIcon fontSize="small" />,
        run: () => window.dispatchEvent(new Event('open-ask-ai')),
      },
      {
        id: 'resume',
        label: 'Download résumé (PDF)',
        hint: 'File',
        icon: <DescriptionOutlinedIcon fontSize="small" />,
        run: () => window.open('/resume.pdf', '_blank'),
      },
      {
        id: 'post',
        label: 'Read: Building Software with AI Agents',
        hint: 'Writing',
        icon: <ArticleOutlinedIcon fontSize="small" />,
        run: () => {
          window.location.href = '/writing/building-software-with-ai-agents.html';
        },
      },
      {
        id: 'github-ext',
        label: 'GitHub',
        hint: 'External',
        icon: <GitHubIcon fontSize="small" />,
        run: () => window.open('https://github.com/sbranham314', '_blank'),
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        hint: 'External',
        icon: <LinkedInIcon fontSize="small" />,
        run: () => window.open('https://linkedin.com/in/samuelbranham', '_blank'),
      },
      {
        id: 'email',
        label: 'Email Samuel',
        hint: 'Contact',
        icon: <MailOutlineRoundedIcon fontSize="small" />,
        run: () => {
          window.location.href = 'mailto:sbranham314@gmail.com';
        },
      },
    ];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q) || (c.hint || '').toLowerCase().includes(q));
  }, [query, commands]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-command-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-command-palette', onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
    }
  }, [open]);
  useEffect(() => {
    setActive(0);
  }, [query]);

  const run = (c?: Cmd) => {
    if (!c) return;
    setOpen(false);
    setTimeout(() => c.run(), 10);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="sm"
      sx={{
        '& .MuiDialog-container': { alignItems: 'flex-start' },
        '& .MuiPaper-root': {
          mt: '12vh',
          bgcolor: '#141B2E',
          border: '1px solid rgba(0,212,255,0.18)',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          py: 2,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <SearchRoundedIcon sx={{ color: 'text.secondary' }} />
        <InputBase
          autoFocus
          fullWidth
          placeholder="Search or jump to…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, filtered.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              run(filtered[active]);
            }
          }}
          sx={{ color: 'text.primary', fontSize: '1.05rem' }}
        />
      </Box>

      <Box sx={{ maxHeight: 360, overflowY: 'auto', py: 1 }}>
        {filtered.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2.5, py: 2 }}>
            No matches.
          </Typography>
        )}
        {filtered.map((c, i) => (
          <Box
            key={c.id}
            onClick={() => run(c)}
            onMouseMove={() => setActive(i)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mx: 1,
              px: 1.5,
              py: 1.25,
              borderRadius: 2,
              cursor: 'pointer',
              bgcolor: i === active ? 'rgba(0,212,255,0.1)' : 'transparent',
            }}
          >
            <Box sx={{ color: i === active ? 'primary.main' : 'text.secondary', display: 'flex' }}>{c.icon}</Box>
            <Typography variant="body2" sx={{ flex: 1, fontWeight: i === active ? 600 : 400, color: 'text.primary' }}>
              {c.label}
            </Typography>
            {c.hint && (
              <Typography variant="caption" color="text.secondary">
                {c.hint}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, px: 2.5, py: 1.25, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <Typography variant="caption" color="text.secondary">↑↓ navigate</Typography>
        <Typography variant="caption" color="text.secondary">↵ select</Typography>
        <Typography variant="caption" color="text.secondary">esc close</Typography>
      </Box>
    </Dialog>
  );
}
