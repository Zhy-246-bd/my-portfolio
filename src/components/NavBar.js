"use client"; // 这一行是必须的：因为下面用到了"点击展开菜单"的交互功能

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, site } from "@/data/site";

// 导航栏：电脑端横着排，手机端收进"菜单"按钮里。
// 所有页面共用同一个导航栏（在 src/app/layout.js 里引用了一次）。
export default function NavBar() {
  const pathname = usePathname(); // 当前网址路径，用来高亮"你正在这一页"
  const [isOpen, setIsOpen] = useState(false); // 手机端菜单是否展开

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* 左上角网站名，点它回首页 */}
        <Link
          href="/"
          className="shrink-0 text-base font-bold text-slate-900 hover:text-indigo-600"
        >
          {site.name}
          <span className="ml-1.5 text-xs font-normal text-slate-400">作品集</span>
        </Link>

        {/* 电脑端（屏幕够宽时显示）：横排导航 */}
        <ul className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={
                    "block rounded-full px-2.5 py-1.5 text-sm transition-colors lg:px-3 " +
                    (active
                      ? "bg-indigo-50 font-semibold text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900")
                  }
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* 手机端（屏幕窄时显示）：右上角的"菜单 / 关闭"按钮 */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 md:hidden"
        >
          {isOpen ? "关闭 ✕" : "菜单 ☰"}
        </button>
      </nav>

      {/* 手机端：点"菜单"后展开的竖排列表 */}
      {isOpen && (
        <ul className="border-t border-slate-200 bg-white px-4 pt-2 pb-3 md:hidden">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)} // 点完自动收起菜单
                  className={
                    "block rounded-lg px-3 py-2.5 text-sm " +
                    (active
                      ? "bg-indigo-50 font-semibold text-indigo-700"
                      : "text-slate-700 hover:bg-slate-100")
                  }
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </header>
  );
}
