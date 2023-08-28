/* eslint-disable */
import { useEffect, useState, useCallback } from 'react';

type QPage = {
  [key: string]: any[];
};

interface PageTotalProps {
  pages: any[];
  key: string | 'tweets';
}

export function usePageTotal({ pages, key }: PageTotalProps) {
  const [pageTotal, setPageTotal] = useState(0);

  const computePageTotal = useCallback(() => {
    const total = pages.reduce((acc: number, page: any) => {
      return acc + page[key].length;
    }, 0);
    setPageTotal(total);
  }, [pages]);

  useEffect(() => {
    computePageTotal();
  }, [computePageTotal]);

  return {
    pageTotal,
    setPageTotal,
  };
}
