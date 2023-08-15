import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FiArrowLeft, FiHeart, FiMenu, FiRss } from 'react-icons/fi'
import { ColumnButton, ColumnHeader, ColumnHeading, ColumnIconButton } from './Column'
import { Main } from './Main'
import { Navbar } from './Navigation'
import { Sidebar } from './Sidebar'

export const SplitShell = () => {
  const [sidebarIsScrolled, setSidebarIsScrolled] = useState(false)
  const [mainIsScrolled, setmMainIsScrolled] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex height="100vh">
      <Box
        height="full"
        width={{ md: '14rem', xl: '18rem' }}
        display={{ base: 'none', lg: 'initial' }}
        overflowY="auto"
        borderRightWidth="1px"
      >
        <Navbar />
      </Box>

      <Box
        bg={useColorModeValue('white', 'gray.900')}
        flex="1"
        overflowY="auto"
        onScroll={(x) => setmMainIsScrolled(x.currentTarget.scrollTop > 32)}
      >
        <ColumnHeader shadow={mainIsScrolled ? 'base' : 'none'}>
          <HStack justify="space-between" width="full">
            <HStack spacing="3">
              <ColumnIconButton
                aria-label="Navigate back"
                icon={<FiArrowLeft />}
                display={{ base: 'inline-flex', md: 'none' }}
              />
              {mainIsScrolled && <ColumnHeading>The shape of a cupcake</ColumnHeading>}
            </HStack>
            <ColumnButton leftIcon={<FiHeart />}>12</ColumnButton>
          </HStack>
        </ColumnHeader>
        <Main maxW="3xl" mx="auto" py="8" px={{ base: '4', md: '8' }} />
        <Main maxW="3xl" mx="auto" py="8" px={{ base: '4', md: '8' }} />
      </Box>


      <Box
        borderRightWidth="1px"
        width={{ md: '20rem', xl: '24rem' }}
        display={{ base: 'none', md: 'initial' }}
        overflowY="auto"
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
                <DrawerOverlay />
                <DrawerContent>
                  <Navbar onClose={onClose} />
                </DrawerContent>
              </Drawer>
              <ColumnHeading>Timeline</ColumnHeading>
            </HStack>
            <ColumnButton leftIcon={<FiRss />}>Customize</ColumnButton>
          </HStack>
        </ColumnHeader>
        <Sidebar />
      </Box>
    </Flex>
  )
}
