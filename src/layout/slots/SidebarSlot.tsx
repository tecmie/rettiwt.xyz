import {
  useDisclosure,
  HStack,
  Box,
  Drawer,
  DrawerContent,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import {
  ColumnHeader,
  ColumnIconButton,
  ColumnHeading,
  ColumnButton,
} from '../split-shell/Column';
import { Navbar } from '../split-shell/Navigation';
import { MdCheckBoxOutlineBlank } from 'react-icons/md';

interface SidebarSlotProps {
  title?: string;
  children: React.ReactNode;
}

const SidebarSlot: React.FC<SidebarSlotProps> = ({ children }) => {
  const [sidebarIsScrolled, setSidebarIsScrolled] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      borderLeftWidth="1px"
      pl={6}
      // position={'sticky'}
      // right={0}
      w={'full'}
      maxW={'md'}
      display={{ base: 'none', md: 'initial' }}
      overflow="hidden"
      onScroll={(x) => setSidebarIsScrolled(x.currentTarget.scrollTop > 32)}
    >
      <ColumnHeader shadow={sidebarIsScrolled ? 'base' : 'none'}>
        <HStack justify="space-between" width="full">
          <HStack spacing="3">
            <ColumnIconButton
              onClick={onOpen}
              aria-label="Open Navigation"
              icon={<FiMenu />}
              display={{ md: 'inline-flex', lg: 'none' }}
            />
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
              <DrawerContent>
                <Navbar onClose={onClose} />
              </DrawerContent>
            </Drawer>
            <ColumnHeading>Overall Sentiments</ColumnHeading>
          </HStack>
          <ColumnButton leftIcon={<MdCheckBoxOutlineBlank />}>
            Customize
          </ColumnButton>
        </HStack>
      </ColumnHeader>
      {children}
    </Box>
  );
};

export default SidebarSlot;
