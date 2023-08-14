import {
  Box,
  Button,
  Circle,
  Container,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { features } from "./_data";

export const Features = () => (
  <Box as="section" bg="bg.surface">
    <Container py={{ base: "16", md: "24" }}>
      <Stack spacing={{ base: "12", md: "16" }}>
        <Stack spacing={{ base: "4", md: "5" }} maxW="3xl">
          <Stack spacing="3">
            <Text
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="semibold"
              color="accent"
            >
              Why you should use Epic CV
            </Text>
            <Heading size={{ base: "sm", md: "md" }}>
              What can you expect?
            </Heading>
          </Stack>
          {/* <Text color="fg.muted" fontSize={{ base: 'lg', md: 'xl' }}>
              A bundle of 210+ ready-to-use, responsive and accessible components with clever
              structured sourcode files.
            </Text> */}
        </Stack>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          columnGap={8}
          rowGap={{ base: 10, md: 16 }}
        >
          {features.map((feature) => (
            <Stack key={feature.name} spacing={{ base: "4", md: "5" }}>
              <Circle
                size={{ base: "12", md: "14" }}
                bg="brand.100"
                color="fg.inverted"
              >
                <Icon
                  as={feature.icon}
                  color={"brand.800"}
                  boxSize={{ base: "5", md: "6" }}
                />
              </Circle>
              <Stack spacing={{ base: "1", md: "2" }} flex="1">
                <Text
                  color="brand.800"
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="medium"
                >
                  {feature.name}
                </Text>
                <Text color="fg.muted">{feature.description}</Text>
              </Stack>
              <Button
                variant="link"
                colorScheme="black"
                rightIcon={<FiArrowRight />}
                alignSelf="start"
              >
                Read more
              </Button>
            </Stack>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  </Box>
);
