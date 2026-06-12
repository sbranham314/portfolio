import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Avatar,
  Button,
  Skeleton,
} from '@mui/material';
import { motion } from 'framer-motion';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';

// Personal account + the project orgs to surface (their public repos are merged in).
const USER = 'sbranham314';
const ORGS = ['retrostoremanager', 'strata-reports-ai'];

type Profile = {
  name?: string;
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  created_at?: string;
};

type Org = { login: string; name?: string; avatar_url: string; html_url: string; repos?: number };
type Repo = {
  id: number;
  name: string;
  owner: string;
  html_url: string;
  description?: string;
  language?: string;
  stars: number;
  pushed_at: string;
};

const LANG_COLOR: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  'C#': '#178600',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  Shell: '#89e051',
  Vue: '#41b883',
  Dockerfile: '#384d54',
};

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toRepo = (r: any): Repo => ({
  id: r.id,
  name: r.name,
  owner: r.owner?.login || '',
  html_url: r.html_url,
  description: r.description || undefined,
  language: r.language || undefined,
  stars: r.stargazers_count || 0,
  pushed_at: r.pushed_at,
});

function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <Box sx={{ textAlign: 'center', minWidth: 60 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.04em' }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function GithubActivity() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [stats, setStats] = useState<{ repoCount: number; stars: number }>({ repoCount: 0, stars: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cached = sessionStorage.getItem('gh-activity-v3');
        if (cached) {
          const c = JSON.parse(cached);
          setProfile(c.profile);
          setOrgs(c.orgs);
          setRepos(c.repos);
          setStats(c.stats);
          setLoading(false);
          return;
        }
      } catch {
        /* ignore */
      }

      const json = (url: string, fallback: unknown) =>
        fetch(url).then((r) => (r.ok ? r.json() : fallback)).catch(() => fallback);

      try {
        const [u, userRepos, orgProfiles, orgRepoLists] = await Promise.all([
          json(`https://api.github.com/users/${USER}`, null),
          json(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, []),
          Promise.all(ORGS.map((o) => json(`https://api.github.com/orgs/${o}`, null))),
          Promise.all(ORGS.map((o) => json(`https://api.github.com/orgs/${o}/repos?per_page=100&sort=pushed`, []))),
        ]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!u) throw new Error('profile unavailable');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const uu = u as any;

        const prof: Profile = {
          name: uu.name,
          login: uu.login,
          avatar_url: uu.avatar_url,
          html_url: uu.html_url,
          public_repos: uu.public_repos,
          created_at: uu.created_at,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const orgList: Org[] = (orgProfiles as any[])
          .filter(Boolean)
          .map((o) => ({ login: o.login, name: o.name, avatar_url: o.avatar_url, html_url: o.html_url || `https://github.com/${o.login}`, repos: o.public_repos }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allRaw: any[] = [
          ...(Array.isArray(userRepos) ? (userRepos as any[]) : []),
          ...(orgRepoLists as any[][]).flat(),
        ];
        const merged = allRaw
          .filter((r) => r && !r.fork)
          .map(toRepo)
          .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());

        const dedup = new Map<number, Repo>();
        merged.forEach((r) => dedup.has(r.id) || dedup.set(r.id, r));
        const topRepos = Array.from(dedup.values()).slice(0, 6);

        const repoCount =
          (uu.public_repos || 0) +
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (orgProfiles as any[]).filter(Boolean).reduce((s, o) => s + (o.public_repos || 0), 0);
        const stars = Array.from(dedup.values()).reduce((s, r) => s + r.stars, 0);

        if (cancelled) return;
        setProfile(prof);
        setOrgs(orgList);
        setRepos(topRepos);
        setStats({ repoCount, stars });
        setLoading(false);
        try {
          sessionStorage.setItem(
            'gh-activity-v3',
            JSON.stringify({ profile: prof, orgs: orgList, repos: topRepos, stats: { repoCount, stars } }),
          );
        } catch {
          /* ignore */
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box id="github" component="section" sx={{ py: { xs: 10, md: 16 }, bgcolor: 'background.default' }}>
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
            Open Source
          </Typography>
          <Typography variant="h2" sx={{ mb: { xs: 6, md: 9 }, fontSize: { xs: '2rem', md: '3rem' } }}>
            GitHub{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              activity
            </Box>
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {/* Profile + orgs */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              sx={{
                p: 3.5,
                height: '100%',
                bgcolor: '#1A2035',
                border: '1px solid rgba(0,212,255,0.1)',
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {loading ? (
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Skeleton variant="circular" width={56} height={56} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton width="60%" />
                      <Skeleton width="40%" />
                    </Box>
                  </Stack>
                  <Skeleton variant="rounded" height={64} />
                </Stack>
              ) : (
                <>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2.5 }}>
                    <Avatar src={profile?.avatar_url} sx={{ width: 56, height: 56, border: '2px solid rgba(0,212,255,0.3)' }}>
                      <GitHubIcon />
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {profile?.name || 'Samuel Branham'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{profile?.login || USER}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ justifyContent: 'space-around', py: 2, mb: 2.5, borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <Stat value={stats.repoCount || profile?.public_repos || '—'} label="Repos" />
                    {profile?.created_at && <Stat value={new Date(profile.created_at).getFullYear()} label="Since" />}
                    {stats.stars > 0 && <Stat value={stats.stars} label="Stars" />}
                  </Stack>

                  {orgs.length > 0 && (
                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, letterSpacing: '0.1em' }}>
                        ORGANIZATIONS
                      </Typography>
                      <Stack spacing={1}>
                        {orgs.map((o) => (
                          <Box
                            key={o.login}
                            component="a"
                            href={o.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.25,
                              textDecoration: 'none',
                              color: 'inherit',
                              p: 1,
                              borderRadius: 2,
                              border: '1px solid rgba(255,255,255,0.08)',
                              transition: 'border-color 0.2s, background-color 0.2s',
                              '&:hover': { borderColor: 'rgba(0,212,255,0.4)', bgcolor: 'rgba(0,212,255,0.04)' },
                            }}
                          >
                            <Avatar src={o.avatar_url} sx={{ width: 32, height: 32 }} />
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                                {o.name || o.login}
                              </Typography>
                              {o.repos != null && (
                                <Typography variant="caption" color="text.secondary">
                                  {o.repos} public repo{o.repos === 1 ? '' : 's'}
                                </Typography>
                              )}
                            </Box>
                            <OpenInNewIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Button
                    variant="outlined"
                    startIcon={<GitHubIcon />}
                    endIcon={<OpenInNewIcon fontSize="small" />}
                    href={profile?.html_url || `https://github.com/${USER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      mt: 'auto',
                      borderColor: 'rgba(0,212,255,0.3)',
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'rgba(0,212,255,0.08)', borderColor: 'primary.main' },
                    }}
                  >
                    View Full Profile
                  </Button>
                </>
              )}
            </Paper>
          </Grid>

          {/* Recent repositories */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              sx={{
                p: 3.5,
                height: '100%',
                bgcolor: '#1A2035',
                border: '1px solid rgba(0,212,255,0.1)',
                borderRadius: 3,
              }}
            >
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.12em', display: 'block', mb: 2 }}>
                Recently Active Repositories
              </Typography>

              {loading ? (
                <Stack spacing={1.5}>
                  {[0, 1, 2, 3].map((k) => (
                    <Skeleton key={k} variant="rounded" height={56} />
                  ))}
                </Stack>
              ) : error || repos.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Live data is taking a break — see everything on{' '}
                  <Box component="a" href={`https://github.com/${USER}`} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                    GitHub
                  </Box>
                  .
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {repos.map((r) => (
                    <Box
                      key={r.id}
                      component="a"
                      href={r.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'block',
                        textDecoration: 'none',
                        color: 'inherit',
                        p: 1.5,
                        borderRadius: 2,
                        border: '1px solid transparent',
                        transition: 'background-color 0.2s, border-color 0.2s',
                        '&:hover': { bgcolor: 'rgba(0,212,255,0.05)', borderColor: 'rgba(0,212,255,0.2)' },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <Box component="span" color="text.secondary" sx={{ fontWeight: 400 }}>
                            {r.owner}/
                          </Box>
                          {r.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                          {timeAgo(r.pushed_at)}
                        </Typography>
                      </Box>
                      {r.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, lineHeight: 1.5 }}>
                          {r.description}
                        </Typography>
                      )}
                      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mt: 0.75 }}>
                        {r.language && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: LANG_COLOR[r.language] || '#9BA3AF' }} />
                            <Typography variant="caption" color="text.secondary">
                              {r.language}
                            </Typography>
                          </Box>
                        )}
                        {r.stars > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, color: 'text.secondary' }}>
                            <StarBorderRoundedIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption">{r.stars}</Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
