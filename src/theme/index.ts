import 'focus-visible/dist/focus-visible';
import base from '@chakra-ui/theme';
import { ThemeConfig, extendBaseTheme } from '@chakra-ui/react';
import * as components from './components';
import * as foundations from './foundations';

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  cssVarPrefix: 'xims',
  useSystemColorMode: false,
};

const brand = {
  '50': '#EAFBF4',
  '100': '#BFF3DD',
  '200': '#94EAC6',
  '300': '#69E2AF',
  '400': '#3FDA99',
  '500': '#25C07F',
  '600': '#1D9663',
  '700': '#156B47',
  '800': '#0C402A',
  '900': '#04150E',
};

export const theme: Record<string, any> = extendBaseTheme(
  {
    config,
    ...foundations,
    components: { ...components },
    colors: {
      ...base.colors,
      black: '#414141',
      brand: brand,
      green: brand,
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
  },
  base,
);
