import { useEffect, useRef } from "react";

const useObserver = (isInfiniteScrolling: boolean, loadMore: () => void) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isInfiniteScrolling && observerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          const target = entries[entries.length - 1];
          if (target.isIntersecting) {
            loadMore();
          }
        },
        { threshold: 0.9 }
      );

      observer.observe(observerRef.current);

      return () => observer.disconnect();
    }
  }, [loadMore, isInfiniteScrolling]);

  return observerRef;
};

export default useObserver;
