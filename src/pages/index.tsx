import { Features } from "@/blocks/features";
import { Hero } from "@/blocks/hero";
import { Prefooter } from "@/blocks/pre-footer";
import { Footer } from "@/components/navbar";
import { Navbar } from "@/components/navbar/header";
import SeoMeta from "@/components/seo-meta";
import { Stack } from "@chakra-ui/react";
import { Fragment } from "react";

export default function Page() {
  return (
    <Fragment>
      <SeoMeta />

      <Stack>
        <Navbar />
        <Hero />
        <Features />
        <Prefooter />
        <Footer />
      </Stack>
    </Fragment>
  );
}
