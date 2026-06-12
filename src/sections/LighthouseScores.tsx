import { Box, Container, Typography, Stack, Button, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ACCENT } from '../theme';

// Snapshot from a Lighthouse desktop audit of the live site. Accessibility,
// Best Practices, and SEO are device-independent; Performance is the desktop
// figure. The "verify" link lets anyone re-run it live.
const SCORES = [
  { label: 'Performance', value: 93 },
  { label: 'Accessibility', value: 100 },
  { label: 'Best Practices', value: 100 },
  { label: 'SEO', value: 100 },
];

function Gauge({ value, label }: { value: number; label: string }) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" value={100} size={88} thickness={3} sx={{ color: 'rgba(255,255,255,0.08)' }} />
        <CircularProgress
          variant="determinate"
          value={value}
          size={88}
          thickness={3}
          sx={{
            color: ACCENT,
            position: 'absolute',
            left: 0,
            '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
          }}
        />
        <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 800 }}>
            {value}
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.25, fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function LighthouseScores() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: '#0D1120', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', letterSpacing: '0.18em', fontWeight: 600, textAlign: 'center', display: 'block', mb: 1 }}
          >
            Built with Care
          </Typography>
          <Typography variant="h6" component="p" sx={{ textAlign: 'center', color: 'text.secondary', fontWeight: 400, mb: 5 }}>
            Google Lighthouse audit of this site
          </Typography>

          <Stack
            direction="row"
            sx={{ justifyContent: 'center', gap: { xs: 3.5, sm: 6, md: 8 }, flexWrap: 'wrap' }}
          >
            {SCORES.map((s) => (
              <Gauge key={s.label} value={s.value} label={s.label} />
            ))}
          </Stack>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fsamuelbranham.com"
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<OpenInNewIcon fontSize="small" />}
              sx={{ color: 'text.secondary', fontWeight: 600, '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
            >
              Verify on PageSpeed Insights
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
