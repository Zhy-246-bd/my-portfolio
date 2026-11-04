"use client";

import Link from "next/link";
import { site } from "@/data/site";
import FluidTitle from "./FluidTitle";
import StudioSidebar from "./StudioSidebar";
import styles from "./studio.module.css";

export default function StudioLanding() {
  return (
    <div className={styles.stage}>
      <span className={styles.grain} aria-hidden="true" />
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
        <h1
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            margin: "-1px",
            padding: 0,
            border: 0,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            whiteSpace: "nowrap",
          }}
        >
          ZHANG HAIYAN
        </h1>

        <FluidTitle lines={["ZHANG", "HAIYAN"]} />
      </main>

      <StudioSidebar />
    </div>
  );
}
