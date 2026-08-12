export interface ResourceSite {
  nameKey: string; // i18n key, e.g. 'resources.site.president'
  url: string;
  domain: string;
  descKey?: string; // optional description i18n key (featured sites only)
  featured?: boolean; // Top 3 featured per chapter
}

export interface HeroCategory {
  id: string;
  labelKey: string;
  color: string;
  sites: ResourceSite[];
}

// ─── Hero Mindmap Data ───
// NOTE: Ethiopia does not mirror Taiwan's institutional shape 1:1 (e.g. no
// five-branch government, no single unified transit operator). Where a
// slot has no real, verifiable Ethiopian equivalent, it has been removed
// rather than filled with an invented or dead link. See git history for
// the earlier placeholder version if a citation is ever needed.
export const heroCategories: HeroCategory[] = [
  {
    id: 'government',
    labelKey: 'resources.category.government.label',
    color: '#065f46',
    sites: [
      {
        nameKey: 'resources.site.executiveYuan',
        url: 'https://www.pmo.gov.et/',
        domain: 'pmo.gov.et',
      },
      {
        nameKey: 'resources.site.legislativeYuan',
        url: 'https://www.hopr.gov.et/',
        domain: 'hopr.gov.et',
        featured: true,
        descKey: 'resources.featured.legislativeYuan',
      },
      {
        nameKey: 'resources.site.judicialYuan',
        url: 'https://www.fsc.gov.et/',
        domain: 'fsc.gov.et',
      },
      {
        nameKey: 'resources.site.mofa',
        url: 'https://www.mfa.gov.et/',
        domain: 'mfa.gov.et',
      },
      {
        nameKey: 'resources.site.moda',
        url: 'http://www.mint.gov.et/',
        domain: 'mint.gov.et',
      },
      {
        nameKey: 'resources.site.moe',
        url: 'https://moe.gov.et/',
        domain: 'moe.gov.et',
      },
      {
        nameKey: 'resources.site.moa',
        url: 'https://www.moa.gov.et/',
        domain: 'moa.gov.et',
      },
      {
        nameKey: 'resources.site.mohw',
        url: 'https://www.moh.gov.et/',
        domain: 'moh.gov.et',
      },
    ],
  },
  {
    id: 'culture',
    labelKey: 'resources.category.culture.label',
    color: '#059669',
    sites: [
      {
        nameKey: 'resources.site.ncl',
        url: 'https://www.nala.gov.et/',
        domain: 'nala.gov.et',
        featured: true,
        descKey: 'resources.featured.ncl',
      },
      {
        nameKey: 'resources.site.npm',
        url: 'https://ehap.insa.gov.et/',
        domain: 'ehap.insa.gov.et',
        featured: true,
        descKey: 'resources.featured.npm',
      },
      {
        nameKey: 'resources.site.sinica',
        url: 'https://eas-et.org/',
        domain: 'eas-et.org',
      },
      {
        nameKey: 'resources.site.ntu',
        url: 'https://www.aau.edu.et/',
        domain: 'aau.edu.et',
      },
      {
        nameKey: 'resources.site.npgov',
        url: 'https://ewca.gov.et/',
        domain: 'ewca.gov.et',
        featured: true,
        descKey: 'resources.featured.npgov',
      },
    ],
  },
  {
    id: 'tourism',
    labelKey: 'resources.category.tourism.label',
    color: '#10b981',
    sites: [
      {
        nameKey: 'resources.site.ethiopiaTourism',
        url: 'https://ewca.gov.et/',
        domain: 'ewca.gov.et',
      },
    ],
  },
  {
    id: 'economy',
    labelKey: 'resources.category.economy.label',
    color: '#047857',
    sites: [
      {
        nameKey: 'resources.site.flagCarrier',
        url: 'https://www.ethiopianairlines.com/',
        domain: 'ethiopianairlines.com',
        featured: true,
        descKey: 'resources.featured.flagCarrier',
      },
      {
        nameKey: 'resources.site.investEthiopia',
        url: 'https://investethiopia.gov.et/',
        domain: 'investethiopia.gov.et',
      },
      {
        nameKey: 'resources.site.stat',
        url: 'https://ess.gov.et/',
        domain: 'ess.gov.et',
      },
      {
        nameKey: 'resources.site.twse',
        url: 'https://esx.et/',
        domain: 'esx.et',
        featured: true,
        descKey: 'resources.featured.twse',
      },
    ],
  },
  {
    id: 'media',
    labelKey: 'resources.category.media.label',
    color: '#064e3b',
    sites: [
      {
        nameKey: 'resources.site.cna',
        url: 'https://www.ena.et/web/eng/',
        domain: 'ena.et',
      },
      {
        nameKey: 'resources.site.ptsNews',
        url: 'https://www.ebc.et/',
        domain: 'ebc.et',
        featured: true,
        descKey: 'resources.featured.ptsNews',
      },
      {
        nameKey: 'resources.site.twreporter',
        url: 'https://www.thereporterethiopia.com/',
        domain: 'thereporterethiopia.com',
        featured: true,
        descKey: 'resources.featured.twreporter',
      },
      {
        nameKey: 'resources.site.ethiopiaNews',
        url: 'https://addisstandard.com/',
        domain: 'addisstandard.com',
      },
    ],
  },
  {
    id: 'opendata',
    labelKey: 'resources.category.opendata.label',
    color: '#059669',
    sites: [
      {
        nameKey: 'resources.site.dataGov',
        url: 'https://www.data.gov.et/',
        domain: 'data.gov.et',
        featured: true,
        descKey: 'resources.featured.dataGov',
      },
      {
        nameKey: 'resources.site.ethiopiaGov',
        url: 'http://www.ethiopia.gov.et/',
        domain: 'ethiopia.gov.et',
      },
      {
        nameKey: 'resources.site.g0v',
        url: 'https://icog-labs.com/',
        domain: 'icog-labs.com',
        featured: true,
        descKey: 'resources.featured.g0vGov',
      },
    ],
  },
  {
    id: 'ethiopiamd',
    labelKey: 'resources.category.ethiopiamd.label',
    color: '#10b981',
    sites: [
      {
        nameKey: 'resources.site.github',
        url: 'https://github.com/EyuReaper/ethiopia-md',
        domain: 'github.com',
      },
      {
        nameKey: 'resources.site.contribute',
        url: '/contribute',
        domain: 'ethiopia.md',
      },
      { nameKey: 'resources.site.rss', url: '/rss.xml', domain: 'ethiopia.md' },
    ],
  },
];

