import {
  Button,
  Container,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

export const Prefooter = () => (
  <>
    <Image
      alt="Placeholder Image"
      src="https://pro.chakra-ui.com/components/marketing/blog/post1.png"
      objectFit="cover"
      objectPosition="center -140px"
      maxH={{ base: "sm", md: "lg" }}
      width="full"
    />
    <Container py={{ base: "16", md: "24" }}>
      <SimpleGrid columns={{ base: 1, md: 2 }} columnGap={16} rowGap={4}>
        <Heading size={{ base: "md", md: "xl" }}>
          Are you ready to Upgrade your CV?
        </Heading>
        <Stack spacing={{ base: "6", md: "8" }} justifyContent="center">
          <Text fontSize={{ base: "lg", md: "xl" }} color="fg.muted">
            Don&apos;t let design and editing challenges stand in your way. With
            Epic AI CV Writer, you can create a professional CV in just 5
            minutes. Click the button below to start your journey to success.
          </Text>
          <Stack direction={{ base: "column", md: "row" }} spacing="3">
            <Button colorScheme="brand" size={{ base: "lg", md: "lg" }}>
              Create a Professional CV
            </Button>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  </>
);
