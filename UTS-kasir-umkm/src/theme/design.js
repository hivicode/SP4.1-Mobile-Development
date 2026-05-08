export const inter = {
  regular: { fontFamily: 'Inter_400Regular' },
  medium: { fontFamily: 'Inter_500Medium' },
  semiBold: { fontFamily: 'Inter_600SemiBold' },
  bold: { fontFamily: 'Inter_700Bold' },
  extraBold: { fontFamily: 'Inter_800ExtraBold' },
};

export const colors = {
  pageBg: '#F9FAFB',
  headerGreen: '#3D7A4D',
  headerGreenDark: '#2F5F3D',
  creamCard: '#F2F4E8',
  surfaceWarm: '#FDFCF0',
  white: '#FFFFFF',
  card: '#FFFFFF',
  ink: '#1F2937',
  inkMuted: '#6B7280',
  inkSoft: '#9CA3AF',
  primary: '#3D7A4D',
  primaryBorder: '#2F5F3D',
  primarySoft: '#E8F0E8',
  mintIconBg: '#E8F0E8',
  badgeBg: '#DCFCE7',
  badgeText: '#166534',
  tabInactive: '#9CA3AF',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  borderLight: '#E5E7EB',
  iconCircle: '#F3F4F6',
  accent: '#C67B5C',
  accentSoft: '#F3E6DF',
  border: '#E5E7EB',
  bgOuter: '#F9FAFB',
  surface: '#FDFCF0',
};

export function cardShadow(opacity, radius) {
  // Flat theme: intentionally no shadows/elevation.
  // Keeping the helper avoids touching many call sites.
  return {};
}
