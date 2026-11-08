"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import WaterVeil from "./WaterVeil";
import styles from "./route-wave.module.css";

const PUSH_DELAY = 620;

const PRELOAD = {
  "/about": [
    "/images/about/profile-1.webp",
    "/images/about/profile-2.webp",
    "/images/about/profile-3.webp",
  ],
};

const normalize = (value) => (value || "").replace(/\/+$/, "") || "/";

export default function RouteWave() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState("idle");
  const [target, setTarget] = useState(null);
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
      setTarget(normalize(href));
      setPhase("wave");
      document.body.classList.remove("studio-arriving");
      document.body.classList.add("studio-departing");
      router.prefetch(href);

      const path = normalize(href);
      (PRELOAD[path] || []).forEach((src) => {
        const image = new window.Image();
        image.src = src;
        preloaded.current.push(image);
      });

      timers.current.push(
        window.setTimeout(() => router.push(href), PUSH_DELAY),
      );
    };

    window.addEventListener("studio-wave", onWave);
    return () => {
      window.removeEventListener("studio-wave", onWave);
      clearTimers();
      document.body.classList.remove(
        "studio-arriving",
        "studio-departing",
      );
    };
  }, [router]);

  useEffect(() => {
    if (phase !== "wave" || !target) return undefined;
    if (normalize(pathname) !== target) return undefined;

    document.body.classList.remove("studio-departing");
    document.body.classList.add("studio-arriving");
    setPhase("reveal");
    return undefined;
  }, [pathname, phase, target]);

  useEffect(() => {
    if (phase !== "wave") return undefined;
    const fallback = window.setTimeout(() => {
      document.body.classList.remove("studio-departing");
      document.body.classList.add("studio-arriving");
      setPhase("reveal");
    }, 2800);
    return () => window.clearTimeout(fallback);
  }, [phase]);

  useEffect(() => {
    if (phase !== "reveal") return undefined;
    const finish = window.setTimeout(() => {
      setPhase("idle");
      setTarget(null);
      document.body.classList.remove(
        "studio-arriving",
        "studio-departing",
      );
    }, 1700);
    return () => window.clearTimeout(finish);
  }, [phase]);

  if (phase === "idle") return null;

  return (
    <div
      className={styles.overlay}
      data-phase={phase}
      aria-hidden="true"
    >
      <WaterVeil phase={phase} />
    </div>
  );
}
