import SeoMeta from '@/components/seo-meta';
import { NewTimelinePost, TimelineView } from '@/features/timeline';
import SidebarSlot from '@/layout/slots/SidebarSlot';
import TimelineSlot from '@/layout/slots/TimelineSlot';
import { SplitShell } from '@/layout/split-shell';
import { Timeline as SidebarRow } from '@/layout/split-shell/Timeline';
import { Box } from '@chakra-ui/react';
import { Fragment } from 'react';

export default function RouterPage() {
  return (
    <Fragment>
      <SeoMeta />

      <TimelineSlot>
        <NewTimelinePost />
        <TimelineView />
      </TimelineSlot>

      <SidebarSlot>
        <SidebarRow maxW="3xl" mx="auto" py="8" px={{ base: '2', md: '4' }} />
      </SidebarSlot>
    </Fragment>
  );
}

RouterPage.getLayout = (page: React.ReactNode) => (
  <SplitShell>{page}</SplitShell>
);
