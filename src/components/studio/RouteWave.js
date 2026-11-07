"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./route-wave.module.css";

const PUSH_DELAY = 380;
const REVEAL_DELAY = 860;

export default function RouteWave() {
  const router = useRouter();
  const [phase, setPhase] = useState("idle");
  const timers = useRef([]);

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

      timers.current.push(
        window.setTimeout(() => router.push(href), PUSH_DELAY),
        window.setTimeout(() => {
          setPhase("reveal");
        }, REVEAL_DELAY),
        window.setTimeout(() => {
          setPhase("idle");
          document.body.classList.remove("studio-arriving");
        }, REVEAL_DELAY + 900),
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
      <span className={styles.ripples}>
        <span className={styles.ring} style={{ "--i": 0 }} />
        <span className={styles.ring} style={{ "--i": 1 }} />
        <span className={styles.ring} style={{ "--i": 2 }} />
        <span className={styles.ring} style={{ "--i": 3 }} />
      </span>
      <span className={styles.glow} />
    </div>
  );
}
