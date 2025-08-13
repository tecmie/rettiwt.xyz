import {
  // useColorModeValue removed
  chakra,
  Box,
  HStack,
} from '@chakra-ui/react';
import React, { type Ref, useState } from 'react';
import { FiArrowLeft, FiHeart } from 'react-icons/fi';
import {
  ColumnHeader,
  ColumnIconButton,
  ColumnHeading,
  ColumnButton,
} from '@/layout/split-shell/Column';
import { useRouter } from 'next/router';
import { BsHeadphones } from 'react-icons/bs';

interface TimelineSlotProps {
  children: React.ReactNode;
  innerScrollRef?: Ref<HTMLDivElement>;
}

const TimelineSlot: React.FC<TimelineSlotProps> = ({
  children,
  innerScrollRef,
}) => {
  const [mainIsScrolled, setmMainIsScrolled] = useState(false);
  const router = useRouter();
  return (
    <Box
      bg={'white'}
      flex="1"
      alignItems={'center'}
      // overflow="hidden"
      maxW={'2xl'}
      minW={['sm', 'md', '2xl']}
      minH={'97vh'}
      w={'full'}
      onScroll={(x) => setmMainIsScrolled(x.currentTarget.scrollTop > 32)}
    >
      <ColumnHeader shadow={mainIsScrolled ? 'base' : 'none'}>
        <HStack justify="space-between" width="full">
          <HStack spacing="3">
            <ColumnIconButton
              onClick={() => router.push('/')}
              aria-label="Navigate back"
              icon={<FiArrowLeft />}
              display={{ base: 'inline-flex', md: 'none' }}
            />
            {mainIsScrolled && (
              <ColumnHeading>
                <small>Knowledge Cutoff: Mon Aug 16 &apos;23</small>
              </ColumnHeading>
            )}
          </HStack>
          <chakra.small mr={2}>Knowledge Cutoff: Mon Aug 16 2023</chakra.small>
          <ColumnButton
            onClick={() => router.push('/sentiments')}
            aria-label="See my thoughts"
            leftIcon={<BsHeadphones />}
          >
            Brain
          </ColumnButton>
        </HStack>
      </ColumnHeader>

      {children}
    </Box>
  );
};

export default TimelineSlot;
