"use client";

import Link from "next/link";
import FluidTitle from "./FluidTitle";
import styles from "./studio.module.css";

export default function ModuleShell({ title, label, index, children }) {
  return (
    <div className={styles.modulePage}>
      <header className={styles.moduleHero}>
        <div className={styles.moduleTopline}>
          <Link href="/studio" className={styles.moduleBack}>
            ← 回到首页
          </Link>
          <span>
            {index} / 07 · {title}
          </span>
        </div>

        <FluidTitle lines={[title]} variant="module" />

        <div className={styles.moduleHeroFoot}>
          <span>{label}</span>
          <span>{title}</span>
        </div>
      </header>

      <div className={styles.moduleBody}>
        <div className={styles.moduleSheet}>{children}</div>
      </div>
    </div>
  );
}
