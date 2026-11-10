"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { about } from "@/data/about";
import { projects } from "@/data/projects";
import { works } from "@/data/works";
import { reflection } from "@/data/reflection";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import styles from "./admin.module.css";

const SECTIONS = [
  { key: "about", label: "关于我" },
  { key: "projects", label: "项目成果" },
  { key: "works", label: "阶段作业" },
  { key: "reflection", label: "学习复盘" },
];

const LOCAL = {
  about,
  projects,
  works,
  reflection,
};

export default function AdminApp() {
  const [session, setSession] = useState(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [active, setActive] = useState("about");
  const [docs, setDocs] = useState(LOCAL);
  const [draft, setDraft] = useState(() => JSON.stringify(about, null, 2));

  const loadContent = useCallback(async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("site_content")
      .select("key, content");

    if (error) {
      setMessage(`读取失败：${error.message}`);
      return;
    }

    if (data?.length) {
      const next = { ...LOCAL };
      data.forEach((row) => {
        if (row.key in next) next[row.key] = row.content;
      });
      setDocs(next);
      setDraft(JSON.stringify(next[active], null, 2));
      setMessage("已读取数据库内容");
    }
  }, [active]);

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession ?? null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadContent();
  }, [session, loadContent]);

  const chooseSection = (key) => {
    setActive(key);
    setDraft(JSON.stringify(docs[key], null, 2));
    setMessage("");
  };

  const login = async (event) => {
    event.preventDefault();
    if (!supabase) return;

    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);

    if (error) {
      setMessage(`登录失败：${error.message}`);
      return;
    }
    setPassword("");
  };

  const logout = async () => {
    await supabase?.auth.signOut();
    setMessage("");
  };

  const save = async () => {
    if (!supabase) return;

    let parsed;
    try {
      parsed = JSON.parse(draft);
    } catch (error) {
      setMessage(`JSON 格式错误：${error.message}`);
      return;
    }

    const shouldBeArray = active === "projects" || active === "works";
    if (shouldBeArray && !Array.isArray(parsed)) {
      setMessage("这一类内容必须是数组");
      return;
    }
    if (!shouldBeArray && (typeof parsed !== "object" || Array.isArray(parsed))) {
      setMessage("这一类内容必须是对象");
      return;
    }

    setBusy(true);
    const { error } = await supabase.from("site_content").upsert(
      {
        key: active,
        content: parsed,
      },
      { onConflict: "key" },
    );
    setBusy(false);

    if (error) {
      setMessage(`保存失败：${error.message}`);
      return;
    }

    setDocs((current) => ({ ...current, [active]: parsed }));
    setMessage("保存成功，刷新公开页面即可看到");
  };

  const restoreLocal = () => {
    setDraft(JSON.stringify(LOCAL[active], null, 2));
    setMessage("已恢复本地内容，点保存后写入数据库");
  };

  const currentSection = useMemo(
    () => SECTIONS.find((item) => item.key === active),
    [active],
  );

  if (!isSupabaseConfigured) {
    return (
      <main className={styles.page}>
        <div className={styles.loginCard}>
          <h1>数据库未配置</h1>
          <p>请先配置 Supabase 的环境变量。</p>
        </div>
      </main>
    );
  }

  if (session === undefined) {
    return (
      <main className={styles.page}>
        <p className={styles.loading}>正在检查登录状态…</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className={styles.page}>
        <form className={styles.loginCard} onSubmit={login}>
          <p className={styles.eyebrow}>ADMIN / PORTFOLIO</p>
          <h1>内容管理</h1>
          <p className={styles.loginHint}>
            用 Supabase 里创建的管理员邮箱和密码登录。
          </p>

          <label>
            邮箱
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            密码
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          <button type="submit" disabled={busy}>
            {busy ? "登录中…" : "登录"}
          </button>

          {message && <p className={styles.error}>{message}</p>}
          <Link href="/" className={styles.back}>
            ← 返回网站
          </Link>
        </form>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>ADMIN / PORTFOLIO</p>
          <h1>内容管理</h1>
          <p className={styles.loginAs}>{session.user.email}</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/" className={styles.back}>
            ← 返回网站
          </Link>
          <button type="button" onClick={logout} className={styles.ghost}>
            退出
          </button>
        </div>
      </header>

      <div className={styles.tabs}>
        {SECTIONS.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => chooseSection(section.key)}
            data-active={active === section.key}
          >
            {section.label}
          </button>
        ))}
      </div>

      <section className={styles.editor}>
        <div className={styles.editorHead}>
          <div>
            <h2>{currentSection.label}</h2>
            <p>
              编辑 JSON 后保存。图片地址可以填站内路径或完整 URL。
            </p>
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.ghost}
              onClick={restoreLocal}
            >
              恢复本地内容
            </button>
            <button
              type="button"
              className={styles.save}
              onClick={save}
              disabled={busy}
            >
              {busy ? "保存中…" : "保存到数据库"}
            </button>
          </div>
        </div>

        <textarea
          spellCheck={false}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          aria-label={`${currentSection.label} JSON`}
        />

        {message && <p className={styles.message}>{message}</p>}
      </section>
    </main>
  );
}
