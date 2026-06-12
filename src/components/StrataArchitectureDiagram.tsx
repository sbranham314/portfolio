import { useState } from 'react';
import { Box, Typography } from '@mui/material';

const ACCENT = '#00D4FF';
const CARD = '#161C2E';
const CARD_SEL = '#1D2740';
const STROKE = 'rgba(0,212,255,0.22)';
const STROKE_HI = 'rgba(0,212,255,0.55)';
const TXT = '#E8EAF0';
const SUB = '#9BA3AF';

const W = 168;
const H = 56;

type N = { id: string; x: number; y: number; title: string; sub: string; detail: string; hi?: boolean };

const NODES: N[] = [
  { id: 'user', x: 12, y: 214, title: 'User', sub: 'Property manager', detail: 'The end user: a short-term-rental owner or property manager who uploads their data and downloads finished reports.' },
  { id: 'web', x: 208, y: 214, title: 'Web SPA', sub: 'React · Static Web Apps', detail: 'React single-page app on Azure Static Web Apps. Handles auth, uploads, and the dashboard, and talks to the API over REST.' },
  { id: 'api', x: 404, y: 214, title: 'API', sub: 'Azure Functions · .NET 9', hi: true, detail: 'The core. Serverless .NET 9 Azure Functions that ingest data, run the report pipeline, enforce tenant isolation, and orchestrate every downstream service.' },
  { id: 'pg', x: 700, y: 34, title: 'PostgreSQL', sub: 'Flexible Server · RLS', detail: 'Azure Database for PostgreSQL (Flexible Server). Row-level security enforces per-tenant data isolation at the database layer.' },
  { id: 'blob', x: 700, y: 114, title: 'Blob Storage', sub: 'PDFs · charts', detail: 'Azure Blob Storage for generated artifacts: the rendered PDF reports and their chart images.' },
  { id: 'llm', x: 700, y: 194, title: 'LLM', sub: 'Anthropic / OpenAI', detail: 'The narrative layer. It writes the report prose, but only describes numbers the deterministic pipeline has already computed and verified, so it never invents a figure.' },
  { id: 'email', x: 700, y: 274, title: 'Email', sub: 'Azure Comm. Services', detail: 'Azure Communication Services delivers finished reports and notifications to owners.' },
  { id: 'stripe', x: 700, y: 354, title: 'Stripe', sub: 'Billing', detail: 'Stripe runs subscriptions and billing through a trial-to-paid state machine driven by webhooks.' },
  { id: 'ai', x: 404, y: 392, title: 'App Insights', sub: 'traces · metrics', detail: 'Application Insights provides distributed tracing, metrics, and logs across every function for observability and self-healing.' },
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n] as [string, N])) as Record<string, N>;
const cx = (n: N) => n.x + W / 2;
const cy = (n: N) => n.y + H / 2;

function HEdge({ from, to }: { from: N; to: N }) {
  return <line x1={from.x + W} y1={cy(from)} x2={to.x} y2={cy(to)} stroke={STROKE_HI} strokeWidth={1.4} />;
}

export default function StrataArchitectureDiagram() {
  const [selectedId, setSelectedId] = useState('api');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const selected = byId[selectedId];

  const api = byId.api;
  const ai = byId.ai;
  const services = ['pg', 'blob', 'llm', 'email', 'stripe'].map((id) => byId[id]);

  return (
    <Box>
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box sx={{ minWidth: 680 }}>
          <svg viewBox="0 0 880 470" width="100%" role="img" aria-label="StayRecap runtime architecture">
            {/* edges first so nodes sit on top */}
            <HEdge from={byId.user} to={byId.web} />
            <HEdge from={byId.web} to={api} />
            {services.map((s) => (
              <line key={`e-${s.id}`} x1={api.x + W} y1={cy(api)} x2={s.x} y2={cy(s)} stroke={STROKE_HI} strokeWidth={1.2} />
            ))}
            <line x1={cx(api)} y1={api.y + H} x2={cx(ai)} y2={ai.y} stroke={STROKE} strokeWidth={1.2} strokeDasharray="4 4" />

            {NODES.map((n) => {
              const isSel = n.id === selectedId;
              const isHov = n.id === hoveredId;
              return (
                <g
                  key={n.id}
                  onClick={() => setSelectedId(n.id)}
                  onMouseEnter={() => setHoveredId(n.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x={n.x}
                    y={n.y}
                    width={W}
                    height={H}
                    rx={11}
                    fill={isSel ? CARD_SEL : CARD}
                    stroke={isSel || isHov ? ACCENT : n.hi ? ACCENT : STROKE}
                    strokeWidth={isSel ? 2.4 : isHov ? 1.8 : n.hi ? 1.8 : 1.2}
                    style={{ transition: 'stroke 0.15s, stroke-width 0.15s, fill 0.15s' }}
                  />
                  <text x={cx(n)} y={n.y + 23} textAnchor="middle" fill={TXT} fontSize={14} fontWeight={700} fontFamily="Inter, sans-serif">
                    {n.title}
                  </text>
                  <text x={cx(n)} y={n.y + 40} textAnchor="middle" fill={SUB} fontSize={10.5} fontFamily="Inter, sans-serif">
                    {n.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        </Box>
      </Box>

      {/* Detail panel */}
      <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.16)' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {selected.title}{' '}
          <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>
            · {selected.sub}
          </Box>
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, lineHeight: 1.7 }}>
          {selected.detail}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1, textAlign: 'center', opacity: 0.8 }}>
        Tap any component to explore the architecture
      </Typography>
    </Box>
  );
}
