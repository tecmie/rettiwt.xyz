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
} from "@chakra-ui/react";
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
} from "react-icons/fi";
import { ColumnHeader, ColumnIconButton } from "./Column";
import { HiOutlineHome } from "react-icons/hi";

interface NavbarProps extends FlexProps {
  onClose?: () => void;
}

export const Navbar = (props: NavbarProps) => {
  const { toggleColorMode } = useColorMode();
  const ToggleIcon = useColorModeValue(FiMoon, FiSun);
  const toggleText = `${useColorModeValue("Dark", "Light")} Theme`;

  return (
    <Flex
      as="nav"
      height="full"
      direction="column"
      justify="space-between"
      {...props}
    >
      <Stack spacing="3">
        <ColumnHeader>
          <HStack spacing="3">
            <ColumnIconButton
              onClick={props.onClose}
              aria-label="Close navigation"
              icon={<FiX />}
              display={{ base: "inline-flex", lg: "none" }}
            />
            <Text fontWeight="bold" fontSize="sm" lineHeight="1.25rem">
              X
            </Text>
          </HStack>
        </ColumnHeader>

        <Stack pt={[4, 8]} px="3" spacing="6">
          <Stack spacing="1">
            <NavLink icon={HiOutlineHome}>Home</NavLink>
            <NavLink icon={FiBookOpen} aria-current="page">
              Writing
            </NavLink>
          </Stack>

          {/*         
        <Stack spacing="3">
          <NavHeading>Me</NavHeading>
          <Stack spacing="1">
            <NavLink icon={FiBookmark}>BookMarks</NavLink>
            <NavLink icon={FiCamera}>Photography</NavLink>
            <NavLink icon={FiMessageCircle}>Chat</NavLink>
          </Stack>
        </Stack> */}

          {/* <Stack spacing="3">
          <NavHeading>Projects</NavHeading>
          <Stack spacing="1">
            <NavLink icon={FiMic} isExternal>
              Podcasts
            </NavLink>
            <NavLink icon={FiFigma} isExternal>
              Figma Plugins
            </NavLink>
            <NavLink icon={FiShield}>Security Checklist</NavLink>
            <NavLink icon={FiMessageSquare}>Hacker News</NavLink>
            <NavLink icon={FiFilm}>Movie Guide</NavLink>
          </Stack>
        </Stack> */}
        </Stack>
      </Stack>

      <Stack spacing={6}>
        <Stack spacing="3" px="3">
          <NavHeading>Online</NavHeading>
          <Stack spacing="1">
            <NavLink icon={FiTwitter} isExternal>
              Twitter
            </NavLink>
            <NavLink icon={FiGithub} isExternal>
              GitHub
            </NavLink>

            <NavLink icon={ToggleIcon} onClick={toggleColorMode}>
              {toggleText}
            </NavLink>
          </Stack>
        </Stack>

        <Box borderTopWidth="0">
          {/* <Divider ml={-24} w={'23rem'} position={'fixed'}  /> */}
          <NavButton leftIcon={<Icon as={FiLock} boxSize={4} />}>
            Sign In
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
    borderRadius="0"
    variant="tertiary"
    size="lg"
    fontSize="sm"
    _hover={{ bg: mode("gray.100", "gray.700") }}
    _active={{ bg: mode("gray.200", "gray.600") }}
    _focus={{ boxShadow: "none" }}
    _focusVisible={{ boxShadow: "outline" }}
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
      _hover={{ bg: mode("gray.100", "gray.700") }}
      _activeLink={{
        bg: "gray.700",
        color: "white",
      }}
      {...linkProps}
    >
      <HStack justify="space-between">
        <HStack as="a" spacing="3">
          <Icon as={icon} />
          <Text as="span" fontSize="sm" lineHeight="1.25rem">
            {props.children}
          </Text>
        </HStack>
        {props.isExternal && (
          <Icon
            as={FiArrowUpRight}
            boxSize="4"
            color={mode("gray.600", "gray.400")}
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
    color={mode("gray.600", "gray.400")}
    {...props}
  />
);