// ─── Chapter 1: Government ───
// Ethiopia is a federal parliamentary republic, not a five-branch (Yuan)
// system. This list covers the key federal organs with a real, verified
// public website rather than forcing a five-way split.
export const governmentFiveYuan: ResourceSite[] = [
  {
    nameKey: 'resources.site.executiveYuan',
    url: 'https://www.pmo.gov.et/',
    domain: 'pmo.gov.et',
  },
  {
    nameKey: 'resources.site.legislativeYuan',
    url: 'https://www.hopr.gov.et/',
    domain: 'hopr.gov.et',
    featured: true,
    descKey: 'resources.featured.legislativeYuan',
  },
  {
    nameKey: 'resources.site.judicialYuan',
    url: 'https://www.fsc.gov.et/',
    domain: 'fsc.gov.et',
  },
  {
    nameKey: 'resources.site.examinationYuan',
    url: 'https://nebe.org.et/en/nebe-et',
    domain: 'nebe.org.et',
  },
  {
    nameKey: 'resources.site.controlYuan',
    url: 'https://ehrc.org/',
    domain: 'ehrc.org',
  },
];

export const governmentMinistries: ResourceSite[] = [
  {
    nameKey: 'resources.site.mofa',
    url: 'https://www.mfa.gov.et/',
    domain: 'mfa.gov.et',
  },
  {
    nameKey: 'resources.site.moda',
    url: 'http://www.mint.gov.et/',
    domain: 'mint.gov.et',
  },
  {
    nameKey: 'resources.site.moe',
    url: 'https://moe.gov.et/',
    domain: 'moe.gov.et',
  },
  {
    nameKey: 'resources.site.moea',
    url: 'https://www.mofed.gov.et/',
    domain: 'mofed.gov.et',
  },
  {
    nameKey: 'resources.site.motc',
    url: 'https://www.motl.gov.et/',
    domain: 'motl.gov.et',
  },
  {
    nameKey: 'resources.site.moi',
    url: 'https://mop.gov.et/en',
    domain: 'mop.gov.et',
  },
  {
    nameKey: 'resources.site.ndc',
    url: 'https://mopd.gov.et/en/',
    domain: 'mopd.gov.et',
  },
  {
    nameKey: 'resources.site.mol',
    url: 'https://mols.gov.et/',
    domain: 'mols.gov.et',
  },
  {
    nameKey: 'resources.site.moenv',
    url: 'https://www.epa.gov.et/',
    domain: 'epa.gov.et',
  },
  {
    nameKey: 'resources.site.moa',
    url: 'https://www.moa.gov.et/',
    domain: 'moa.gov.et',
  },
  {
    nameKey: 'resources.site.mnd',
    url: 'https://mod.gov.et/',
    domain: 'mod.gov.et',
  },
  {
    nameKey: 'resources.site.moj',
    url: 'https://justice.gov.et/en/',
    domain: 'justice.gov.et',
  },
  {
    nameKey: 'resources.site.mohw',
    url: 'https://www.moh.gov.et/',
    domain: 'moh.gov.et',
  },
  {
    nameKey: 'resources.site.trade',
    url: 'https://motri.gov.et/',
    domain: 'motri.gov.et',
  },
  {
    nameKey: 'resources.site.tipo',
    url: 'https://eipa.gov.et/',
    domain: 'eipa.gov.et',
  },
  {
    nameKey: 'resources.site.fsc',
    url: 'https://ecma.gov.et/',
    domain: 'ecma.gov.et',
  },
  {
    nameKey: 'resources.site.immigration',
    url: 'https://ics.gov.et/',
    domain: 'ics.gov.et',
  },
  {
    nameKey: 'resources.site.cwa',
    url: 'https://www.ethiomet.gov.et/',
    domain: 'ethiomet.gov.et',
  },
];

