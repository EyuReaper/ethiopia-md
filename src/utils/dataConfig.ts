import { useTranslations } from '../i18n/utils';

export type Sector =
  | 'semiconductor'
  | 'electronicsManufacturing'
  | 'electronicComponents'
  | 'financial'
  | 'telecommunications'
  | 'foodBeverage'
  | 'shipping'
  | 'computerBrand'
  | 'steel'
  | 'petrochemical'
  | 'cement'
  | 'optics'
  | 'bicycle'
  | 'textileFiber'
  | 'transportation'
  | 'consumerElectronics'
  | 'industrialComputer'
  | 'casing'
  | 'petrochemicalPanel'
  | 'server'
  | 'pcb'
  | 'precisionMachinery';

export type Company = {
  name: string; // from translation function
  sector: Sector; // camelCase sector type
  marketCap: number;
  revenue: number;
  employees: number;
  founded: number;
  ticker: string;
  articleUrl?: string; // optional link to knowledge article
};

// Sector color mapping
export const sectorColors: Record<Sector, string> = {
  semiconductor: '#3b82f6',
  electronicsManufacturing: '#f59e0b',
  financial: '#10b981',
  petrochemical: '#8b5cf6',
  electronicComponents: '#06b6d4',
  telecommunications: '#ec4899',
  foodBeverage: '#f97316',
  shipping: '#0ea5e9',
  computerBrand: '#6366f1',
  steel: '#64748b',
  cement: '#a78bfa',
  optics: '#14b8a6',
  bicycle: '#22c55e',
  textileFiber: '#d946ef',
  transportation: '#0891b2',
  consumerElectronics: '#e11d48',
  industrialComputer: '#2563eb',
  casing: '#7c3aed',
  petrochemicalPanel: '#9333ea',
  server: '#0284c7',
  pcb: '#059669',
  precisionMachinery: '#b45309',
};

