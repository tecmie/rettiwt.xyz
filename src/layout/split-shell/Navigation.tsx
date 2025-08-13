import {
  type As,
  Box,
  Button,
  type ButtonProps,
  Flex,
  type FlexProps,
  HStack,
  Icon,
  Stack,
  Text,
  type TextProps,
  useColorModeValue as mode,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiArrowUpRight,
  FiGithub,
  FiLock,
  FiMoon,
  FiSun,
  FiTwitter,
  FiX,
} from 'react-icons/fi';
import { ColumnHeader, ColumnIconButton } from './Column';
import XLogo from '@/components/logo';
import { MdHome, MdInfoOutline, MdPersonOutline } from 'react-icons/md';
import Link from 'next/link';
import type { LinkProps } from 'next/link';

interface NavbarProps extends FlexProps {
  onClose?: () => void;
}

export const Navbar = (props: NavbarProps) => {
  const { toggleColorMode } = useColorMode();
  const ToggleIcon = useColorModeValue(FiMoon, FiSun);
  const toggleText = `${useColorModeValue('Dark', 'Light')} Theme`;

  return (
    <Flex
      as="nav"
      align={'flex-end'}
      // flex={1}
      height="full"
      direction="column"
      justify="space-between"
      {...props}
    >
      <Stack spacing="3" w={'xs'}>
        <ColumnHeader>
          <HStack spacing="3">
            <ColumnIconButton
              onClick={props.onClose}
              aria-label="Close navigation"
              icon={<FiX />}
              display={{ base: 'inline-flex', lg: 'none' }}
            />
            <Text
              as={Link}
              href={'/'}
              fontWeight="bold"
              fontSize="sm"
              lineHeight="1.25rem"
            >
              <XLogo />
            </Text>
          </HStack>
        </ColumnHeader>

        <Stack pt={[4, 8]} px="3" spacing="6">
          <Stack spacing="1">
            <NavLink p={2} href="/home" icon={MdHome}>
              Home
            </NavLink>
            <NavLink p={2} href="/sentiments" icon={MdInfoOutline}>
              Brain
            </NavLink>
            <NavLink p={2} href="/" icon={MdPersonOutline}>
              Persona
            </NavLink>
          </Stack>
        </Stack>
      </Stack>

      <Stack spacing={6} w={'xs'}>
        <Stack spacing="3" px="3">
          <NavHeading>Online</NavHeading>
          <Stack spacing="1">
            <NavLink href="https://x.com/0xalzzy" icon={FiTwitter} isExternal>
              Twitter
            </NavLink>
            <NavLink
              href="https://github.com/koolamusic/rettiwt.xyz"
              icon={FiGithub}
              isExternal
            >
              GitHub
            </NavLink>

            <NavButton
              fontWeight={'normal'}
              color="emphasized"
              pl={2}
              size={'sm'}
              leftIcon={<Icon mr={1} as={ToggleIcon} />}
              onClick={toggleColorMode}
            >
              {toggleText}
            </NavButton>
          </Stack>
        </Stack>

        <Box borderTopWidth="0" mb={4}>
          {/* <Divider ml={-24} w={'23rem'} position={'fixed'}  /> */}
          <NavButton
            rounded={'full'}
            variant={'outline'}
            w={'max-content'}
            leftIcon={<Icon as={FiLock} boxSize={4} />}
          >
            Create a Profile
          </NavButton>
        </Box>
      </Stack>
    </Flex>
  );
};

const NavButton = (props: ButtonProps) => (
  <Button
    width="full"
    justifyContent="flex-start"
    // borderRadius="0"
    variant="tertiary"
    size="lg"
    fontSize="sm"
    _hover={{ bg: mode('blackAlpha.200', 'whiteAlpha.200') }}
    _active={{ bg: mode('gray.200', 'gray.600') }}
    _focus={{ boxShadow: 'none' }}
    _focusVisible={{ boxShadow: 'outline' }}
    {...props}
  />
);

interface NavLinkProps extends LinkProps {
  icon: As;
}

export const NavLink = (props: NavLinkProps & { isExternal?: boolean }) => {
  const { icon, ...linkProps } = props;
  return (
    <Link
      px="2"
      py="1.5"
      borderRadius="md"
      _hover={{ bg: mode('blackAlpha.200', 'whiteAlpha.200') }}
      _activeLink={{
        bg: mode('blackAlpha.200', 'whiteAlpha.100'),
        fontWeight: 'bold',
        color: 'emphasized',
      }}
      {...linkProps}
    >
      <HStack justify="space-between">
        <HStack as="button" spacing="3">
          <Icon as={icon} />
          <Text as="span" fontSize="sm" lineHeight="1.25rem">
            {props.children}
          </Text>
        </HStack>
        {props.isExternal && (
          <Icon
            as={FiArrowUpRight}
            boxSize="4"
            color={mode('gray.600', 'gray.400')}
          />
        )}
      </HStack>
    </Link>
  );
};

export const NavHeading = (props: TextProps) => (
  <Text
    as="h4"
    fontSize="xs"
    fontWeight="semibold"
    px="2"
    lineHeight="1.25"
    color={mode('gray.600', 'gray.400')}
    {...props}
  />
);