// Ethiopia's regional states and city administrations are not uniformly
// digitized the way Taiwan's 22 counties/cities are — most publish through
// sector bureaus rather than one unified regional portal. Only entries with
// a verifiable, live official site are listed; the rest were removed
// rather than guessed at.
export const governmentLocalGov: ResourceSite[] = [
  {
    nameKey: 'resources.site.capitalCity',
    url: 'https://addismayor.gov.et/',
    domain: 'addismayor.gov.et',
    featured: true,
    descKey: 'resources.featured.addisAbaba',
  },
  {
    nameKey: 'resources.site.secondCity',
    url: 'https://diredawa.et/',
    domain: 'diredawa.et',
  },
  {
    nameKey: 'resources.site.regionalState',
    url: 'https://www.amhara.gov.et/',
    domain: 'amhara.gov.et',
  },
];

export const governmentOpenData: ResourceSite[] = [
  {
    nameKey: 'resources.site.dataGov',
    url: 'https://www.data.gov.et/',
    domain: 'data.gov.et',
    featured: true,
    descKey: 'resources.featured.dataGov',
  },
  {
    nameKey: 'resources.site.ethiopiaGov',
    url: 'http://www.ethiopia.gov.et/',
    domain: 'ethiopia.gov.et',
  },
  {
    nameKey: 'resources.site.g0v',
    url: 'https://icog-labs.com/',
    domain: 'icog-labs.com',
    featured: true,
    descKey: 'resources.featured.g0vGov',
  },
];

