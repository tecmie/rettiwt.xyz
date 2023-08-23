import { Fragment } from 'react';
import { useForm } from '@/components/forms';
import SeoMeta from '@/components/seo-meta';
import { WhoToFollow } from '@/components/who-to-follow';
import { NewTimelinePost, TimelineView } from '@/features/timeline';
import SidebarSlot from '@/layout/slots/SidebarSlot';
import TimelineSlot from '@/layout/slots/TimelineSlot';
import { SplitShell } from '@/layout/split-shell';
import { type GetServerSidePropsContext } from 'next';
import nookies from 'nookies';

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
        <WhoToFollow />
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

  if (!persona) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
