/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Fragment } from 'react';
import { format } from 'timeago.js';

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
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroll-component';

export function TimelineSentiments({ tweetId }: any) {
  const sentiments = api.sentiment.list_by.useInfiniteQuery(
    {
      tweetId,
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  if (sentiments.isLoading || !sentiments.data) {
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
  const pageTotal = sentiments.data.pages.reduce((acc: number, page: any) => {
    return acc + Number(page.sentiments.length);
  }, 0);

  return (
    <Fragment>
      <Center mt={6}>
        <chakra.div
          id="scrollable_timeline"
          maxW={'xl'}
          w={'full'}
          position={'relative'}
          height={'calc(100vh - 16px)'}
          overflowY={'auto'}
          overflowX={'hidden'}
        >
          <InfiniteScroll
            dataLength={pageTotal}
            next={sentiments.fetchNextPage}
            hasMore={sentiments.hasNextPage ? true : false}
            refreshFunction={sentiments.refetch}
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
            {/* <PostCard /> */}

            <SentimentView data={sentiments.data} />
          </InfiniteScroll>
        </chakra.div>
      </Center>
    </Fragment>
  );
}

export const SentimentView = ({ data, ...rest }: any) => {
  return (
    <Stack
      spacing={{ base: '1px', lg: '1' }}
      py="3"
      // bg={'bg-surface'}
      // px={4}
      flexWrap={'wrap'}
      rounded={'xl'}
      mt={6}
      divider={<StackDivider />}
      {...rest}
    >
      {data.pages.flatMap((page: any) => {
        return page.sentiments.map((sentiment: any) => {
          return (
            <HStack align="start" key={sentiment.id} px={4} pt={2}>
              <Link
                href={'#'}
                key={sentiment.tweet_id}
                _hover={{
                  textDecoration: 'none',
                  // bg: mode("blackAlpha.50", "whiteAlpha.50")
                }}
                w={'full'}
                borderRadius={{ lg: 'lg' }}
              >
                <SentimentalDeck sentiment={sentiment} />

                {/* <TimelineDeckFooter post={post} /> */}
              </Link>
            </HStack>
          );
        });
      })}
      <StackDivider />
    </Stack>
  );
};

export const SentimentalDeck = ({ sentiment }: any) => {
  return (
    sentiment && (
      <Fragment>
        <HStack
          align={'center'}
          fontSize={['xs', 'sm']}
          spacing="1"
          mt={1.5}
          mb={2}
        >
          <Box mr={1} px={0}>
            <Avatar
              src={sentiment.author.avatar || sentiment.author.name}
              name={sentiment.author.handle}
              boxSize="5"
            />
          </Box>

          {/* <Text fontWeight="bold" color="emphasized">
              {sentiment.author.name}
            </Text> */}
          <Text opacity={0.6} color="muted">
            {/* @{sentiment.author.handle} */}
          </Text>
          <Text opacity={0.6} color={'muted'}>
            {' '}
            • {sentiment.timestamp && format(sentiment.timestamp)}
          </Text>
        </HStack>

        <Stack spacing="1" pb={2} pt={0.5} fontSize="xs" lineHeight="1.25rem">
          <Text>{sentiment.text}</Text>
        </Stack>
      </Fragment>
    )
  );
};
