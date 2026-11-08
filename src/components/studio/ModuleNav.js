"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./studio.module.css";

const modules = [
  { href: "/about", label: "关于我" },
  { href: "/works", label: "阶段作业" },
  { href: "/projects", label: "项目成果" },
  { href: "/process", label: "过程证据" },
  { href: "/iterations", label: "迭代记录" },
  { href: "/reflection", label: "学习复盘" },
];

export default function ModuleNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 820px)").matches;
    setOpen(!isMobile);
  }, [pathname]);

  return (
    <div className={styles.moduleNav} data-open={open}>
      <button
        type="button"
        className={styles.moduleNavToggle}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="module-nav"
      >
        <span aria-hidden="true">{open ? "‹" : "›"}</span>
        {open ? "收起导航" : "模块"}
      </button>

      <nav id="module-nav" className={styles.moduleNavPanel}>
        {modules.map((module) => {
          const active =
            (pathname || "").replace(/\/+$/, "") === module.href;
          return (
            <Link
              key={module.href}
              href={module.href}
              className={styles.moduleNavLink}
              data-active={active}
              onClick={() => setOpen(false)}
            >
              <span>{module.label}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
