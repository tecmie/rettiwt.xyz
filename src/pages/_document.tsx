import { theme } from '@/theme';
import { ColorModeScript } from '@chakra-ui/react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        {/* 👇 Here's the script */}
        <ColorModeScript
          initialColorMode={theme.config.initialColorMode}
          type="cookie"
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
