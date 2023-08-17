import {
  Avatar,
  Box,
  HStack,
  Link,
  Stack,
  StackDivider,
  StackProps,
  Text,
  chakra,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { api } from '@/utils/api';
import { useState } from 'react';
import { format } from 'timeago.js';
import { ColumnIconButton } from '@/layout/split-shell/Column';

import { AiOutlineHeart } from 'react-icons/ai';
import {
  CommentIcon,
  ImpressionIcon,
  RetweetIcon,
  ShareIcon,
} from '@/components/icons';

export const TimelineView = (props: StackProps) => {
  const [currCursor, setCurrCursor] = useState(0);
  const tweets = api.timeline.list.useInfiniteQuery(
    {
      id: '1',
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: currCursor, // <-- optional you can pass an initialCursor
    },
  );

  console.log(tweets.data?.pages[0]);

const regex = /#(\w+)/g;




  return (
    <Stack
      spacing={{ base: '1px', lg: '1' }}
      py="3"
      divider={<StackDivider />}
      {...props}
    >
      {tweets.data?.pages[currCursor]?.tweets.map((post) => {

const postContent = post.content.replace(regex, (match, hashtag) => {
  return `<a href="https://x.com/hashtag/${hashtag}">${match}</a>`;
});

        return (
      
        <HStack align="start" px={4} pt={2}>
          <Box w={'40px'} mr={1}>
            <Avatar src={post.author.avatar} boxSize="9">
              {/* <AvatarBadge boxSize="4" bg={post.is_pinned ? 'success' : 'subtle'} /> */}
            </Avatar>
          </Box>

          <Link
            key={post.id}
            aria-current={post.id === '2' ? 'page' : undefined}
            _hover={{
              textDecoration: 'none',
              // bg: mode("blackAlpha.50", "whiteAlpha.50")
            }}
            w={'full'}
            // _activeLink={{ bg: "gray.700", color: "white" }}
            borderRadius={{ lg: 'lg' }}
          >
            <HStack spacing="1">
              <Text size="sm" fontWeight="bold" color="emphasized">
                {post.author.name}
              </Text>
              <Text size="sm" opacity={0.6} color="muted">
                @{post.author.handle}
              </Text>
              <Text opacity={0.6} color={'muted'} fontSize={'sm'}>
                {' '}
                • {post.timestamp && format(post.timestamp)}
              </Text>
            </HStack>

            <Stack
              spacing="1"
              py={{ base: '3', lg: '2' }}
              fontSize="sm"
              lineHeight="1.25rem"
            >
              <RenderContentText text={post.content} />
            </Stack>

            <HStack justify={'space-between'}>
              <HStack>
                <ColumnIconButton
                  aria-label="Comment"
                  rounded={'full'}
                  color={'muted'}
                  opacity={0.7}
                  icon={<CommentIcon />}
                />
                <Text color="muted" fontSize={'sm'} opacity={0.7}>
                  {post.reply_count}
                </Text>
              </HStack>

              <HStack>
                <ColumnIconButton
                  aria-label="Retweet"
                  rounded={'full'}
                  color={'muted'}
                  opacity={0.7}
                  icon={<RetweetIcon />}
                />

                <Text color="muted" fontSize={'sm'} opacity={0.7}>
                  {post.repost_count}
                </Text>
              </HStack>

              <HStack>
                <ColumnIconButton
                  aria-label="Favorite"
                  rounded={'full'}
                  colorScheme="green"
                  color={'muted'}
                  opacity={0.7}
                  icon={<AiOutlineHeart />}
                />
                <Text color="muted" fontSize={'sm'} opacity={0.7}>
                  {post.favorite_count}
                </Text>
              </HStack>

              <HStack>
                <ColumnIconButton
                  aria-label="Favorite"
                  rounded={'full'}
                  colorScheme="green"
                  color={'muted'}
                  opacity={0.7}
                  icon={<ImpressionIcon />}
                />
                <Text color="muted" fontSize={'sm'} opacity={0.7}>
                  23
                </Text>
              </HStack>
              <ColumnIconButton
                aria-label="Share and Save"
                rounded={'full'}
                colorScheme="green"
                color={'muted'}
                opacity={0.7}
                icon={<ShareIcon />}
              />
            </HStack>
          </Link>
        </HStack>
      )}
      )}
      <StackDivider />
    </Stack>
  );
};



const RenderContentText = ({ text }: {text :string}) => {
  const regex = /#(\w+)/g;

  console.log({ text })

  if(!text) return;

  const renderTextWithHashtags = () => {
    const parts = [];
    let lastIndex = 0;

    text.replace(regex, (match: string, hashtag: string, index: number): string => {
      parts.push(text.slice(lastIndex, index));
      parts.push(
        <chakra.a color={'blue.400'} href={`https://x.com/hashtag/${hashtag}`} key={index}>
          {match}
        </chakra.a>
      );
      lastIndex = index + match.length;
      return match;
    });

    parts.push(text.slice(lastIndex));

    return parts;
  };

  return <chakra.text opacity={0.8}>{renderTextWithHashtags()}</chakra.text>;
};

