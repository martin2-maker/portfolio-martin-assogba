
import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

const useIntersectionObserver = <T extends HTMLElement>(
  options: UseIntersectionObserverOptions = { threshold: 0.1, triggerOnce: true }
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const { triggerOnce, ...observerOptions } = options;
    const element = elementRef.current;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (triggerOnce && element) {
          observer.unobserve(element);
        }
      } else {
        if (!triggerOnce) {
          setIsIntersecting(false);
        }
      }
    }, observerOptions);

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);

  return [elementRef, isIntersecting] as const;
};

export default useIntersectionObserver;
