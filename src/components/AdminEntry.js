"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin-entry.module.css";

export default function AdminEntry() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <Link href="/admin/" className={styles.entry} aria-label="进入内容管理">
      管理入口
    </Link>
  );
}
