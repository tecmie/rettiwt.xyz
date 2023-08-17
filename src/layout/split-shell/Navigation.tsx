import {
  As,
  Box,
  Button,
  ButtonProps,
  Divider,
  Flex,
  FlexProps,
  HStack,
  Icon,
  Link,
  LinkProps,
  Stack,
  Text,
  TextProps,
  useColorModeValue as mode,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiArrowUpRight,
  FiBookOpen,
  FiBookmark,
  FiCamera,
  FiFigma,
  FiFilm,
  FiGithub,
  FiHome,
  FiKey,
  FiLock,
  FiMessageCircle,
  FiMessageSquare,
  FiMic,
  FiMoon,
  FiShield,
  FiSun,
  FiTwitter,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { ColumnHeader, ColumnIconButton } from './Column';
import { HiOutlineHome } from 'react-icons/hi';
import XLogo from '@/components/logo';
import {
  MdHome,
  MdHouse,
  MdLogin,
  MdPerson,
  MdPerson2,
  MdPerson3,
  MdPersonOutline,
} from 'react-icons/md';

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
      // w={'max-content'}
      align={'flex-end'}
      // minW={{ md: "18rem", xl: "18rem" }}
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
            <Text fontWeight="bold" fontSize="sm" lineHeight="1.25rem">
              <XLogo />
            </Text>
          </HStack>
        </ColumnHeader>

        <Stack pt={[4, 8]} px="3" spacing="6">
          <Stack spacing="1">
            <NavLink icon={MdHome} aria-current="page">
              Home
            </NavLink>
            <NavLink icon={MdPersonOutline}>Profile</NavLink>
          </Stack>
        </Stack>
      </Stack>

      <Stack spacing={6} w={'xs'}>
        <Stack spacing="3" px="3">
          <NavHeading>Online</NavHeading>
          <Stack spacing="1">
            <NavLink icon={FiTwitter} isExternal>
              Twitter
            </NavLink>
            <NavLink icon={FiGithub} isExternal>
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

export const NavLink = (props: NavLinkProps) => {
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
