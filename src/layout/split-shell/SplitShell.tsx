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

      {children}
    </Flex>
  );
};
