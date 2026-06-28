export const inter = {
  regular: { fontFamily: 'Roboto_400Regular' },
  medium: { fontFamily: 'Roboto_500Medium' },
  semiBold: { fontFamily: 'Roboto_500Medium' },
  bold: { fontFamily: 'Roboto_700Bold' },
  extraBold: { fontFamily: 'Roboto_900Black' },
};

export const defaultThemeColor = '#0F172A';

export const materialPalettes = {
  light: {
    primary: '#0F172A',
    onPrimary: '#FFFFFF',
    primaryContainer: '#ECFCCB',
    onPrimaryContainer: '#3F6212',
    secondary: '#EC4899',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#FCE7F3',
    onSecondaryContainer: '#831843',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    onSurface: '#0F172A',
  },
  dark: {
    primary: '#F8FAFC',
    onPrimary: '#0F172A',
    primaryContainer: '#334155',
    onPrimaryContainer: '#F1F5F9',
    secondary: '#F472B6',
    onSecondary: '#831843',
    secondaryContainer: '#9D174D',
    onSecondaryContainer: '#FCE7F3',
    background: '#0F172A',
    surface: '#1E293B',
    onSurface: '#F8FAFC',
  },
};

export const colors = {
  pageBg: '#F9FAFB',
  headerGreen: '#A3E635',
  headerGreenDark: '#3F6212',
  creamCard: '#FCE7F3',
  surfaceWarm: '#FFFFFF',
  white: '#FFFFFF',
  card: '#FFFFFF',
  ink: '#0F172A',
  inkMuted: '#64748B',
  inkSoft: '#94A3B8',
  primary: '#0F172A',
  primaryBorder: '#0F172A',
  primarySoft: '#ECFCCB',
  mintIconBg: '#ECFCCB',
  badgeBg: '#ECFCCB',
  badgeText: '#3F6212',
  tabInactive: '#94A3B8',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  borderLight: '#E2E8F0',
  iconCircle: '#F1F5F9',
  accent: '#EC4899',
  accentSoft: '#FCE7F3',
  border: '#E2E8F0',
  bgOuter: '#F8FAFC',
  surface: '#FFFFFF',
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
  return {
    shadowColor: '#0F172A',
    shadowOffset: { width: 3.5, height: 3.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
  };
}
