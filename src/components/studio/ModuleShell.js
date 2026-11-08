"use client";

import Link from "next/link";
import FluidTitle from "./FluidTitle";
import ModuleNav from "./ModuleNav";
import styles from "./studio.module.css";

export default function ModuleShell({
  title,
  label,
  index,
  titleScale,
  titleY,
  children,
}) {
  return (
    <div className={styles.modulePage} data-module-page>
      <div className={styles.moduleFluid}>
        <FluidTitle
          lines={[title]}
          variant="moduleStage"
          titleScale={titleScale}
          titleY={titleY}
        />
      </div>
      <span className={styles.moduleShade} aria-hidden="true" />

      <header className={styles.moduleHero} data-module-hero aria-hidden="true" />

      <Link href="/studio" className={styles.moduleBackFixed}>
        ← 回到首页
      </Link>

      <ModuleNav />

      <div className={styles.moduleBody} data-module-body>
        <div className={styles.moduleSheet}>{children}</div>
      </div>
    </div>
  );
}
