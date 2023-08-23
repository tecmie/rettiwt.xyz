import { Fragment } from 'react';
import SeoMeta from '@/components/seo-meta';
import { FollowRecommendation } from '@/components/follow-recommendation';
import { NewTimelinePost, TimelineView } from '@/features/timeline';
import SidebarSlot from '@/layout/slots/SidebarSlot';
import TimelineSlot from '@/layout/slots/TimelineSlot';
import { SplitShell } from '@/layout/split-shell';
import { type GetServerSidePropsContext } from 'next';
import { createInnerTRPCContext } from '@/server/api/trpc';

import nookies from 'nookies';

import { z } from 'zod';
import { appRouter } from '@/server/api/root';
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import TimelineStatDeck from '@/components/timeline-stat';

export default function RouterPage() {
  return (
    <Fragment>
      <SeoMeta />

      <TimelineSlot>
        <NewTimelinePost />
        <TimelineView />
      </TimelineSlot>

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

  const trpcState = helpers.dehydrate();

  console.log({ trpcState: JSON.stringify(trpcState) });
  // Make sure to return { props: { trpcState: helpers.dehydrate() } }
  return {
    props: {
      trpcState,
      persona,
    },
  };
};
