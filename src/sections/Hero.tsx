import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import DownloadIcon from '@mui/icons-material/Download';

const ROLES = [
  'Senior Software Engineer',
  'Technical Lead & Scrum Master',
  'Cloud Architect',
  'Full Stack Developer',
];

function useTypewriter(strings: string[]) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const current = strings[roleIndex];

  useEffect(() => {
    if (!isDeleting && charIndex < current.length) {
      const id = setTimeout(() => setCharIndex((c) => c + 1), 50);
      return () => clearTimeout(id);
    }
    if (!isDeleting && charIndex === current.length) {
      const id = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(id);
    }
    if (isDeleting && charIndex > 0) {
      const id = setTimeout(() => setCharIndex((c) => c - 1), 28);
      return () => clearTimeout(id);
    }
    if (isDeleting && charIndex === 0) {
      const id = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((i) => (i + 1) % strings.length);
      }, 400);
      return () => clearTimeout(id);
    }
  }, [roleIndex, charIndex, isDeleting, current, strings.length]);

  return current.slice(0, charIndex);
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

const EMAIL = 'sbranham314@gmail.com';

export default function Hero() {
  const role = useTypewriter(ROLES);
  const [toast, setToast] = useState(false);

  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setToast(true);
    } catch {
      // clipboard blocked — mailto still fires below
    }
    window.location.href = `mailto:${EMAIL}`;
  };

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Cyan orb — top right */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          right: '-5%',
          width: { xs: '350px', md: '700px' },
          height: { xs: '350px', md: '700px' },
          background: 'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* Blue orb — bottom left */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '-15%',
          left: '-8%',
          width: { xs: '280px', md: '580px' },
          height: { xs: '280px', md: '580px' },
          background: 'radial-gradient(circle, rgba(0,102,204,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* Dot grid */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(0,212,255,0.04) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: 12, pb: 8 }}>
        <Box sx={{ maxWidth: 820 }}>
          <motion.div {...fadeUp(0)}>
            <Typography
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                mb: 2,
              }}
            >
              Hi, I'm
            </Typography>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3.2rem', sm: '4.5rem', md: '6.5rem' },
                lineHeight: 1.0,
                mb: 2.5,
                background: 'linear-gradient(130deg, #E8EAF0 20%, #00D4FF 55%, #0066CC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Samuel
              <br />
              Branham
            </Typography>
          </motion.div>

          <motion.div {...fadeUp(0.2)}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, minHeight: 40 }}>
              <Typography
                variant="h5"
                component="span"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 400,
                  fontSize: { xs: '1.1rem', md: '1.4rem' },
                }}
              >
                {role}
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    width: '2px',
                    height: '1.15em',
                    bgcolor: 'primary.main',
                    ml: '3px',
                    verticalAlign: 'text-bottom',
                    animation: 'blink 1s step-end infinite',
                    '@keyframes blink': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0 },
                    },
                  }}
                />
              </Typography>
            </Box>
          </motion.div>

          <motion.div {...fadeUp(0.3)}>
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mb: 5 }}>
              {['13+ Years Experience', 'Tech Lead · Scrum Master', 'Raleigh, NC'].map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(0,212,255,0.07)',
                    color: 'text.secondary',
                    border: '1px solid rgba(0,212,255,0.14)',
                  }}
                />
              ))}
            </Stack>
          </motion.div>

          <motion.div {...fadeUp(0.4)}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() =>
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                }
                sx={{
                  bgcolor: 'primary.main',
                  color: '#0A0E1A',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  '&:hover': { bgcolor: '#33DDFF' },
                }}
              >
                View My Work
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() =>
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(0,212,255,0.08)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                Contact Me
              </Button>
              <Button
                variant="text"
                size="large"
                startIcon={<DownloadIcon fontSize="small" />}
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.secondary',
                  px: 2,
                  py: 1.5,
                  '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                }}
              >
                Resume
              </Button>
            </Stack>
          </motion.div>

          <motion.div {...fadeUp(0.55)}>
            <Stack direction="row" spacing={0.5}>
              {[
                {
                  href: 'https://github.com/sbranham314',
                  icon: <GitHubIcon fontSize="small" />,
                  label: 'GitHub',
                },
                {
                  href: 'https://linkedin.com/in/samuelbranham',
                  icon: <LinkedInIcon fontSize="small" />,
                  label: 'LinkedIn',
                },
              ].map(({ href, icon, label }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  sx={{
                    color: 'text.secondary',
                    border: '1px solid rgba(255,255,255,0.08)',
                    '&:hover': {
                      color: 'primary.main',
                      borderColor: 'rgba(0,212,255,0.3)',
                      bgcolor: 'rgba(0,212,255,0.06)',
                    },
                  }}
                >
                  {icon}
                </IconButton>
              ))}
              <IconButton
                onClick={handleEmailClick}
                aria-label="Email — click to copy address"
                sx={{
                  color: 'text.secondary',
                  border: '1px solid rgba(255,255,255,0.08)',
                  '&:hover': {
                    color: 'primary.main',
                    borderColor: 'rgba(0,212,255,0.3)',
                    bgcolor: 'rgba(0,212,255,0.06)',
                  },
                }}
              >
                <EmailIcon fontSize="small" />
              </IconButton>
            </Stack>
          </motion.div>
        </Box>
      </Container>

      {/* Animated scroll indicator */}
      <Box
        component={motion.div}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        sx={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)' }}
      >
        <IconButton
          onClick={() =>
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
          }
          aria-label="Scroll to about"
          sx={{ color: 'text.secondary' }}
        >
          <ArrowDownwardIcon fontSize="small" />
        </IconButton>
      </Box>

      <Snackbar
        open={toast}
        autoHideDuration={2500}
        onClose={() => setToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast(false)}
          severity="success"
          variant="filled"
          sx={{ bgcolor: '#00D4FF', color: '#0A0E1A', fontWeight: 600 }}
        >
          Email copied to clipboard
        </Alert>
      </Snackbar>
    </Box>
  );
}
