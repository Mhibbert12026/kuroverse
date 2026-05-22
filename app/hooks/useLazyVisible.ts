"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type UseLazyVisibleOptions = {
  rootRef?: RefObject<Element | null>;
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
};

export function useLazyVisible<T extends Element = HTMLDivElement>({
  rootRef,
  rootMargin = "120px 0px",
  threshold = 0.01,
  once = true,
}: UseLazyVisibleOptions = {}) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || (once && visible)) return;

    const root = rootRef?.current ?? null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { root, rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootRef, rootMargin, threshold, once, visible]);

  return { ref, visible };
}
