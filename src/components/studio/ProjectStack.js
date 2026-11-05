"use client";

import Image from "next/image";
import styles from "./projects.module.css";

const layout = [
  { x: 15, y: 20, s: 28, z: 1, dur: 17.5, delay: -3.2, r: -3.2 },
  { x: 78, y: 15, s: 24, z: 2, dur: 14.8, delay: -6.4, r: 2.4 },
  { x: 47, y: 31, s: 31, z: 3, dur: 19.2, delay: -1.7, r: -1.2 },
  { x: 88, y: 54, s: 19, z: 4, dur: 13.6, delay: -5.1, r: 3.6 },
  { x: 21, y: 57, s: 25, z: 2, dur: 16.2, delay: -7.3, r: 2.1 },
  { x: 65, y: 67, s: 27, z: 5, dur: 15.4, delay: -2.8, r: -2.7 },
  { x: 40, y: 83, s: 25, z: 6, dur: 18.7, delay: -4.6, r: 1.4 },
];

export default function ProjectStack({ projects }) {
  return (
    <section className={styles.floatSection} aria-label="项目成果">
      <div className={styles.floatHead}>
        <span>SELECTED WORKS</span>
        <span>07 PROJECTS / 2026</span>
      </div>

      <div className={styles.floatField}>
        {projects.slice(0, layout.length).map((project, index) => {
          const item = layout[index];
          return (
            <a
              key={project.id}
              id={project.id}
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
