"use client";

import { useState } from "react";
import Link from "next/link";
import AboutProfileCard from "./AboutProfileCard";
import HobbyGallery from "./HobbyGallery";
import styles from "./about-drawers.module.css";

const LAYERS = [
  {
    id: "life",
    no: "01",
    title: "生活者",
    sub: "出门走走、找吃的、打游戏、做饭，还有路边遇到的猫狗。",
    open: "收起",
    closed: "展开",
  },
  {
    id: "learner",
    no: "02",
    title: "学习者",
    sub: "从零开始学做网站，和这个作品集想留下什么。",
    open: "收起",
    closed: "展开",
  },
  {
    id: "builder",
    no: "03",
    title: "建造者",
    sub: "8 个阶段作业、8 个项目，和它们背后的过程。",
    open: "收起",
    closed: "展开",
  },
];

export default function AboutDrawers({ about, email }) {
  const [open, setOpen] = useState("life");

  const toggle = (id) => {
    setOpen((current) => (current === id ? null : id));
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.srOnly}>关于我</h1>

      <div className={styles.top}>
        <section className={styles.fan} aria-label="个人照片">
          <AboutProfileCard photos={about.photos} />
        </section>

        <section className={styles.profileCard}>
          <p className={styles.cardKicker}>HELLO, I AM</p>
          <h2 className={styles.cardName}>{about.profile.name}</h2>
          <p className={styles.cardTagline}>{about.profile.tagline}</p>
          <p className={styles.cardIntro}>{about.profile.intro}</p>

          <dl className={styles.cardFacts}>
            {about.profile.facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <div className={styles.drawers}>
        {LAYERS.map((layer) => {
          const isOpen = open === layer.id;
          return (
            <section
              key={layer.id}
              className={styles.drawer}
              data-open={isOpen ? "true" : "false"}
            >
              <button
                type="button"
                className={styles.head}
                onClick={() => toggle(layer.id)}
                aria-expanded={isOpen}
                aria-controls={`about-${layer.id}`}
              >
                <span className={styles.index}>{layer.no}</span>
                <span className={styles.headText}>
                  <span className={styles.title}>{layer.title}</span>
                  <span className={styles.sub}>{layer.sub}</span>
                </span>
                <span className={styles.state}>
                  {isOpen ? layer.open : layer.closed}
                  <i aria-hidden="true">{isOpen ? "−" : "+"}</i>
                </span>
              </button>

              <div
                id={`about-${layer.id}`}
                className={styles.body}
                aria-hidden={!isOpen}
              >
                <div className={styles.bodyInner}>
                  {layer.id === "learner" && (
                    <div className={styles.learnerTextOnly}>
                      {about.story.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  )}

                  {layer.id === "builder" && (
                    <div className={styles.builder}>
                      <div className={styles.metrics}>
                        {about.achievements.map((item) => (
                          <article key={item.title}>
                            <span>{item.label}</span>
                            <strong>{item.value}</strong>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                          </article>
                        ))}
                      </div>

                      <div className={styles.capabilities}>
                        {about.capabilities.map((item) => (
                          <article key={item.title}>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                            <span>{item.tools}</span>
                          </article>
                        ))}
                      </div>

                      <div className={styles.links}>
                        <Link href="/works/">阶段作业 →</Link>
                        <Link href="/projects/">项目成果 →</Link>
                        <Link href="/process/">过程证据 →</Link>
                      </div>
                    </div>
                  )}

                  {layer.id === "life" && (
                    <div className={styles.life}>
                      <div className={styles.hobbies}>
                        {about.hobbies.map((item) => (
                          <article key={item.title}>
                            <span>{item.tag}</span>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                          </article>
                        ))}
                      </div>
                      <HobbyGallery />
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <footer className={styles.footer}>
        <div>
          <p className={styles.footerTitle}>联系我</p>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
        <p>{about.aiStatement}</p>
      </footer>
    </div>
  );
}
