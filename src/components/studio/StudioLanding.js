"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import styles from "./studio.module.css";

const headings = {
  home: ["ZHANG", "HAIYAN"],
  about: ["ABOUT"],
  outputs: ["OUTPUTS"],
};

export default function StudioLanding() {
  const [view, setView] = useState("home");

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setView("home");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const leftAction = view === "about" ? "home" : "about";
  const leftLabel = view === "about" ? "首页" : "关于";
  const leftSub = view === "about" ? "BACK TO TOP ↗" : "ABOUT ME ↗";

  const rightAction = view === "outputs" ? "home" : "outputs";
  const rightLabel = view === "outputs" ? "首页" : "作品";
  const rightSub =
    view === "outputs" ? "BACK TO TOP ↗" : "WHAT I BUILT ↗";

  return (
    <div className={styles.stage} data-view={view}>
      <svg className={styles.filterDefs} aria-hidden="true" focusable="false">
        <defs>
          <filter
            id="studioLiquid"
            x="-20%"
            y="-30%"
            width="140%"
            height="160%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.004 0.012"
              numOctaves="2"
              seed="7"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="16s"
                values="0.004 0.012;0.008 0.02;0.004 0.012"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>
      </svg>

      <span className={styles.grain} aria-hidden="true" />
      <span className={`${styles.smoke} ${styles.smokeTeal}`} aria-hidden="true" />
      <span className={`${styles.smoke} ${styles.smokePurple}`} aria-hidden="true" />
      <span className={styles.horizon} aria-hidden="true" />

      <header className={styles.identity}>
        <strong>{site.name}</strong>
        <span>ZHANG HAIYAN</span>
        <small>数智编程 · 2026 作品集</small>
      </header>

      <div className={styles.topLinks}>
        <Link href="/notebook">手账版 ↗</Link>
        <Link href="/">完整网站 ↗</Link>
      </div>

      <main className={styles.main}>
        <div className={styles.headingWrap}>
          <h1
            key={view}
            className={`${styles.title} ${
              view === "home" ? styles.titleHome : styles.titleSingle
            }`}
            onClick={() => setView("home")}
          >
            {headings[view].map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
        </div>

        {view === "about" && (
          <section className={styles.panel} aria-label="关于我">
            <span className={styles.avatar} aria-hidden="true">
              张
            </span>
            <p className={styles.lead}>你好，我是张海燕。</p>
            <p className={styles.body}>
              数字媒体专业 2025 级，正在学习把想法做成能用的网页。
              这个作品集记录了我从零开始做项目的过程：作业、项目、迭代和复盘。
            </p>
            <div className={styles.panelLinks}>
              <Link href="/about">完整关于页 ↗</Link>
              <Link href="/notebook">翻手账 ↗</Link>
              <a href={`mailto:${site.email}`}>Email ↗</a>
            </div>
          </section>
        )}

        {view === "outputs" && (
          <section className={styles.outputs} aria-label="项目作品">
            <div className={styles.outputsHead}>
              <span>PROJECTS / 7 个项目</span>
              <Link href="/notebook">手账版 ↗</Link>
            </div>
            <div className={styles.outputGrid}>
              {projects.map((project, index) => (
                <Link
                  key={project.id}
                  href={`/projects#${project.id}`}
                  className={styles.projectCard}
                >
                  <span className={styles.cardIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.cardText}>
                    <strong>{project.name}</strong>
                    <small>{project.tech?.[0]?.name || "课程项目"}</small>
                  </span>
                  <span className={styles.cardArrow}>↗</span>
                </Link>
              ))}
            </div>
            <p className={styles.outputsFoot}>
              还有阶段作业、过程证据和迭代记录，在完整网站和手账版里。
            </p>
          </section>
        )}
      </main>

      <nav className={styles.nav} aria-label="页面切换">
        <button
          type="button"
          className={styles.navCard}
          onClick={() => setView(leftAction)}
        >
          <span className={styles.navLabel}>{leftLabel}</span>
          <small className={styles.navSub}>{leftSub}</small>
        </button>
        <button
          type="button"
          className={`${styles.navCard} ${styles.navRight}`}
          onClick={() => setView(rightAction)}
        >
          <span className={styles.navLabel}>{rightLabel}</span>
          <small className={styles.navSub}>{rightSub}</small>
        </button>
      </nav>
    </div>
  );
}
