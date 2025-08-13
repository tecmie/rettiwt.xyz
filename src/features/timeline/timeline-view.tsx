import {
  Avatar,
  chakra,
  Box,
  Button,
  HStack,
  Icon,
  Input,
  Stack,
  Separator,
  type StackProps,
  Text,
  Textarea,
  useDisclosure,
  Spinner,
  Center,
  type TextProps,
  // useToast - replaced with simpler console logging for now
} from '@chakra-ui/react';
import Link from 'next/link';
import { env } from '@/env.mjs';
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
import { BsChevronDown } from 'react-icons/bs';
import { HiRefresh } from 'react-icons/hi';
import { type ITimelineTweet } from '@/types/timeline.type';
import { type ITweet, ITweetIntent } from '@/types/tweet.type';
import { useProfilePersona } from '@/hooks/use-persona';
import { PersonaModal } from '@/features/persona/persona-modal';
import { useRouter } from 'next/router';
import { randomWholeInt, sanitizeText } from '@/utils/values';

export type PagedTweet = {
  tweets: ITweet[];
  nextCursor: string | undefined;
};

export type TimelineViewProps = StackProps & {
  tweets: {
    pages: PagedTweet[];
    pageParams: unknown[];
  };
};

export const TimelineView = ({ tweets, ...rest }: TimelineViewProps) => {
  return (
    <Stack
      spacing={{ base: '1px', lg: '1' }}
      py="3"
            {...rest}
    >
      {tweets.pages.flatMap((page: PagedTweet) => {
        return page.tweets.map((post: ITimelineTweet) => {
          return (
            <HStack align="start" key={post.id} px={4} pt={2}>
              <Box w={'40px'} mr={1} px={0}>
                <Avatar
                  src={post.author.avatar ?? post.author.name}
                  name={post.author.handle}
                  boxSize="9"
                ></Avatar>
              </Box>
              <Stack>
                <TimelineDeckBody post={post} />

                <TimelineDeckFooter post={post} />
              </Stack>
            </HStack>
          );
        });
      })}
      <Separator />
    </Stack>
  );
};

export const RenderContentText = ({
  text,
  ...textProps
}: TextProps & { text: string }) => {
  const regex = /#(\w+)/g;

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

  return (
    <chakra.p opacity={0.8} {...textProps}>
      {renderTextWithHashtags()}
    </chakra.p>
  );
};

