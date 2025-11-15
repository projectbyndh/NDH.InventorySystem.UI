import React, { useEffect, useRef } from "react";
import { showToast } from "./toast";

// Prevent duplicate route-enter toasts by remembering the last shown name
// and ignoring repeats within a short window.
export default function RouteNotifier({ name, children, toast = true }) {
  const last = useRef({ name: null, ts: 0 });

  useEffect(() => {
    try {
      if (!toast) return;
      const now = Date.now();
      // If the same route name was toasted recently, skip to avoid duplicates
      if (last.current.name === name && now - last.current.ts < 2500) return;
      showToast(`Entered: ${name}`, "info", 2200);
      last.current = { name, ts: now };
    } catch (e) {
      // ignore
    }
  }, [name, toast]);

  return <>{children}</>;
}