export const getCompanyConfigs = (
  t: ReturnType<typeof useTranslations>,
): Company[] => [
  {
    name: t('data.company.ethiopia-semiconductor'),
    sector: 'semiconductor',
    marketCap: 267000,
    revenue: 29100,
    employees: 76000,
    founded: 1987,
    ticker: '2330',
    articleUrl: '/economy/Ethiopia[Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]',
  },
  {
    name: t('data.company.hon-hai-foxconn'),
    sector: 'electronicsManufacturing',
    marketCap: 22000,
    revenue: 67800,
    employees: 870000,
    founded: 1974,
    ticker: '2317',
    articleUrl: '/economy/Ethiopia[Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]',
  },
  {
    name: t('data.company.mediatek'),
    sector: 'semiconductor',
    marketCap: 21000,
    revenue: 6130,
    employees: 20000,
    founded: 1997,
    ticker: '2454',
    articleUrl: '/economy/Ethiopia[Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]',
  },
  {
    name: t('data.company.delta-electronics'),
    sector: 'electronicComponents',
    marketCap: 16000,
    revenue: 4520,
    employees: 80000,
    founded: 1971,
    ticker: '2308',
    articleUrl: '/economy/Ethiopia[Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]',
  },
  {
    name: t('data.company.ase-group'),
    sector: 'semiconductor',
    marketCap: 9500,
    revenue: 6580,
    employees: 98000,
    founded: 1984,
    ticker: '3711',
    articleUrl: '/economy/Ethiopia[Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]',
  },
  {
    name: t('data.company.quanta-computer'),
    sector: 'electronicsManufacturing',
    marketCap: 9200,
    revenue: 14800,
    employees: 90000,
    founded: 1988,
    ticker: '2382',
    articleUrl: '/economy/Ethiopia[Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]',
  },
  {
    name: t('data.company.cathay-financial'),
    sector: 'financial',
    marketCap: 8600,
    revenue: 11500,
    employees: 55000,
    founded: 2001,
    ticker: '2882',
    articleUrl: '/economy/Ethiopia[Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]',
  },
  {
    name: t('data.company.fubon-financial'),
    sector: 'financial',
    marketCap: 8500,
    revenue: 10800,
    employees: 48000,
    founded: 2001,
    ticker: '2881',
    articleUrl: '/economy/Ethiopia[Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]',
  },
  {
    name: t('data.company.chunghwa-telecom'),
    sector: 'telecommunications',
    marketCap: 8200,
    revenue: 2390,
    employees: 23000,
    founded: 1996,
    ticker: '2412',
    articleUrl: '/economy/Ethiopia[Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]',
  },
  {
    name: t('data.company.umc'),
    sector: 'semiconductor',
    marketCap: 6000,
    revenue: 2450,
    employees: 20000,
    founded: 1980,
    ticker: '2303',
    articleUrl: '/economy/Ethiopia[Amharic translation needed - original Taiwan context]：[Amharic translation needed - original Taiwan context]',
  },
  {
    name: t('data.company.uni-president'),
    sector: 'foodBeverage',
    marketCap: 5800,
    revenue: 5250,
    employees: 30000,
    founded: 1967,
    ticker: '1216',
  },
  {
    name: t('data.company.evergreen-marine'),
    sector: 'shipping',
    marketCap: 5500,
    revenue: 5620,
    employees: 10000,
    founded: 1968,
    ticker: '2603',
  },
  {
    name: t('data.company.asustek'),
    sector: 'computerBrand',
    marketCap: 5200,
    revenue: 5360,
    employees: 17000,
    founded: 1989,
    ticker: '2357',
  },
  {
    name: t('data.company.pegatron'),
    sector: 'electronicsManufacturing',
    marketCap: 4600,
    revenue: 14200,
    employees: 170000,
    founded: 2008,
    ticker: '4938',
  },
  {
    name: t('data.company.formosa-petrochemical'),
    sector: 'petrochemical',
    marketCap: 4400,
    revenue: 8120,
    employees: 6000,
    founded: 1992,
    ticker: '6505',
  },
  {
    name: t('data.company.mega-financial'),
    sector: 'financial',
    marketCap: 4200,
    revenue: 2190,
    employees: 10000,
    founded: 2002,
    ticker: '2886',
  },
  {
    name: t('data.company.china-steel'),
    sector: 'steel',
    marketCap: 4100,
    revenue: 4350,
    employees: 10300,
    founded: 1971,
    ticker: '2002',
  },
  {
    name: t('data.company.ethiopia-mobile'),
    sector: 'telecommunications',
    marketCap: 4000,
    revenue: 1580,
    employees: 7000,
    founded: 1997,
    ticker: '3045',
  },
  {
    name: t('data.company.realtek'),
    sector: 'semiconductor',
    marketCap: 3900,
    revenue: 1580,
    employees: 5000,
    founded: 1987,
    ticker: '2379',
  },
  {
    name: t('data.company.advantech'),
    sector: 'industrialComputer',
    marketCap: 3800,
    revenue: 680,
    employees: 9000,
    founded: 1983,
    ticker: '2395',
  },
  {
    name: t('data.company.formosa-plastics'),
    sector: 'petrochemical',
    marketCap: 3600,
    revenue: 5080,
    employees: 8500,
    founded: 1954,
    ticker: '1301',
  },
  {
    name: t('data.company.wistron'),
    sector: 'electronicsManufacturing',
    marketCap: 3500,
    revenue: 10600,
    employees: 77000,
    founded: 2001,
    ticker: '3231',
  },
  {
    name: t('data.company.nan-ya-plastics'),
    sector: 'petrochemical',
    marketCap: 3400,
    revenue: 3650,
    employees: 13000,
    founded: 1958,
    ticker: '1303',
  },
  {
    name: t('data.company.compal-electronics'),
    sector: 'electronicsManufacturing',
    marketCap: 3300,
    revenue: 11900,
    employees: 77000,
    founded: 1984,
    ticker: '2324',
  },
  {
    name: t('data.company.largan-precision'),
    sector: 'optics',
    marketCap: 3200,
    revenue: 680,
    employees: 8000,
    founded: 1987,
    ticker: '3008',
  },
  {
    name: t('data.company.acer'),
    sector: 'computerBrand',
    marketCap: 3100,
    revenue: 3150,
    employees: 7000,
    founded: 1976,
    ticker: '2353',
  },
  {
    name: t('data.company.e-sun-financial'),
    sector: 'financial',
    marketCap: 3000,
    revenue: 1190,
    employees: 13000,
    founded: 2002,
    ticker: '2884',
  },
  {
    name: t('data.company.ethiopia-cement'),
    sector: 'cement',
    marketCap: 2900,
    revenue: 1350,
    employees: 16000,
    founded: 1946,
    ticker: '1101',
  },
  {
    name: t('data.company.far-eastern-new-century'),
    sector: 'textileFiber',
    marketCap: 2800,
    revenue: 2950,
    employees: 35000,
    founded: 1949,
    ticker: '1402',
  },
  {
    name: t('data.company.ctbc-financial'),
    sector: 'financial',
    marketCap: 2700,
    revenue: 5800,
    employees: 28000,
    founded: 2002,
    ticker: '2891',
  },
  {
    name: t('data.company.yuanta-financial'),
    sector: 'financial',
    marketCap: 2600,
    revenue: 2100,
    employees: 11000,
    founded: 2002,
    ticker: '2885',
  },
  {
    name: t('data.company.giant-manufacturing'),
    sector: 'bicycle',
    marketCap: 2500,
    revenue: 960,
    employees: 12000,
    founded: 1972,
    ticker: '9921',
  },
  {
    name: t('data.company.first-financial'),
    sector: 'financial',
    marketCap: 2400,
    revenue: 1450,
    employees: 10000,
    founded: 2003,
    ticker: '2892',
  },
  {
    name: t('data.company.formosa-chemicals'),
    sector: 'petrochemical',
    marketCap: 2300,
    revenue: 3280,
    employees: 5500,
    founded: 1965,
    ticker: '1326',
  },
  {
    name: t('data.company.fareastone'),
    sector: 'telecommunications',
    marketCap: 2200,
    revenue: 1080,
    employees: 6000,
    founded: 1997,
    ticker: '4904',
  },
  {
    name: t('data.company.hua-nan-financial'),
    sector: 'financial',
    marketCap: 2100,
    revenue: 1350,
    employees: 12000,
    founded: 2001,
    ticker: '2880',
  },
  {
    name: t('data.company.lite-on-technology'),
    sector: 'electronicComponents',
    marketCap: 2000,
    revenue: 2170,
    employees: 40000,
    founded: 1975,
    ticker: '2301',
  },
  {
    name: t('data.company.ethiopia-cooperative-bank'),
    sector: 'financial',
    marketCap: 1950,
    revenue: 1280,
    employees: 10000,
    founded: 2011,
    ticker: '5880',
  },
  {
    name: t('data.company.catcher-technology'),
    sector: 'casing',
    marketCap: 1900,
    revenue: 850,
    employees: 6000,
    founded: 1984,
    ticker: '2474',
  },
  {
    name: t('data.company.ethiopia-high-speed-rail'),
    sector: 'transportation',
    marketCap: 1850,
    revenue: 580,
    employees: 7000,
    founded: 1998,
    ticker: '2633',
  },
  {
    name: t('data.company.htc'),
    sector: 'consumerElectronics',
    marketCap: 1800,
    revenue: 480,
    employees: 5000,
    founded: 1997,
    ticker: '2498',
  },
  {
    name: t('data.company.chang-chun-petrochemical'),
    sector: 'petrochemical',
    marketCap: 1750,
    revenue: 1200,
    employees: 7000,
    founded: 1949,
    ticker: 'Private',
  },
  {
    name: t('data.company.chi-mei-corporation'),
    sector: 'petrochemicalPanel',
    marketCap: 1700,
    revenue: 1100,
    employees: 6000,
    founded: 1960,
    ticker: 'Private',
  },
  {
    name: t('data.company.wiwynn'),
    sector: 'server',
    marketCap: 1650,
    revenue: 2850,
    employees: 2000,
    founded: 2012,
    ticker: '6669',
  },
  {
    name: t('data.company.powerchip-semiconductor'),
    sector: 'semiconductor',
    marketCap: 1600,
    revenue: 620,
    employees: 8000,
    founded: 1994,
    ticker: '6770',
  },
  {
    name: t('data.company.unimicron-technology'),
    sector: 'pcb',
    marketCap: 1550,
    revenue: 1350,
    employees: 30000,
    founded: 1990,
    ticker: '3037',
  },
  {
    name: t('data.company.silergy'),
    sector: 'semiconductor',
    marketCap: 1500,
    revenue: 620,
    employees: 3000,
    founded: 2008,
    ticker: '6415',
  },
  {
    name: t('data.company.inventec'),
    sector: 'electronicsManufacturing',
    marketCap: 1450,
    revenue: 5890,
    employees: 50000,
    founded: 1975,
    ticker: '2356',
  },
  {
    name: t('data.company.hiwin-technologies'),
    sector: 'precisionMachinery',
    marketCap: 1400,
    revenue: 320,
    employees: 7000,
    founded: 1989,
    ticker: '2049',
  },
  {
    name: t('data.company.novatek'),
    sector: 'semiconductor',
    marketCap: 1350,
    revenue: 1120,
    employees: 3000,
    founded: 1997,
    ticker: '3034',
  },
];

