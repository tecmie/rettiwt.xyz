import { Button, Stack, Center, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { EmptyPageImg } from "./ProviderIcons";

const EmptyPage = ({ message = "", account = false }) => {
  const router = useRouter();

  return (
    <Stack overflow={"hidden"} justifyContent="space-between" mt="12">
      <Center>
        <EmptyPageImg />
      </Center>

      <Center>
        <Text
          fontSize={"md"}
          fontWeight="300"
          w="80%"
          mt="6"
          textAlign="center"
        >
          {message}
        </Text>
      </Center>

      {account && (
        <Stack pt="2">
          <Button
            variant="gradient"
            rounded={"3xl"}
            style={{ borderRadius: "100px" }}
            onClick={() => router.push("/link-account")}
          >
            Link account now
          </Button>
        </Stack>
      )}
      {/* <Stack alignItems={"center"} spacing="4">
                <Button
                  variant={"gradient"}
                  borderRadius="100px"
                  w="100%"
                  onClick={() => router.back()}
                >
                  Notify me later
                </Button>
                <Button
                  variant={"outline"}
                  h="60px"
                  w="100%"
                  onClick={() => router.back()}
                >
                  Okay
                </Button>
              </Stack> */}
    </Stack>
  );
};

export default EmptyPage;
