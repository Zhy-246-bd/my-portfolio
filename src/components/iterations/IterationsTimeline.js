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
        <div>
          <p className={styles.eyebrow}>31 个版本 · 2026.09.28 — 现在</p>
          <h2 className={styles.heading}>
            31 次迭代，
            <br />
            <span>把网站往右推。</span>
          </h2>
        </div>
        <p className={styles.lead}>
          课程要求网站必须持续迭代。这里不是 31 张总结卡，而是一条从
          2026.09.28 延伸到现在的横轴：每一次改动都带着版本、原因、结果和下一步。
        </p>
      </header>

      <div className={styles.control}>
        <div className={styles.trackMeta}>
          <span>v1</span>
          <div className={styles.progress} aria-hidden="true">
            <span style={{ width: `${progress * 100}%` }} />
          </div>
          <span>v31</span>
        </div>
        <div className={styles.hint}>
          <span className={styles.mouse}>滚轮</span>
          <span>向下滚动 / 左右滑动，时间向右走</span>
        </div>
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

      <div className={styles.footerNote}>
        <span>滚轮在时间轴内只负责横向移动</span>
        <span>共 {iterations.length} 次迭代</span>
      </div>
    </div>
  );
}

