"use client";

import { useEffect, useRef, useState } from "react";
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
  const stageRef = useRef(null);
  const turbulenceRef = useRef(null);
  const displacementRef = useRef(null);
  const blurRef = useRef(null);

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

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return undefined;

    let frame = 0;
    let last = 0;

    const tick = (now) => {
      if (now - last < 45) {
        frame = requestAnimationFrame(tick);
        return;
      }
      last = now;

      const t = now / 1000;
      const fx =
        0.004 + Math.sin(t * 0.7) * 0.0022 + Math.sin(t * 1.7) * 0.0008;
      const fy =
        0.012 + Math.cos(t * 0.55) * 0.0045 + Math.sin(t * 1.1) * 0.0015;
      const scale = 26 + Math.sin(t * 0.9) * 12;
      const blur = 1.2 + Math.sin(t * 0.8) * 0.7;

      turbulenceRef.current?.setAttribute(
        "baseFrequency",
        `${fx.toFixed(5)} ${fy.toFixed(5)}`,
      );
      displacementRef.current?.setAttribute("scale", scale.toFixed(1));
      blurRef.current?.setAttribute("stdDeviation", blur.toFixed(2));

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handlePointerMove = (event) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const mx = (event.clientX - rect.left) / rect.width - 0.5;
    const my = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.setProperty("--mx", mx.toFixed(3));
    stage.style.setProperty("--my", my.toFixed(3));
    stage.style.setProperty("--px", `${event.clientX - rect.left}px`);
    stage.style.setProperty("--py", `${event.clientY - rect.top}px`);
  };

  const handlePointerLeave = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--mx", "0");
    stage.style.setProperty("--my", "0");
    stage.style.setProperty("--px", "50vw");
    stage.style.setProperty("--py", "50vh");
  };

  const leftAction = view === "about" ? "home" : "about";
  const leftLabel = view === "about" ? "首页" : "关于";
  const leftSub = view === "about" ? "BACK TO TOP ↗" : "ABOUT ME ↗";

  const rightAction = view === "outputs" ? "home" : "outputs";
  const rightLabel = view === "outputs" ? "首页" : "作品";
  const rightSub =
    view === "outputs" ? "BACK TO TOP ↗" : "WHAT I BUILT ↗";

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      data-view={view}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
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
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.004 0.012"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="noise"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur ref={blurRef} stdDeviation="1.4" />
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
              <span key={line} className={styles.line}>
                {line.split("").map((letter, index) => (
                  <span
                    key={`${letter}-${index}`}
                    className={styles.letter}
                    style={{ "--i": index }}
                  >
                    {letter}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>

        <span className={styles.smokeVeil} aria-hidden="true" />
        <span className={styles.pointerGlow} aria-hidden="true" />

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
