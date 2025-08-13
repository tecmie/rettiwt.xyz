import {
  Avatar,
  Box,
  Center,
  HStack,
  Heading,
  Stack,
  Separator,
  Text,
} from '@chakra-ui/react';

export const FollowRecommendation = () => (
  <Center maxW="sm" mx="auto" py={{ base: '4', md: '8' }}>
    <Box px={4} rounded={'2xl'}>
      <Heading as="h2" fontSize="lg">
        Your Followers
      </Heading>
      <Stack gap="4" pb={6}>
        {authors.map((member, index) => (
          <Box key={member.id}>
            {index > 0 && <Separator />}
            <Stack
              cursor={'pointer'}
              fontSize="sm"
              px="4"
              gap="4"
            >
              <Stack direction="row" justify="space-between" gap="4">
                <HStack gap="3">
                  <Avatar src={member.avatarUrl} boxSize="10" />
                  <Box>
                    <Text fontWeight="medium" color="fg.emphasized">
                      {member.name}
                    </Text>
                    <Text color="fg.muted">{member.handle}</Text>
                  </Box>
                </HStack>
                <Text color="fg.muted">{member.lastSeen}</Text>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  </Center>
);

export const authors = [
  {
    id: '1',
    name: 'Christian Nwamba',
    handle: '@christian',
    avatarUrl: 'https://bit.ly/code-beast',
    status: 'active',
    message: 'Some message',
    lastSeen: 'just now',
  },
  {
    id: '2',
    name: 'Kent C. Dodds',
    handle: '@kent',
    avatarUrl: 'https://bit.ly/kent-c-dodds',
    status: 'active',
    message: 'Some message',
    lastSeen: '2hr ago',
  },
  {
    id: '3',
    name: 'Prosper Otemuyiwa',
    handle: '@prosper',
    avatarUrl: 'https://bit.ly/prosper-baba',
    status: 'active',
    message: 'Some message',
    lastSeen: '3hr ago',
  },
  {
    id: '4',
    name: 'Ryan Florence',
    handle: '@ryan',
    avatarUrl: 'https://bit.ly/ryan-florence',
    status: 'active',
    message: 'Some message',
    lastSeen: '4hr ago',
  },
  {
    id: '5',
    name: 'Segun Adebayo',
    handle: '@segun',
    avatarUrl: 'https://bit.ly/sage-adebayo',
    status: 'inactive',
    message: 'Some message',
    lastSeen: '5hr ago',
  },
];
