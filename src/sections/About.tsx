import { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const STATS = [
  { value: 13, suffix: '+', label: 'Years Experience' },
  { value: 2, suffix: '', label: 'SaaS Products' },
  { value: 15, suffix: '', label: 'Certifications' },
  { value: 100, suffix: '%', label: 'Full Stack' },
];

function useCountUp(target: number, duration = 1400) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, elRef };
}

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, elRef } = useCountUp(value);
  return (
    <Paper
      ref={elRef}
      sx={{
        p: 2,
        textAlign: 'center',
        bgcolor: '#1A2035',
        border: '1px solid rgba(0,212,255,0.08)',
        borderRadius: 2,
      }}
    >
      <Typography
        sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.75rem', lineHeight: 1, mb: 0.4 }}
      >
        {count}{suffix}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
        {label}
      </Typography>
    </Paper>
  );
}

export default function About() {
  return (
    <Box
      id="about"
      component="section"
      sx={{ py: { xs: 10, md: 16 }, bgcolor: 'background.default' }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', letterSpacing: '0.18em', fontWeight: 600, display: 'block', mb: 1 }}
          >
            About Me
          </Typography>
          <Typography variant="h2" sx={{ mb: { xs: 6, md: 9 }, fontSize: { xs: '2rem', md: '3rem' } }}>
            Building software that{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              actually ships
            </Box>
          </Typography>
        </motion.div>

        <Grid container spacing={{ xs: 4, md: 7 }} sx={{ alignItems: 'center' }}>
          {/* Left: photo + stats */}
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, x: -36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <Box sx={{ position: 'relative', '&::before': { content: '""', position: 'absolute', inset: -10, borderRadius: '50%', border: '1px solid rgba(0,212,255,0.08)' } }}>
                  <Box
                    component="img"
                    src="/profile.jpg"
                    alt="Samuel Branham"
                    sx={{
                      width: 200,
                      height: 200,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid rgba(0,212,255,0.28)',
                      boxShadow: '0 0 60px rgba(0,212,255,0.1)',
                      display: 'block',
                    }}
                  />
                </Box>

                <Grid container spacing={2} sx={{ width: '100%' }}>
                  {STATS.map(({ value, suffix, label }) => (
                    <Grid size={{ xs: 6 }} key={label}>
                      <StatCard value={value} suffix={suffix} label={label} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </motion.div>
          </Grid>

          {/* Right: bio */}
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {[
                <>
                  I'm a senior software engineer and technical lead with{' '}
                  <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    13+ years building production-grade systems
                  </Box>{' '}
                  for government and enterprise clients. Currently based in Knightdale, NC, I specialize
                  in architecting cloud-native full-stack solutions using Azure, .NET, and React — and
                  serving as Scrum Master for a team of 8 at Victra.
                </>,
                <>
                  My background spans government systems in the Washington D.C. metro area — including
                  leading delivery of DC's unemployment insurance modernization during the COVID-19 surge —
                  through to modern SaaS products, giving me a deep appreciation for both security-conscious
                  engineering and rapid product iteration.
                </>,
                <>
                  I've been deeply integrated with{' '}
                  <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    AI-assisted development using Claude Code
                  </Box>{' '}
                  for over a year — building LLM-powered features, establishing team-wide AI patterns,
                  and shipping faster with agentic tooling. I hold a{' '}
                  <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    BS in Computer Science from the University of Maryland
                  </Box>{' '}
                  and am on an active Azure architect certification track.
                </>,
              ].map((para, i) => (
                <Typography
                  key={i}
                  variant="body1"
                  sx={{ color: 'text.secondary', mb: i < 2 ? 3 : 0, fontSize: '1.05rem', lineHeight: 1.85 }}
                >
                  {para}
                </Typography>
              ))}
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
