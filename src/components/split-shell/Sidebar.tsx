import { Link, Stack, StackProps, Text, useColorModeValue as mode } from '@chakra-ui/react'
import { posts } from './data'

export const Sidebar = (props: StackProps) => (
  <Stack spacing={{ base: '1px', lg: '1' }} px={{ lg: '3' }} py="3" {...props}>
    {posts.map((post) => (
      <Link
        key={post.id}
        aria-current={post.id === '2' ? 'page' : undefined}
        _hover={{ textDecoration: 'none', bg: mode('gray.100', 'gray.700') }}
        _activeLink={{ bg: 'gray.700', color: 'white' }}
        borderRadius={{ lg: 'lg' }}
      >
        <Stack
          spacing="1"
          py={{ base: '3', lg: '2' }}
          px={{ base: '3.5', lg: '3' }}
          fontSize="sm"
          lineHeight="1.25rem"
        >
          <Text fontWeight="medium">{post.title}</Text>
          <Text opacity={0.8}>{post.excerpt}</Text>
          <Text opacity={0.6}>{post.publishedAt}</Text>
        </Stack>
      </Link>
    ))}
  </Stack>
)
