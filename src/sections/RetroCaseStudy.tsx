import type { ReactNode } from 'react';
import { Box, Container, Typography, Chip, Button, Stack, IconButton, Divider } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';

const ACCENT = '#00D4FF';
const CARD = '#1A2035';

const HIGHLIGHTS: { t: string; d: string }[] = [
  {
    t: 'Vision-powered trade-in intake',
    d: 'A store owner snaps a photo of a customer trade-in and Claude vision identifies the title, platform, and condition, then pre-populates the inventory record. The slowest task at the counter collapses into a few seconds.',
  },
  {
    t: 'Tenant isolation enforced on every endpoint',
    d: 'Each request carries a company_id extracted from its JWT, and a custom [RequirePermission] attribute checks access on every Azure Function. A store can only ever touch its own data, and the check lives at the boundary rather than scattered through business logic.',
  },
  {
    t: 'Billing as a state machine',
    d: 'Stripe drives subscriptions through webhooks, with an explicit trial-to-paid state machine rather than ad hoc flags. The system always knows what state an account is in and why.',
  },
  {
    t: 'Built and operated by agents',
    d: 'RetroStoreManager is produced by the same autonomous multi-agent pipeline as StayRecap: an orchestrator reads the spec and dispatches AI agents to write, review, test, and deploy across four coordinated repositories.',
  },
];

const TECH = ['React', 'TypeScript', 'Material UI', '.NET 8', 'Azure Functions', 'PostgreSQL', 'Claude (Vision)', 'Stripe', 'GitHub Actions'];

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Typography variant="overline" sx={{ color: ACCENT, letterSpacing: '0.18em', fontWeight: 600, display: 'block', mb: 1.5 }}>
      {children}
    </Typography>
  );
}

export default function RetroCaseStudy({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1300,
            background: 'rgba(6,9,16,0.96)',
            backdropFilter: 'blur(6px)',
            overflowY: 'auto',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ position: 'sticky', top: 0, zIndex: 2, display: 'flex', justifyContent: 'flex-end', p: 2, background: 'linear-gradient(180deg, rgba(6,9,16,0.95), rgba(6,9,16,0))' }}>
              <IconButton onClick={onClose} aria-label="Close case study" sx={{ color: 'text.secondary', '&:hover': { color: ACCENT } }}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Container maxWidth="md" sx={{ pb: 12, pt: 1 }}>
              <Typography variant="overline" sx={{ color: ACCENT, letterSpacing: '0.18em', fontWeight: 600 }}>
                Case Study · Multi-Tenant SaaS · 4-Repo Architecture
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mt: 1, mb: 2 }}>
                RetroStoreManager
              </Typography>
              <Typography variant="h6" component="p" sx={{ color: 'text.secondary', fontWeight: 400, lineHeight: 1.7, mb: 5 }}>
                A multi-tenant SaaS for retro game and trading-card-game store owners, built and operated by the same
                autonomous agent pipeline as StayRecap.
              </Typography>

              <SectionLabel>The product</SectionLabel>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                Retro and TCG stores run on inventory that is messy by nature: consoles, loose cartridges, complete-in-box
                sets, and thousands of card singles, each with its own condition and price. The highest-friction moment is
                the counter, where a customer brings in a stack to trade and someone has to identify and price every item by
                hand.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5 }}>
                RetroStoreManager gives owners a multi-tenant back office for all of it, and removes the worst of that
                friction: a photo of a trade-in is identified by Claude vision (title, platform, condition) and turned into a
                ready-to-edit inventory record in seconds.
              </Typography>

              <SectionLabel>Runtime architecture</SectionLabel>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 5 }}>
                A React, TypeScript, and Material UI single-page app on Azure Static Web Apps talks to a .NET 8 Azure
                Functions API, backed by PostgreSQL for multi-tenant data, Claude vision for trade-in identification, and
                Stripe for billing. The codebase is split across four coordinated repositories (frontend, API, data model,
                and the orchestrator that runs the build pipeline).
              </Typography>

              <SectionLabel>Engineering highlights</SectionLabel>
              <Stack spacing={2} sx={{ mb: 5 }}>
                {HIGHLIGHTS.map((h) => (
                  <Box key={h.t} sx={{ p: 2.5, bgcolor: CARD, border: '1px solid rgba(0,212,255,0.08)', borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>{h.t}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{h.d}</Typography>
                  </Box>
                ))}
              </Stack>

              <SectionLabel>Stack</SectionLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 5 }}>
                {TECH.map((t) => (
                  <Chip key={t} label={t} size="small" sx={{ bgcolor: 'rgba(0,212,255,0.05)', color: 'text.secondary', border: '1px solid rgba(0,212,255,0.1)', fontSize: '0.72rem' }} />
                ))}
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 4 }} />

              <SectionLabel>Source</SectionLabel>
              <Button
                variant="outlined"
                size="small"
                startIcon={<GitHubIcon fontSize="small" />}
                href="https://github.com/retrostoremanager"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ borderColor: 'rgba(255,255,255,0.12)', color: 'text.secondary', '&:hover': { borderColor: ACCENT, color: ACCENT } }}
              >
                GitHub organization
              </Button>
            </Container>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
