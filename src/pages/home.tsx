import SeoMeta from '@/components/seo-meta';
import { Fragment } from 'react';
import { SplitShell } from '@/layout/split-shell';
import { createInnerTRPCContext } from '@/server/api/trpc';
import { FollowRecommendation } from '@/components/follow-recommendation';
import SidebarSlot from '@/layout/slots/SidebarSlot';
import TimelineSlot from '@/layout/slots/TimelineSlot';
import { type GetServerSidePropsContext } from 'next';

import nookies from 'nookies';
import dynamic from 'next/dynamic';
import superjson from 'superjson';
import { api } from '@/utils/api';

import { appRouter } from '@/server/api/root';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { NewTimelinePost, TimelineView } from '@/features/timeline';
import { Center, chakra, Spinner } from '@chakra-ui/react';
import InfiniteScroll from 'react-infinite-scroll-component';

const TimelineStatDeck = dynamic(() => import('@/components/timeline-stat'), {
  ssr: false,
});

export default function RouterPage() {
  const tweets = api.timeline.list.useInfiniteQuery(
    {
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  if (tweets.isLoading || !tweets.data) {
    return (
      <>
        <TimelineSlot>
          <Center h={'100vh'}>
            <Spinner colorScheme="twitter" />
          </Center>
        </TimelineSlot>
        <SidebarSlot>
          <FollowRecommendation />
        </SidebarSlot>
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
      <SeoMeta />

      <chakra.div
        id="scrollable_timeline"
        maxW={'2xl'}
        minW={['sm', 'md', '2xl']}
        minH={'100vh'}
        overflow={'auto'}
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
          style={{
            overflow: 'hidden',
          }}
          // style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
          // inverse={true}
          loader={
            <Center>
              <Spinner colorScheme="twitter" />
            </Center>
          }
        >
          <TimelineSlot>
            <NewTimelinePost />

            <TimelineView tweets={tweets.data} />
          </TimelineSlot>
        </InfiniteScroll>
      </chakra.div>

      <SidebarSlot>
        <TimelineStatDeck />
        <FollowRecommendation />
      </SidebarSlot>
    </Fragment>
  );
}

RouterPage.getLayout = (page: React.ReactNode) => (
  <SplitShell>{page}</SplitShell>
);

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const cookies = nookies.get(ctx);
  const persona = cookies['persona'];

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });

  if (!persona) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  /**
   * @see https://trpc.io/docs/client/nextjs/server-side-helpers#nextjs-example
   * Prefetching the `post.byId` query.
   * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
   */
  await helpers.author.get.prefetch({ handle: persona });
  await helpers.timeline.list.prefetch({ limit: 3 });

  const trpcState = helpers.dehydrate();

  // Make sure to return { props: { trpcState: helpers.dehydrate() } }
  return {
    props: {
      trpcState,
      persona,
    },
  };
};
