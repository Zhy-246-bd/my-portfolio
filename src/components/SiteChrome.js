"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

// 手账预览页要占满整个窗口，不套普通版的导航栏和页脚；
// 其余页面保持原样。
export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const bare = pathname === "/notebook" || pathname?.startsWith("/notebook/");

  if (bare) return children;

  return (
    <>
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
