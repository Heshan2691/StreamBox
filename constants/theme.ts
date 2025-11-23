/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    
    // App-specific colors
    primary: '#E50914',
    secondary: '#564d4d',
    accent: '#FFD700',
    cardBackground: '#FFFFFF',
    headerBackground: '#1a1a1a',
    inputBackground: '#f5f5f5',
    inputBorder: '#ddd',
    placeholderText: '#999',
    error: '#ff0000',
    success: '#00ff00',
    border: '#e0e0e0',
    shadow: '#000',
    overlay: 'rgba(0, 0, 0, 0.5)',
    buttonText: '#FFFFFF',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    
    // App-specific colors
    primary: '#E50914',
    secondary: '#8c8c8c',
    accent: '#FFD700',
    cardBackground: '#1f1f1f',
    headerBackground: '#0a0a0a',
    inputBackground: '#2a2a2a',
    inputBorder: '#444',
    placeholderText: '#666',
    error: '#ff4444',
    success: '#44ff44',
    border: '#333',
    shadow: '#000',
    overlay: 'rgba(0, 0, 0, 0.7)',
    buttonText: '#FFFFFF',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
