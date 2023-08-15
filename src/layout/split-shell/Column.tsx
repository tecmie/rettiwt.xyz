import {
  Button,
  ButtonProps,
  Flex,
  FlexProps,
  Heading,
  HeadingProps,
  IconButton,
  IconButtonProps,
  useColorModeValue,
} from "@chakra-ui/react";

export const ColumnHeader = (props: FlexProps) => (
  <Flex
    minH="12"
    position="sticky"
    zIndex={1}
    top="0"
    px="3"
    align="center"
    // bg={useColorModeValue('white', 'gray.800')}
    bg={"inherit"}
    color={useColorModeValue("gray.700", "white")}
    {...props}
  />
);

export const ColumnHeading = (props: HeadingProps) => (
  <Heading fontWeight="bold" fontSize="sm" lineHeight="1.25rem" {...props} />
);

export const ColumnButton = (props: ButtonProps) => (
  <Button
    variant="tertiary"
    size="sm"
    fontSize="xs"
    _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
    _active={{ bg: useColorModeValue("gray.200", "gray.600") }}
    _focus={{ boxShadow: "none" }}
    _focusVisible={{ boxShadow: "outline" }}
    {...props}
  />
);

export const ColumnIconButton = (props: IconButtonProps) => (
  <IconButton
    size="sm"
    fontSize="md"
    variant="tertiary"
    _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
    _active={{ bg: useColorModeValue("gray.200", "gray.600") }}
    _focus={{ boxShadow: "none" }}
    _focusVisible={{ boxShadow: "outline" }}
    {...props}
  />
);
