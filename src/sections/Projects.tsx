import { useState } from 'react';
import { Box, Container, Typography, Grid, Paper, Chip, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import StrataCaseStudy from './StrataCaseStudy';

type Project = {
  title: string;
  category: string;
  description: string;
  tech: string[];
  status: string;
  statusColor: string;
  links: { github?: string; demo?: string };
  featured: boolean;
  caseStudy?: boolean;
};

const PROJECTS: Project[] = [
  {
    title: 'RetroStoreManager',
    category: 'SaaS Platform',
    description:
      'A multi-tenant SaaS platform purpose-built for retro game and trading card game store owners. Features inventory management, point-of-sale, customer loyalty programs, and real-time business analytics.',
    tech: ['React', 'TypeScript', 'Material UI', '.NET 8', 'Azure Functions', 'Azure SQL', 'GitHub Actions'],
    status: 'In Development',
    statusColor: '#FF8A65',
    links: { github: 'https://github.com/sbranham314' },
    featured: true,
  },
  {
    title: 'StrataReport AI',
    category: 'AI SaaS · Autonomous Build Pipeline',
    description:
      'A multi-tenant SaaS that turns messy short-term-rental data (PMS exports, expense CSVs, guest reviews) into polished, owner-ready quarterly PDF reports in under two minutes — with AI narrative bound to verified numbers so it never hallucinates a figure. The distinctive part: the product is built and operated by an autonomous multi-agent CI/CD pipeline — an orchestrator reads the spec, then dispatches AI agents to write, review, test, and deploy code across four repos, and self-heals production incidents.',
    tech: ['React', 'TypeScript', '.NET 9', 'Azure Functions', 'PostgreSQL', 'EF Core', 'Claude (Anthropic)', 'Stripe', 'GitHub Actions'],
    status: 'MVP Complete',
    statusColor: '#66BB6A',
    links: { github: 'https://github.com/strata-reports-ai/orchestrator-strata-reports' },
    featured: true,
    caseStudy: true,
  },
];

export default function Projects() {
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  return (
    <Box
      id="projects"
      component="section"
      sx={{ py: { xs: 10, md: 16 }, bgcolor: '#0D1120' }}
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
            Projects
          </Typography>
          <Typography variant="h2" sx={{ mb: { xs: 6, md: 9 }, fontSize: { xs: '2rem', md: '3rem' } }}>
            What I've{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              built
            </Box>
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {PROJECTS.map((project, idx) => (
            <Grid size={{ xs: 12, md: 6 }} key={project.title}>
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, delay: idx * 0.1 }}
                style={{ height: '100%' }}
              >
                <Paper
                  sx={{
                    p: 3.5,
                    bgcolor: '#1A2035',
                    border: '1px solid rgba(0,212,255,0.08)',
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
                    '&:hover': {
                      borderColor: 'rgba(0,212,255,0.28)',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 16px 48px rgba(0,212,255,0.08)',
                    },
                    ...(project.featured && {
                      borderColor: 'rgba(0,212,255,0.18)',
                    }),
                  }}
                >
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ minWidth: 0, mr: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}
                      >
                        {project.category}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.25 }}>
                        {project.title}
                      </Typography>
                    </Box>
                    <Chip
                      label={project.status}
                      size="small"
                      sx={{
                        bgcolor: `${project.statusColor}14`,
                        color: project.statusColor,
                        border: `1px solid ${project.statusColor}30`,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    />
                  </Box>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 3, flex: 1 }}
                  >
                    {project.description}
                  </Typography>

                  {/* Tech stack */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3 }}>
                    {project.tech.map((t) => (
                      <Chip
                        key={t}
                        label={t}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(0,212,255,0.05)',
                          color: 'text.secondary',
                          border: '1px solid rgba(0,212,255,0.1)',
                          fontSize: '0.72rem',
                        }}
                      />
                    ))}
                  </Box>

                  {/* Links */}
                  <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {project.caseStudy && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ArticleOutlinedIcon fontSize="small" />}
                        onClick={() => setCaseStudyOpen(true)}
                        sx={{
                          bgcolor: 'rgba(0,212,255,0.12)',
                          color: 'primary.main',
                          boxShadow: 'none',
                          border: '1px solid rgba(0,212,255,0.3)',
                          '&:hover': { bgcolor: 'rgba(0,212,255,0.2)', boxShadow: 'none' },
                        }}
                      >
                        Case Study
                      </Button>
                    )}
                    {project.links.github && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<GitHubIcon fontSize="small" />}
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          borderColor: 'rgba(255,255,255,0.12)',
                          color: 'text.secondary',
                          '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                        }}
                      >
                        GitHub
                      </Button>
                    )}
                    {project.links.demo && (
                      <Button
                        variant="outlined"
                        size="small"
                        endIcon={<OpenInNewIcon fontSize="small" />}
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          borderColor: 'rgba(0,212,255,0.28)',
                          color: 'primary.main',
                          '&:hover': { bgcolor: 'rgba(0,212,255,0.08)' },
                        }}
                      >
                        Live Demo
                      </Button>
                    )}
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      <StrataCaseStudy open={caseStudyOpen} onClose={() => setCaseStudyOpen(false)} />
    </Box>
  );
}
