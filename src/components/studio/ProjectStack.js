"use client";

import Image from "next/image";
import styles from "./projects.module.css";

const layout = [
  { x: 0, y: 80, r: -3, z: 2 },
  { x: -268, y: 34, r: -9, z: 1 },
  { x: 262, y: 48, r: 7, z: 3 },
  { x: -350, y: 168, r: -12, z: 1 },
  { x: 342, y: 154, r: 10, z: 2 },
  { x: -132, y: 228, r: 5, z: 4 },
  { x: 150, y: 238, r: -7, z: 5 },
];

const pinColors = [
  "#b8862e",
  "#a33a32",
  "#6d7f57",
  "#b08a43",
  "#4f6f7a",
  "#9a5c38",
  "#a88b45",
];

export default function ProjectStack({ projects }) {
  return (
    <section className={styles.stackSection} aria-label="项目成果">
      <div className={styles.stackHead}>
        <span>SELECTED WORKS</span>
        <span>07 PIECES / 2026</span>
      </div>

      <div className={styles.stackFrame}>
        <svg
          className={styles.dashedLine}
          viewBox="0 0 240 420"
          aria-hidden="true"
        >
          <path
            d="M15 20c110-30 190 35 145 90-45 55-155 30-120 105 25 55 120 45 175 88"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="7 10"
            strokeLinecap="round"
          />
        </svg>

        <div className={styles.stack}>
          {projects.map((project, index) => {
            const item = layout[index % layout.length];
            const card = (
              <div
                className={styles.cardInner}
                style={{
                  "--x": `${item.x}px`,
                  "--y": `${item.y}px`,
                  "--r": `${item.r}deg`,
                  "--z": item.z,
                }}
              >
                <span
                  className={styles.pin}
                  style={{ "--pin": pinColors[index % pinColors.length] }}
                  aria-hidden="true"
                />
                <div className={styles.photo}>
                  <Image
                    src={project.cover}
                    alt={`${project.name} 首页截图`}
                    width={640}
                    height={460}
                    className={styles.image}
                  />
                </div>
                <div className={styles.caption}>
                  <span className={styles.number}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2>{project.name}</h2>
                    <p>{project.role || project.summary}</p>
                  </div>
                  <span className={styles.arrow} aria-hidden="true">
                    ↗
                  </span>
                </div>
              </div>
            );

            return (
              <div
                key={project.id}
                id={project.id}
                className={styles.cardSlot}
                style={{
                  "--x": `${item.x}px`,
                  "--y": `${item.y}px`,
                  "--r": `${item.r}deg`,
                  "--z": item.z,
                }}
              >
                {project.entry ? (
                  <a
                    href={project.entry}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cardLink}
                    aria-label={`打开项目：${project.name}`}
                  >
                    {card}
                  </a>
                ) : (
                  card
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className={styles.stackHint}>
        把鼠标移到照片上，拿起一张看看。照片可以直接打开对应项目。
      </p>
    </section>
  );
}
