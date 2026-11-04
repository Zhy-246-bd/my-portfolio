"use client";

import { usePathname } from "next/navigation";
import ModuleShell from "./ModuleShell";

const modules = {
  "/about": { title: "ABOUT", label: "关于我", index: "01" },
  "/works": { title: "WORKS", label: "阶段作业", index: "02" },
  "/projects": { title: "PROJECTS", label: "项目成果", index: "03" },
  "/process": { title: "PROCESS", label: "过程证据", index: "04" },
  "/iterations": { title: "ITERATIONS", label: "迭代记录", index: "05" },
  "/featured": { title: "FEATURED", label: "标志性成果", index: "06" },
  "/reflection": { title: "REFLECTION", label: "学习复盘", index: "07" },
};

export default function ModuleFrame({ children }) {
  const pathname = usePathname();
  const normalized = (pathname || "/").replace(/\/+$/, "") || "/";
  const module = modules[normalized];

  if (!module) return children;

  return (
    <ModuleShell
      title={module.title}
      label={module.label}
      index={module.index}
    >
      {children}
    </ModuleShell>
  );
}
