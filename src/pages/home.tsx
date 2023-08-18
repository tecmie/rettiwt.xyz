import { useForm } from '@/components/forms';
import SeoMeta from '@/components/seo-meta';
import { NewTimelinePost, TimelineView } from '@/features/timeline';
import SidebarSlot from '@/layout/slots/SidebarSlot';
import TimelineSlot from '@/layout/slots/TimelineSlot';
import { SplitShell } from '@/layout/split-shell';
import { Timeline as SidebarRow } from '@/layout/split-shell/Timeline';
import { Fragment } from 'react';

import { z } from 'zod';

const setupValidationSchema = z.object({
  fullName: z.string().nonempty(),
  occupation: z.string().nonempty(),
  location: z.string().nonempty(),
  email: z.string().email(),
  website: z.string().nonempty(),
  phone: z.string().nonempty(),
});

export default function RouterPage() {
  const { renderForm } = useForm<z.infer<typeof setupValidationSchema>>({
    onSubmit: (data) => console.log(data),
    schema: setupValidationSchema,
    defaultValues: {
      fullName: 'Seun Andrew',
      occupation: 'Brand Designer',
      location: 'Lagos, Nigeria',
      website: 'seun.design',
      email: '',
      phone: '',
    },
  });
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
