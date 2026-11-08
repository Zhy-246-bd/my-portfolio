"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./projects.module.css";

const layout = [
  { x: 20, y: 20, s: 25, z: 1, dur: 17.5, delay: -3.2, r: -3.2 },
  { x: 77, y: 16, s: 22, z: 2, dur: 14.8, delay: -6.4, r: 2.4 },
  { x: 48, y: 33, s: 28, z: 3, dur: 19.2, delay: -1.7, r: -1.2 },
  { x: 84, y: 53, s: 18, z: 4, dur: 13.6, delay: -5.1, r: 3.6 },
  { x: 25, y: 58, s: 23, z: 2, dur: 16.2, delay: -7.3, r: 2.1 },
  { x: 63, y: 68, s: 25, z: 5, dur: 15.4, delay: -2.8, r: -2.7 },
  { x: 42, y: 82, s: 23, z: 6, dur: 18.7, delay: -4.6, r: 1.4 },
  { x: 57, y: 48, s: 20, z: 7, dur: 16.8, delay: -8.2, r: 2.8 },
];

export default function ProjectStack({ projects }) {
  const fieldRef = useRef(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return undefined;

    let frame = 0;
    let resetTimer = 0;
    let pointerX = 0;
    let pointerY = 0;
    let lastX = 0;
    let lastY = 0;
    let velocityX = 0;
    let velocityY = 0;

    const update = () => {
      frame = 0;
      const cards = field.querySelectorAll("[data-float-card]");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - pointerX;
        const dy = cy - pointerY;
        const distance = Math.hypot(dx, dy);
        const near = Math.max(0, 1 - distance / 330);
        const force = near * near;
        const nx = dx / Math.max(1, distance);
        const ny = dy / Math.max(1, distance);
        const flowX = Math.max(-1, Math.min(1, velocityX / 26));
        const flowY = Math.max(-1, Math.min(1, velocityY / 26));

        const pushX = nx * force * 32 + flowX * force * 22;
        const pushY = ny * force * 24 + flowY * force * 16;
        const pushR = Math.max(
          -4.5,
          Math.min(4.5, (flowX * 2.8 + nx * 1.2) * force),
        );

        card.style.setProperty("--amp", (1 + near * 0.95).toFixed(3));
        card.style.setProperty("--push-x", `${pushX.toFixed(2)}px`);
        card.style.setProperty("--push-y", `${pushY.toFixed(2)}px`);
        card.style.setProperty("--push-r", `${pushR.toFixed(2)}deg`);
      });
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const clearPush = () => {
      field.querySelectorAll("[data-float-card]").forEach((card) => {
        card.style.setProperty("--push-x", "0px");
        card.style.setProperty("--push-y", "0px");
        card.style.setProperty("--push-r", "0deg");
      });
    };

    const onMove = (event) => {
      velocityX = event.clientX - lastX;
      velocityY = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      pointerX = event.clientX;
      pointerY = event.clientY;

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(clearPush, 170);
      schedule();
    };

    const reset = () => {
      window.clearTimeout(resetTimer);
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      field.querySelectorAll("[data-float-card]").forEach((card) => {
        card.style.setProperty("--amp", "1");
      });
      clearPush();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", reset);
    return () => {
      window.clearTimeout(resetTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", reset);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className={styles.floatSection} aria-label="项目成果">
      <div className={styles.floatHead}>
        <span>SELECTED WORKS</span>
        <span>08 PROJECTS / 2026</span>
      </div>

      <div className={styles.floatField} ref={fieldRef}>
        {projects.slice(0, layout.length).map((project, index) => {
          const item = layout[index];
          return (
            <a
              key={project.id}
              id={project.id}
              data-float-card
              href={project.entry || `#${project.id}`}
              target={project.entry ? "_blank" : undefined}
              rel={project.entry ? "noopener noreferrer" : undefined}
              className={styles.floatCard}
              style={{
                "--x": `${item.x}%`,
                "--y": `${item.y}%`,
                "--s": `${item.s}%`,
                "--z": item.z,
                "--dur": `${item.dur}s`,
                "--delay": `${item.delay}s`,
                "--r": `${item.r}deg`,
              }}
              aria-label={`打开项目：${project.name}`}
            >
              <span className={styles.floatInner}>
                <span className={styles.floatImage}>
                  <Image
                    src={project.cover}
                    alt={`${project.name} 首页截图`}
                    width={720}
                    height={520}
                    className={styles.image}
                  />
                </span>
                <span className={styles.floatMeta}>
                  <span className={styles.floatNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong>{project.name}</strong>
                  <span className={styles.floatArrow} aria-hidden="true">
                    ↗
                  </span>
                </span>
              </span>
            </a>
          );
        })}
      </div>

      <p className={styles.floatHint}>
        项目图片浮在水面，跟着水流缓慢漂移。
      </p>
    </section>
  );
}
