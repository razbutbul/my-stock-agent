import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import type { StockInsight } from '../types/agent';
import type { InsightSection, InsightSectionKey } from '../types/insight-sections';
import {
  getEntryDecisionColor,
  getEntryScoreColor,
  getEntryScoreLabel,
  getHolderDecisionColor,
  getOrderedDetailSections,
  getSellRiskColor,
  getSellRiskLabel,
  parseInsightSections,
} from '../utils/parseInsightSections';
import { InsightSectionContent } from './InsightSectionContent';
import { StockQuoteCard } from './StockQuoteCard';

interface StockInsightsCardProps {
  data: StockInsight;
}

const HERO_SECTION_KEYS = new Set<InsightSectionKey>([
  'bottomLine',
  'entryScore',
  'sellRiskScore',
  'successProbability',
]);

const SECTION_META: Record<
  InsightSectionKey,
  { icon: ReactNode; accent: string }
> = {
  bottomLine: { icon: <FlagOutlinedIcon />, accent: '#00c896' },
  technical: { icon: <ShowChartOutlinedIcon />, accent: '#4dabf7' },
  news: { icon: <NewspaperOutlinedIcon />, accent: '#7eb8ff' },
  potential: { icon: <RocketLaunchOutlinedIcon />, accent: '#5ce0b8' },
  contracts: { icon: <DescriptionOutlinedIcon />, accent: '#8ec5ff' },
  growthEngines: { icon: <LocalFireDepartmentOutlinedIcon />, accent: '#ff8a4c' },
  competitors: { icon: <EmojiEventsOutlinedIcon />, accent: '#ffd166' },
  risks: { icon: <WarningAmberOutlinedIcon />, accent: '#ffb020' },
  entryDecision: { icon: <CheckCircleOutlineOutlinedIcon />, accent: '#00c896' },
  holderDecision: { icon: <WorkOutlineOutlinedIcon />, accent: '#b388ff' },
  entryScore: { icon: <AssessmentOutlinedIcon />, accent: '#4dabf7' },
  sellRiskScore: { icon: <TrendingDownOutlinedIcon />, accent: '#ff6b6b' },
  successProbability: { icon: <AutoGraphOutlinedIcon />, accent: '#00c896' },
};

function SectionCard({ section }: { section: InsightSection }) {
  const meta = SECTION_META[section.key];

  if (HERO_SECTION_KEYS.has(section.key)) {
    return null;
  }

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Card
        sx={{
          height: '100%',
          borderTop: `3px solid ${meta.accent}`,
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'center' }}>
            <Box sx={{ color: meta.accent, display: 'flex' }}>{meta.icon}</Box>
            <Typography variant="h6">{section.title}</Typography>
          </Stack>
          <InsightSectionContent content={section.content} />
        </CardContent>
      </Card>
    </Grid>
  );
}

export function StockInsightsCard({ data }: StockInsightsCardProps) {
  const parsed = useMemo(
    () => parseInsightSections(data.insights),
    [data.insights],
  );

  const bottomLine = parsed.sections.find(
    (section) => section.key === 'bottomLine',
  );
  const detailSections = getOrderedDetailSections(parsed.sections);
  const entryScoreColor = parsed.entryScore
    ? getEntryScoreColor(parsed.entryScore)
    : '#4dabf7';
  const sellRiskColor = parsed.sellRiskScore
    ? getSellRiskColor(parsed.sellRiskScore)
    : '#ffb020';

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
        }}
      >
        <Box>
          <Typography variant="h5">
            {data.symbol} — {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ניתוח מומנטום, חדשות, פוטנציאל עסקי, חוזים, מתחרות וסיכונים
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {parsed.entryDecision && (
            <Chip
              label={parsed.entryDecision}
              color={getEntryDecisionColor(parsed.entryDecision)}
              icon={<BoltOutlinedIcon />}
              sx={{ fontWeight: 700, px: 0.5 }}
            />
          )}
          {parsed.holderDecision && (
            <Chip
              label={parsed.holderDecision}
              color={getHolderDecisionColor(parsed.holderDecision)}
              icon={<WorkOutlineOutlinedIcon />}
              sx={{ fontWeight: 700, px: 0.5 }}
            />
          )}
        </Stack>
      </Stack>

      {data.stock && <StockQuoteCard data={data.stock} compact />}

      <Card
        sx={{
          border: '1px solid rgba(0, 200, 150, 0.25)',
          background:
            'linear-gradient(135deg, rgba(0, 200, 150, 0.12), rgba(18, 26, 47, 0.9))',
        }}
      >
        <CardContent>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            sx={{ alignItems: { xs: 'stretch', md: 'center' } }}
          >
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                <FlagOutlinedIcon color="primary" />
                <Typography variant="h6">שורה תחתונה</Typography>
              </Stack>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {bottomLine?.content || parsed.raw}
              </Typography>
            </Box>

            <Stack spacing={2} sx={{ minWidth: { md: 280 } }}>
              {parsed.entryScore !== null && (
                <Box>
                  <Stack
                    direction="row"
                    sx={{ mb: 0.75, justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      ציון כניסה
                    </Typography>
                    <Typography variant="h6" sx={{ color: entryScoreColor }}>
                      {parsed.entryScore}/100
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={parsed.entryScore}
                    sx={{
                      height: 10,
                      borderRadius: 999,
                      bgcolor: 'rgba(255,255,255,0.08)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: entryScoreColor,
                        borderRadius: 999,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75 }}>
                    {getEntryScoreLabel(parsed.entryScore)}
                  </Typography>
                </Box>
              )}

              {parsed.sellRiskScore !== null && (
                <Box>
                  <Stack
                    direction="row"
                    sx={{ mb: 0.75, justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      ציון סיכון מכירה
                    </Typography>
                    <Typography variant="h6" sx={{ color: sellRiskColor }}>
                      {parsed.sellRiskScore}/100
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={parsed.sellRiskScore}
                    sx={{
                      height: 10,
                      borderRadius: 999,
                      bgcolor: 'rgba(255,255,255,0.08)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: sellRiskColor,
                        borderRadius: 999,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75 }}>
                    {getSellRiskLabel(parsed.sellRiskScore)}
                  </Typography>
                </Box>
              )}

              {parsed.successProbability !== null && (
                <Box>
                  <Stack
                    direction="row"
                    sx={{ mb: 0.75, justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      הסתברות הצלחה (12 חודשים)
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {parsed.successProbability}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={parsed.successProbability}
                    color="primary"
                    sx={{
                      height: 10,
                      borderRadius: 999,
                      bgcolor: 'rgba(255,255,255,0.08)',
                      '& .MuiLinearProgress-bar': { borderRadius: 999 },
                    }}
                  />
                </Box>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {detailSections.length > 0 ? (
        <Grid container spacing={2}>
          {detailSections.map((section) => (
            <SectionCard key={section.key} section={section} />
          ))}
        </Grid>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
              {parsed.raw}
            </Typography>
          </CardContent>
        </Card>
      )}

      {data.toolsUsed.length > 0 && (
        <Typography variant="caption" color="text.secondary">
          כלים בשימוש: {data.toolsUsed.join(', ')}
        </Typography>
      )}

      <Typography variant="caption" color="text.secondary">
        המידע להמחשה ולימוד בלבד — אינו מהווה ייעוץ פיננסי. השקעה כרוכה בסיכון.
      </Typography>
    </Stack>
  );
}
