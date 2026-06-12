import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const NAV_LINKS = [
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Experience', id: 'experience' },
  { label: 'Projects', id: 'projects' },
  { label: 'Certifications', id: 'certifications' },
  { label: 'Contact', id: 'contact' },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.userAgent);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      let current = '';
      NAV_LINKS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    scrollTo(id);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          transition: 'background 0.3s ease, border-color 0.3s ease',
          bgcolor: scrolled ? 'rgba(10, 14, 26, 0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0, 212, 255, 0.1)' : 'none',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 0.5 }}>
            <Typography
              variant="h6"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.02em',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #E8EAF0 0%, #00D4FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                userSelect: 'none',
              }}
            >
              SB
            </Typography>

            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {NAV_LINKS.map(({ label, id }) => (
                  <Button
                    key={id}
                    onClick={() => handleNavClick(id)}
                    sx={{
                      color: activeSection === id ? 'primary.main' : 'text.secondary',
                      fontWeight: activeSection === id ? 600 : 400,
                      fontSize: '0.875rem',
                      position: 'relative',
                      px: 1.5,
                      '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 4,
                        left: '50%',
                        width: '60%',
                        height: '2px',
                        bgcolor: 'primary.main',
                        borderRadius: '1px',
                        transform: activeSection === id
                          ? 'translateX(-50%) scaleX(1)'
                          : 'translateX(-50%) scaleX(0)',
                        transition: 'transform 0.25s ease',
                      },
                    }}
                  >
                    {label}
                  </Button>
                ))}
                <Button
                  onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
                  aria-label="Open command palette"
                  sx={{
                    ml: 1,
                    minWidth: 0,
                    px: 1,
                    py: 0.25,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'text.secondary',
                    border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 1.5,
                    '&:hover': { color: 'primary.main', borderColor: 'primary.main', bgcolor: 'transparent' },
                  }}
                >
                  {isMac ? '⌘K' : 'Ctrl K'}
                </Button>
              </Box>
            )}

            {isMobile && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{ color: 'text.primary' }}
                aria-label="open menu"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            bgcolor: '#111827',
            width: 280,
            borderLeft: '1px solid rgba(0, 212, 255, 0.1)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {NAV_LINKS.map(({ label, id }) => (
            <ListItemButton
              key={id}
              onClick={() => handleNavClick(id)}
              sx={{
                mx: 1,
                borderRadius: 2,
                color: activeSection === id ? 'primary.main' : 'text.primary',
                '& .MuiListItemText-primary': {
                  fontWeight: activeSection === id ? 600 : 400,
                },
                '&:hover': { bgcolor: 'rgba(0, 212, 255, 0.08)' },
              }}
            >
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
}
