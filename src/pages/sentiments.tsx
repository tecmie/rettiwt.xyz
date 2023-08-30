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
import { Link } from '@chakra-ui/next-js';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SplitShell } from '@/layout/split-shell';
import { RenderContentText } from '@/features/timeline';
import { useProfilePersona } from '@/hooks/use-persona';

export default function Page() {
  const { activeProfilePersona } = useProfilePersona();
  const sentiments = api.sentiment.list_all.useInfiniteQuery(
    {
      persona: activeProfilePersona?.id as string,
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
      <Center mt={6} overflow={'hidden'}>
        <chakra.div
          id="scrollable_timeline"
          maxW={'4xl'}
          w={'full'}
          position={'relative'}
          height={'calc(100vh - 1px)'}
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
                key={sentiment.author_id}
                _hover={{
                  textDecoration: 'none',
                  // bg: mode("blackAlpha.50", "whiteAlpha.50")
                }}
                w={'full'}
                borderRadius={{ lg: 'lg' }}
              >
                <SentimentalDeck sentiment={sentiment} />

                <Stack
                  borderWidth={'1px'}
                  borderStyle={'dashed'}
                  px={3}
                  pt={1.5}
                  pb={2}
                  rounded={'xl'}
                  mt={1}
                  mb={2}
                >
                  <QuoteDeckComponent post={sentiment.tweet} />
                </Stack>

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

          <Text fontWeight="bold" color="emphasized">
            {sentiment.author.name}
          </Text>
          <Text opacity={0.6} color="muted">
            @{sentiment.author.handle}
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

export const QuoteDeckComponent = ({ post }: any) => {
  return (
    <Fragment>
      <HStack spacing="1">
        {/* <Text fontSize="sm" fontWeight="bold" color="emphasized">
            {post.author.name}
          </Text>
   */}
        <Text fontSize="xs" opacity={0.6} color="muted">
          @{post.author.handle}
        </Text>
        <Text opacity={0.6} color={'muted'} fontSize={'xs'}>
          {' '}
          • {post.timestamp && format(post.timestamp)}
        </Text>
      </HStack>

      <Stack spacing="1" pb={2} pt={0.5} fontSize="xs" lineHeight="1.25rem">
        <RenderContentText noOfLines={4} text={post.content} />
      </Stack>
    </Fragment>
  );
};

Page.getLayout = (page: React.ReactNode) => <SplitShell>{page}</SplitShell>;