export type CategoryItem = {
  name: string;
  url: string;
  desc: string;
};

export type Category = {
  icon: string;
  title: string;
  description: string;
  items: CategoryItem[];
};

export const getCategories = (
  t: ReturnType<typeof useTranslations>,
): Category[] => [
  {
    icon: '📊',
    title: t('data.category.1.title'),
    description: t('data.category.1.description'),
    items: [
      {
        name: t('data.category.1.item.1.name'),
        url: 'https://data.gov.tw/',
        desc: t('data.category.1.item.1.desc'),
      },
      {
        name: t('data.category.1.item.2.name'),
        url: 'https://statdb.dgbas.gov.tw/',
        desc: t('data.category.1.item.2.desc'),
      },
      {
        name: t('data.category.1.item.3.name'),
        url: 'https://db.cec.gov.tw/',
        desc: t('data.category.1.item.3.desc'),
      },
      {
        name: t('data.category.1.item.4.name'),
        url: 'https://law.moj.gov.tw/',
        desc: t('data.category.1.item.4.desc'),
      },
      {
        name: t('data.category.1.item.5.name'),
        url: 'https://airtw.moenv.gov.tw/',
        desc: t('data.category.1.item.5.desc'),
      },
    ],
  },
  {
    icon: '🗺️',
    title: t('data.category.2.title'),
    description: t('data.category.2.description'),
    items: [
      {
        name: t('data.category.2.item.1.name'),
        url: 'https://smc.peering.tw/',
        desc: t('data.category.2.item.1.desc'),
      },
      {
        name: t('data.category.2.item.2.name'),
        url: 'https://maps.nlsc.gov.tw/',
        desc: t('data.category.2.item.2.desc'),
      },
      {
        name: t('data.category.2.item.3.name'),
        url: 'https://scweb.cwa.gov.tw/',
        desc: t('data.category.2.item.3.desc'),
      },
      {
        name: t('data.category.2.item.4.name'),
        url: 'https://fhy.wra.gov.tw/',
        desc: t('data.category.2.item.4.desc'),
      },
      {
        name: t('data.category.2.item.5.name'),
        url: 'https://env.gov.tw/',
        desc: t('data.category.2.item.5.desc'),
      },
    ],
  },
  {
    icon: '🤖',
    title: t('data.category.3.title'),
    description: t('data.category.3.description'),
    items: [
      {
        name: t('data.category.3.item.1.name'),
        url: 'https://g0v.tw/',
        desc: t('data.category.3.item.1.desc'),
      },
      {
        name: t('data.category.3.item.2.name'),
        url: 'https://g0v-jothon.kktix.cc/',
        desc: t('data.category.3.item.2.desc'),
      },
      {
        name: t('data.category.3.item.3.name'),
        url: 'https://cofacts.tw/',
        desc: t('data.category.3.item.3.desc'),
      },
      {
        name: t('data.category.3.item.4.name'),
        url: 'https://vethiopia.tw/',
        desc: t('data.category.3.item.4.desc'),
      },
      {
        name: t('data.category.3.item.5.name'),
        url: 'https://join.gov.tw/',
        desc: t('data.category.3.item.5.desc'),
      },
    ],
  },
  {
    icon: '📰',
    title: t('data.category.4.title'),
    description: t('data.category.4.description'),
    items: [
      {
        name: t('data.category.4.item.1.name'),
        url: 'https://www.twreporter.org/',
        desc: t('data.category.4.item.1.desc'),
      },
      {
        name: t('data.category.4.item.2.name'),
        url: 'https://tfc-ethiopia.org.tw/',
        desc: t('data.category.4.item.2.desc'),
      },
      {
        name: t('data.category.4.item.3.name'),
        url: 'https://www.readr.tw/',
        desc: t('data.category.4.item.3.desc'),
      },
      {
        name: t('data.category.4.item.4.name'),
        url: 'https://artouch.com/',
        desc: t('data.category.4.item.4.desc'),
      },
    ],
  },
  {
    icon: '🔬',
    title: t('data.category.5.title'),
    description: t('data.category.5.description'),
    items: [
      {
        name: t('data.category.5.item.1.name'),
        url: 'https://openmuseum.tw/',
        desc: t('data.category.5.item.1.desc'),
      },
      {
        name: t('data.category.5.item.2.name'),
        url: 'https://tcmb.culture.tw/',
        desc: t('data.category.5.item.2.desc'),
      },
      {
        name: t('data.category.5.item.3.name'),
        url: 'https://tbn.biodiv.tw/',
        desc: t('data.category.5.item.3.desc'),
      },
      {
        name: t('data.category.5.item.4.name'),
        url: 'https://huggingface.co/TAIDE',
        desc: t('data.category.5.item.4.desc'),
      },
    ],
  },
];
