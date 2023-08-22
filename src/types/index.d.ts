/* Support layouts */
declare module 'next/page' {
  export type NextPageView =
    | string
    | number
    | boolean
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;

  /* Initialize Next page & layout configs */
  export type NextPageWithLayout<P = unknown> = NextPage<P> & {
    getLayout?: (page: NextPageView) => React.ReactElement;
    getLayout?: (
      page: React.ReactElement<string | React.JSXElementConstructor<any>>,
    ) => page;
  };

  type NextAppProps = AppProps & {
    Component: NextPageWithLayout;
  };

  /**
   * Create a params page that includes the Router Query and Params
   * from GetserverSideProps Context as page of the Page Props
   * @todo Add support for i18n and locales
   * @example <Page query={query} params={params} locale={locale} />
   */
  import { type GetServerSidePropsContext } from 'next';

  export type NextQueryPage<P = unknown> = NextPageWithLayout<P> & {
    getServerSideProps?: GetServerSideProps<P, { query: P }>;
  };

  export type ParamsPageProps<P = unknown> = P & {
    params?: GetServerSidePropsContext['params'];
    query?: GetServerSidePropsContext['query'];
  };
}
