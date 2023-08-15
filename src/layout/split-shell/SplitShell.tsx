import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiArrowLeft, FiHeart, FiMenu, FiRss } from "react-icons/fi";
import {
  ColumnButton,
  ColumnHeader,
  ColumnHeading,
  ColumnIconButton,
} from "./Column";
import { Timeline } from "./Timeline";
import { Navbar } from "./Navigation";
import { PostCard } from "./PostCard";

type SplitShellProps = {
  children: React.ReactNode;
};

export const SplitShell = ({ children }: SplitShellProps) => {
  const [sidebarIsScrolled, setSidebarIsScrolled] = useState(false);
  const [mainIsScrolled, setmMainIsScrolled] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex height="100vh">
      <Box
        height="full"
        ml={48}
        pr={6}
        position="relative"
        width={{ md: "14rem", xl: "18rem" }}
        display={{ base: "none", lg: "initial" }}
        overflowY="auto"
        borderRightWidth="1px"
      >
        <Navbar />
      </Box>

      <Box
        bg={useColorModeValue("gray.50", "gray.900")}
        flex="1"
        alignItems={"center"}
        overflowY="auto"
        onScroll={(x) => setmMainIsScrolled(x.currentTarget.scrollTop > 32)}
      >
        <ColumnHeader shadow={mainIsScrolled ? "base" : "none"}>
          <HStack justify="space-between" width="full">
            <HStack spacing="3">
              <ColumnIconButton
                aria-label="Navigate back"
                icon={<FiArrowLeft />}
                display={{ base: "inline-flex", md: "none" }}
              />
              {mainIsScrolled && (
                <ColumnHeading>The shape of a cupcake</ColumnHeading>
              )}
            </HStack>
            <ColumnButton leftIcon={<FiHeart />}>12</ColumnButton>
          </HStack>
        </ColumnHeader>

{children}
      </Box>

      <Box
        borderLeftWidth="1px"
        pl={6}
        mr={[4, 12, 32]}
        flex={0.5}
        width={{ md: "20rem", xl: "24rem" }}
        display={{ base: "none", md: "initial" }}
        overflowY="auto"
        onScroll={(x) => setSidebarIsScrolled(x.currentTarget.scrollTop > 32)}
      >
        <ColumnHeader shadow={sidebarIsScrolled ? "base" : "none"}>
          <HStack justify="space-between" width="full">
            <HStack spacing="3">
              <ColumnIconButton
                onClick={onOpen}
                aria-label="Open Navigation"
                icon={<FiMenu />}
                display={{ md: "inline-flex", lg: "none" }}
              />
              <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                  <Navbar onClose={onClose} />
                </DrawerContent>
              </Drawer>
              <ColumnHeading>Timeline</ColumnHeading>
            </HStack>
            <ColumnButton leftIcon={<FiRss />}>Customize</ColumnButton>
          </HStack>
        </ColumnHeader>

        <Timeline maxW="3xl" mx="auto" py="8" px={{ base: "2", md: "4" }} />
        
      </Box>
    </Flex>
  );
};
