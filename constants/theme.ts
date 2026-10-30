import { CategoryInfo } from '../types/dictionary';

export const Colors = {
  // Brand colors (Denizli Horozu Kırmızısı & Pamukkale Beyazı)
  primary: '#C0392B',
  primaryDark: '#962D22',
  primaryLight: '#FADBD8',
  primarySubtle: '#FDEDEC',
  
  // Neutral & background tokens
  background: '#FAFAF8',
  card: '#FFFFFF',
  cardBorder: '#E5E7EB',
  surface: '#FFFFFF',
  surfaceVariant: '#F3F4F6',
  surfaceHover: '#F9FAFB',
  
  // Text tokens
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Accent & functional colors
  accent: '#D97706',       // Traverten kehribarı
  accentLight: '#FEF3C7',
  heart: '#E11D48',        // Favori kalbi
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  border: '#E5E7EB',
  divider: '#F0F0EE',
  
  // Audio playback indicator
  audioActive: '#C0392B',
  audioBackground: '#FDE8E7',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  minTouchTarget: 44, // Minimum 44x44px for accessibility
};

export const Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 28,
    hero: 34,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.45,
    relaxed: 1.6,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 9999,
};

export const Shadows = {
  soft: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  floating: {
    shadowColor: '#C0392B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'hepsi',
    label: 'Tümü',
    iconName: 'apps-outline',
  },
  {
    id: 'gunluk_yasam',
    label: 'Günlük Yaşam',
    iconName: 'home-outline',
  },
  {
    id: 'tarim',
    label: 'Tarım & Hayvancılık',
    iconName: 'leaf-outline',
  },
  {
    id: 'yiyecek_icecek',
    label: 'Mutfak & Lezzet',
    iconName: 'restaurant-outline',
  },
  {
    id: 'giyim_kusam',
    label: 'Giyim & Kuşam',
    iconName: 'shirt-outline',
  },
  {
    id: 'akrabalik',
    label: 'Akrabalık & Hitap',
    iconName: 'people-outline',
  },
  {
    id: 'doga',
    label: 'Doğa & Çevre',
    iconName: 'flower-outline',
  },
  {
    id: 'diger',
    label: 'Deyimler & Diğer',
    iconName: 'chatbubble-ellipses-outline',
  },
];
