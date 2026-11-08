"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./route-wave.module.css";

const PUSH_DELAY = 620;
const REVEAL_DELAY = 1100;

const PRELOAD = {
  "/about": [
    "/images/about/profile-1.webp",
    "/images/about/profile-2.webp",
    "/images/about/profile-3.webp",
  ],
};

export default function RouteWave() {
  const router = useRouter();
  const [phase, setPhase] = useState("idle");
  const timers = useRef([]);
  const preloaded = useRef([]);

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  useEffect(() => {
    const onWave = (event) => {
      const href = event.detail?.href;
      if (!href) return;

      clearTimers();
      setPhase("wave");
      document.body.classList.add("studio-arriving");
      router.prefetch(href);

      const target = href.replace(/\/+$/, "") || "/";
      (PRELOAD[target] || []).forEach((src) => {
        const image = new window.Image();
        image.src = src;
        preloaded.current.push(image);
      });

      timers.current.push(
        window.setTimeout(() => router.push(href), PUSH_DELAY),
        window.setTimeout(() => {
          setPhase("reveal");
          window.dispatchEvent(new CustomEvent("studio-arrive"));
        }, REVEAL_DELAY),
        window.setTimeout(() => {
          setPhase("idle");
          document.body.classList.remove("studio-arriving");
        }, REVEAL_DELAY + 1100),
      );
    };

    window.addEventListener("studio-wave", onWave);
    return () => {
      window.removeEventListener("studio-wave", onWave);
      clearTimers();
      document.body.classList.remove("studio-arriving");
    };
  }, [router]);

  if (phase === "idle") return null;

  return (
    <div
      className={styles.overlay}
      data-phase={phase}
      aria-hidden="true"
    >
      <span className={styles.veil} />
    </div>
  );
}
