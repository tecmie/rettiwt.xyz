'use client';

import { randomInt, randomWholeInt } from '@/utils/numbers';
import {
  Badge,
  Box,
  SimpleGrid,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
} from '@chakra-ui/react';
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiMoreVertical,
} from 'react-icons/fi';

const stats = [
  {
    label: 'Total Interactions',
    value: randomWholeInt(5000, 299000),
    delta: { value: randomWholeInt(2000, 50000), isUpwardsTrend: true },
  },
  {
    label: 'Positive Intent Ratio',
    value: randomInt(31.6, 72.63) + '%',
    delta: { value: '5.1%', isUpwardsTrend: true },
  },
  {
    label: 'Negative Intent Ratio',
    value: randomInt(25, 40.5) + '%',
    delta: { value: '7.90%', isUpwardsTrend: false },
  },
];

export const TimelineStatDeck = () => (
  <Box as="section" py={{ base: '4', md: '8' }}>
    <SimpleGrid columns={{ base: 1, md: 1 }} gap={{ base: '5', md: '6' }}>
      {stats.map((stat, id) => (
        <StatDeck key={id} {...stat} />
      ))}
    </SimpleGrid>
  </Box>
);

interface Props {
  label: string;
  value: string;
  delta: {
    value: string;
    isUpwardsTrend: boolean;
  };
}
export const StatDeck = (props: Props) => {
  const { label, value, delta, ...boxProps } = props;
  return (
    <Box
      px={{ base: '4', md: '6' }}
      py={{ base: '5', md: '6' }}
      bg="bg.surface"
      borderRadius="lg"
      boxShadow="sm"
      border={'.5px solid'}
      borderColor={'muted'}
      opacity={0.8}
      {...boxProps}
    >
      <Stack>
        <HStack justify="space-between">
          <Text textStyle="sm" color="fg.muted">
            {label}
          </Text>
          <Icon as={FiMoreVertical} boxSize="5" color="fg.muted" />
        </HStack>
        <HStack justify="space-between">
          <Heading size={{ base: 'sm', md: 'md' }}>{value}</Heading>
          <Badge
            variant="outline"
            colorScheme={delta.isUpwardsTrend ? 'green' : 'red'}
          >
            <HStack spacing="1" mt={'1px'}>
              <Icon
                as={delta.isUpwardsTrend ? FiArrowUpRight : FiArrowDownRight}
              />
              <Text>{delta.value}</Text>
            </HStack>
          </Badge>
        </HStack>
      </Stack>
    </Box>
  );
};

export default TimelineStatDeck;
