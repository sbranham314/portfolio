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
import CommitIcon from '@mui/icons-material/Commit';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';

const USER = 'sbranham314';

type Profile = {
  name?: string;
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  bio?: string;
  created_at?: string;
};

type Activity = { id: string; type: string; repo: string; repoUrl: string; text: string; when: string };

const cap = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

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
function summarize(e: any): Activity | null {
  const repo: string = e?.repo?.name || '';
  if (!repo) return null;
  const base = { id: String(e.id), type: e.type, repo, repoUrl: `https://github.com/${repo}`, when: timeAgo(e.created_at) };
  switch (e.type) {
    case 'PushEvent': {
      const n = e.payload?.commits?.length || e.payload?.size || 1;
      return { ...base, text: `Pushed ${n} commit${n > 1 ? 's' : ''} to` };
    }
    case 'PullRequestEvent': {
      const merged = e.payload?.pull_request?.merged;
      return { ...base, text: merged ? 'Merged a pull request in' : `${cap(e.payload?.action)} a pull request in` };
    }
    case 'IssuesEvent':
      return { ...base, text: `${cap(e.payload?.action)} an issue in` };
    case 'CreateEvent': {
      const rt = e.payload?.ref_type;
      if (rt === 'repository') return { ...base, text: 'Created repository' };
      return { ...base, text: `Created a ${rt || 'ref'} in` };
    }
    case 'ReleaseEvent':
      return { ...base, text: 'Published a release in' };
    case 'ForkEvent':
      return { ...base, text: 'Forked' };
    case 'WatchEvent':
      return { ...base, text: 'Starred' };
    default:
      return null;
  }
}

const ICONS: Record<string, ReactNode> = {
  PushEvent: <CommitIcon fontSize="small" />,
  PullRequestEvent: <CallMergeIcon fontSize="small" />,
  WatchEvent: <StarBorderRoundedIcon fontSize="small" />,
  ForkEvent: <AltRouteIcon fontSize="small" />,
  CreateEvent: <AddCircleOutlinedIcon fontSize="small" />,
};

function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <Box sx={{ textAlign: 'center', minWidth: 64 }}>
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
  const [activity, setActivity] = useState<Activity[]>([]);
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cached = sessionStorage.getItem('gh-activity-v1');
        if (cached) {
          const c = JSON.parse(cached);
          setProfile(c.profile);
          setActivity(c.activity);
          setStars(c.stars);
          setLoading(false);
          return;
        }
      } catch {
        /* ignore cache errors */
      }

      try {
        const [uRes, eRes, rRes] = await Promise.all([
          fetch(`https://api.github.com/users/${USER}`),
          fetch(`https://api.github.com/users/${USER}/events/public?per_page=30`),
          fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`),
        ]);
        if (!uRes.ok) throw new Error('profile fetch failed');
        const u = await uRes.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const events: any[] = eRes.ok ? await eRes.json() : [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const repos: any[] = rRes.ok ? await rRes.json() : [];

        const prof: Profile = {
          name: u.name,
          login: u.login,
          avatar_url: u.avatar_url,
          html_url: u.html_url,
          public_repos: u.public_repos,
          followers: u.followers,
          bio: u.bio,
          created_at: u.created_at,
        };
        const seen = new Set<string>();
        const acts = (Array.isArray(events) ? events : [])
          .map(summarize)
          .filter((a): a is Activity => a !== null)
          .filter((a) => {
            const key = `${a.text}|${a.repo}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .slice(0, 7);
        const starCount = Array.isArray(repos)
          ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
          : 0;

        if (cancelled) return;
        setProfile(prof);
        setActivity(acts);
        setStars(starCount);
        setLoading(false);
        try {
          sessionStorage.setItem('gh-activity-v1', JSON.stringify({ profile: prof, activity: acts, stars: starCount }));
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
          {/* Profile + stats */}
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

                  {profile?.bio && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.7 }}>
                      {profile.bio}
                    </Typography>
                  )}

                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ justifyContent: 'space-around', py: 2, mb: 2.5, borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <Stat value={profile?.public_repos ?? '—'} label="Repos" />
                    {profile?.created_at && <Stat value={new Date(profile.created_at).getFullYear()} label="Since" />}
                    {!!profile && profile.followers > 0 && <Stat value={profile.followers} label="Followers" />}
                    {stars != null && stars > 0 && <Stat value={stars} label="Stars" />}
                  </Stack>

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

          {/* Recent activity */}
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
                Recent Activity
              </Typography>

              {loading ? (
                <Stack spacing={2}>
                  {[0, 1, 2, 3].map((k) => (
                    <Skeleton key={k} variant="rounded" height={36} />
                  ))}
                </Stack>
              ) : error || activity.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Live activity is taking a break — see everything on{' '}
                  <Box
                    component="a"
                    href={`https://github.com/${USER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'primary.main', textDecoration: 'none' }}
                  >
                    GitHub
                  </Box>
                  .
                </Typography>
              ) : (
                <Stack spacing={0.5}>
                  {activity.map((a) => (
                    <Box
                      key={a.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 1.25,
                        px: 1,
                        borderRadius: 2,
                        transition: 'background-color 0.2s',
                        '&:hover': { bgcolor: 'rgba(0,212,255,0.05)' },
                      }}
                    >
                      <Box sx={{ color: 'primary.main', display: 'flex', flexShrink: 0 }}>
                        {ICONS[a.type] || <CommitIcon fontSize="small" />}
                      </Box>
                      <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }}>
                        <Box component="span" color="text.secondary">
                          {a.text}{' '}
                        </Box>
                        <Box
                          component="a"
                          href={a.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: 'text.primary', fontWeight: 600, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                        >
                          {a.repo}
                        </Box>
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                        {a.when}
                      </Typography>
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
