import { Box, Center, Flex, type FlexProps } from '@chakra-ui/react';
import { Navbar } from './Navigation';

type SplitShellProps = {
  children: React.ReactNode;
  navFlexProps?: FlexProps;
};

export const SplitShell = ({ children, navFlexProps }: SplitShellProps) => {
  return (
    <Center>
      <Flex height="100vh" marginX="auto">
        <Box
          height="full"
          position="relative"
          w={'full'}
          maxW={'xl'}
          pl={4}
          display={{ base: 'none', lg: 'initial' }}
          overflowY="auto"
          borderRightWidth="1px"
          {...navFlexProps}
        >
          <Navbar />
        </Box>

        {children}
      </Flex>
    </Center>
  );
};
