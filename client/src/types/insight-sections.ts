export type InsightSectionKey =
  | 'bottomLine'
  | 'technical'
  | 'news'
  | 'potential'
  | 'contracts'
  | 'growthEngines'
  | 'competitors'
  | 'risks'
  | 'entryDecision'
  | 'holderDecision'
  | 'entryScore'
  | 'sellRiskScore'
  | 'successProbability';

export type EntryDecision =
  | 'מעניין לכניסה'
  | 'מעניין רק במעקב'
  | 'עדיף להמתין'
  | 'לא מעניין כרגע'
  | null;

export type HolderDecision =
  | 'אין סיבה ברורה למכור כרגע'
  | 'להחזיק אך לעקוב מקרוב'
  | 'לשקול צמצום חשיפה'
  | 'סיכון מכירה גבוה'
  | null;

export interface InsightSection {
  key: InsightSectionKey;
  title: string;
  content: string;
}

export interface ParsedInsight {
  sections: InsightSection[];
  entryScore: number | null;
  sellRiskScore: number | null;
  successProbability: number | null;
  entryDecision: EntryDecision;
  holderDecision: HolderDecision;
  raw: string;
}
