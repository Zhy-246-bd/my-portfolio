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

const ABOUT_SCHEMA = [
  {
    title: "基本信息",
    fields: [
      { kind: "text", path: "profile.name", label: "姓名" },
      { kind: "text", path: "profile.role", label: "专业 / 年级" },
      { kind: "text", path: "profile.tagline", label: "一句话介绍" },
      {
        kind: "text",
        path: "profile.intro",
        label: "网站简介",
        multiline: true,
      },
      {
        kind: "text",
        path: "aiStatement",
        label: "AI 使用说明",
        multiline: true,
      },
    ],
  },
  {
    title: "顶部资料",
    fields: [{ kind: "pairs", path: "profile.facts", label: "资料项" }],
  },
  {
    title: "我的故事",
    fields: [
      {
        kind: "list",
        path: "story",
        label: "段落",
        item: { kind: "text" },
      },
    ],
  },
  {
    title: "照片",
    fields: [
      {
        kind: "list",
        path: "photos",
        label: "照片",
        item: {
          kind: "fields",
          fields: [
            { key: "src", label: "图片地址", kind: "text" },
            { key: "alt", label: "图片说明", kind: "text" },
            { key: "label", label: "小标签", kind: "text" },
          ],
        },
      },
    ],
  },
  {
    title: "爱好",
    fields: [
      {
        kind: "list",
        path: "hobbies",
        label: "爱好",
        item: {
          kind: "fields",
          fields: [
            { key: "title", label: "名称", kind: "text" },
            { key: "tag", label: "标签", kind: "text" },
            { key: "text", label: "描述", kind: "text", multiline: true },
          ],
        },
      },
    ],
  },
  {
    title: "能力与工具",
    fields: [
      {
        kind: "list",
        path: "capabilities",
        label: "能力",
        item: {
          kind: "fields",
          fields: [
            { key: "title", label: "能力", kind: "text" },
            { key: "text", label: "说明", kind: "text", multiline: true },
            { key: "tools", label: "工具", kind: "text" },
          ],
        },
      },
    ],
  },
  {
    title: "成绩与成果",
    fields: [
      {
        kind: "list",
        path: "achievements",
        label: "成果",
        item: {
          kind: "fields",
          fields: [
            { key: "label", label: "分类", kind: "text" },
            { key: "value", label: "数字", kind: "text" },
            { key: "title", label: "标题", kind: "text" },
            { key: "text", label: "说明", kind: "text", multiline: true },
          ],
        },
      },
    ],
  },
];

const PROJECT_SCHEMA = [
  {
    kind: "list",
    path: "",
    label: "项目",
    item: {
      kind: "fields",
      fields: [
        { key: "id", label: "ID（不要随意修改）", kind: "text" },
        { key: "name", label: "项目名称", kind: "text" },
        { key: "cover", label: "封面图片地址", kind: "text" },
        { key: "entry", label: "公网地址", kind: "text" },
        { key: "role", label: "角色", kind: "text" },
        { key: "summary", label: "简介", kind: "text", multiline: true },
        { key: "learned", label: "我的收获", kind: "text", multiline: true },
        {
          key: "features",
          label: "功能",
          kind: "list",
          item: { kind: "text" },
        },
        {
          key: "tech",
          label: "技术说明",
          kind: "list",
          item: {
            kind: "fields",
            fields: [
              { key: "name", label: "技术", kind: "text" },
              { key: "what", label: "负责什么", kind: "text" },
            ],
          },
        },
        {
          key: "keyPages",
          label: "关键页面",
          kind: "list",
          item: {
            kind: "fields",
            fields: [
              { key: "title", label: "页面", kind: "text" },
              { key: "description", label: "说明", kind: "text" },
              { key: "image", label: "图片地址", kind: "text" },
            ],
          },
        },
      ],
    },
  },
];

