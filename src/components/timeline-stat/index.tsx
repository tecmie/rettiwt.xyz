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
    value: '71,887',
    delta: { value: '320', isUpwardsTrend: true },
  },
  {
    label: 'Positive Intent Ratio',
    value: '56.87%',
    delta: { value: '2.3%', isUpwardsTrend: true },
  },
  {
    label: 'Negative Intent Ratio',
    value: '12.87%',
    delta: { value: '0.1%', isUpwardsTrend: false },
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
            variant="pill"
            colorScheme={delta.isUpwardsTrend ? 'green' : 'red'}
          >
            <HStack spacing="1">
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
