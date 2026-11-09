"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./studio.module.css";

const modules = [
  { href: "/about", label: "关于我", sub: "ABOUT / PROFILE" },
  { href: "/works", label: "阶段作业", sub: "COURSEWORK" },
  { href: "/projects", label: "项目成果", sub: "PROJECTS" },
  { href: "/process", label: "过程证据", sub: "PROCESS" },
  { href: "/iterations", label: "迭代记录", sub: "ITERATIONS" },
  { href: "/reflection", label: "学习复盘", sub: "REFLECTION" },
];

export default function StudioSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        className={styles.sidebarToggle}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="studio-modules"
      >
        <span>{open ? "关闭" : "模块"}</span>
        <small>{open ? "CLOSE" : "INDEX"}</small>
      </button>

      <button
        type="button"
        className={styles.sidebarBackdrop}
        data-open={open}
        onClick={() => setOpen(false)}
        aria-label="关闭模块菜单"
        tabIndex={open ? 0 : -1}
      />

      <aside
        id="studio-modules"
        className={styles.sidebar}
        data-open={open}
        aria-label="作品集模块"
      >
        <div className={styles.sidebarHead}>
          <span>INDEX</span>
          <span>06 MODULES</span>
        </div>

        <nav className={styles.sidebarNav}>
          {modules.map((module, index) => {
            const active = pathname === module.href;
            return (
              <Link
                key={module.href}
                href={module.href}
                className={styles.sidebarCard}
                data-active={active}
                onClick={() => setOpen(false)}
              >
                <span className={styles.sidebarIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.sidebarText}>
                  <strong>{module.label}</strong>
                  <small>{module.sub}</small>
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
