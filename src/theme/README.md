## Chakra UI Pro Theme

This theme works best in conjunction with [Chakra UI Pro](https://pro.chakra-ui.com).

### Install the theme

There are two ways to install the theme. Using the npm registry (recommended) or download the sources directly from the Chakra UI Pro website (advanced).

Let's start with the easy way - to do this just type

```bash
yarn add @chakra-ui/pro-theme # or npm install @chakra-ui/pro-theme
```

If you want to change the Chakra UI Pro theme more flexibly, it's best to get a local copy. [Download Chakra UI Pro Theme](https://pro.chakra-ui.com/downloads/themes/chakra-ui-pro-theme.zip) and add the contents to your project.

### Setup font and color

The Chakra UI Pro Theme uses [Google Font Inter](https://fonts.google.com/specimen/Inter) by default, but can be configured otherwise.
Since Inter is only a suggestion, we have not bundled the font with it. The easiest way to install the font is as follows:

```bash
yarn add @fontsource/inter # or npm install @fontsource/inter
```

Now import the font in a convenient place, for example in your app.

```tsx
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@chakra-ui/pro-theme";
import "@fontsource/inter/variable.css";

export const App = () => {
  const myTheme = extendTheme(
    {
      colors: { ...theme.colors, brand: theme.colors.purple },
    },
    theme
  );
  return (
    <ChakraProvider theme={myTheme}>
      <MyAwesomeProject />
    </ChakraProvider>
  );
};
```

To use a different font (e.g Roboto) proceed as follows.

```tsx
import { ChakraProvider } from "@chakra-ui/react";
import { theme as proTheme } from "@chakra-ui/pro-theme";
import "@fontsource/roboto";

const theme = extendTheme(
  {
    fonts: {
      heading: "Roboto, -apple-system, system-ui, sans-serif",
      body: "Roboto, -apple-system, system-ui, sans-serif",
    },
  },
  proTheme
);

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <MyAwesomeProject />
    </ChakraProvider>
  );
};
```
