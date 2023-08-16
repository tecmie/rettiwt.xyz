import type { Router } from 'next/router';
import np from 'nprogress';
import { useEffect, Fragment } from 'react';

export const useProgressRouter = (router: Router) => {
  /* Hook nprogress with router */
  useEffect(() => {
    const handleStart = () => {
      // eslint-disable-next-line no-console
      // __DEV__ && console.log(`[Loading: ${url}]`);
      np.start();
    };
    const handleStop = () => {
      np.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);
};

export const NextProgressRouter = ({ router }: { router: Router }) => {
  useProgressRouter(router);
  return <Fragment />;
};
