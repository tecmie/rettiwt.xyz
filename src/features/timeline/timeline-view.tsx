import {
  Avatar,
  Badge,
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Input,
  Link,
  Stack,
  StackDivider,
  StackProps,
  Text,
  Textarea,
  chakra,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { api } from '@/utils/api';
import { Fragment, useState } from 'react';
import { format } from 'timeago.js';
import { ColumnIconButton } from '@/layout/split-shell/Column';

import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import {
  CommentIcon,
  ImpressionIcon,
  RetweetIcon,
  ShareIcon,
} from '@/components/icons';
import { BsChevronRight } from 'react-icons/bs';
import { HiRefresh } from 'react-icons/hi';
import { ITimelineTweet } from '@/types/timeline.type';
import { ITweetInteraction } from '@/types/tweet.type';

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

  return (
    <Stack
      spacing={{ base: '1px', lg: '1' }}
      py="3"
      divider={<StackDivider />}
      {...props}
    >
      {tweets.data?.pages[currCursor]?.tweets.map((post) => {
        return (
          <HStack align="start" px={4} pt={3}>
            <Box w={'40px'} mr={1} px={2}>
              <Avatar src={post.author.avatar} boxSize="9"></Avatar>
            </Box>

            <Link
              key={post.id}
              aria-current={post.id === '2' ? 'page' : undefined}
              _hover={{
                textDecoration: 'none',
                // bg: mode("blackAlpha.50", "whiteAlpha.50")
              }}
              w={'full'}
              borderRadius={{ lg: 'lg' }}
            >
              <TimelineDeckBody post={post} />

              <TimelineDeckFooter post={post} />
            </Link>
          </HStack>
        );
      })}
      <StackDivider />
    </Stack>
  );
};

const RenderContentText = ({ text }: { text: string }) => {
  const regex = /#(\w+)/g;

  console.log({ text });

  if (!text) return;

  const renderTextWithHashtags = () => {
    const parts = [];
    let lastIndex = 0;

    text.replace(
      regex,
      (match: string, hashtag: string, index: number): string => {
        parts.push(text.slice(lastIndex, index));
        parts.push(
          <chakra.a
            color={'link'}
            href={`https://x.com/hashtag/${hashtag}`}
            key={index}
          >
            {match}
          </chakra.a>,
        );
        lastIndex = index + match.length;
        return match;
      },
    );

    parts.push(text.slice(lastIndex));

    return parts;
  };

  return <chakra.text opacity={0.8}>{renderTextWithHashtags()}</chakra.text>;
};

export const NewTimelinePost = (props: any) => {
  const name = props.name || 'Ezra';
  return (
    <Box borderWidth={'0.5px'} borderX={'none'}>
      <Stack divider={<StackDivider />} spacing={0} mt={3}>
        <HStack align="start" px={3}>
          <Stack w={'full'}>
            <Badge
              size={'lg'}
              pl={1.5}
              pr={3.5}
              variant={'outline'}
              w={'max-content'}
              colorScheme="blue"
            >
              <HStack>
                <Avatar src={name} name={name} size={'xs'}></Avatar>
                <Text>{`Viewing as ${name}`}</Text>
                <Icon as={BsChevronRight} fontSize={'xs'} />
              </HStack>
            </Badge>
            <Textarea
              style={{ resize: 'none' }}
              variant={'flushed'}
              borderBottom={0}
              rows={3}
            />
          </Stack>
        </HStack>

        <HStack px={3}>
          <Input
            placeholder={`What should ${name} tweet about`}
            style={{ resize: 'none' }}
            variant={'flushed'}
          />

          <HStack spacing={3}>
            <IconButton
              icon={<HiRefresh />}
              aria-label="Generate Post"
              size={'xs'}
              variant={'outline'}
              rounded={'full'}
            />

            <Button size="sm" colorScheme="twitter" rounded={'full'}>
              Post
            </Button>
          </HStack>
        </HStack>
      </Stack>
    </Box>
  );
};

type TimelineDeckProps = {
  post: ITimelineTweet;
};

// import React from 'react';
// import TweetDeck from './TweetDeck'; // Import TweetDeck component
// import Retweet from './Retweet'; // Import Retweet component
// import Quote from './Quote'; // Import Quote component
// import Like from './Like'; // Import Like component
// import Reply from './Reply'; // Import Reply component

export const TweetDeckComponent = ({ post }: TimelineDeckProps) => {
  return (
    <Fragment>
      <HStack spacing="1">
        <Text fontSize="sm" fontWeight="bold" color="emphasized">
          {post.author.name}
        </Text>
        <Text fontSize="sm" opacity={0.6} color="muted">
          @{post.author.handle}
        </Text>
        <Text opacity={0.6} color={'muted'} fontSize={'sm'}>
          {' '}
          • {post.timestamp && format(post.timestamp)}
        </Text>
      </HStack>

      <Stack spacing="1" pb={2} pt={0.5} fontSize="sm" lineHeight="1.25rem">
        <RenderContentText text={post.content} />
      </Stack>
    </Fragment>
  );
};

