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

function SectionHead({ title }) {
  return (
    <div className={styles.sectionHead}>
      <h2>{title}</h2>
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

      <div className={styles.layout}>
        <aside className={styles.rail}>
          <div className={styles.railWord} aria-hidden="true">
            <span>复</span>
            <span>盘</span>
          </div>
          <nav aria-label="复盘章节">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                data-active={active === section.id ? "true" : "false"}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className={styles.content}>
          <section id="ability" className={styles.section}>
            <SectionHead title="能力变化" />

            <div className={styles.changes}>
              {reflection.abilityChanges.map((item) => (
                <article key={item.ability} className={styles.change}>
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
            <SectionHead title="做事的办法" />

            <div className={styles.methods}>
              {reflection.methods.map((item) => (
                <article key={item.name} className={styles.method}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="failures" className={styles.section}>
            <SectionHead title="踩过的坑" />

            <div className={styles.failures}>
              {reflection.failures.map((item) => (
                <article key={item.what} className={styles.failure}>
                  <div className={styles.failureMark}>
                    <span>坑</span>
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
            <SectionHead title="下一步" />

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

