import { Box, Container, Typography, Grid, Paper, Chip, Button } from '@mui/material';
import { motion } from 'framer-motion';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

type AzureCert = {
  name: string;
  code: string;
  description: string;
  status: 'earned' | 'upcoming' | 'in-progress';
  statusLabel: string;
};

const AZURE_CERTS: AzureCert[] = [
  {
    name: 'Azure Administrator Associate',
    code: 'AZ-104',
    description: 'Expertise in managing Azure subscriptions, identity, storage, compute, virtual networks, and monitoring at enterprise scale.',
    status: 'earned',
    statusLabel: 'Earned · 2026',
  },
  {
    name: 'Azure Fundamentals',
    code: 'AZ-900',
    description: 'Core cloud concepts, Azure architecture, services, security, compliance, and pricing fundamentals.',
    status: 'earned',
    statusLabel: 'Earned',
  },
  {
    name: 'Azure Developer Associate',
    code: 'AZ-204',
    description: 'Designing, building, testing, and maintaining cloud applications and services on Microsoft Azure.',
    status: 'upcoming',
    statusLabel: 'Exam · Jun 2026',
  },
  {
    name: 'Azure Solutions Architect Expert',
    code: 'AZ-305',
    description: 'Advanced Azure infrastructure and solution design — compute, network, storage, security, and enterprise-scale architecture.',
    status: 'in-progress',
    statusLabel: 'In Progress',
  },
];

const STATUS_COLORS: Record<AzureCert['status'], string> = {
  earned: '#4CAF8A',
  upcoming: '#FF9900',
  'in-progress': '#C084FC',
};

export default function Certifications() {
  return (
    <Box
      id="certifications"
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
            Certifications
          </Typography>
          <Typography variant="h2" sx={{ mb: { xs: 6, md: 9 }, fontSize: { xs: '2rem', md: '3rem' } }}>
            Azure{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              certification track
            </Box>
          </Typography>
        </motion.div>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {AZURE_CERTS.map(({ name, code, description, status, statusLabel }, idx) => {
            const color = STATUS_COLORS[status];
            const earned = status === 'earned';
            return (
              <Grid size={{ xs: 12, sm: 6 }} key={code}>
                <motion.div
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  style={{ height: '100%' }}
                >
                  <Paper
                    sx={{
                      p: 3.5,
                      bgcolor: '#1A2035',
                      border: earned
                        ? '1px solid rgba(0,120,212,0.3)'
                        : '1px dashed rgba(0,120,212,0.15)',
                      borderRadius: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
                      '&:hover': {
                        borderColor: 'rgba(0,120,212,0.5)',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 16px 40px rgba(0,120,212,0.1)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: earned
                          ? 'linear-gradient(90deg, #0078D4, #50B0FF)'
                          : `linear-gradient(90deg, ${color}80, ${color}30)`,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '14px',
                          bgcolor: 'rgba(0,120,212,0.12)',
                          border: '1px solid rgba(0,120,212,0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', color: '#0078D4' }}>M</Typography>
                      </Box>
                      <Chip
                        label={statusLabel}
                        size="small"
                        sx={{
                          bgcolor: `${color}14`,
                          color,
                          border: `1px solid ${color}35`,
                          fontWeight: 700,
                          fontSize: '0.78rem',
                        }}
                      />
                    </Box>

                    <Box>
                      <Chip
                        label={code}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(0,120,212,0.1)',
                          color: '#50B0FF',
                          border: '1px solid rgba(0,120,212,0.25)',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          letterSpacing: '0.04em',
                          mb: 0.75,
                        }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                        {name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#0078D4', fontWeight: 600, letterSpacing: '0.06em' }}>
                        Microsoft Certified
                      </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        {/* Additional certs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              bgcolor: 'rgba(26,32,53,0.5)',
              border: '1px dashed rgba(0,212,255,0.12)',
              borderRadius: 3,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                15 Additional Certifications
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                AWS Cloud Solutions Architect Specialization, DevOps on AWS, CompTIA Security+ (CE), and more — all listed on LinkedIn.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<OpenInNewIcon fontSize="small" />}
              href="https://linkedin.com/in/samuelbranham"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                whiteSpace: 'nowrap',
                flexShrink: 0,
                borderColor: 'rgba(0,212,255,0.28)',
                color: 'primary.main',
                '&:hover': { bgcolor: 'rgba(0,212,255,0.08)', borderColor: 'primary.main' },
              }}
            >
              View on LinkedIn
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
