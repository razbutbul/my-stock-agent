import type {
  EntryDecision,
  HolderDecision,
  InsightSection,
  InsightSectionKey,
  ParsedInsight,
} from '../types/insight-sections';

const SECTION_DEFINITIONS: Array<{
  key: InsightSectionKey;
  title: string;
  markers: string[];
}> = [
  {
    key: 'bottomLine',
    title: 'שורה תחתונה',
    markers: ['🎯 שורה תחתונה', 'שורה תחתונה'],
  },
  {
    key: 'technical',
    title: 'נרות ומומנטום',
    markers: [
      '📈 נרות ומומנטום',
      'נרות ומומנטום',
      '📈 תמונה טכנית',
      'תמונה טכנית',
    ],
  },
  {
    key: 'news',
    title: 'חדשות אחרונות והשפעה על המניה',
    markers: [
      '📰 חדשות אחרונות והשפעה על המניה',
      'חדשות אחרונות והשפעה על המניה',
      '📰 חדשות אחרונות',
      'חדשות אחרונות',
    ],
  },
  {
    key: 'potential',
    title: 'פוטנציאל עסקי',
    markers: [
      '🚀 פוטנציאל עסקי',
      'פוטנציאל עסקי',
      '🚀 פוטנציאל קדימה',
      'פוטנציאל קדימה',
    ],
  },
  {
    key: 'contracts',
    title: 'חוזים ועסקאות משמעותיות',
    markers: [
      '📑 חוזים ועסקאות משמעותיות',
      'חוזים ועסקאות משמעותיות',
    ],
  },
  {
    key: 'growthEngines',
    title: 'מנועי צמיחה',
    markers: [
      '🔥 מנועי צמיחה',
      'מנועי צמיחה',
      '🤝 קטליזטורים',
      'קטליזטורים',
    ],
  },
  {
    key: 'competitors',
    title: 'מתחרות מובילות',
    markers: ['🏆 מתחרות מובילות', 'מתחרות מובילות'],
  },
  {
    key: 'risks',
    title: 'מה יכול להרוס את התזה',
    markers: [
      '⚠️ מה יכול להרוס את התזה',
      'מה יכול להרוס את התזה',
      '⚠️ סיכונים מרכזיים',
      'סיכונים מרכזיים',
    ],
  },
  {
    key: 'entryDecision',
    title: 'החלטה לכניסה חדשה',
    markers: [
      '✅ החלטה לכניסה חדשה',
      'החלטה לכניסה חדשה',
      '✅ החלטה',
      'החלטה',
    ],
  },
  {
    key: 'holderDecision',
    title: 'למחזיקים קיימים — האם לשקול מכירה?',
    markers: [
      '💼 למחזיקים קיימים — האם לשקול מכירה?',
      'למחזיקים קיימים — האם לשקול מכירה?',
      '💼 למחזיקים קיימים',
      'למחזיקים קיימים',
    ],
  },
  {
    key: 'entryScore',
    title: 'ציון כניסה נוכחי',
    markers: [
      '📊 ציון כניסה נוכחי',
      'ציון כניסה נוכחי',
      '📊 ציון נוכחי',
      'ציון נוכחי',
      '📊 ציון השקעה',
      'ציון השקעה',
    ],
  },
  {
    key: 'sellRiskScore',
    title: 'ציון סיכון מכירה',
    markers: ['📉 ציון סיכון מכירה', 'ציון סיכון מכירה'],
  },
  {
    key: 'successProbability',
    title: 'הסתברות הצלחה ל-12 חודשים',
    markers: [
      '🎯 הסתברות הצלחה ל-12 חודשים',
      'הסתברות הצלחה ל-12 חודשים',
      'הסתברות השקעה נוכחית',
    ],
  },
];

export const DETAIL_SECTION_ORDER: InsightSectionKey[] = [
  'technical',
  'news',
  'potential',
  'contracts',
  'growthEngines',
  'competitors',
  'risks',
  'entryDecision',
  'holderDecision',
];

const HERO_SECTION_KEYS = new Set<InsightSectionKey>([
  'bottomLine',
  'entryScore',
  'sellRiskScore',
  'successProbability',
]);

const ENTRY_DECISION_OPTIONS: EntryDecision[] = [
  'מעניין לכניסה',
  'מעניין רק במעקב',
  'עדיף להמתין',
  'לא מעניין כרגע',
];

const HOLDER_DECISION_OPTIONS: HolderDecision[] = [
  'אין סיבה ברורה למכור כרגע',
  'להחזיק אך לעקוב מקרוב',
  'לשקול צמצום חשיפה',
  'סיכון מכירה גבוה',
];

function findSectionStart(text: string, markers: string[]): number {
  for (const marker of markers) {
    const index = text.indexOf(marker);
    if (index !== -1) {
      return index;
    }
  }

  return -1;
}

function extractSectionContent(text: string, start: number, end: number): string {
  const slice = text.slice(start, end === -1 ? undefined : end);
  const firstLineBreak = slice.indexOf('\n');

  if (firstLineBreak === -1) {
    return '';
  }

  return slice
    .slice(firstLineBreak)
    .replace(/^[\s:-]+/, '')
    .replace(/^---\s*/gm, '')
    .replace(/\*\*/g, '')
    .trim();
}

function parseSections(text: string): InsightSection[] {
  const starts = SECTION_DEFINITIONS.map((definition) => ({
    definition,
    index: findSectionStart(text, definition.markers),
  }))
    .filter((entry) => entry.index !== -1)
    .sort((a, b) => a.index - b.index);

  return starts.map((entry, index) => {
    const nextIndex = starts[index + 1]?.index ?? -1;

    return {
      key: entry.definition.key,
      title: entry.definition.title,
      content: extractSectionContent(text, entry.index, nextIndex),
    };
  });
}