// ─── Chapter 2: Culture ───
export const cultureUniversities: ResourceSite[] = [
  {
    nameKey: 'resources.site.ntu',
    url: 'https://www.aau.edu.et/',
    domain: 'aau.edu.et',
  },
  {
    nameKey: 'resources.site.nthu',
    url: 'https://www.bdu.edu.et/',
    domain: 'bdu.edu.et',
  },
  {
    nameKey: 'resources.site.nycu',
    url: 'https://www.mu.edu.et/',
    domain: 'mu.edu.et',
  },
  {
    nameKey: 'resources.site.ncku',
    url: 'https://www.hu.edu.et/',
    domain: 'hu.edu.et',
  },
  {
    nameKey: 'resources.site.nccu',
    url: 'https://ju.edu.et/',
    domain: 'ju.edu.et',
  },
  {
    nameKey: 'resources.site.ntnu',
    url: 'https://uog.edu.et/',
    domain: 'uog.edu.et',
  },
  {
    nameKey: 'resources.site.sinica',
    url: 'https://eas-et.org/',
    domain: 'eas-et.org',
  },
];

export const cultureMuseums: ResourceSite[] = [
  {
    nameKey: 'resources.site.ncl',
    url: 'https://www.nala.gov.et/',
    domain: 'nala.gov.et',
    featured: true,
    descKey: 'resources.featured.ncl',
  },
  {
    nameKey: 'resources.site.npm',
    url: 'https://ehap.insa.gov.et/',
    domain: 'ehap.insa.gov.et',
    featured: true,
    descKey: 'resources.featured.npm',
  },
];

export const cultureVenues: ResourceSite[] = [
  {
    nameKey: 'resources.site.tfam',
    url: 'https://allianceaddis.org/',
    domain: 'allianceaddis.org',
  },
  {
    nameKey: 'resources.site.kmfa',
    url: 'https://www.goethe.de/addisabeba',
    domain: 'goethe.de',
  },
  {
    nameKey: 'resources.site.npacNtt',
    url: 'https://www.aau.edu.et/ies/',
    domain: 'aau.edu.et',
  },
];

export const cultureParks: ResourceSite[] = [
  {
    nameKey: 'resources.site.npgov',
    url: 'https://ewca.gov.et/',
    domain: 'ewca.gov.et',
    featured: true,
    descKey: 'resources.featured.npgov',
  },
];

// ─── Chapter 3: Media ───
export const mediaMainstream: ResourceSite[] = [
  {
    nameKey: 'resources.site.cna',
    url: 'https://www.ena.et/web/eng/',
    domain: 'ena.et',
  },
  {
    nameKey: 'resources.site.ptsNews',
    url: 'https://www.ebc.et/',
    domain: 'ebc.et',
    featured: true,
    descKey: 'resources.featured.ptsNews',
  },
  {
    nameKey: 'resources.site.pts',
    url: 'https://www.fanabc.com/',
    domain: 'fanabc.com',
  },
  {
    nameKey: 'resources.site.rti',
    url: 'https://www.waltainfo.com/',
    domain: 'waltainfo.com',
  },
  {
    nameKey: 'resources.site.businessweekly',
    url: 'https://addisfortune.news/',
    domain: 'addisfortune.news',
  },
];

export const mediaDigital: ResourceSite[] = [
  {
    nameKey: 'resources.site.twreporter',
    url: 'https://www.thereporterethiopia.com/',
    domain: 'thereporterethiopia.com',
    featured: true,
    descKey: 'resources.featured.twreporter',
  },
  {
    nameKey: 'resources.site.ethiopiaNews',
    url: 'https://addisstandard.com/',
    domain: 'addisstandard.com',
    featured: true,
    descKey: 'resources.featured.ethiopiaNews',
  },
];

export const mediaNgo: ResourceSite[] = [
  {
    nameKey: 'resources.site.tahr',
    url: 'https://ehrco.org/',
    domain: 'ehrco.org',
  },
  {
    nameKey: 'resources.site.teia',
    url: 'https://redcrosseth.org/',
    domain: 'redcrosseth.org',
  },
  {
    nameKey: 'resources.site.wikimedia',
    url: 'https://meta.wikimedia.org/wiki/Wikimedians_of_Ethiopia_User_Group',
    domain: 'meta.wikimedia.org',
  },
  {
    nameKey: 'resources.site.digitalDiplomacy',
    url: 'https://www.ewla-et.org/',
    domain: 'ewla-et.org',
  },
];

