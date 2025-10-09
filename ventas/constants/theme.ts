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
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** Fuentes personalizadas PublicSans */
    sans: 'PublicSans-Regular',
    serif: 'PublicSans-Regular',
    rounded: 'PublicSans-Medium',
    mono: 'PublicSans-Medium',
  },
  android: {
    /** Fuentes personalizadas PublicSans */
    sans: 'PublicSans-Regular',
    serif: 'PublicSans-Regular',
    rounded: 'PublicSans-Medium',
    mono: 'PublicSans-Medium',
  },
  default: {
    sans: 'PublicSans-Regular',
    serif: 'PublicSans-Regular',
    rounded: 'PublicSans-Medium',
    mono: 'PublicSans-Medium',
  },
  web: {
    sans: 'PublicSans-Regular, system-ui, sans-serif',
    serif: 'PublicSans-Regular, Georgia, serif',
    rounded: 'PublicSans-Medium, sans-serif',
    mono: 'PublicSans-Medium, monospace',
  },
});
