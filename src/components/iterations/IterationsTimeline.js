"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./iterations.module.css";

const FIELDS = [
  { key: "what", label: "改了什么" },
  { key: "why", label: "为什么改" },
  { key: "effect", label: "效果如何" },
  { key: "next", label: "下一步" },
];

export default function IterationsTimeline({ iterations }) {
  const viewportRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const update = () => {
      const max = viewport.scrollWidth - viewport.clientWidth;
      const value = max > 0 ? viewport.scrollLeft / max : 0;
      setProgress(Math.min(1, Math.max(0, value)));
      setAtEnd(max > 0 && viewport.scrollLeft >= max - 2);
    };

    const onWheel = (event) => {
      if (event.ctrlKey) return;

      const delta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;
      if (!delta) return;

      const max = viewport.scrollWidth - viewport.clientWidth;
      const atStart = viewport.scrollLeft <= 2;
      const isAtEnd = viewport.scrollLeft >= max - 2;

      if ((delta < 0 && atStart) || (delta > 0 && isAtEnd)) {
        return;
      }

      event.preventDefault();
      viewport.scrollLeft += delta;
    };

    const onKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        viewport.scrollBy({ left: 320, behavior: "smooth" });
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        viewport.scrollBy({ left: -320, behavior: "smooth" });
      }
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("scroll", update, { passive: true });
    viewport.addEventListener("keydown", onKeyDown);
    update();

    return () => {
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("scroll", update);
      viewport.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.heading}>
          31 次迭代，
          <br />
          <span>把网站往右推。</span>
        </h2>
      </header>

      <div className={styles.control}>
        <div className={styles.progress} aria-hidden="true">
          <span style={{ width: `${progress * 100}%` }} />
        </div>
        <p className={styles.hint}>
          向下滚动 / 左右滑动，时间向右走
        </p>
      </div>

      <div
        className={styles.viewport}
        ref={viewportRef}
        tabIndex={0}
        role="region"
        aria-label="迭代记录横向时间轴，使用滚轮或左右方向键浏览"
        data-at-end={atEnd ? "true" : "false"}
      >
        <div className={styles.track}>
          <span className={styles.axis} aria-hidden="true">
            <i />
          </span>

          {iterations.map((item, index) => {
            const position = index % 2 === 0 ? styles.up : styles.down;
            return (
              <article
                key={item.no}
                className={`${styles.item} ${position}`}
                tabIndex={0}
                onMouseEnter={() => setFocused(item)}
                onMouseLeave={() =>
                  setFocused((current) =>
                    current?.no === item.no ? null : current,
                  )
                }
                onFocus={() => setFocused(item)}
                onClick={() => setFocused(item)}
                onBlur={() =>
                  setFocused((current) =>
                    current?.no === item.no ? null : current,
                  )
                }
              >
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.version}>{item.version}</span>
                <div className={styles.card}>
                  <div className={styles.cardMeta}>
                    <span>第 {item.no} 次</span>
                    <span>{item.date}</span>
                  </div>
                  <h2>{item.title}</h2>
                  <dl>
                    {FIELDS.map((field) => (
                      <div key={field.key}>
                        <dt>{field.label}</dt>
                        <dd>{item[field.key]}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            );
          })}

          <div className={styles.tail} aria-hidden="true">
            <span>现在</span>
            <p>2026.11 · 还在继续</p>
          </div>
        </div>
      </div>

      {focused && (
        <aside className={styles.detail} aria-live="polite">
          <div className={styles.detailMeta}>
            <span>第 {focused.no} 次迭代</span>
            <span>{focused.version}</span>
            <span>{focused.date}</span>
          </div>
          <h3>{focused.title}</h3>
          <dl>
            {FIELDS.map((field) => (
              <div key={field.key}>
                <dt>{field.label}</dt>
                <dd>{focused[field.key]}</dd>
              </div>
            ))}
          </dl>
        </aside>
      )}
    </div>
  );
}

