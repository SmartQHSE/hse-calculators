"use client";

import { useEffect } from "react";

// Reports document height to the parent window on mount + every resize.
// Paired with embed.js which listens for { type: "sqhse:resize", height } on
// message events and sizes the host iframe accordingly.
export default function ResizeReporter() {
  useEffect(() => {
    function report() {
      const h = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
      try {
        window.parent.postMessage({ type: "sqhse:resize", height: h }, "*");
      } catch {
        // parent may be cross-origin and not listening — non-fatal
      }
    }

    // Initial report + after fonts load + on resize
    report();
    const t = setTimeout(report, 250);
    window.addEventListener("resize", report);
    const ro = new ResizeObserver(report);
    ro.observe(document.body);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", report);
      ro.disconnect();
    };
  }, []);

  return null;
}
