import SeoMeta from "@/components/seo-meta";
import { TimelineView } from "@/features/timeline";
import { SplitShell } from "@/layout/split-shell";
import { Fragment } from "react";

export default function Page() {
  return (
    <Fragment>
      <SeoMeta />
      <SplitShell>
        <TimelineView />
      </SplitShell>
    </Fragment>
  );
}
