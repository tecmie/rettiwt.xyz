import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  Img,
  Stack,
  Text,
} from "@chakra-ui/react";

export const Hero = () => (
  <Box position="relative" height={{ lg: "720px" }}>
    <Container py={{ base: "16", md: "24" }} height="full">
      <Stack
        direction={{ base: "column", lg: "row" }}
        spacing={{ base: "16" }}
        align={{ lg: "center" }}
        height="full"
      >
        <Stack spacing={{ base: "8", md: "12" }}>
          <Stack spacing="4">
            <Stack
              spacing={{ base: "4", md: "6" }}
              maxW={{ md: "xl", lg: "md", xl: "xl" }}
            >
              <Heading size={{ base: "md", md: "xl" }}>
                <Text
                  bgGradient="linear(to-l, #099DDC, #25C07F)"
                  bgClip="text"
                  fontWeight="extrabold"
                  display={"inline"}
                  pr={2}
                >
                  Upgrade Your CV in 5 Minutes
                </Text>
                with Epic&apos;s AI CV Writer.
              </Heading>
              <Text fontSize={{ base: "lg", md: "xl" }} color="fg.muted">
                Craft a professional CV effortlessly with our AI-powered CV
                writer. No more struggles, no more time wasted - just a
                compelling CV ready in 10 minutes.
              </Text>
            </Stack>
          </Stack>
          <Stack direction={{ base: "column", md: "row" }} spacing="3">
            <Button colorScheme="brand" size={{ base: "md", md: "lg" }}>
              Create a Professional CV
            </Button>
            {/* <Button variant="primary-on-accent" size={{ base: "md", md: "lg" }}>
              Learn more
            </Button> */}
          </Stack>
        </Stack>
        <Box
          pos={{ lg: "absolute" }}
          right="0"
          bottom="0"
          w={{ base: "full", lg: "50%" }}
          height={{ base: "96", lg: "full" }}
          sx={{
            clipPath: {
              lg: "polygon(0.001% 0.01%, 100% 0%, 100% 100%, 0% 100%)",
            },
          }}
        >
          <Img
            boxSize="full"
            objectFit="cover"
            src="/images/hero__cv-image.png"
            alt="Lady at work"
          />
        </Box>
      </Stack>
    </Container>
  </Box>
);