const WORK_SCHEMA = [
  {
    kind: "list",
    path: "",
    label: "作业",
    item: {
      kind: "fields",
      fields: [
        { key: "order", label: "顺序", kind: "number" },
        { key: "stage", label: "阶段", kind: "text" },
        { key: "title", label: "作业名称", kind: "text" },
        { key: "date", label: "日期", kind: "text" },
        { key: "status", label: "状态", kind: "text" },
        { key: "projectId", label: "关联项目 ID", kind: "text" },
        { key: "goal", label: "作业要求", kind: "text", multiline: true },
        { key: "whatIdid", label: "我的过程", kind: "text", multiline: true },
        {
          key: "skills",
          label: "技能",
          kind: "list",
          item: { kind: "text" },
        },
      ],
    },
  },
];

const REFLECTION_SCHEMA = [
  {
    title: "开场",
    fields: [
      { kind: "text", path: "intro", label: "复盘开场", multiline: true },
    ],
  },
  {
    title: "能力变化",
    fields: [
      {
        kind: "list",
        path: "abilityChanges",
        label: "能力",
        item: {
          kind: "fields",
          fields: [
            { key: "ability", label: "能力", kind: "text" },
            { key: "before", label: "之前", kind: "text", multiline: true },
            { key: "after", label: "现在", kind: "text", multiline: true },
          ],
        },
      },
    ],
  },
  {
    title: "做事的办法",
    fields: [
      {
        kind: "list",
        path: "methods",
        label: "方法",
        item: {
          kind: "fields",
          fields: [
            { key: "name", label: "方法", kind: "text" },
            { key: "detail", label: "说明", kind: "text", multiline: true },
          ],
        },
      },
    ],
  },
  {
    title: "踩过的坑",
    fields: [
      {
        kind: "list",
        path: "failures",
        label: "问题",
        item: {
          kind: "fields",
          fields: [
            { key: "what", label: "问题", kind: "text" },
            { key: "lesson", label: "学到的", kind: "text", multiline: true },
          ],
        },
      },
    ],
  },
  {
    title: "下一步",
    fields: [
      {
        kind: "list",
        path: "plan",
        label: "计划",
        item: {
          kind: "fields",
          fields: [
            { key: "period", label: "时间", kind: "text" },
            { key: "goal", label: "目标", kind: "text", multiline: true },
          ],
        },
      },
    ],
  },
];

const SCHEMA = {
  about: ABOUT_SCHEMA,
  projects: PROJECT_SCHEMA,
  works: WORK_SCHEMA,
  reflection: REFLECTION_SCHEMA,
};

function joinPath(base, ...parts) {
  return [base, ...parts]
    .filter((part) => part !== undefined && part !== null && part !== "")
    .join(".");
}

function getAtPath(root, path) {
  if (!path) return root;
  return path.split(".").reduce((value, key) => value?.[key], root);
}

function setAtPath(root, path, value) {
  if (!path) return value;
  const copy = structuredClone(root);
  const keys = path.split(".");
  let cursor = copy;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
      return;
    }
    if (cursor[key] === undefined || cursor[key] === null) {
      cursor[key] = /^\d+$/.test(keys[index + 1]) ? [] : {};
    }
    cursor = cursor[key];
  });
  return copy;
}

function emptyItem(schema) {
  if (schema.kind === "text") return "";
  if (schema.kind === "fields") {
    return Object.fromEntries(
      schema.fields.map((field) => [
        field.key,
        field.kind === "list" ? [] : field.kind === "number" ? 0 : "",
      ]),
    );
  }
  return [];
}

