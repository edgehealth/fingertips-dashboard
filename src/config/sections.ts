import { colors, colorsRGB } from '../theme/colors';

export type SectionId = 'cyp' | 'early-cancer';

// API `category` query param accepted by the /indicators endpoint.
export type SectionCategory = 'CYP' | 'EarlyCancer';

export interface SectionConfig {
  id: SectionId;
  path: string;
  category: SectionCategory;
  navLabel: string;
  mainTitle: string;
  subtitle: string;
  backgroundColor: string;
  accentColor: string;
  accentColorRgb: string;
}

export const sections: Record<SectionId, SectionConfig> = {
  cyp: {
    id: 'cyp',
    path: '/cyp',
    category: 'CYP',
    navLabel: 'Children & Young People',
    mainTitle: 'Edge Health',
    subtitle: 'Children & Young People Health',
    backgroundColor: colors.secondary.lightPink,
    accentColor: colors.primary.pink,
    accentColorRgb: colorsRGB.pink,
  },
  'early-cancer': {
    id: 'early-cancer',
    path: '/early-cancer',
    category: 'EarlyCancer',
    navLabel: 'Early Cancer Diagnosis',
    mainTitle: 'Edge Health',
    subtitle: 'Early Cancer Diagnosis',
    backgroundColor: colors.secondary.lightCyan,
    accentColor: colors.secondary.aquamarine,
    accentColorRgb: colorsRGB.aquamarine,
  },
};

export const sectionList: SectionConfig[] = [sections.cyp, sections['early-cancer']];
