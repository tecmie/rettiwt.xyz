import { Fragment } from 'react';
import { api } from '@/utils/api';
import {
  Avatar,
  Box,
  Text,
  Center,
  chakra,
  HStack,
  Spinner,
  Stack,
  StackDivider,
} from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import InfiniteScroll from 'react-infinite-scroll-component';
import TimelineView, {
  TimelineDeckBody,
  TimelineDeckFooter,
} from '@/features/timeline/timeline-view';
import { env } from '@/env.mjs';

/**
 * @deprecated
 * @returns JSX.Element
 */
export function TimelineThread({ id }: any) {
  const tweets = api.tweet.list_with_replies.useInfiniteQuery(
    {
      tweetId: id,
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  if (tweets.isLoading || !tweets.data) {
    return (
      <>
        <Center h={'100vh'} w={'full'}>
          <Spinner colorScheme="twitter" />
        </Center>
      </>
    );
  }

  /**
   * Get the page length total
   */
  const pageTotal = tweets.data.pages.reduce((acc: number, page: any) => {
    return acc + Number(page.tweets.length);
  }, 0);

  return (
    <Fragment>
      <Center mt={6}>
        <chakra.div
          id="scrollable_timeline"
          maxW={'3xl'}
          w={'full'}
          position={'relative'}
          height={'calc(100vh - 16px)'}
          overflowY={'auto'}
          overflowX={'hidden'}
        >
          <InfiniteScroll
            dataLength={pageTotal}
            next={tweets.fetchNextPage}
            hasMore={tweets.hasNextPage ? true : false}
            refreshFunction={tweets.refetch}
            pullDownToRefresh={true}
            releaseToRefreshContent={
              <Center>
                <h3 style={{ textAlign: 'center' }}>
                  &#8593; Release to refresh
                </h3>{' '}
              </Center>
            }
            scrollableTarget="scrollable_timeline"
            className="detail__sentiment-scroll"
            loader={
              <Center>
                <Spinner colorScheme="twitter" />
              </Center>
            }
          >
            <TweetDetailDeck id={id} />

            <TimelineView tweets={tweets.data as any} />
          </InfiniteScroll>
        </chakra.div>
      </Center>
    </Fragment>
  );
}

export const TweetDetailDeck = ({ id }: any) => {
  const tweet = api.tweet.get.useQuery({ id });

  if (!tweet.data) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const post = tweet.data;

  return (
    post && (
      <Fragment>
        <Stack
          spacing={{ base: '1px', lg: '1' }}
          py="3"
          divider={<StackDivider />}
        >
          <HStack align="start" key={post.id} px={4} pt={2} mr={3}>
            <Box w={'40px'} mr={1} px={0}>
              <Avatar
                src={post.author.avatar ?? post.author.name}
                name={post.author.handle}
                boxSize="9"
              ></Avatar>
            </Box>

            <Stack>
              <TimelineDeckBody post={post as any} />

              <TimelineDeckFooter post={post as any} />
            </Stack>
          </HStack>

          <Text textAlign={'center'} color={'muted'} size={'xs'}>
            Other users response to the tweet above
          </Text>
          <StackDivider />
        </Stack>
      </Fragment>
    )
  );
};
