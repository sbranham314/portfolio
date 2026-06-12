import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import GithubActivity from './sections/GithubActivity';
import Writing from './sections/Writing';
import Certifications from './sections/Certifications';
import LighthouseScores from './sections/LighthouseScores';
import Contact from './sections/Contact';
import { lazy, Suspense } from 'react';

// Deferred: overlays not needed for first paint (trims the initial bundle).
const AskAI = lazy(() => import('./components/AskAI'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main">
          <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <GithubActivity />
        <Writing />
        <Certifications />
        <LighthouseScores />
        <Contact />
        </Box>
        <Suspense fallback={null}>
          <AskAI />
          <CommandPalette />
        </Suspense>
      </Box>
    </ThemeProvider>
  );
}