// ─── Chapter 4: Economy ───
export const econCompanies: ResourceSite[] = [
  {
    nameKey: 'resources.site.flagCarrier',
    url: 'https://www.ethiopianairlines.com/',
    domain: 'ethiopianairlines.com',
    featured: true,
    descKey: 'resources.featured.flagCarrier',
  },
  {
    nameKey: 'resources.site.umc',
    url: 'https://www.ethiotelecom.et/',
    domain: 'ethiotelecom.et',
  },
  {
    nameKey: 'resources.site.foxconn',
    url: 'https://combanketh.et/home',
    domain: 'combanketh.et',
  },
  {
    nameKey: 'resources.site.investEthiopia',
    url: 'https://investethiopia.gov.et/',
    domain: 'investethiopia.gov.et',
  },
];

export const econTransport: ResourceSite[] = [
  {
    nameKey: 'resources.site.railway',
    url: 'https://erc.gov.et/',
    domain: 'erc.gov.et',
  },
  {
    nameKey: 'resources.site.taoyuanAirport',
    url: 'https://www.ethiopianairlines.com/',
    domain: 'ethiopianairlines.com',
  },
];

export const econHealth: ResourceSite[] = [
  {
    nameKey: 'resources.site.cdc',
    url: 'https://ephi.gov.et/',
    domain: 'ephi.gov.et',
  },
  {
    nameKey: 'resources.site.nhi',
    url: 'https://www.moh.gov.et/',
    domain: 'moh.gov.et',
    featured: true,
    descKey: 'resources.featured.nhi',
  },
  {
    nameKey: 'resources.site.ntuh',
    url: 'https://sphmmc.edu.et/',
    domain: 'sphmmc.edu.et',
  },
];

export const econFinance: ResourceSite[] = [
  {
    nameKey: 'resources.site.stat',
    url: 'https://ess.gov.et/',
    domain: 'ess.gov.et',
  },
  {
    nameKey: 'resources.site.twse',
    url: 'https://esx.et/',
    domain: 'esx.et',
    featured: true,
    descKey: 'resources.featured.twse',
  },
  {
    nameKey: 'resources.site.tpex',
    url: 'https://nbe.gov.et/',
    domain: 'nbe.gov.et',
  },
];

// ─── Chapter 5: Community ───
export const communityProjects: ResourceSite[] = [
  {
    nameKey: 'resources.site.g0v',
    url: 'https://icog-labs.com/',
    domain: 'icog-labs.com',
    featured: true,
    descKey: 'resources.featured.g0v',
  },
  {
    nameKey: 'resources.site.cofacts',
    url: 'https://github.com/opensourceethiopia',
    domain: 'github.com',
    featured: true,
    descKey: 'resources.featured.cofacts',
  },
  {
    nameKey: 'resources.site.disfactory',
    url: 'https://meta.wikimedia.org/wiki/Wikimedians_of_Ethiopia_User_Group',
    domain: 'meta.wikimedia.org',
  },
  {
    nameKey: 'resources.site.ethiopiamd',
    url: 'https://ethiopia.md/',
    domain: 'ethiopia.md',
    featured: true,
    descKey: 'resources.featured.ethiopiamd',
  },
];

export const communityFood: ResourceSite[] = [
  {
    nameKey: 'resources.site.burgerMap',
    url: 'https://map.et/en',
    domain: 'map.et',
  },
];

// ─── Ethiopia.md Links (footer) ───
export const ethiopiamdLinks: ResourceSite[] = [
  {
    nameKey: 'resources.site.github',
    url: 'https://github.com/EyuReaper/ethiopia-md',
    domain: 'github.com',
  },
  {
    nameKey: 'resources.site.contribute',
    url: '/contribute',
    domain: 'ethiopia.md',
  },
  { nameKey: 'resources.site.rss', url: '/rss.xml', domain: 'ethiopia.md' },
];