export const NewTimelinePost = () => {
  const router = useRouter();
  const disclosure = useDisclosure();
  const { handle, name, activeProfilePersona } = useProfilePersona();
  // Simple state management instead of useChat
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: input }],
          author: activeProfilePersona,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to generate');
      
      const result = await response.text();
      const newMessage = { role: 'assistant', content: result };
      setMessages(prev => [...prev, { role: 'user', content: input }, newMessage]);
      setInput('');
    } catch (err) {
      console.error('Chat error:', err);
      toast({
        title: 'We had an issue generating your tweet',
        description: 'Request temporarily failed - please try again.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // setMessages is already available from useState

  const write = api.tweet.create.useMutation();
  // Simple toast replacement
  const toast = (options: any) => console.log('Toast:', options);

  const _handlePostTweet = async () => {
    const result = await write.mutateAsync(
      {
        content: messages[messages.length - 1]?.content || '',
        authorId: String(activeProfilePersona?.id),
        intent: ITweetIntent.TWEET,
      },
      {
        onError: (error) => {
          console.log(error);
          toast({
            status: 'error',
            title: 'We cannot process your request right now.',
            // description: String(error.message),
            isClosable: true,
          });
        },
        onSuccess() {
          /* Clear the AI form input */
          setMessages([]);

          /* Reload our page */
          void router.push('/home');
        },
      },
    );

    console.log(result);
  };

  return (
    <Box borderWidth={'0.5px'} borderX={'none'}>
      {/* Inject our persona modal below */}
      <PersonaModal disclosure={disclosure} />

      <Stack gap={0} mt={3}>
        <HStack align="start" px={3}>
          <Stack w={'full'}>
            <Button
              size={'sm'}
              pl={0.5}
              pr={3.5}
              rounded={'full'}
              variant={'outline'}
              w={'max-content'}
              onClick={disclosure.onOpen}
              colorScheme="blue"
            >
              <HStack>
                <Avatar
                  src={activeProfilePersona?.avatar || name}
                  name={name}
                  size={'xs'}
                ></Avatar>
                <Text>{`Acting as ${handle}`}</Text>
                <Icon as={BsChevronDown} fontSize={'xs'} />
              </HStack>
            </Button>
            <Textarea
              style={{ resize: 'none' }}
              readOnly
              variant={'flushed'}
              borderBottom={0}
              rows={4}
              /* We only want the latest message content */
              value={
                (messages.length != 0 &&
                  sanitizeText(messages[messages.length - 1]?.content)) ||
                ''
              }
            />
          </Stack>
        </HStack>

        {/* ---------  AI Generate Author Tweet Form with Vercel AI SDK ---------- */}
        <form onSubmit={handleSubmit}>
          <HStack px={3}>
            <Input
              placeholder={`Type a new tweet idea for ${name} into this box.`}
              style={{ resize: 'none' }}
              variant={'flushed'}
              value={input}
              onChange={handleInputChange}
              borderWidth={'.1px'}
              border={'none'}
            />

            <HStack spacing={3}>
              <Button
                type="submit"
                rightIcon={<HiRefresh />}
                isLoading={isLoading}
                aria-label="Generate Post"
                size={'xs'}
                variant={'outline'}
                rounded={'full'}
              >
                Generate
              </Button>

              <Button
                isDisabled={messages.length == 0}
                isLoading={write.isLoading}
                ml={2}
                px={4}
                onClick={_handlePostTweet}
                size="sm"
                colorScheme="twitter"
                rounded={'md'}
              >
                Post
              </Button>
            </HStack>
          </HStack>
        </form>
        {/* ---------  AI Generate Author Tweet Form with Vercel AI SDK ---------- */}
      </Stack>
    </Box>
  );
};

type TimelineDeckProps = {
  post: ITimelineTweet;
};

export const MainTweetDeckComponent = ({ post }: TimelineDeckProps) => {
  return (
    post && (
      <Link
        href={`${env.NEXT_PUBLIC_BASE_URL}/status/${post.id}`}
        key={post.id}
        _hover={{
          textDecoration: 'none',
        }}
        w={'full'}
      >
        <HStack fontSize={['xs', 'sm']} spacing="1" mt={1.5}>
          <Text fontWeight="bold" color="emphasized">
            {post.author.name}
          </Text>
          <Text opacity={0.6} color="muted">
            {/* @{post.author.handle} */}
          </Text>
          <Text opacity={0.6} color={'muted'}>
            {' '}
            • {post.timestamp && format(post.timestamp)}
          </Text>
        </HStack>

        <Stack spacing="1" pb={2} pt={0.5} fontSize="sm" lineHeight="1.25rem">
          <RenderContentText text={post.content} />
        </Stack>
      </Link>
    )
  );
};

export const TweetDeckComponent = ({ post }: TimelineDeckProps) => {
  return (
    post && (
      <Fragment>
        <Link
          href={`${env.NEXT_PUBLIC_BASE_URL}/status/${post.id}`}
          key={post.id}
          _hover={{
            textDecoration: 'none',
          }}
          w={'full'}
        >
          <HStack fontSize={['xs', 'sm']} spacing="1" mt={1.5}>
            <Box mr={1} px={0}>
              <Avatar
                src={post.author.avatar || post.author.name}
                name={post.author.handle}
                boxSize="6"
              ></Avatar>
            </Box>

            <Text fontWeight="bold" color="emphasized">
              {post.author.name}
            </Text>
            <Text opacity={0.6} color="muted">
              {/* @{post.author.handle} */}
            </Text>
            <Text opacity={0.6} color={'muted'}>
              {' '}
              • {post.timestamp && format(post.timestamp)}
            </Text>
          </HStack>

          <Stack spacing="1" pb={2} pt={0.5} fontSize="sm" lineHeight="1.25rem">
            <RenderContentText text={post.content} />
          </Stack>
        </Link>
      </Fragment>
    )
  );
};

export const LikeDeckComponent = ({ post }: TimelineDeckProps) => {
  return (
    <Fragment>
      <HStack opacity={0.8} fontSize="xs" fontWeight="medium" color="muted">
        <Icon as={AiFillHeart} color={'red.500'} />
        <Text>
          <chakra.span>{post.author.name} liked</chakra.span>
          <Link
            px={1}
            color={'link'}
            href={`${env.NEXT_PUBLIC_BASE_URL}/status/${post.id}`}
          >
            @{post.author.handle}&apos;s
          </Link>
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
          <Link
            px={1}
            color={'link'}
            href={`${env.NEXT_PUBLIC_BASE_URL}/status/${post.id}`}
          >
            @{post.author.handle}&apos;s
          </Link>
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
  if (post.is_reply_tweet && !post.reply_parent) {
    return (
      <Center>
        <Spinner colorScheme="twitter" />
      </Center>
    );
  }
  return (
    <Fragment>
      <HStack spacing="1" fontSize={['xs', 'sm']}>
        <Text fontWeight="bold" color="emphasized">
          {post.author.name}
        </Text>

        <Text opacity={0.6} color="muted">
          @{post.author.handle}
        </Text>
        <Text opacity={0.6} color={'muted'}>
          {' '}
          • {post.timestamp && format(post.timestamp)}
        </Text>
      </HStack>

      {post.reply_parent && (
        <HStack opacity={0.8} fontSize="sm" fontWeight="medium" color="muted">
          <Icon as={CommentIcon} color={'blue.500'} />
          <Text>
            <chakra.span>Replying to</chakra.span>
            <Link
              px={1}
              color={'link'}
              href={`${env.NEXT_PUBLIC_BASE_URL}/status/${post.reply_parent_id}`}
            >
              @{post.reply_parent.author.handle}&apos;s
            </Link>
            <chakra.span>tweet</chakra.span>
          </Text>
        </HStack>
      )}

      <Stack spacing="1" pb={2} pt={0.5} fontSize="sm" lineHeight="1.25rem">
        <RenderContentText text={post.content} />
      </Stack>
    </Fragment>
  );
};

const InnerQuoteDeckComponent = ({ post }: TimelineDeckProps) => {
  const __render__ = post.intent;
  switch (__render__) {
    case ITweetIntent.REPLY:
      return <ReplyDeckComponent post={post} />;
    default:
      return (
        post.quote_parent && <TweetDeckComponent post={post.quote_parent} />
      );
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
      {post.is_quote_tweet && (
        <chakra.a
          href={`${env.NEXT_PUBLIC_BASE_URL}/status/${post.quote_parent?.id}`}
        >
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
        </chakra.a>
      )}
    </Fragment>
  );
};

export const TimelineDeckBody = ({ post }: TimelineDeckProps) => {
  const __render__ = post.intent;
  switch (__render__) {
    case ITweetIntent.RETWEET:
      return <RetweetDeckComponent post={post} />;
    case ITweetIntent.QUOTE:
      return <QuoteDeckComponent post={post} />;
    case ITweetIntent.LIKE:
      return <LikeDeckComponent post={post} />;
    case ITweetIntent.REPLY:
      return <ReplyDeckComponent post={post} />;
    default:
      return <MainTweetDeckComponent post={post} />;
  }
};

export const TimelineDeckFooter = ({ post }: { post: ITimelineTweet }) => {
  return (
    <HStack justify={'space-between'}>
      <HStack
        spacing={0}
        as={Link}
        _hover={{
          textDecoration: 'none',
        }}
        href={`${env.NEXT_PUBLIC_BASE_URL}/status/${post.id}`}
      >
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

      <HStack
        spacing={0}
        as={Link}
        _hover={{
          textDecoration: 'none',
        }}
        href={`${env.NEXT_PUBLIC_BASE_URL}/status/${post.id}`}
      >
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

      <HStack
        spacing={0}
        as={Link}
        _hover={{
          textDecoration: 'none',
        }}
        href={`${env.NEXT_PUBLIC_BASE_URL}/status/${post.id}`}
      >
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

      <HStack
        spacing={0}
        as={Link}
        _hover={{
          textDecoration: 'none',
        }}
        href={`${env.NEXT_PUBLIC_BASE_URL}/status/${post.id}`}
      >
        <ColumnIconButton
          aria-label="Favorite"
          rounded={'full'}
          colorScheme="green"
          color={'muted'}
          opacity={0.7}
          icon={<ImpressionIcon />}
        />
        <Text color="muted" fontSize={'sm'} opacity={0.7}>
          {randomWholeInt(100, 10000)}
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

export default TimelineView;
