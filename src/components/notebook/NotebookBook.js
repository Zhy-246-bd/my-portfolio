"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { about } from "@/data/about";
import { works } from "@/data/works";
import { projects } from "@/data/projects";
import { process as processData } from "@/data/process";
import { iterations } from "@/data/iterations";
import { credits } from "@/data/credits";
import styles from "./notebook.module.css";

const sortedWorks = [...works].sort((a, b) => a.order - b.order);
const sortedIterations = [...iterations].sort((a, b) => b.no - a.no);

function chunk(items, size) {
  const result = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

function cx(...values) {
  return values.filter(Boolean).join(" ");
}

function useMediaQuery(query) {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/* ---------------- 页面内容（已经按一页的容量切好） ---------------- */

function AboutIntro() {
  return (
    <>
      <h4 className={styles.h4}>自我介绍</h4>
      {about.intro.map((paragraph) => (
        <p key={paragraph} className={styles.para}>
          {paragraph}
        </p>
      ))}
    </>
  );
}

function AboutSkills() {
  return (
    <>
      <h4 className={styles.h4}>能力清单</h4>
      <p className={styles.para}>
        分三档如实标注：熟练 = 不看教程也能做；会用 = 查资料能做出来；学习中 =
        刚接触，还在跟着做。
      </p>
      {about.skills.map((group) => (
        <div key={group.category} className={styles.skillGroup}>
          <p className={styles.skillGroupTitle}>{group.category}</p>
          <ul className={styles.chips}>
            {group.items.map((skill) => (
              <li key={skill.name} className={styles.chip} data-level={skill.level}>
                {skill.name}
                <span>{skill.level}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function AboutGoals() {
  return (
    <>
      <h4 className={styles.h4}>学习目标</h4>
      <ul className={styles.goals}>
        {about.goals.map((goal) => (
          <li key={goal.period}>
            <span>{goal.period}</span>
            {goal.text}
          </li>
        ))}
      </ul>

      <h4 className={styles.h4}>关于这个网站的说明</h4>
      <p className={styles.para}>{about.aiStatement}</p>
      <p className={styles.para}>
        联系我：
        <a className={styles.inlineLink} href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </p>
    </>
  );
}

function WorksChunk({ items }) {
  return (
    <ol className={styles.timeline}>
      {items.map((work) => (
        <li key={work.order}>
          <div className={styles.tlMeta}>
            <span className={styles.tlStage}>{work.stage}</span>
            <span>{work.date}</span>
            <span>{work.status}</span>
          </div>
          <h5>{work.title}</h5>
          <p>
            <b>作业要求：</b>
            {work.goal}
          </p>
          <p>
            <b>我的过程：</b>
            {work.whatIdid}
          </p>
          <div className={styles.tagRow}>
            {work.skills.map((skill) => (
              <span key={skill} className={styles.tag}>
                {skill}
              </span>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}

function ProjectsChunk({ items }) {
  return (
    <>
      {items.map((project) => (
        <div key={project.id} className={styles.projectBlock} id={`nb-${project.id}`}>
          <h5>{project.name}</h5>
          <p className={styles.projectMeta}>
            {project.role} · {project.tech?.[0]?.name || "课程项目"}
          </p>
          <p>{project.summary}</p>
          <ul className={styles.featureList}>
            {project.features.slice(0, 3).map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <div className={styles.linkRow}>
            {project.entry && (
              <a href={project.entry} target="_blank" rel="noopener noreferrer">
                访问项目 ↗
              </a>
            )}
            <Link href={`/projects#${project.id}`}>查看完整档案 →</Link>
          </div>
        </div>
      ))}
    </>
  );
}

const collageLayouts = {
  left: [
    { top: "7%", left: "4%", width: "60%", rotate: -3, z: 2 },
    { top: "5%", right: "4%", width: "52%", rotate: 4, z: 3 },
    { top: "38%", left: "3%", width: "56%", rotate: 2, z: 1 },
    { top: "52%", right: "4%", width: "48%", rotate: -5, z: 4 },
  ],
  right: [
    { top: "8%", left: "12%", width: "72%", rotate: -2, z: 1 },
    { top: "40%", left: "2%", width: "55%", rotate: 4, z: 3 },
    { top: "58%", right: "2%", width: "60%", rotate: -3, z: 2 },
  ],
};

function ProjectCollage({ images, side }) {
  const layout = collageLayouts[side] ?? collageLayouts.left;

  return (
    <div className={styles.collageCanvas}>
      {images.slice(0, layout.length).map((image, index) => {
        const item = layout[index];

        return (
          <span
            key={image.src}
            className={styles.collageItem}
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              width: item.width,
              zIndex: item.z,
              transform: `rotate(${item.rotate}deg)`,
            }}
          >
            <span className={styles.collageTapeLeft} aria-hidden="true" />
            <span className={styles.collageTapeRight} aria-hidden="true" />
            <span className={styles.collageFrame}>
              <Image
                src={image.src}
                alt={`${image.name} 页面截图`}
                width={1000}
                height={703}
                className={styles.collageImage}
              />
            </span>
          </span>
        );
      })}
    </div>
  );
}

function ProjectIntro() {
  return (
    <p className={styles.para}>
      下面两页是我做过的项目截图，先不看文字，翻过去看一眼；再往后是每个项目的说明和入口。
    </p>
  );
}

function ProcessRequirement() {
  const { requirement } = processData;
  return (
    <>
      <h4 className={styles.h4}>① 需求</h4>
      <p className={styles.para}>{requirement.what}</p>
      <p className={styles.para}>
        <b>做给谁：</b>
        {requirement.forWhom}
      </p>
      <p className={styles.para}>
        <b>做到什么程度：</b>
        {requirement.goal}
      </p>
    </>
  );
}

function ProcessProtoPrompts() {
  const { prototypes, prompts } = processData;
  return (
    <>
      <h4 className={styles.h4}>② 原型</h4>
      <p className={styles.para}>
        没有专业画图工具，用「文字结构描述 + 方块线框图」画了
        {prototypes.length} 份页面结构，分别是首页和「关于我」页。
      </p>

      <h4 className={styles.h4}>③ 提示词</h4>
      <p className={styles.para}>
        记录了 {prompts.length} 次真实的 AI 对话，下面是其中两次：
      </p>
      <ul className={styles.featureList}>
        {prompts.slice(0, 2).map((item) => (
          <li key={item.date}>
            <b>{item.date}</b>：{item.question.slice(0, 58)}…
          </li>
        ))}
      </ul>
    </>
  );
}

function ProcessVersionsProblems() {
  const { versions, problems } = processData;
  return (
    <>
      <h4 className={styles.h4}>④ 版本</h4>
      <p className={styles.para}>
        从 v1 的空壳到 v{versions.length}，每一版做了什么都有时间线；网站上的迭代记录已经到
        v{sortedIterations[0].no}。
      </p>

      <h4 className={styles.h4}>⑤ 问题解决</h4>
      <ul className={styles.featureList}>
        {problems.slice(0, 3).map((item, index) => (
          <li key={index}>
            <b>{item.problem.slice(0, 28)}…</b> {item.solution}
          </li>
        ))}
      </ul>
    </>
  );
}

function IterationsChunk({ items }) {
  return (
    <ol className={styles.iterList}>
      {items.map((item) => (
        <li key={item.no}>
          <div className={styles.iterNo}>{item.version}</div>
          <div>
            <div className={styles.iterTitle}>{item.title}</div>
            <div className={styles.iterMeta}>
              {item.date} · 第 {item.no} 次
            </div>
            <p className={styles.iterWhat}>{item.what}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function CreditsChunk({ sections }) {
  return (
    <>
      {sections.map((section) => (
        <div key={section.title} className={styles.creditsSection}>
          <h5>{section.title}</h5>
          <ul>
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function FeaturedContent() {
  return (
    <div className={styles.placeholder}>
      <strong>等代表作定下来，这里会分成 7 块：</strong>
      <ul>
        <li>问题：要解决什么真实痛点</li>
        <li>用户：做给谁用</li>
        <li>方案：我的思路和做法</li>
        <li>功能：核心任务闭环</li>
        <li>过程：关键决策和迭代</li>
        <li>演示：能打开的入口和关键页</li>
        <li>复盘：好的、不好的、重做怎么改</li>
      </ul>
    </div>
  );
}

function ReflectionContent() {
  return (
    <div className={styles.placeholder}>
      <strong>四个部分：</strong>
      <ul>
        <li>能力变化：同一件事，学期初的我 vs 现在的我</li>
        <li>有效方法：这一学期总结出的做事方法</li>
        <li>失败经验：做砸的事，以及学到的教训</li>
        <li>后续计划：接下来想学什么、做什么</li>
      </ul>
    </div>
  );
}

/* ---------------- 模块 = 多页 ---------------- */

const aboutPages = [
  { opener: true, content: <AboutIntro /> },
  { content: <AboutSkills /> },
  { content: <AboutGoals /> },
];

const worksPages = [
  {
    opener: true,
    content: <WorksChunk items={sortedWorks.slice(0, 2)} />,
  },
  ...chunk(sortedWorks.slice(2), 2).map((items) => ({
    content: <WorksChunk items={items} />,
  })),
];

const projectImages = projects
  .filter((project) => project.cover)
  .map((project) => ({ src: project.cover, name: project.name }));

const projectPages = [
  { opener: true, content: <ProjectIntro /> },
  {
    collage: true,
    collageSide: "left",
    images: projectImages.slice(0, 4),
  },
  {
    collage: true,
    collageSide: "right",
    images: projectImages.slice(4),
  },
  ...chunk(projects, 2).map((items) => ({
    content: <ProjectsChunk items={items} />,
  })),
];

const processPages = [
  { opener: true, content: <ProcessRequirement /> },
  { content: <ProcessProtoPrompts /> },
  { content: <ProcessVersionsProblems /> },
];

const iterationPages = [
  {
    opener: true,
    content: <IterationsChunk items={sortedIterations.slice(0, 4)} />,
  },
  ...chunk(sortedIterations.slice(4), 5).map((items) => ({
    content: <IterationsChunk items={items} />,
  })),
];

const creditsPages = [
  {
    opener: true,
    content: <CreditsChunk sections={credits.sections.slice(0, 3)} />,
  },
  { content: <CreditsChunk sections={credits.sections.slice(3)} /> },
];

const modules = [
  {
    key: "about",
    no: "01",
    label: "关于",
    file: "about.md",
    eyebrow: "PERSONAL PROFILE",
    title: "关于我",
    lead: "我是谁、我在学什么、现在能做什么。",
    pages: aboutPages,
  },
  {
    key: "works",
    no: "02",
    label: "作业",
    file: "works.md",
    eyebrow: "COURSE WORK",
    title: "阶段作业",
    lead: "按课程顺序记录每一次作业：要求是什么、我真实做了什么、做到什么程度。",
    pages: worksPages,
  },
  {
    key: "projects",
    no: "03",
    label: "项目",
    file: "projects.md",
    eyebrow: "PROJECTS",
    title: "项目成果",
    lead: "每个项目按课程要求写清楚：功能、入口、关键页、技术说明。",
    pages: projectPages,
  },
  {
    key: "process",
    no: "04",
    label: "过程",
    file: "process.md",
    eyebrow: "PROCESS EVIDENCE",
    title: "过程证据",
    lead: "需求、原型、提示词、版本、问题解决——证明我是想清楚再动手的。",
    pages: processPages,
  },
  {
    key: "iterations",
    no: "05",
    label: "迭代",
    file: "iterations.md",
    eyebrow: "ITERATION LOG",
    title: "迭代记录",
    lead: "每次改了什么、为什么改、效果如何、下一步做什么。最新的一次在最上面。",
    pages: iterationPages,
  },
  {
    key: "reflection",
    no: "06",
    label: "复盘",
    file: "reflection.md",
    eyebrow: "FINAL REFLECTION",
    title: "最终学习复盘",
    lead: "一学期结束后，回头看看自己从哪里走到了哪里。",
    pages: [{ opener: true, content: <ReflectionContent /> }],
  },
  {
    key: "credits",
    no: "07",
    label: "引用",
    file: "credits.md",
    eyebrow: "CREDITS",
    title: "引用声明",
    lead: "用了模板、开源代码、AI 辅助或同伴帮助，都在这里如实说明。",
    pages: creditsPages,
  },
];

/* 每个模块第一页放在右边，左边留白；后面的页左右交替。 */
const spreads = [];
const moduleStartSpread = [];

modules.forEach((module, moduleIndex) => {
  moduleStartSpread[moduleIndex] = spreads.length;
  const pages = module.pages;
  spreads.push({ module: moduleIndex, left: null, right: pages[0] ?? null });
  for (let i = 1; i < pages.length; i += 2) {
    spreads.push({
      module: moduleIndex,
      left: pages[i] ?? null,
      right: pages[i + 1] ?? null,
    });
  }
});

spreads.forEach((spread, spreadIndex) => {
  if (spread.left) spread.left.pageNo = spreadIndex * 2 + 1;
  if (spread.right) spread.right.pageNo = spreadIndex * 2 + 2;
});

const mobilePages = [];
spreads.forEach((spread, spreadIndex) => {
  if (spread.left) {
    mobilePages.push({
      page: spread.left,
      module: spread.module,
      pageNo: spread.left.pageNo,
      spreadIndex,
    });
  }
  if (spread.right) {
    mobilePages.push({
      page: spread.right,
      module: spread.module,
      pageNo: spread.right.pageNo,
      spreadIndex,
    });
  }
});

const moduleFirstMobile = modules.map((module, moduleIndex) =>
  mobilePages.findIndex((entry) => entry.module === moduleIndex),
);

function ChapterOpener({ module }) {
  return (
    <div className={styles.opener}>
      <span className={styles.openerNo} aria-hidden="true">
        {module.no}
      </span>
      <p className={styles.openerKicker}>{module.eyebrow}</p>
      <h2 className={styles.openerTitle}>{module.title}</h2>
      <p className={styles.openerLead}>{module.lead}</p>
    </div>
  );
}

function PageView({
  side,
  page,
  module,
  pageNo,
  variant,
  onPageClick,
  interactive,
  mobile,
}) {
  const isRight = side === "right";
  const baseClass = isRight ? styles.rightPage : styles.leftPage;
  const pageLabel = pageNo ? String(pageNo).padStart(2, "0") : "";

  if (page?.collage) {
    return (
      <div
        className={cx(
          baseClass,
          styles.collagePage,
          variant === "sheet" && styles.sheetPage,
          mobile && styles.mobilePage,
          interactive && isRight && styles.pageNext,
        )}
        onClick={onPageClick}
        title={interactive ? "点击进入下一页" : undefined}
      >
        <ProjectCollage
          images={page.images ?? []}
          side={page.collageSide ?? side}
        />
        <span className={styles.collageVignette} aria-hidden="true" />
      </div>
    );
  }

  if (!page) {
    return (
      <div
        className={cx(
          baseClass,
          styles.blankPage,
          variant === "sheet" && styles.sheetPage,
          mobile && styles.mobilePage,
          interactive && isRight && styles.pageNext,
        )}
        onClick={onPageClick}
        title={interactive ? "点击进入下一页" : undefined}
      />
    );
  }

  return (
    <div
      className={cx(
        baseClass,
        styles.contentPage,
        variant === "sheet" && styles.sheetPage,
        mobile && styles.mobilePage,
        interactive && styles.pageNext,
      )}
      onClick={onPageClick}
      title={interactive ? "点击进入下一页" : undefined}
    >
      <span className={styles.paperTint} aria-hidden="true" />
      <div className={cx(styles.pageHead, !isRight && styles.pageHeadLeft)}>
        {isRight ? (
          <span className={styles.fileTab}>{module.file}</span>
        ) : (
          <span className={styles.leftTab}>
            {module.no} · {module.label}
          </span>
        )}
        <span className={styles.pageNo}>P. {pageLabel}</span>
      </div>

      <div
        className={cx(
          styles.pageBody,
          mobile && styles.pageBodyMobile,
          !isRight && styles.pageBodyLeft,
        )}
      >
        {page.opener && <ChapterOpener module={module} />}
        {page.content}
      </div>

      <div className={cx(styles.pageFoot, !isRight && styles.pageFootLeft)}>
        <span>{site.name} · 数智编程手账</span>
        <span>
          {module.no} / 08 · P.{pageLabel}
        </span>
      </div>
    </div>
  );
}

export default function NotebookBook() {
  const [open, setOpen] = useState(false);
  const [spread, setSpread] = useState(0);
  const [pendingSpread, setPendingSpread] = useState(null);
  const [flipping, setFlipping] = useState(false);
  const [direction, setDirection] = useState(1);
  const [mobilePage, setMobilePage] = useState(0);
  const timer = useRef(null);
  const isMobile = useMediaQuery("(max-width: 860px)");

  const closeBook = useCallback(() => {
    window.clearTimeout(timer.current);
    setFlipping(false);
    setPendingSpread(null);
    setOpen(false);
  }, []);

  const goToSpread = useCallback(
    (next, forcedDirection) => {
      if (!open || flipping) return;
      const target = Math.max(0, Math.min(spreads.length - 1, next));
      if (target === spread) return;

      const nextDirection =
        forcedDirection ?? (target > spread ? 1 : -1);

      setDirection(nextDirection);
      setPendingSpread(target);
      setFlipping(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        setSpread(target);
        setPendingSpread(null);
        setFlipping(false);
      }, 770);
    },
    [open, flipping, spread],
  );

  const goToMobilePage = useCallback(
    (next) => {
      if (!open) return;
      const target = Math.max(0, Math.min(mobilePages.length - 1, next));
      setMobilePage(target);
    },
    [open],
  );

  const handleLeftPageClick = (event) => {
    if (!open || flipping || isMobile) return;
    if (!(event.target instanceof Element)) return;
    if (event.target.closest("a, button, input, textarea, select, label")) return;
    if (window.getSelection()?.toString()) return;
    goToSpread(spread - 1, -1);
  };

  const handleRightPageClick = (event) => {
    if (!open || flipping || isMobile) return;
    if (!(event.target instanceof Element)) return;
    if (event.target.closest("a, button, input, textarea, select, label")) return;
    if (window.getSelection()?.toString()) return;
    goToSpread(spread + 1, 1);
  };

  const handleTabClick = (moduleIndex) => {
    if (isMobile) {
      const target = moduleFirstMobile[moduleIndex];
      if (target >= 0) goToMobilePage(target);
      return;
    }
    goToSpread(moduleStartSpread[moduleIndex]);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeBook();
        return;
      }

      if (!open) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setOpen(true);
        }
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (isMobile) {
          goToMobilePage(mobilePage + 1);
        } else {
          goToSpread(spread + 1, 1);
        }
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (isMobile) {
          goToMobilePage(mobilePage - 1);
        } else {
          goToSpread(spread - 1, -1);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    open,
    isMobile,
    mobilePage,
    spread,
    goToSpread,
    goToMobilePage,
    closeBook,
  ]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const currentSpread = spreads[spread];
  const currentModuleIndex = currentSpread?.module ?? 0;
  const pendingData =
    pendingSpread !== null ? spreads[pendingSpread] : null;

  const leftSpreadIndex =
    flipping && direction === -1 && pendingData ? pendingSpread : spread;
  const rightSpreadIndex =
    flipping && direction === 1 && pendingData ? pendingSpread : spread;

  const leftSpread = spreads[leftSpreadIndex];
  const rightSpread = spreads[rightSpreadIndex];
  const leftModule = modules[leftSpread.module];
  const rightModule = modules[rightSpread.module];

  const mobileEntry = mobilePages[mobilePage] ?? mobilePages[0];
  const activeModuleIndex = isMobile
    ? mobileEntry?.module ?? 0
    : currentModuleIndex;

  return (
    <div className={cx(styles.desk, open && styles.isOpen)}>
      <svg className={styles.edgeFilter} aria-hidden="true" focusable="false">
        <defs>
          <filter id="paperEdgeRough">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.08 0.02"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <header className={styles.topbar}>
        <button
          type="button"
          className={styles.topBtn}
          onClick={() => (open ? closeBook() : setOpen(true))}
        >
          {open ? "← 合上手账" : "翻开手账 →"}
        </button>

        <p className={styles.topTitle}>{site.name} · 数智编程手账</p>

        <div className={styles.topRight}>
          <Link className={styles.topBtn} href="/">
            普通版 ↗
          </Link>
        </div>
      </header>

      <div className={styles.stage}>
        <div className={styles.bookShadow} aria-hidden="true" />

        <div className={cx(styles.book, open ? styles.open : styles.closed)}>
          <div className={styles.pageStack} aria-hidden="true">
            <span className={styles.stackLeft} />
            <span className={styles.stackRight} />
            <span className={styles.stackBoard} />
            <span className={styles.stackBottom} />
          </div>

          {isMobile ? (
            <PageView
              key={`mobile-${mobilePage}`}
              side="right"
              page={mobileEntry?.page}
              module={modules[mobileEntry?.module ?? 0]}
              pageNo={mobileEntry?.pageNo}
              mobile
            />
          ) : (
            <PageView
              side="right"
              page={rightSpread.right}
              module={rightModule}
              pageNo={rightSpread.right?.pageNo}
              onPageClick={open ? handleRightPageClick : undefined}
              interactive={open}
            />
          )}

          <div className={styles.cover}>
            <div
              className={styles.coverFront}
              role="button"
              tabIndex={0}
              aria-label="打开手账"
              onClick={() => setOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setOpen(true);
                }
              }}
            />

            <div
              className={styles.coverBack}
              onClick={!isMobile && open ? handleLeftPageClick : undefined}
              title={!isMobile && open ? "点击返回上一页" : undefined}
            >
              {!isMobile && (
                <PageView
                  side="left"
                  page={leftSpread.left}
                  module={leftModule}
                  pageNo={leftSpread.left?.pageNo}
                />
              )}
            </div>
          </div>

          <div className={styles.spine} aria-hidden="true">
            {Array.from({ length: 6 }).map((_, index) => (
              <span key={index} className={styles.ring} />
            ))}
          </div>

          <nav className={styles.tabs} aria-label="手账章节">
            {modules.map((module, index) => (
              <button
                key={module.key}
                type="button"
                className={cx(
                  styles.tab,
                  index === activeModuleIndex && styles.tabActive,
                )}
                onClick={() => handleTabClick(index)}
                aria-current={index === activeModuleIndex ? "page" : undefined}
                title={`${module.no} ${module.title}`}
              >
                <span className={styles.tabNo}>{module.no}</span>
                <span className={styles.tabLabel}>{module.label}</span>
              </button>
            ))}
          </nav>

          {!isMobile && flipping && pendingSpread !== null && direction === 1 && (
            <div className={styles.flipSheet} aria-hidden="true">
              <div className={cx(styles.sheetFace, styles.sheetFront)}>
                <PageView
                  side="right"
                  page={currentSpread.right}
                  module={modules[currentSpread.module]}
                  pageNo={currentSpread.right?.pageNo}
                  variant="sheet"
                />
              </div>
              <div className={cx(styles.sheetFace, styles.sheetBack)}>
                <PageView
                  side="left"
                  page={pendingData.left}
                  module={modules[pendingData.module]}
                  pageNo={pendingData.left?.pageNo}
                  variant="sheet"
                />
              </div>
            </div>
          )}

          {!isMobile && flipping && pendingSpread !== null && direction === -1 && (
            <div
              className={cx(styles.flipSheet, styles.flipSheetBack)}
              aria-hidden="true"
            >
              <div
                className={cx(
                  styles.sheetFace,
                  styles.sheetFront,
                  styles.sheetFrontLeft,
                )}
              >
                <PageView
                  side="left"
                  page={currentSpread.left}
                  module={modules[currentSpread.module]}
                  pageNo={currentSpread.left?.pageNo}
                  variant="sheet"
                />
              </div>
              <div
                className={cx(
                  styles.sheetFace,
                  styles.sheetBack,
                  styles.sheetBackRight,
                )}
              >
                <PageView
                  side="right"
                  page={pendingData.right}
                  module={modules[pendingData.module]}
                  pageNo={pendingData.right?.pageNo}
                  variant="sheet"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {isMobile && open && (
        <div className={styles.mobileNav}>
          <button
            type="button"
            onClick={() => goToMobilePage(mobilePage - 1)}
            disabled={mobilePage <= 0}
          >
            ← 上一页
          </button>
          <span>
            {mobilePage + 1} / {mobilePages.length}
          </span>
          <button
            type="button"
            onClick={() => goToMobilePage(mobilePage + 1)}
            disabled={mobilePage >= mobilePages.length - 1}
          >
            下一页 →
          </button>
        </div>
      )}

      {!isMobile && open && (
        <div className={styles.hintBar} aria-hidden="true">
          <span>← → 翻页</span>
          <span>ESC 合上</span>
          <span>点左页往回 · 点右页往后</span>
        </div>
      )}
    </div>
  );
}
