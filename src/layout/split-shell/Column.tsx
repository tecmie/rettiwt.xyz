import {
  Button,
  type ButtonProps,
  Flex,
  type FlexProps,
  HStack,
  Heading,
  type HeadingProps,
  IconButton,
  type IconButtonProps,
  // useColorModeValue removed
} from '@chakra-ui/react';

export const ColumnHeader = (props: FlexProps) => (
  <Flex
    minH="12"
    position="sticky"
    zIndex={1}
    top="0"
    px="3"
    align="center"
    blur={'blur(100px)'}
    backdropFilter={'blur(100px)'}
    bg={'inherit'}
    color={'gray.700'}
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
    _hover={{ bg: 'gray.100' }}
    _active={{ bg: 'gray.200' }}
    _focus={{ boxShadow: 'none' }}
    _focusVisible={{ boxShadow: 'outline' }}
    {...props}
  />
);

export const ColumnIconButton = (props: IconButtonProps) => (
  <IconButton
    size="sm"
    fontSize="md"
    variant="tertiary"
    _hover={{ bg: 'gray.100' }}
    _active={{ bg: 'gray.200' }}
    _focus={{ boxShadow: 'none' }}
    _focusVisible={{ boxShadow: 'outline' }}
    {...props}
  />
);
