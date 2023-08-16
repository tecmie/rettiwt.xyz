import SeoMeta from '@/components/seo-meta';
import { PostCard, SplitShell } from '@/layout/split-shell';
import { Fragment } from 'react';

export default function Page() {
  return (
    <Fragment>
      <SeoMeta />
      <SplitShell>
        <PostCard />
        <PostCard />
      </SplitShell>
    </Fragment>
  );
}
