import { useEffect, useRef } from "react";

/**
 * Intersection Observer hook that adds `.visible` class to elements with `.reveal`.
 * Place this once in a layout; it observes all `.reveal` descendants of the container.
 */
export function useScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // animate once
          }
        }
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.1 },
    );

    // Observe all .reveal elements inside the container
    const targets = root.querySelectorAll(".reveal");
    targets.forEach((el) => observer.observe(el));

    // MutationObserver to pick up dynamically added .reveal elements
    const mutation = new MutationObserver(() => {
      const newTargets = root.querySelectorAll(".reveal:not(.visible)");
      newTargets.forEach((el) => observer.observe(el));
    });
    mutation.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  return containerRef;
}
