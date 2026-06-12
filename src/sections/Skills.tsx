import { Box, Container, Typography, Chip, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import WebIcon from '@mui/icons-material/Web';
import ApiIcon from '@mui/icons-material/Api';
import CloudIcon from '@mui/icons-material/Cloud';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import type { SvgIconComponent } from '@mui/icons-material';

type SkillGroup = {
  title: string;
  Icon: SvgIconComponent;
  color: string;
  skills: string[];
};

const SKILL_GROUPS: SkillGroup[] = [
  {
    title: 'Frontend',
    Icon: WebIcon,
    color: '#00D4FF',
    skills: ['React', 'Angular', 'TypeScript', 'JavaScript', 'Material UI', 'HTML5 / CSS3', 'Responsive Design'],
  },
  {
    title: 'Backend',
    Icon: ApiIcon,
    color: '#0066CC',
    skills: ['C# / .NET 8', 'ASP.NET Core', 'Node.js', 'REST APIs', 'GraphQL', 'Entity Framework Core'],
  },
  {
    title: 'Cloud & DevOps',
    Icon: CloudIcon,
    color: '#7B61FF',
    skills: ['Azure Functions', 'Azure App Service', 'Azure Static Web Apps', 'Azure SQL', 'AWS', 'GitHub Actions', 'CI/CD', 'Docker'],
  },
  {
    title: 'Database',
    Icon: StorageIcon,
    color: '#00C49F',
    skills: ['PostgreSQL', 'SQL Server', 'Azure SQL', 'Redis', 'Entity Framework'],
  },
  {
    title: 'AI & LLM',
    Icon: AutoAwesomeIcon,
    color: '#C084FC',
    skills: ['Claude AI', 'Claude Code', 'Anthropic API', 'LLM Integration', 'Prompt Engineering', 'AI-Assisted Development'],
  },
  {
    title: 'Tools & Practices',
    Icon: BuildIcon,
    color: '#FF8A65',
    skills: ['Git', 'Visual Studio', 'VS Code', 'Postman', 'Swagger / OpenAPI', 'Agile / Scrum'],
  },
];

export default function Skills() {
  return (
    <Box
      id="skills"
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
            Technical Skills
          </Typography>
          <Typography variant="h2" sx={{ mb: { xs: 6, md: 9 }, fontSize: { xs: '2rem', md: '3rem' } }}>
            My{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              tech stack
            </Box>
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {SKILL_GROUPS.map(({ title, Icon, color, skills }, idx) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={title}>
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                style={{ height: '100%' }}
              >
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: '#1A2035',
                    border: '1px solid rgba(255,255,255,0.05)',
                    height: '100%',
                    borderRadius: 3,
                    transition: 'border-color 0.25s',
                    '&:hover': { borderColor: `${color}35` },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        bgcolor: `${color}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color,
                      }}
                    >
                      <Icon fontSize="small" />
                    </Box>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {title}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.85 }}>
                    {skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        sx={{
                          bgcolor: `${color}10`,
                          color,
                          border: `1px solid ${color}28`,
                          fontSize: '0.76rem',
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
