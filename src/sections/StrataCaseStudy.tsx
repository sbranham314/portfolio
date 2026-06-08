import { Box, Container, Typography, Chip, Button, Stack, IconButton, Divider } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StrataArchitectureDiagram from '../components/StrataArchitectureDiagram';

const ACCENT = '#00D4FF';
const CARD = '#1A2035';

const PIPELINE = [
  { k: 'Spec', v: 'PRD.md' },
  { k: 'Backlog', v: 'epics + stories as issues' },
  { k: 'Develop', v: 'agent writes + opens PR' },
  { k: 'Review', v: 'agent reviews / rebases' },
  { k: 'Deploy', v: 'live env + DB migrate' },
  { k: 'Test', v: 'agent hits real endpoints' },
  { k: 'Merge', v: 'to main' },
];

const HIGHLIGHTS: { t: string; d: string }[] = [
  {
    t: 'AI narrative bound to verified numbers',
    d: 'Figures are computed deterministically in code; the LLM only writes prose around them, so it cannot hallucinate a revenue number. Report generation is held under $0.25 per report.',
  },
  {
    t: 'Multi-tenant isolation via row-level security',
    d: 'Every authenticated DB connection sets a PostgreSQL session variable (app.current_tenant_id), so a query can never cross tenant boundaries even if application code has a bug.',
  },
  {
    t: 'Self-healing deploys',
    d: 'A shared dev database meant migration history and schema could drift apart. The deploy pipeline carries an idempotent remediation layer that repairs four distinct failure modes (missing column, missing table, duplicate table, model/snapshot drift) before they reach users.',
  },
  {
    t: 'Operated, not just written',
    d: 'A merge once took the API down with a three-layer migration cascade. Recovery: pause the pipeline so its own self-heal stops competing, reconcile schema in one shot, redeploy, and document the root cause so it cannot recur unseen.',
  },
];

const TECH = ['React', 'TypeScript', '.NET 9', 'Azure Functions', 'PostgreSQL', 'EF Core', 'Dapper', 'Claude (Anthropic)', 'Azure Communication Services', 'Stripe', 'GitHub Actions', 'Bicep'];

const REPOS: { label: string; url: string }[] = [
  { label: 'Orchestrator (system overview)', url: 'https://github.com/strata-reports-ai/orchestrator-strata-reports' },
  { label: 'Backend API', url: 'https://github.com/strata-reports-ai/fn-strata-reports' },
  { label: 'Frontend', url: 'https://github.com/strata-reports-ai/web-strata-reports' },
  { label: 'Data model', url: 'https://github.com/strata-reports-ai/dbproj-strata-reports' },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="overline" sx={{ color: ACCENT, letterSpacing: '0.18em', fontWeight: 600, display: 'block', mb: 1.5 }}>
      {children}
    </Typography>
  );
}

export default function StrataCaseStudy({ open, onClose }: { open: boolean; onClose: () => void }) {
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
              {/* Title */}
              <Typography variant="overline" sx={{ color: ACCENT, letterSpacing: '0.18em', fontWeight: 600 }}>
                Case Study · AI SaaS · Autonomous Build Pipeline
              </Typography>
              <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mt: 1, mb: 2 }}>
                StrataReport&nbsp;AI
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, lineHeight: 1.7, mb: 5 }}>
                A multi-tenant SaaS that turns messy short-term-rental data into polished, owner-ready quarterly PDF
                reports in under two minutes — and which is itself built and operated by an autonomous multi-agent CI/CD
                pipeline.
              </Typography>

              {/* Problem / product */}
              <SectionLabel>The product</SectionLabel>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                Short-term-rental property managers spend 10–20 hours a quarter assembling owner reports by hand, pulling
                from disconnected systems — the PMS, channel reviews, accounting, and ops tools. StrataReport ingests those
                CSV exports and produces a 4–8 page owner-facing report: headline metrics, charts, and an AI-written
                narrative that explains the quarter and justifies the management fee — in about two minutes.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 5 }}>
                The numbers are computed in code and the AI is given only verified figures to narrate, so the report is
                fast <em>and</em> trustworthy. MVP1 is feature-complete: auth, CSV ingestion, AI report generation,
                Stripe billing, transactional email, invite codes, and operator metrics.
              </Typography>

              {/* Architecture */}
              <SectionLabel>Runtime architecture</SectionLabel>
              <Box sx={{ p: { xs: 1.5, md: 3 }, bgcolor: CARD, border: '1px solid rgba(0,212,255,0.1)', borderRadius: 3, mb: 1.5 }}>
                <StrataArchitectureDiagram />
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 5 }}>
                A React SPA on Azure Static Web Apps talks to a .NET 9 Azure Functions API, backed by PostgreSQL
                (row-level multi-tenancy), Blob Storage for generated PDFs and charts, an LLM for narrative, Azure
                Communication Services for email, and Stripe for billing — all traced through Application Insights.
              </Typography>

              {/* Pipeline */}
              <SectionLabel>The differentiator — it builds itself</SectionLabel>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                The product was not hand-coded story by story. An orchestrator reads the spec, generates a backlog, and
                dispatches AI coding agents across four repositories. Each story flows through a closed loop:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', gap: 1, mb: 2 }}>
                {PIPELINE.map((s, i) => (
                  <Box key={s.k} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ p: 1.5, minWidth: 132, bgcolor: CARD, border: '1px solid rgba(0,212,255,0.14)', borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ color: ACCENT, fontWeight: 700 }}>{s.k}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.v}</Typography>
                    </Box>
                    {i < PIPELINE.length - 1 && <ArrowForwardIcon sx={{ color: 'rgba(0,212,255,0.4)', fontSize: 18 }} />}
                  </Box>
                ))}
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 5 }}>
                The loop is self-healing: failed tests file bugs that re-enter the backlog, conflicts route to a rebase
                agent, and the orchestrator handles real operational concerns — per-model spend caps, expiring agent
                tokens, and a "done ≠ merged" guard so a story only closes when its code is actually in main.
              </Typography>

              {/* Highlights */}
              <SectionLabel>Engineering highlights</SectionLabel>
              <Stack spacing={2} sx={{ mb: 5 }}>
                {HIGHLIGHTS.map((h) => (
                  <Box key={h.t} sx={{ p: 2.5, bgcolor: CARD, border: '1px solid rgba(0,212,255,0.08)', borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>{h.t}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{h.d}</Typography>
                  </Box>
                ))}
              </Stack>

              {/* Tech */}
              <SectionLabel>Stack</SectionLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 5 }}>
                {TECH.map((t) => (
                  <Chip key={t} label={t} size="small" sx={{ bgcolor: 'rgba(0,212,255,0.05)', color: 'text.secondary', border: '1px solid rgba(0,212,255,0.1)', fontSize: '0.72rem' }} />
                ))}
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 4 }} />

              {/* Repos */}
              <SectionLabel>Source</SectionLabel>
              <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                {REPOS.map((r) => (
                  <Button
                    key={r.url}
                    variant="outlined"
                    size="small"
                    startIcon={<GitHubIcon fontSize="small" />}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ borderColor: 'rgba(255,255,255,0.12)', color: 'text.secondary', '&:hover': { borderColor: ACCENT, color: ACCENT } }}
                  >
                    {r.label}
                  </Button>
                ))}
              </Stack>
            </Container>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