export const LikeDeckComponent = ({ post }: TimelineDeckProps) => {
  return (
    <Fragment>
      <HStack opacity={0.8} fontSize="xs" fontWeight="medium" color="muted">
        <Icon as={AiFillHeart} color={'red.500'} />
        <Text>
          <chakra.span>{post.author.name} liked</chakra.span>
          <chakra.a
            px={1}
            color={'link'}
            href={`https://twitter.com/${post.id}`}
          >
            @{post.author.handle}&apos;s
          </chakra.a>
          <chakra.span>tweet</chakra.span>
        </Text>
      </HStack>

      <HStack spacing="1">
        <Text fontSize="sm" fontWeight="bold" color="emphasized">
          {post.author.name}
        </Text>

        <Text fontSize="sm" opacity={0.6} color="muted">
          @{post.author.handle}
        </Text>
        <Text opacity={0.6} color={'muted'} fontSize={'sm'}>
          {' '}
          • {post.timestamp && format(post.timestamp)}
        </Text>
      </HStack>

      <Stack spacing="1" pb={2} pt={0.5} fontSize="sm" lineHeight="1.25rem">
        <RenderContentText text={post.content} />
      </Stack>
    </Fragment>
  );
};

export const RetweetDeckComponent = ({ post }: TimelineDeckProps) => {
  return (
    <Fragment>
      <HStack opacity={0.8} fontSize="xs" fontWeight="medium" color="muted">
        <Icon as={RetweetIcon} color={'green.500'} />
        <Text>
          <chakra.span>{post.author.name} retweeted</chakra.span>
          <chakra.a
            px={1}
            color={'link'}
            href={`https://twitter.com/${post.id}`}
          >
            @{post.author.handle}&apos;s
          </chakra.a>
          <chakra.span>tweet</chakra.span>
        </Text>
      </HStack>

      <HStack spacing="1">
        <Text fontSize="sm" fontWeight="bold" color="emphasized">
          {post.author.name}
        </Text>

        <Text fontSize="sm" opacity={0.6} color="muted">
          @{post.author.handle}
        </Text>
        <Text opacity={0.6} color={'muted'} fontSize={'sm'}>
          {' '}
          • {post.timestamp && format(post.timestamp)}
        </Text>
      </HStack>

      <Stack spacing="1" pb={2} pt={0.5} fontSize="sm" lineHeight="1.25rem">
        <RenderContentText text={post.content} />
      </Stack>
    </Fragment>
  );
};

export const ReplyDeckComponent = ({ post }: TimelineDeckProps) => {
  return (
    <Fragment>
      <HStack spacing="1">
        <Text fontSize="sm" fontWeight="bold" color="emphasized">
          {post.author.name}
        </Text>

        <Text fontSize="sm" opacity={0.6} color="muted">
          @{post.author.handle}
        </Text>
        <Text opacity={0.6} color={'muted'} fontSize={'sm'}>
          {' '}
          • {post.timestamp && format(post.timestamp)}
        </Text>
      </HStack>

      <HStack opacity={0.8} fontSize="xs" fontWeight="medium" color="muted">
        <Icon as={CommentIcon} color={'blue.500'} />
        <Text>
          <chakra.span>Replying to</chakra.span>
          <chakra.a
            px={1}
            color={'link'}
            href={`https://twitter.com/${post.id}`}
          >
            @{post.author.handle}&apos;s
          </chakra.a>
          <chakra.span>tweet</chakra.span>
        </Text>
      </HStack>

      <Stack spacing="1" pb={2} pt={0.5} fontSize="sm" lineHeight="1.25rem">
        <RenderContentText text={post.content} />
      </Stack>
    </Fragment>
  );
};

const InnerQuoteDeckComponent = ({ post }: TimelineDeckProps) => {
  const __render__ = post.type;
  switch (__render__) {
    case ITweetInteraction.REPLY:
      return <ReplyDeckComponent post={post} />;
    default:
      return <TweetDeckComponent post={post} />;
  }
};

export const QuoteDeckComponent = ({ post }: TimelineDeckProps) => {
  return (
    <Fragment>
      <HStack spacing="1">
        <Text fontSize="sm" fontWeight="bold" color="emphasized">
          {post.author.name}
        </Text>

        <Text fontSize="sm" opacity={0.6} color="muted">
          @{post.author.handle}
        </Text>
        <Text opacity={0.6} color={'muted'} fontSize={'sm'}>
          {' '}
          • {post.timestamp && format(post.timestamp)}
        </Text>
      </HStack>

      <Stack spacing="1" pb={2} pt={0.5} fontSize="sm" lineHeight="1.25rem">
        <RenderContentText text={post.content} />
      </Stack>

      <Stack
        borderWidth={'1px'}
        borderStyle={'solid'}
        px={3}
        pt={1.5}
        rounded={'xl'}
        mt={1}
        mb={2}
      >
        <InnerQuoteDeckComponent post={post} />
      </Stack>
    </Fragment>
  );
};

export const TimelineDeckBody = ({ post }: TimelineDeckProps) => {
  const __render__ = post.type;
  switch (__render__) {
    case ITweetInteraction.RETWEET:
      return <RetweetDeckComponent post={post} />;
    case ITweetInteraction.QUOTE_TWEET:
      return <QuoteDeckComponent post={post} />;
    case ITweetInteraction.LIKE:
      return <LikeDeckComponent post={post} />;
    case ITweetInteraction.REPLY:
      return <ReplyDeckComponent post={post} />;
    default:
      return <TweetDeckComponent post={post} />;
  }
};

export const TimelineDeckFooter = ({ post }: { post: ITimelineTweet }) => {
  return (
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
  );
};
