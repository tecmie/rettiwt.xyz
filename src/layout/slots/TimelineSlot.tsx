import { useColorModeValue as mode, Box, HStack } from '@chakra-ui/react';
import React, { Ref, useState } from 'react';
import { FiArrowLeft, FiHeart } from 'react-icons/fi';
import {
  ColumnHeader,
  ColumnIconButton,
  ColumnHeading,
  ColumnButton,
} from '@/layout/split-shell/Column';

interface TimelineSlotProps {
  children: React.ReactNode;
  innerScrollRef?: Ref<HTMLDivElement>;
}

const TimelineSlot: React.FC<TimelineSlotProps> = ({
  children,
  innerScrollRef,
}) => {
  const [mainIsScrolled, setmMainIsScrolled] = useState(false);

  return (
    <Box
      bg={mode('white', 'gray.900')}
      flex="1"
      alignItems={'center'}
      // overflow="hidden"
      // maxW={'2xl'}
      // minW={['sm', 'md', '2xl']}
      // minH={'100vh'}
      w={'full'}
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
            {mainIsScrolled && (
              <ColumnHeading>
                <small>Knowledge Cutoff: Mon Aug 16 2023</small>
              </ColumnHeading>
            )}
          </HStack>
          <ColumnButton leftIcon={<FiHeart />}>12 Followers</ColumnButton>
        </HStack>
      </ColumnHeader>

      {children}
    </Box>
  );
};

export default TimelineSlot;
