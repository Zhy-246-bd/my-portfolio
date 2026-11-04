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
  const inkRef = useRef(null);

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

  const handlePointerMove = (event) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const mx = (event.clientX - rect.left) / rect.width - 0.5;
    const my = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.setProperty("--mx", mx.toFixed(3));
    stage.style.setProperty("--my", my.toFixed(3));
  };

  const handlePointerLeave = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--mx", "0");
    stage.style.setProperty("--my", "0");
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const canvas = inkRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastSpawn = 0;
    let particles = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const makeSprite = (rgb) => {
      const sprite = document.createElement("canvas");
      sprite.width = 128;
      sprite.height = 128;
      const sctx = sprite.getContext("2d");
      const gradient = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, `rgba(${rgb},0.9)`);
      gradient.addColorStop(0.35, `rgba(${rgb},0.42)`);
      gradient.addColorStop(0.7, `rgba(${rgb},0.12)`);
      gradient.addColorStop(1, `rgba(${rgb},0)`);
      sctx.fillStyle = gradient;
      sctx.fillRect(0, 0, 128, 128);

      for (let i = 0; i < 4; i += 1) {
        const cx = 30 + Math.random() * 68;
        const cy = 30 + Math.random() * 68;
        const radius = 22 + Math.random() * 26;
        const blob = sctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          radius,
        );
        blob.addColorStop(0, `rgba(${rgb},0.24)`);
        blob.addColorStop(0.6, `rgba(${rgb},0.08)`);
        blob.addColorStop(1, `rgba(${rgb},0)`);
        sctx.fillStyle = blob;
        sctx.fillRect(0, 0, 128, 128);
      }

      return sprite;
    };

    const sprites = [
      makeSprite("150, 238, 220"),
      makeSprite("150, 238, 220"),
      makeSprite("198, 128, 216"),
      makeSprite("224, 250, 240"),
    ];

    const spawn = (x, y, strong = false) => {
      const big = strong || Math.random() < 0.3;
      const sprite = sprites[Math.floor(Math.random() * sprites.length)];
      particles.push({
        x: x + (Math.random() - 0.5) * 22,
        y: y + (Math.random() - 0.5) * 22,
        vx: (Math.random() - 0.5) * (big ? 2.2 : 3.4),
        vy: (Math.random() - 0.5) * (big ? 1.6 : 2.4) - 0.32,
        size: big ? 92 + Math.random() * 86 : 44 + Math.random() * 44,
        grow: big ? 1.7 + Math.random() * 1.6 : 1.1 + Math.random() * 1.2,
        life: 1,
        decay: big ? 0.004 + Math.random() * 0.003 : 0.007 + Math.random() * 0.005,
        alpha: big ? 0.2 : 0.26,
        sprite,
      });
      if (particles.length > 130) particles.splice(0, particles.length - 130);
    };

    let lastPointer = null;

    const onMove = (event) => {
      const now = performance.now();
      if (now - lastSpawn < 22) return;
      lastSpawn = now;

      const x = event.clientX;
      const y = event.clientY;
      const from = lastPointer ?? { x, y };
      const distance = Math.hypot(x - from.x, y - from.y);
      const steps = Math.max(1, Math.min(5, Math.ceil(distance / 34)));

      for (let i = 1; i <= steps; i += 1) {
        const t = i / steps;
        spawn(
          from.x + (x - from.x) * t,
          from.y + (y - from.y) * t,
          i === steps && Math.random() < 0.12,
        );
      }

      lastPointer = { x, y };
    };

    const tick = (now) => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (const particle of particles) {
        particle.life -= particle.decay;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy -= 0.012;
        particle.vx +=
          Math.sin((particle.y + now * 0.02) * 0.012) * 0.03;
        particle.size += particle.grow;

        if (particle.life <= 0) continue;

        ctx.globalAlpha = Math.max(0, particle.life) * particle.alpha;
        ctx.drawImage(
          particle.sprite,
          particle.x - particle.size / 2,
          particle.y - particle.size / 2,
          particle.size,
          particle.size,
        );
      }

      ctx.globalAlpha = 1;
      particles = particles.filter((particle) => particle.life > 0);
      frame = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      particles = [];
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
    <div
      ref={stageRef}
      className={styles.stage}
      data-view={view}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
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
            aria-label={headings[view].join(" ")}
          >
            {headings[view].map((line) => (
              <span key={line} className={styles.line}>
                {line.split("").map((letter, index) => (
                  <span
                    key={`${letter}-${index}`}
                    className={
                      index % 2 === 0
                        ? styles.letter
                        : `${styles.letter} ${styles.letterAlt}`
                    }
                    style={{
                      "--d": `${6 + (index % 4) * 0.85}s`,
                      "--delay": `${-index * 0.47}s`,
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>

        <span className={styles.smokeVeil} aria-hidden="true" />
        <canvas ref={inkRef} className={styles.inkCanvas} aria-hidden="true" />

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
