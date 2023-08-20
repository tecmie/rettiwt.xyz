import 'focus-visible/dist/focus-visible';
import base from '@chakra-ui/theme';
import { type ThemeConfig, extendTheme } from '@chakra-ui/react';
import * as components from './components';
import * as foundations from './foundations';

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  cssVarPrefix: 'xims',
  useSystemColorMode: false,
};

export const theme: Record<string, any> = extendTheme({
  config,
  ...foundations,
  components: { ...components },
  colors: {
    ...base.colors,
    black: '#414141',
    brand: base.colors.twitter,
    gray: {
      '50': '#F2F2F2',
      '100': '#DBDBDB',
      '200': '#CACACA',
      '300': '#ADADAD',
      '400': '#969696',
      '500': '#838383',
      '600': '#666666',
      // "700": "#414141",0px solid #
      '700': '#333333',
      '800': '#16181c',
      '900': '#000000',
    },
  },
});
