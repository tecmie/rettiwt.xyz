/* eslint-disable @typescript-eslint/no-misused-promises */
import Link from "next/link";

import { Box, HStack, Icon, Button, Stack, Text } from "@chakra-ui/react";
import type { ButtonProps, LinkProps } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaGlobe } from "react-icons/fa";
import { MdMoney } from "react-icons/md";

type NavigationLinkProps = ButtonProps & {
  children?: string | React.ReactNode;
  href: string;
  activeProps?: ButtonProps;
  _hover?: ButtonProps["_hover"];
};

/**
 * @name NavigationLink
 * @description Navigation link that wraps next/link with chakra UI to enablestyling and
 * detect routes within pages and style accordingly.. to be used with PrimaryNav Components
 * @see https://dev.to/kennymark/implementing-activelink-in-next-js-and-chakra-44ki
 */

export function NavigationLink({
  href,
  activeProps,
  children,
  ...props
}: NavigationLinkProps & LinkProps) {
  const router = useRouter();
  // const isPath =
  const isActive =
    router.asPath === href ? true : router.pathname.startsWith(href);
  // const isActive = router.asPath === href;

  if (isActive) {
    return (
      <Link href={href} passHref>
        <Button
          variant="link"
          size={"xs"}
          aria-current="page"
          fontWeight={"500"}
          _hover={{ opacity: 1 }}
          {...props}
          {...activeProps}
        >
          {children}
        </Button>
      </Link>
    );
  }

  return (
    <Link href={href} passHref>
      <Button
        size={"xs"}
        variant={"link"}
        opacity={0.4}
        _hover={{ opacity: 0.8 }}
        {...props}
      >
        {children}
      </Button>
    </Link>
  );
}

class HomeNavOptionProps {
  // onAccountPage?: boolean = false;
  // onRequestPage?: boolean = false;
  // onTransactionPage?: boolean = false;
  // onSettingsPage?: boolean = false;
  pageName?: string = "";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HomeNav = (_props: HomeNavOptionProps) => {
  /* do nothing */
  // JSON.stringify(props)

  const router = useRouter();
  return (
    <>
      <Box
        position={"fixed"}
        zIndex="99"
        bottom="0"
        w="100%"
        h={"80px"}
        left="0"
        display={{ sm: "none" }}
      >
        <HStack
          fontSize={"10px"}
          zIndex="2"
          w="full"
          p={"24px"}
          bottom={1}
          // pl={6}
          justifyContent={"space-between"}
          position="relative"
        >
          {/* Wrap the side divs at the edge */}
          <Stack isInline spacing={4}>
            <NavigationLink
              display={"flex"}
              flexDirection={"column"}
              // as={NavigationLink}
              href={"/accounts"}
              transition="0.3s"
              justifyContent="flex-start"
              alignItems="center"
              // opacity={ 0.4}
              // onClick={() => router.push("/accounts")}
            >
              <Icon as={FaGlobe} />
              <Text fontFamily="heading">Accounts</Text>
            </NavigationLink>

            <NavigationLink
              display={"flex"}
              flexDirection={"column"}
              // as={NavigationLink}
              href={"/requests"}
              transition="0.3s"
              justifyContent="flex-start"
              alignItems="center"
              // opacity={ 0.4}
              // onClick={() => router.push("/requests")}
            >
              {/* <RequestIcon /> */}
              <Icon as={MdMoney} fontSize={"25px"} />
              <Text fontFamily="heading">Requests</Text>
            </NavigationLink>
          </Stack>

          <Stack
            cursor={"pointer"}
            justifyContent="center"
            alignItems="center"
            spacing={"0"}
            borderRadius="50%"
            p={3.5}
            position={"relative"}
            bg="linear-gradient(294.35deg, #F3FE39 -0.09%, #2FFFCD 89.32%)"
            bottom={"16px"}
            left={1.5}
            onClick={() => router.push("/home")}
          >
            <Icon as={FaGlobe} />
          </Stack>

          {/* Wrap the side divs at the edge */}
          <Stack isInline spacing={4}>
            <NavigationLink
              display={"flex"}
              flexDirection={"column"}
              // as={NavigationLink}
              href={"/transactions"}
              transition="0.3s"
              justifyContent="center"
              alignItems="center"
              // width="18%"
              // opacity={0.4}
              // onClick={() => router.push("/transactions")}
            >
              <Icon as={FaGlobe} />
              <Text fontFamily="heading">Transactions</Text>
            </NavigationLink>

            <NavigationLink
              display={"flex"}
              flexDirection={"column"}
              // as={NavigationLink}
              href={"/settings"}
              transition="0.3s"
              justifyContent="flex-start"
              alignItems="center"
              // opacity={ 0.4}
              // onClick={() => router.push("/settings")}
            >
              <Icon as={FaGlobe} />
              <Text fontFamily="heading">Settings</Text>
            </NavigationLink>
          </Stack>
        </HStack>
        <Icon
          as={FaGlobe}
          position={"absolute"}
          bottom={"-38px"}
          w={"full"}
          minH={"108px"}
          h={"108px"}
          borderBottomRadius={"xl"}
        />
      </Box>
    </>
  );
};

export default HomeNav;
