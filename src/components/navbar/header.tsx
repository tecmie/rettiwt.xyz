import {
  Box,
  Button,
  ButtonGroup,
  Container,
  HStack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Logo } from "./navbar-logo";
import { MobileDrawer } from "./mobile-drawer";
import { ToggleButton } from "./toggle-button";

export const Navbar = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const mobileNavbar = useDisclosure();
  return (
    <Box as="section">
      <Box
        borderBottomWidth="1px"
        bg="bg.surface"
        position="relative"
        zIndex="tooltip"
      >
        <Container py="3" mb={0}>
          <HStack justify="space-between">
            <Logo />
            {isDesktop ? (
              <HStack spacing="8">
                <ButtonGroup
                  size="lg"
                  variant="text"
                  colorScheme="gray"
                  spacing="1"
                >
                  {[""].map((item) => (
                    <Button key={item}>{item}</Button>
                  ))}
                </ButtonGroup>
                <Button colorScheme="brand">Get Started</Button>
              </HStack>
            ) : (
              <>
                <ToggleButton
                  onClick={mobileNavbar.onToggle}
                  isOpen={mobileNavbar.isOpen}
                  aria-label="Open Menu"
                />
                <MobileDrawer
                  isOpen={mobileNavbar.isOpen}
                  onClose={mobileNavbar.onClose}
                />
              </>
            )}
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};
