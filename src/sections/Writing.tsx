import { Box, Container, Typography, Paper, Stack, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

type Post = {
  title: string;
  date: string;
  readingTime: string;
  excerpt: string;
  href: string;
  tags: string[];
};

const POSTS: Post[] = [
  {
    title: 'What I Learned Building Software with Autonomous AI Agents',
    date: 'June 12, 2026',
    readingTime: '6 min read',
    excerpt:
      "Notes from building two SaaS products almost entirely through a pipeline of AI agents that write, review, test, and deploy code. What works, what doesn't, and what it changes about the job.",
    href: '/writing/building-software-with-ai-agents.html',
    tags: ['AI Agents', 'Engineering'],
  },
];

export default function Writing() {
  return (
    <Box id="writing" component="section" sx={{ py: { xs: 10, md: 16 }, bgcolor: '#0D1120' }}>
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
            Writing
          </Typography>
          <Typography variant="h2" sx={{ mb: { xs: 6, md: 9 }, fontSize: { xs: '2rem', md: '3rem' } }}>
            Things I've{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              written
            </Box>
          </Typography>
        </motion.div>

        <Stack spacing={3}>
          {POSTS.map((post, idx) => (
            <motion.div
              key={post.href}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: idx * 0.1 }}
            >
              <Paper
                component="a"
                href={post.href}
                sx={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  p: { xs: 3, md: 4 },
                  bgcolor: '#1A2035',
                  border: '1px solid rgba(0,212,255,0.1)',
                  borderRadius: 3,
                  transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
                  '&:hover': {
                    borderColor: 'rgba(0,212,255,0.32)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 48px rgba(0,212,255,0.08)',
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}
                >
                  {post.date} &middot; {post.readingTime}
                </Typography>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mt: 0.5, mb: 1.5 }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2.5 }}>
                  {post.excerpt}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main', fontWeight: 700 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Read post
                    </Typography>
                    <ArrowForwardRoundedIcon fontSize="small" />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    {post.tags.map((t) => (
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
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
