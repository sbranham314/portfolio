import { Box, Container, Typography, Paper, Chip, Divider, Button } from '@mui/material';
import { motion } from 'framer-motion';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  promotion?: string;
  tech: string[];
  bullets: string[];
};

const EXPERIENCES: Experience[] = [
  {
    role: 'Software Engineer III & Scrum Master',
    company: 'Victra — Verizon Authorized Retailer',
    location: 'Raleigh, NC (Hybrid)',
    period: 'Jun 2025 – Present',
    current: true,
    tech: ['React', 'TypeScript', '.NET 10', 'Azure', 'SQL Server', 'Azure DevOps', 'Material UI'],
    bullets: [
      'Lead engineer and Scrum Master on a team of 8 building internal applications supporting 1,500+ Verizon-authorized stores nationwide',
      'Lead engineer on Contribution Matrix — a new performance and commission-calculation platform serving 6,600+ Victra employees company-wide',
      'Architect and ship features for Metric Management Center (MMC): commission overrides, coupon overrides, sales adjustments, and inventory data integrated with multiple downstream systems via REST APIs',
      "Driving POS-agnostic architecture, re-engineering integration layers so Victra's internal tools are decoupled from any specific point-of-sale platform",
      'Established team-wide patterns for AI-assisted development using Claude across the full development lifecycle',
    ],
  },
  {
    role: 'Senior Software Engineer',
    company: 'DC Department of Employment Services',
    location: 'Washington, D.C. / Remote',
    period: 'Apr 2018 – Apr 2025',
    current: false,
    promotion: 'Promoted to Senior · Mar 2020',
    tech: ['Angular', 'AWS EC2', 'AWS Lambda', '.NET', 'C#', 'SQL Server', 'REST APIs'],
    bullets: [
      "Core engineer on the AWS-based modernization of DC's unemployment insurance platform — owned Angular frontend, middle tier, and backend services",
      'Owned end-to-end delivery during the COVID-19 surge when claims volume jumped 10x+ overnight; worked 14-hour days enabling benefit payments to tens of thousands of DC residents',
      'Integrated with IRS, SSA, and US DOL via REST APIs for federal compliance data exchange, validation, and benefit eligibility verification',
      'Led a 10-person support team handling production incidents and on-call response for both legacy and modernized platforms simultaneously',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Clear Info, LLC',
    location: 'Annapolis, MD',
    period: 'Jul 2016 – Mar 2018',
    current: false,
    tech: ['.NET', 'C#', 'SQL Server', 'REST APIs'],
    bullets: [
      'Built backend services and REST API integrations using .NET, C#, and SQL Server for enterprise clients',
      'Designed and implemented relational data models supporting multi-system integrations',
    ],
  },
  {
    role: 'Junior Software Engineer',
    company: 'Rockwell Collins',
    location: 'Annapolis, MD',
    period: 'Jul 2014 – Jun 2016',
    current: false,
    tech: ['Java', 'Spring', 'REST APIs', 'Relational Databases'],
    bullets: [
      'Developed Java applications and backend services for avionics and defense systems in a regulated, high-reliability engineering environment',
      'Worked across the full stack with relational databases, REST services, and integration testing',
    ],
  },
];

export default function Experience() {
  return (
    <Box
      id="experience"
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
            Experience
          </Typography>
          <Typography variant="h2" sx={{ mb: { xs: 6, md: 9 }, fontSize: { xs: '2rem', md: '3rem' } }}>
            Where I've{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              worked
            </Box>
          </Typography>
        </motion.div>

        <Box sx={{ position: 'relative', pl: { xs: 0, md: '36px' } }}>
          {/* Vertical timeline line */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              left: 0,
              top: '28px',
              bottom: 0,
              width: '2px',
              background: 'linear-gradient(180deg, rgba(0,212,255,0.55) 0%, rgba(0,102,204,0.08) 100%)',
            }}
          />

          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
            >
              <Box sx={{ position: 'relative', mb: 4 }}>
                {/* Timeline dot */}
                <Box
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    position: 'absolute',
                    left: '-43px',
                    top: '28px',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    bgcolor: exp.current ? 'primary.main' : 'rgba(0,212,255,0.3)',
                    border: '2px solid #0A0E1A',
                    boxShadow: exp.current ? '0 0 14px rgba(0,212,255,0.55)' : 'none',
                  }}
                />

                <Paper
                  sx={{
                    p: { xs: 3, md: 4 },
                    bgcolor: '#1A2035',
                    border: '1px solid rgba(0,212,255,0.1)',
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1, mb: 0.5 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, flex: 1 }}>
                      {exp.role}
                    </Typography>
                    {exp.current && (
                      <Chip
                        label="Current"
                        size="small"
                        sx={{
                          bgcolor: 'rgba(0,212,255,0.1)',
                          color: 'primary.main',
                          border: '1px solid rgba(0,212,255,0.28)',
                          fontWeight: 600,
                          height: 22,
                        }}
                      />
                    )}
                  </Box>

                  <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 600, mb: 0.25 }}>
                    {exp.company}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: exp.promotion ? 0.5 : 0 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {exp.location} · {exp.period}
                    </Typography>
                  </Box>
                  {exp.promotion && (
                    <Typography variant="caption" sx={{ color: '#4CAF8A', fontWeight: 600, display: 'block', mb: 0.5 }}>
                      ↑ {exp.promotion}
                    </Typography>
                  )}

                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.06)' }} />

                  <Box component="ul" sx={{ pl: 2, mb: 2.5 }}>
                    {exp.bullets.map((bullet, j) => (
                      <Box component="li" key={j} sx={{ mb: 0.75 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>
                          {bullet}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {exp.tech.map((t) => (
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
                </Paper>
              </Box>
            </motion.div>
          ))}

          {/* LinkedIn link */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45 }}
          >
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'absolute',
                  left: '-43px',
                  top: '28px',
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  bgcolor: 'rgba(0,212,255,0.12)',
                  border: '2px solid #0A0E1A',
                }}
              />
              <Paper
                sx={{
                  p: { xs: 2.5, md: 3 },
                  bgcolor: 'rgba(26,32,53,0.4)',
                  border: '1px dashed rgba(0,212,255,0.1)',
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { sm: 'center' },
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.25 }}>
                    Earlier Career · 2013 – 2014
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Software Engineer Intern at Agnik LLC — distributed analytics platform, Java.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
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
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
