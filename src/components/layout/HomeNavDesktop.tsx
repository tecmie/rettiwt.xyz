import { Center, Tab, TabList, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { transparentize } from "@chakra-ui/theme-tools";

const HomeNavDesktop = ({
  // onAccountPage = false,
  // onRequestPage = false,
  // onTransactionPage = false,
  // onSettingsPage = false,
  pageName = "",
}) => {
  const router = useRouter();
  return (
    <>
      <Center
        position="fixed"
        w="100%"
        top="0"
        display={{ base: "none", sm: "flex" }}
      >
        <Tabs
          variant="soft-rounded"
          p="6px"
          bg="black"
          borderRadius="20px"
          mt="20px"
          colorScheme={"green"}
          // defaultIndex={
          //   onAccountPage
          //     ? 1
          //     : onRequestPage
          //     ? 2
          //     : onTransactionPage
          //     ? 3
          //     : onSettingsPage
          //     ? 4
          //     : 0
          // }
          defaultIndex={
            pageName == "account"
              ? 1
              : pageName == "request"
              ? 2
              : pageName == "transaction"
              ? 3
              : pageName == "settings"
              ? 4
              : 0
          }
        >
          <TabList fontFamily={"heading"}>
            <Tab
              _selected={{
                boxShadow: "1px 0px 1px",
                bg: transparentize("green.500", 0.2),
                color: "green.300",
              }}
              color={"gray.300"}
              onClick={() => router.push("/home")}
            >
              Home
            </Tab>
            <Tab
              _selected={{
                boxShadow: "1px 0px 1px",
                bg: transparentize("green.500", 0.2),
                color: "green.300",
              }}
              color={"gray.300"}
              onClick={() => router.push("/accounts")}
            >
              Accounts
            </Tab>
            <Tab
              _selected={{
                boxShadow: "1px 0px 1px",
                bg: transparentize("green.500", 0.2),
                color: "green.300",
              }}
              color={"gray.300"}
              onClick={() => router.push("/requests")}
            >
              Requests
            </Tab>
            <Tab
              _selected={{
                boxShadow: "1px 0px 1px",
                bg: transparentize("green.500", 0.2),
                color: "green.300",
              }}
              color={"gray.300"}
              onClick={() => router.push("/transactions")}
            >
              Transactions
            </Tab>
            <Tab
              _selected={{
                boxShadow: "1px 0px 1px",
                bg: transparentize("green.500", 0.2),
                color: "green.300",
              }}
              color={"gray.300"}
              onClick={() => router.push("/settings")}
            >
              Settings
            </Tab>
          </TabList>
        </Tabs>
      </Center>
    </>
  );
};

export default HomeNavDesktop;
