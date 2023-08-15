import { Box, Container, useBreakpointValue } from "@chakra-ui/react";
import HomeNav from "./HomeNav";
import HomeNavDesktop from "./HomeNavDesktop";

interface LayoutProps {
  children: React.ReactNode;
  topNav?: boolean;
  pageName?: string;
}
export const LayoutContainer = (props: LayoutProps) => {
  return (
    <Box
      minH={"100vh"}
      bg={"bg-canvas"}
      // bgGradient={{ sm: "linear(to-r, blue.600, purple.600)" }}
      pt={{ base: "0", md: "10", "2xl": "24" }}
      // pt={
      //   props.topNav
      //     ? { base: "4", md: "24", "2xl": "24" }
      //     : { base: "4", md: "10", "2xl": "24" }
      // }
      style={{ display: "flex" }}
      h={"100vh"}
    >
      <Container
        maxW="md"
        // py={0}
        py={{ base: "0", sm: "8" }}
        px={{ base: "4", sm: "10" }}
        /* We need a lot of bottom padding in the container wrapper */
        pb={{ base: props.topNav ? "20" : "12", md: "16", "2xl": "24" }}
        bg={useBreakpointValue({ base: "transparent", sm: "bg-surface" })}
        // boxShadow={{ base: "none", sm: "xl" }}
        borderRadius={{ base: "none", sm: "xl" }}
        overflowY="scroll"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        css={{
          "&::-webkit-scrollbar": {
            width: "0px",
            background: "transparent",
          },
          "&::-webkit-scrollbar-track": {
            width: "0px",
          },
        }}
        position="relative"
      >
        {props.children}
        {props.topNav && <HomeNav pageName={props.pageName} />}
      </Container>
      {props.topNav && <HomeNavDesktop pageName={props.pageName} />}
    </Box>
  );
};
