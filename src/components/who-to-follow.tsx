import {
    Avatar,
    AvatarBadge,
    Box,
    Center,
    HStack,
    Heading,
    Stack,
    StackDivider,
    Text,
  } from '@chakra-ui/react'

  
  
  export const WhoToFollow = () => (
    <Center maxW="sm" mx="auto" py={{ base: '4', md: '8' }}>
      <Box bg="bg-surface" px={4} rounded={'2xl'}>

        <Heading as="h2" fontSize="lg">Your Followers</Heading>
        <Stack divider={<StackDivider />} spacing="4" pb={6}>
          {authors.map((member) => (
            <Stack key={member.id} cursor={'pointer'} fontSize="sm" px="4" spacing="4">
              <Stack direction="row" justify="space-between" spacing="4">
                <HStack spacing="3">
                  <Avatar src={member.avatarUrl} boxSize="10">
                    <AvatarBadge boxSize="4" bg={member.status === 'active' ? 'success' : 'subtle'} />
                  </Avatar>
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
          ))}
        </Stack>
      </Box>
    </Center>
  )
  



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
  ]