import { Suspense } from "react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";

import { ChakraBaseProvider } from "@chakra-ui/react";
import { theme } from "@/theme/index";

/* -------- Analytics ---------- */
import { Analytics } from "@vercel/analytics/react";
/* -------- Analytics ---------- */

import { NextProgressRouter } from "@/hooks/use-progress";
import MetaSeo from "@/components/seo-meta";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  router,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Suspense fallback={<div>Loading...</div>}>

      <ChakraBaseProvider theme={theme}>
        <NextProgressRouter router={router} />
        <MetaSeo />
        {/* <GoogleAnalytics strategy="lazyOnload" trackPageViews /> */}
        <Component {...pageProps} />
        <Analytics />
      </ChakraBaseProvider>
      </Suspense>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
