import {
  Box,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { Navbar } from "./Navigation";
import { PostCard } from "./PostCard";

type SplitShellProps = {
  children: React.ReactNode;
};

export const SplitShell = ({ children }: SplitShellProps) => {

  return (
    <Flex height="100vh" marginX="auto">
      <Box
        height="full"
        // ml={48}
        pr={4}
        position="relative"
        w={'full'}
        maxW={'xl'}
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
