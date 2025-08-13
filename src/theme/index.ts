import 'focus-visible/dist/focus-visible';
import { createSystem, defaultConfig } from '@chakra-ui/react';

// Simple theme configuration for Chakra UI v3
const config = {
  tokens: {
    colors: {
      black: { value: '#414141' },
      brand: { value: '#1DA1F2' },
      gray: {
        '50': { value: '#F2F2F2' },
        '100': { value: '#DBDBDB' },
        '200': { value: '#CACACA' },
        '300': { value: '#ADADAD' },
        '400': { value: '#969696' },
        '500': { value: '#838383' },
        '600': { value: '#666666' },
        '700': { value: '#333333' },
        '800': { value: '#16181c' },
        '900': { value: '#000000' },
      },
    },
  },
  globalCss: {
    body: {
      color: 'gray.700',
      bg: 'white',
    },
  },
};

export const theme = createSystem(defaultConfig, config);
