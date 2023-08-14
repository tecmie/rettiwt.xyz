/* eslint-disable */
import type { StyleFunctionProps } from "@chakra-ui/theme-tools";
import { darken, mode, transparentize } from "@chakra-ui/theme-tools";

const baseStyle = {
  ":focus:not(:focus-visible)": {
    boxShadow: "none",
  },
  colorScheme: "orange",
  fontWeight: "400",
  borderRadius: "lg",
};

const sizes = {
  lg: {
    fontSize: "md",
  },
};

const variants = {
  primary: (props: StyleFunctionProps) => ({
    ...props,
    variant: "solid",
    colorScheme: "brand",
  }),
  "primary-on-accent": () => ({
    bg: "brand.50",
    color: "brand.600",
    _hover: { bg: "brand.100" },
    _active: { bg: "brand.100" },
  }),
  gradient: () => ({
    color: "black",
    height: "60px",
    fontSize: "md",
    fontFamily: "heading",
    bgGradient: "linear(to-r, #F1D94F, #A8FF78)",
    _hover: {
      bgGradient: "linear(to-l, #F1D94F, #A8FF78)",
    },
  }),
  brand: (props: StyleFunctionProps) =>
    props.theme.components.Button.variants.solid({
      ...props,
      colorScheme: "brand",
    }),
  outline: (props: StyleFunctionProps) => ({
    color: "emphasized",
    bg: "#191E1B",
    fontFamily: "heading",
    fontSize: "md",
    border: "1px solid",
    _hover: {
      bg: mode(
        darken("gray.50", 1)(props.theme),
        transparentize("gray.700", 0.4)(props.theme)
      )(props),
    },
    _checked: {
      bg: mode("gray.100", "gray.700")(props),
    },
    _active: {
      bg: mode("gray.100", "gray.700")(props),
    },
  }),
  ghost: (props: StyleFunctionProps) => ({
    color: "emphasized",
    _hover: {
      bg: mode(
        darken("gray.50", 1)(props.theme),
        darken("gray.700", 4)(props.theme)
      )(props),
    },
    _active: {
      bg: mode(
        darken("gray.50", 1)(props.theme),
        darken("gray.700", 4)(props.theme)
      )(props),
    },
    _activeLink: {
      bg: mode("gray.100", "gray.700")(props),
    },
  }),
  "ghost-on-accent": (props: StyleFunctionProps) => ({
    color: "brand.50",
    _hover: {
      bg: transparentize("brand.400", 0.67)(props.theme),
    },
    _activeLink: {
      color: "white",
      bg: "bg-accent-subtle",
    },
  }),
  link: (props: StyleFunctionProps) => {
    if (props.colorScheme === "gray") {
      return {
        color: "muted",
        _hover: {
          textDecoration: "none",
          color: "default",
        },
        _active: {
          color: "default",
        },
      };
    }
    return {
      color: mode(
        `${props.colorScheme}.600`,
        `${props.colorScheme}.200`
      )(props),
      _hover: {
        color: mode(
          `${props.colorScheme}.700`,
          `${props.colorScheme}.300`
        )(props),
        textDecoration: "none",
      },
      _active: {
        color: mode(
          `${props.colorScheme}.700`,
          `${props.colorScheme}.300`
        )(props),
      },
    };
  },
  "link-on-accent": () => ({
    padding: 0,
    height: "auto",
    lineHeight: "normal",
    verticalAlign: "baseline",
    color: "brand.50",
    _hover: {
      color: "white",
    },
    _active: {
      color: "white",
    },
  }),
};

const button = {
  baseStyle,
  variants,
  defaultProps: {
    size: "lg",
    fontWeight: "500",
  },
  sizes,
};

export default button;
