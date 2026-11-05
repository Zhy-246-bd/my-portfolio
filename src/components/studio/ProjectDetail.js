"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./projects.module.css";

export default function ProjectDetail({ projects }) {
  const [index, setIndex] = useState(0);
  const project = projects[index];
  const total = projects.length;

  const move = (step) => {
    setIndex((current) => (current + step + total) % total);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [total]);

  if (!project) return null;

  return (
    <section className={styles.detailSection} aria-label="项目介绍">
      <div className={styles.detailHead}>
        <span>PROJECT INDEX</span>
        <span>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className={styles.detailFrame}>
        <button
          type="button"
          className={styles.detailNav}
          onClick={() => move(-1)}
          aria-label="上一个项目"
        >
          ‹
        </button>

        <article className={styles.detailPanel} key={project.id}>
          <div className={styles.detailHero}>
            {project.entry ? (
              <a
                href={project.entry}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.detailThumbLink}
                aria-label={`打开项目：${project.name}`}
              >
                <Image
                  src={project.cover}
                  alt={`${project.name} 页面截图`}
                  width={420}
                  height={280}
                  className={styles.detailThumb}
                />
              </a>
            ) : (
              <span className={styles.detailThumbLink}>
                <Image
                  src={project.cover}
                  alt={`${project.name} 页面截图`}
                  width={420}
                  height={280}
                  className={styles.detailThumb}
                />
              </span>
            )}

            <div className={styles.detailHeading}>
              <div className={styles.detailTopline}>
                <span>
                  {String(index + 1).padStart(2, "0")} / PROJECT
                </span>
                <span>{project.role || "独立完成"}</span>
              </div>

              <h2>{project.name}</h2>
            </div>
          </div>

          <p className={styles.detailSummary}>{project.summary}</p>

          {project.features?.length > 0 && (
            <ul className={styles.detailFeatures}>
              {project.features.slice(0, 3).map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          )}

          <div className={styles.detailBottom}>
            <div className={styles.detailTags}>
              {project.tech?.slice(0, 3).map((item) => (
                <span key={item.name}>{item.name}</span>
              ))}
            </div>

            {project.entry && (
              <a
                href={project.entry}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.detailEntry}
              >
                打开项目 ↗
              </a>
            )}
          </div>
        </article>

        <button
          type="button"
          className={styles.detailNav}
          onClick={() => move(1)}
          aria-label="下一个项目"
        >
          ›
        </button>
      </div>

      <p className={styles.detailHint}>用左右按钮或键盘方向键切换项目。</p>
    </section>
  );
}