function Field({ schema, path, doc, update }) {
  if (schema.kind === "text") {
    const value = getAtPath(doc, path) || "";
    return (
      <label className={styles.field}>
        <span>{schema.label}</span>
        {schema.multiline ? (
          <textarea
            value={value}
            rows={3}
            onChange={(event) => update(path, event.target.value)}
          />
        ) : (
          <input
            value={value}
            onChange={(event) => update(path, event.target.value)}
          />
        )}
      </label>
    );
  }

  if (schema.kind === "number") {
    const value = getAtPath(doc, path) ?? 0;
    return (
      <label className={styles.field}>
        <span>{schema.label}</span>
        <input
          type="number"
          value={value}
          onChange={(event) =>
            update(path, Number(event.target.value) || 0)
          }
        />
      </label>
    );
  }

  if (schema.kind === "pairs") {
    const value = getAtPath(doc, path) || [];
    return (
      <div className={styles.field}>
        <span className={styles.fieldLabel}>{schema.label}</span>
        <div className={styles.list}>
          {value.map((pair, index) => (
            <div className={styles.pairRow} key={index}>
              <input
                value={pair?.[0] || ""}
                placeholder="名称"
                onChange={(event) =>
                  update(joinPath(path, index, "0"), event.target.value)
                }
              />
              <input
                value={pair?.[1] || ""}
                placeholder="内容"
                onChange={(event) =>
                  update(joinPath(path, index, "1"), event.target.value)
                }
              />
              <button
                type="button"
                className={styles.remove}
                onClick={() =>
                  update(
                    path,
                    value.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
              >
                删除
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.add}
            onClick={() => update(path, [...value, ["", ""]])}
          >
            + 添加一项
          </button>
        </div>
      </div>
    );
  }

  if (schema.kind === "list") {
    const value = getAtPath(doc, path) || [];
    return (
      <div className={styles.field}>
        <span className={styles.fieldLabel}>{schema.label}</span>
        <div className={styles.list}>
          {value.map((item, index) => (
            <div className={styles.listItem} key={index}>
              <div className={styles.listItemHead}>
                <span>第 {index + 1} 项</span>
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() =>
                    update(
                      path,
                      value.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  删除
                </button>
              </div>
              {schema.item.kind === "text" ? (
                <textarea
                  value={item}
                  rows={2}
                  onChange={(event) =>
                    update(joinPath(path, index), event.target.value)
                  }
                />
              ) : (
                <div className={styles.grid2}>
                  {schema.item.fields.map((field) => (
                    <Field
                      key={field.key}
                      schema={field}
                      path={joinPath(path, index, field.key)}
                      doc={doc}
                      update={update}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            className={styles.add}
            onClick={() => update(path, [...value, emptyItem(schema.item)])}
          >
            + 添加{schema.label}
          </button>
        </div>
      </div>
    );
  }

  if (schema.kind === "fields") {
    return (
      <div className={styles.grid2}>
        {schema.fields.map((field) => (
          <Field
            key={field.key}
            schema={field}
            path={joinPath(path, field.key)}
            doc={doc}
            update={update}
          />
        ))}
      </div>
    );
  }

  return null;
}

export default function AdminApp() {
  const [session, setSession] = useState(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [active, setActive] = useState("about");
  const [docs, setDocs] = useState(LOCAL);

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
      setMessage("已读取数据库内容");
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => setSession(nextSession ?? null),
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadContent();
  }, [session, loadContent]);

  const update = (path, value) => {
    setDocs((current) => ({
      ...current,
      [active]: setAtPath(current[active], path, value),
    }));
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
    setBusy(true);
    const { error } = await supabase.from("site_content").upsert(
      { key: active, content: docs[active] },
      { onConflict: "key" },
    );
    setBusy(false);

    if (error) {
      setMessage(`保存失败：${error.message}`);
      return;
    }
    setMessage("保存成功，刷新公开页面即可看到");
  };

  const restoreLocal = () => {
    setDocs((current) => ({ ...current, [active]: LOCAL[active] }));
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
            onClick={() => {
              setActive(section.key);
              setMessage("");
            }}
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
            <p>按分类填写，保存后刷新公开页面即可看到。</p>
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

        <div className={styles.form}>
          {SCHEMA[active].map((group) =>
            group.title ? (
              <section key={group.title} className={styles.group}>
                <h3>{group.title}</h3>
                {group.fields.map((field, index) => (
                  <Field
                    key={`${group.title}-${index}`}
                    schema={field}
                    path={field.path}
                    doc={docs[active]}
                    update={update}
                  />
                ))}
              </section>
            ) : (
              <Field
                key={group.path}
                schema={group}
                path={group.path}
                doc={docs[active]}
                update={update}
              />
            ),
          )}
        </div>

        {message && <p className={styles.message}>{message}</p>}
      </section>
    </main>
  );
}





