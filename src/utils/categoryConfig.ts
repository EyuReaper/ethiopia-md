import { useTranslations } from '../i18n/utils';

export const getCategoryConfigs = (t: ReturnType<typeof useTranslations>) => ({
  about: {
    name: 'About',
    description: 'About Ethiopia.md - Origin story, team, and mission',
    icon: '📖',
    color: '#4b5563',
    colorLight: '#4b556320',
    gradient: 'linear-gradient(135deg, #4b5563, #6b7280)',
  },
  history: {
    name: t('categoryConfig.history'),
    description: t('categoryConfig.history.description'),

    icon: '📜',
    color: '#92400e',
    colorLight: '#f59e0b20',
    gradient: 'linear-gradient(135deg, #92400e, #d97706)',
    cover: '/images/categories/history.svg',
  },
  geography: {
    name: t('categoryConfig.geography'),
    description: t('categoryConfig.geography.description'),
    icon: '🗺️',
    color: '#065f46',
    colorLight: '#059f4620',
    gradient: 'linear-gradient(135deg, #065f46, #10b981)',
    cover: '/images/categories/geography.svg',
  },
  culture: {
    name: t('categoryConfig.culture'),
    description: t('categoryConfig.culture.description'),

    icon: '🎭',
    color: '#7c3aed',
    colorLight: '#7c3aed20',
    gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    cover: '/images/categories/culture.svg',
  },
  food: {
    name: t('categoryConfig.food'),
    description: t('categoryConfig.food.description'),
    icon: '🍜',
    color: '#ea580c',
    colorLight: '#ea580c20',
    gradient: 'linear-gradient(135deg, #ea580c, #f97316)',
    cover: '/images/categories/food.svg',
  },
  art: {
    name: t('categoryConfig.art'),
    description: t('categoryConfig.art.description'),
    icon: '🎨',
    color: '#be185d',
    colorLight: '#be185d20',
    gradient: 'linear-gradient(135deg, #be185d, #ec4899)',
    cover: '/images/categories/art.svg',
  },
  music: {
    name: t('categoryConfig.music'),
    description: t('categoryConfig.music.description'),
    icon: '🎵',
    color: '#0891b2',
    colorLight: '#0891b220',
    gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)',
    cover: '/images/categories/music.svg',
  },
  technology: {
    name: t('categoryConfig.technology'),
    description: t('categoryConfig.technology.description'),
    icon: '💻',
    color: '#1d4ed8',
    colorLight: '#1d4ed820',
    gradient: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
    cover: '/images/categories/technology.svg',
  },
  nature: {
    name: t('categoryConfig.nature'),
    description: t('categoryConfig.nature.description'),
    icon: '🌿',
    color: '#15803d',
    colorLight: '#15803d20',
    gradient: 'linear-gradient(135deg, #15803d, #22c55e)',
    cover: '/images/categories/nature.svg',
  },
  people: {
    name: t('categoryConfig.people'),
    description: t('categoryConfig.people.description'),
    description_en:
      "Key figures and stories that shaped Ethiopia's development",
    icon: '👥',
    color: '#b45309',
    colorLight: '#b4530920',
    gradient: 'linear-gradient(135deg, #b45309, #f59e0b)',
    cover: '/images/categories/people.svg',
  },
  society: {
    name: t('categoryConfig.society'),
    description: t('categoryConfig.society.description'),
    icon: '🏛️',
    color: '#475569',
    colorLight: '#47556920',
    gradient: 'linear-gradient(135deg, #475569, #64748b)',
    cover: '/images/categories/society.svg',
  },
  economy: {
    name: t('categoryConfig.economy'),
    description: t('categoryConfig.economy.description'),
    icon: '📊',
    color: '#c2410c',
    colorLight: '#c2410c20',
    gradient: 'linear-gradient(135deg, #c2410c, #ea580c)',
    cover: '/images/categories/economy.svg',
  },
  lifestyle: {
    name: t('categoryConfig.lifestyle'),
    description: t('categoryConfig.lifestyle.description'),
    icon: '🏠',
    color: '#4d7c0f',
    colorLight: '#4d7c0f20',
    gradient: 'linear-gradient(135deg, #4d7c0f, #65a30d)',
    cover: '/images/categories/lifestyle.svg',
  },
});

const __plainCategoryConfig = getCategoryConfigs((key) => key as any);

export const categoryList = Object.keys(__plainCategoryConfig) as CategoryKey[];
export type CategoryKey = keyof typeof __plainCategoryConfig;
