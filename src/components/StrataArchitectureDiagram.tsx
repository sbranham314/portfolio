import { Box } from '@mui/material';

const ACCENT = '#00D4FF';
const CARD = '#161C2E';
const STROKE = 'rgba(0,212,255,0.22)';
const STROKE_HI = 'rgba(0,212,255,0.55)';
const TXT = '#E8EAF0';
const SUB = '#9BA3AF';

const W = 168;
const H = 56;

type N = { id: string; x: number; y: number; title: string; sub: string; hi?: boolean };

const NODES: N[] = [
  { id: 'user', x: 12, y: 214, title: 'User', sub: 'Property manager' },
  { id: 'web', x: 208, y: 214, title: 'Web SPA', sub: 'React · Static Web Apps' },
  { id: 'api', x: 404, y: 214, title: 'API', sub: 'Azure Functions · .NET 9', hi: true },
  { id: 'pg', x: 700, y: 34, title: 'PostgreSQL', sub: 'Flexible Server · RLS' },
  { id: 'blob', x: 700, y: 114, title: 'Blob Storage', sub: 'PDFs · charts' },
  { id: 'llm', x: 700, y: 194, title: 'LLM', sub: 'Anthropic / OpenAI' },
  { id: 'email', x: 700, y: 274, title: 'Email', sub: 'Azure Comm. Services' },
  { id: 'stripe', x: 700, y: 354, title: 'Stripe', sub: 'Billing' },
  { id: 'ai', x: 404, y: 392, title: 'App Insights', sub: 'traces · metrics' },
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n] as [string, N])) as Record<string, N>;
const cx = (n: N) => n.x + W / 2;
const cy = (n: N) => n.y + H / 2;

function HEdge({ from, to }: { from: N; to: N }) {
  return (
    <line
      x1={from.x + W}
      y1={cy(from)}
      x2={to.x}
      y2={cy(to)}
      stroke={STROKE_HI}
      strokeWidth={1.4}
    />
  );
}

export default function StrataArchitectureDiagram() {
  const api = byId.api;
  const ai = byId.ai;
  const services = ['pg', 'blob', 'llm', 'email', 'stripe'].map((id) => byId[id]);

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Box sx={{ minWidth: 680 }}>
        <svg viewBox="0 0 880 470" width="100%" role="img" aria-label="StayRecap runtime architecture">
          {/* edges first so nodes sit on top */}
          <HEdge from={byId.user} to={byId.web} />
          <HEdge from={byId.web} to={api} />
          {services.map((s) => (
            <line
              key={`e-${s.id}`}
              x1={api.x + W}
              y1={cy(api)}
              x2={s.x}
              y2={cy(s)}
              stroke={STROKE_HI}
              strokeWidth={1.2}
            />
          ))}
          {/* api -> app insights (vertical) */}
          <line x1={cx(api)} y1={api.y + H} x2={cx(ai)} y2={ai.y} stroke={STROKE} strokeWidth={1.2} strokeDasharray="4 4" />

          {NODES.map((n) => (
            <g key={n.id}>
              <rect
                x={n.x}
                y={n.y}
                width={W}
                height={H}
                rx={11}
                fill={CARD}
                stroke={n.hi ? ACCENT : STROKE}
                strokeWidth={n.hi ? 1.8 : 1.2}
              />
              <text x={cx(n)} y={n.y + 23} textAnchor="middle" fill={TXT} fontSize={14} fontWeight={700} fontFamily="Inter, sans-serif">
                {n.title}
              </text>
              <text x={cx(n)} y={n.y + 40} textAnchor="middle" fill={SUB} fontSize={10.5} fontFamily="Inter, sans-serif">
                {n.sub}
              </text>
            </g>
          ))}
        </svg>
      </Box>
    </Box>
  );
}