function extractScore(
  text: string,
  patterns: RegExp[],
): number | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = Number(match[1]);
      if (value >= 0 && value <= 100) {
        return value;
      }
    }
  }

  return null;
}

function extractEntryScore(text: string): number | null {
  return extractScore(text, [
    /ציון כניסה נוכחי[\s\S]{0,120}?(\d{1,3})\s*\/\s*100/,
    /ציון נוכחי[\s\S]{0,120}?(\d{1,3})\s*\/\s*100/,
    /ציון השקעה[\s\S]{0,120}?(\d{1,3})\s*\/\s*100/,
    /ציון כניסה נוכחי[^\d]{0,40}(\d{1,3})/,
    /ציון נוכחי[^\d]{0,40}(\d{1,3})/,
    /ציון השקעה[^\d]{0,40}(\d{1,3})/,
  ]);
}

function extractSellRiskScore(text: string): number | null {
  return extractScore(text, [
    /ציון סיכון מכירה[\s\S]{0,120}?(\d{1,3})\s*\/\s*100/,
    /ציון סיכון מכירה[^\d]{0,40}(\d{1,3})/,
  ]);
}

function extractSuccessProbability(text: string): number | null {
  return extractScore(text, [
    /הסתברות(?:\s+הצלחה|\s+השקעה)[^%\n]{0,80}(\d{1,3})\s*%/,
    /הסתברות הצלחה ל-12 חודשים[\s\S]{0,80}?(\d{1,3})\s*%/,
  ]);
}

function extractEntryDecision(text: string): EntryDecision {
  const decisionSection = parseSections(text).find(
    (section) => section.key === 'entryDecision',
  );
  const haystack = decisionSection?.content ?? text;

  return (
    ENTRY_DECISION_OPTIONS.find((option) => option && haystack.includes(option)) ??
    null
  );
}

function extractHolderDecision(text: string): HolderDecision {
  const holderSection = parseSections(text).find(
    (section) => section.key === 'holderDecision',
  );
  const haystack = holderSection?.content ?? text;

  return (
    HOLDER_DECISION_OPTIONS.find((option) => option && haystack.includes(option)) ??
    null
  );
}

export function getOrderedDetailSections(
  sections: InsightSection[],
): InsightSection[] {
  const sectionMap = new Map(
    sections
      .filter((section) => !HERO_SECTION_KEYS.has(section.key))
      .map((section) => [section.key, section]),
  );

  const ordered = DETAIL_SECTION_ORDER.flatMap((key) => {
    const section = sectionMap.get(key);
    return section ? [section] : [];
  });

  const knownKeys = new Set([...HERO_SECTION_KEYS, ...DETAIL_SECTION_ORDER]);

  const extras = sections.filter(
    (section) => !knownKeys.has(section.key),
  );

  return [...ordered, ...extras];
}

export function parseInsightSections(insights: string): ParsedInsight {
  const raw = insights.trim();
  const sections = parseSections(raw);

  return {
    sections,
    entryScore: extractEntryScore(raw),
    sellRiskScore: extractSellRiskScore(raw),
    successProbability: extractSuccessProbability(raw),
    entryDecision: extractEntryDecision(raw),
    holderDecision: extractHolderDecision(raw),
    raw,
  };
}

export function getEntryScoreLabel(score: number): string {
  if (score >= 90) return 'הזדמנות חריגה';
  if (score >= 80) return 'הזדמנות חזקה';
  if (score >= 70) return 'מעניינת';
  if (score >= 60) return 'סבירה';
  if (score >= 50) return 'מעורבת';
  if (score >= 40) return 'חלשה';
  if (score >= 20) return 'לא אטרקטיבית';
  return 'מסוכנת';
}

export function getSellRiskLabel(score: number): string {
  if (score >= 90) return 'סיכון מכירה גבוה מאוד';
  if (score >= 75) return 'סיכון מכירה גבוה';
  if (score >= 60) return 'כדאי לבחון צמצום או הגנה';
  if (score >= 40) return 'ניטרלי / תלוי מחיר כניסה';
  if (score >= 20) return 'אין לחץ ברור למכור';
  return 'עדיפות להחזקה';
}

export function getEntryDecisionColor(
  decision: EntryDecision,
): 'success' | 'info' | 'warning' | 'error' | 'default' {
  switch (decision) {
    case 'מעניין לכניסה':
      return 'success';
    case 'מעניין רק במעקב':
      return 'info';
    case 'עדיף להמתין':
      return 'warning';
    case 'לא מעניין כרגע':
      return 'error';
    default:
      return 'default';
  }
}

export function getHolderDecisionColor(
  decision: HolderDecision,
): 'success' | 'info' | 'warning' | 'error' | 'default' {
  switch (decision) {
    case 'אין סיבה ברורה למכור כרגע':
      return 'success';
    case 'להחזיק אך לעקוב מקרוב':
      return 'info';
    case 'לשקול צמצום חשיפה':
      return 'warning';
    case 'סיכון מכירה גבוה':
      return 'error';
    default:
      return 'default';
  }
}

export function getEntryScoreColor(score: number): string {
  if (score >= 80) return '#00c896';
  if (score >= 60) return '#4dabf7';
  if (score >= 40) return '#ffb020';
  return '#ff6b6b';
}

export function getSellRiskColor(score: number): string {
  if (score >= 75) return '#ff6b6b';
  if (score >= 60) return '#ffb020';
  if (score >= 40) return '#4dabf7';
  return '#00c896';
}
