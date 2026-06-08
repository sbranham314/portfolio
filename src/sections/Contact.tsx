import { Box, Container, Typography, Button, Stack, IconButton, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const SOCIAL = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/samuelbranham',
    icon: <LinkedInIcon />,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/sbranham314',
    icon: <GitHubIcon />,
  },
];

export default function Contact() {
  return (
    <Box
      id="contact"
      component="section"
      sx={{
        py: { xs: 12, md: 18 },
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #0A0E1A 0%, #0D1B35 50%, #0A0E1A 100%)',
      }}
    >
      {/* Background accent */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '400px', md: '800px' },
          height: { xs: '400px', md: '600px' },
          background: 'radial-gradient(ellipse, rgba(0,212,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
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
            Get In Touch
          </Typography>
          <Typography
            variant="h2"
            sx={{ mb: 3, fontSize: { xs: '2.2rem', md: '3.2rem' } }}
          >
            Let's work{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              together
            </Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mb: 6,
              fontSize: '1.1rem',
              lineHeight: 1.85,
              maxWidth: 560,
              mx: 'auto',
            }}
          >
            Have a project you'd like to collaborate on, or just want to connect?
            Feel free to reach out — I'm always happy to chat about technology, ideas, or interesting problems.
          </Typography>

          {/* Primary CTA */}
          <Button
            variant="contained"
            size="large"
            startIcon={<EmailIcon />}
            href="mailto:sbranham314@gmail.com"
            sx={{
              bgcolor: 'primary.main',
              color: '#0A0E1A',
              fontWeight: 700,
              px: 5,
              py: 1.75,
              fontSize: '1rem',
              mb: 6,
              '&:hover': { bgcolor: '#33DDFF' },
            }}
          >
            sbranham314@gmail.com
          </Button>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 5 }} />

          {/* Social links */}
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
            {SOCIAL.map(({ label, href, icon }) => (
              <IconButton
                key={label}
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                sx={{
                  color: 'text.secondary',
                  border: '1px solid rgba(255,255,255,0.1)',
                  width: 52,
                  height: 52,
                  transition: 'all 0.2s',
                  '&:hover': {
                    color: 'primary.main',
                    borderColor: 'rgba(0,212,255,0.4)',
                    bgcolor: 'rgba(0,212,255,0.06)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                {icon}
              </IconButton>
            ))}
          </Stack>

          <Typography
            variant="caption"
            sx={{ display: 'block', color: 'text.secondary', mt: 8, opacity: 0.5 }}
          >
            © {new Date().getFullYear()} Samuel Branham. Built with React & Material UI.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
}
