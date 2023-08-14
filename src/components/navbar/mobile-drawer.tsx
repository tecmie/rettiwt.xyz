import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerProps,
  Stack,
} from "@chakra-ui/react";

// const menu = ['Components', 'Pricing', 'Marketplace', 'Support']
const menu = [""];
export const MobileDrawer = (props: Omit<DrawerProps, "children">) => (
  <Drawer placement="top" {...props}>
    <DrawerContent>
      <DrawerBody mt="4">
        <Stack spacing="6" align="stretch">
          {menu.map((item) => (
            <Button key={item} size="lg" variant="text" colorScheme="gray">
              {item}
            </Button>
          ))}
          <Button>Sign Up</Button>
        </Stack>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);
