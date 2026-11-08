"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./reflection.module.css";

const SECTIONS = [
  { id: "ability", no: "01", label: "能力变化" },
  { id: "methods", no: "02", label: "做事的办法" },
  { id: "failures", no: "03", label: "踩过的坑" },
  { id: "plan", no: "04", label: "下一步" },
];

function SectionHead({ no, title, note }) {
  return (
    <div className={styles.sectionHead}>
      <span className={styles.sectionNo}>{no}</span>
      <h2>{title}</h2>
      <p>{note}</p>
    </div>
  );
}

export default function ReflectionStory({ reflection }) {
  const [active, setActive] = useState("ability");

  useEffect(() => {
    const sections = SECTIONS.map((section) =>
      document.getElementById(section.id),
    ).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-22% 0px -58% 0px", threshold: [0.05, 0.2, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.srOnly}>学习复盘</h1>

      <div className={styles.metaLine}>
        <span>学习复盘</span>
        <span>从模板到独立完成 / 2026</span>
      </div>

      <section className={styles.opening}>
        <p className={styles.eyebrow}>一次把过程讲清楚的复盘</p>
        <p className={styles.headline}>
          不是学会了几个工具，
          <br />
          <span>是知道下一步做什么。</span>
        </p>
        <p className={styles.intro}>{reflection.intro}</p>
      </section>

      <div className={styles.layout}>
        <aside className={styles.rail}>
          <div className={styles.railWord} aria-hidden="true">
            <span>RE</span>
            <span>WRITE</span>
          </div>
          <nav aria-label="复盘章节">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                data-active={active === section.id ? "true" : "false"}
              >
                <span>{section.no}</span>
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className={styles.content}>
          <section id="ability" className={styles.section}>
            <SectionHead
              no="01"
              title="能力变化"
              note="同一件事，前后两种做法"
            />

            <div className={styles.changes}>
              {reflection.abilityChanges.map((item, index) => (
                <article key={item.ability} className={styles.change}>
                  <span className={styles.changeNo}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{item.ability}</h3>
                    <div className={styles.compare}>
                      <div className={styles.before}>
                        <span>之前</span>
                        <p>{item.before}</p>
                      </div>
                      <span className={styles.arrow} aria-hidden="true">
                        →
                      </span>
                      <div className={styles.after}>
                        <span>现在</span>
                        <p>{item.after}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="methods" className={styles.section}>
            <SectionHead
              no="02"
              title="做事的办法"
              note="不是灵感，是重复使用的工作方式"
            />

            <div className={styles.methods}>
              {reflection.methods.map((item, index) => (
                <article key={item.name} className={styles.method}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="failures" className={styles.section}>
            <SectionHead
              no="03"
              title="踩过的坑"
              note="真正留下来的，是修好它的过程"
            />

            <div className={styles.failures}>
              {reflection.failures.map((item, index) => (
                <article key={item.what} className={styles.failure}>
                  <div className={styles.failureMark}>
                    <span>坑</span>
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3>{item.what}</h3>
                    <p>{item.lesson}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="plan" className={styles.section}>
            <SectionHead
              no="04"
              title="下一步"
              note="把这次学会的，继续用下去"
            />

            <div className={styles.plan}>
              {reflection.plan.map((item) => (
                <article key={item.period} className={styles.planRow}>
                  <span className={styles.period}>{item.period}</span>
                  <p>{item.goal}</p>
                  <span className={styles.planArrow} aria-hidden="true">
                    ↗
                  </span>
                </article>
              ))}
            </div>
          </section>

          <footer className={styles.footer}>
            <Link href="/projects/">继续看项目成果 →</Link>
            <Link href="/process/">过程证据</Link>
            <Link href="/works/">阶段作业</Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
