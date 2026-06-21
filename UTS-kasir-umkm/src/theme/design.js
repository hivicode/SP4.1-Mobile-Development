export const inter = {
  regular: { fontFamily: 'Inter_400Regular' },
  medium: { fontFamily: 'Inter_500Medium' },
  semiBold: { fontFamily: 'Inter_600SemiBold' },
  bold: { fontFamily: 'Inter_700Bold' },
  extraBold: { fontFamily: 'Inter_800ExtraBold' },
};

export const defaultThemeColor = '#346739';

export const materialPalettes = {
  light: {
    primary: '#346739',
    onPrimary: '#FFFFFF',
    primaryContainer: '#9FCB98',
    onPrimaryContainer: '#022105',
    secondary: '#79AE6F',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#F2EDC2',
    onSecondaryContainer: '#2A3323',
    background: '#FDFDF9',
    surface: '#F8F9F4',
    onSurface: '#1A1C18',
  },
  dark: {
    primary: '#9FCB98',
    onPrimary: '#003814',
    primaryContainer: '#346739',
    onPrimaryContainer: '#C2F4B8',
    secondary: '#F2EDC2',
    onSecondary: '#313321',
    secondaryContainer: '#4D6745',
    onSecondaryContainer: '#DDE6C6',
    background: '#111410',
    surface: '#191D17',
    onSurface: '#E2E3DD',
  },
};

export const colors = {
  pageBg: '#FDFDF9',
  headerGreen: '#346739',
  headerGreenDark: '#022105',
  creamCard: '#F2EDC2',
  surfaceWarm: '#F8F9F4',
  white: '#FFFFFF',
  card: '#F8F9F4',
  ink: '#1A1C18',
  inkMuted: '#6B7280',
  inkSoft: '#9CA3AF',
  primary: '#346739',
  primaryBorder: '#022105',
  primarySoft: '#9FCB98',
  mintIconBg: '#9FCB98',
  badgeBg: '#9FCB98',
  badgeText: '#022105',
  tabInactive: '#9CA3AF',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  borderLight: '#E5E7EB',
  iconCircle: '#F3F4F6',
  accent: '#C67B5C',
  accentSoft: '#F3E6DF',
  border: '#E5E7EB',
  bgOuter: '#F9FAFB',
  surface: '#F8F9F4',
};

export const themeSwatches = [
  { label: 'Logo', value: defaultThemeColor },
  { label: 'Biru', value: '#2563EB' },
  { label: 'Merah', value: '#DC2626' },
  { label: 'Kuning', value: '#CA8A04' },
  { label: 'Ungu', value: '#7C3AED' },
  { label: 'Toska', value: '#0F766E' },
];

function normalizeHex(hex) {
  const clean = String(hex || defaultThemeColor).replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean.padEnd(6, '0').slice(0, 6);
  return `#${full.toUpperCase()}`;
}

function hexToRgb(hex) {
  const clean = normalizeHex(hex).replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function toHex(value) {
  return Math.max(0, Math.min(255, Math.round(value)))
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
}

function mix(hex, targetHex, amount) {
  const base = hexToRgb(hex);
  const target = hexToRgb(targetHex);
  return `#${toHex(base.r + (target.r - base.r) * amount)}${toHex(
    base.g + (target.g - base.g) * amount
  )}${toHex(base.b + (target.b - base.b) * amount)}`;
}

export function createAppColors(seedColor = defaultThemeColor) {
  return createThemedColors(seedColor, 'light');
}

export function createThemedColors(seedColor = defaultThemeColor, appearanceMode = 'light') {
  const dark = appearanceMode === 'dark';
  const p = dark ? materialPalettes.dark : materialPalettes.light;
  const muted = dark ? '#BAC2B4' : '#5E665A';
  const soft = dark ? '#8D9588' : '#747C70';
  const border = dark ? '#343A31' : '#DFE4D8';
  const iconCircle = dark ? '#252B22' : '#EEF2E8';

  return {
    ...colors,
    pageBg: p.background,
    bgOuter: p.background,
    white: p.surface,
    card: p.surface,
    surface: p.surface,
    surfaceWarm: p.surface,
    creamCard: p.secondaryContainer,
    ink: p.onSurface,
    inkMuted: muted,
    inkSoft: soft,
    borderLight: border,
    border,
    iconCircle,
    tabInactive: soft,
    headerGreen: dark ? p.primaryContainer : p.primary,
    headerGreenDark: dark ? p.onPrimary : p.onPrimaryContainer,
    primary: p.primary,
    onPrimary: p.onPrimary,
    primaryBorder: dark ? p.onPrimary : p.onPrimaryContainer,
    primarySoft: p.primaryContainer,
    onPrimaryContainer: p.onPrimaryContainer,
    mintIconBg: p.primaryContainer,
    badgeBg: p.primaryContainer,
    badgeText: p.onPrimaryContainer,
    secondary: p.secondary,
    onSecondary: p.onSecondary,
    secondaryContainer: p.secondaryContainer,
    onSecondaryContainer: p.onSecondaryContainer,
    accent: p.secondary,
    accentSoft: p.secondaryContainer,
    isDark: dark,
  };
}

export function cardShadow(opacity, radius) {
  // Flat theme: intentionally no shadows/elevation.
  // Keeping the helper avoids touching many call sites.
  return {};
}
