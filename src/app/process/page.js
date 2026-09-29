import Image from "next/image";
import Link from "next/link";
import { process as processData } from "@/data/process";

export const metadata = { title: "过程证据" };

// 页面顶部的目录 —— 这 5 项就是课程要求本页必须包含的 5 个要素
const SECTIONS = [
  { id: "requirement", no: "①", label: "需求" },
  { id: "prototypes", no: "②", label: "原型" },
  { id: "prompts", no: "③", label: "提示词" },
  { id: "versions", no: "④", label: "版本" },
  { id: "problems", no: "⑤", label: "问题解决" },
];

// 还没填写的内容会以【待填写】开头，显示成黄色草稿框
function isDraft(text) {
  return typeof text === "string" && text.startsWith("【待填写】");
}

function DraftBox({ text }) {
  return (
    <p className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-800">
      <span className="font-semibold">这段还是草稿，等我填上真实内容：</span>
      {text.replace("【待填写】", "")}
    </p>
  );
}

// 内容还没录入时显示的提示框
function EmptyBox({ children }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
      {children}
    </div>
  );
}

function SectionTitle({ id, no, title, hint }) {
  return (
    <>
      <h2
        id={id}
        className="scroll-mt-20 text-lg font-bold text-slate-900 sm:text-xl"
      >
        <span className="mr-1.5 text-indigo-600">{no}</span>
        {title}
      </h2>
      {hint && <p className="mt-2 text-sm leading-6 text-slate-500">{hint}</p>}
    </>
  );
}

export default function ProcessPage() {
  const { requirement, prototypes, prompts, versions, problems } = processData;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">过程证据</h1>
      <p className="mt-4 leading-7 text-slate-600">
        这一页记录我是怎么做这个网站的：动手前想清楚要什么、和 AI 的每一次对话、每个版本分别做了什么、遇到问题怎么解决。
        课程要求这一页包含 5 个要素，下面按顺序排列。
      </p>

      {/* 五个要素的目录（点一下跳转到对应板块） */}
      <nav className="mt-6 flex flex-wrap gap-2">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600"
          >
            <span className="mr-1 font-semibold">{section.no}</span>
            {section.label}
          </a>
        ))}
      </nav>

      {/* ① 需求 */}
      <section className="mt-10">
        <SectionTitle
          id="requirement"
          no="①"
          title="需求"
          hint="动手写代码之前，先想清楚要做什么、做给谁、做到什么程度。"
        />
        <div className="mt-4 space-y-3">
          {[
            { label: "要做什么", text: requirement.what },
            { label: "做给谁看", text: requirement.forWhom },
            { label: "做到什么程度", text: requirement.goal },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <p className="text-sm font-semibold text-indigo-600">
                {item.label}
              </p>
              {isDraft(item.text) ? (
                <div className="mt-2">
                  <DraftBox text={item.text} />
                </div>
              ) : (
                <p className="mt-2 leading-7 text-slate-600">{item.text}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ② 原型 */}
      <section className="mt-10">
        <SectionTitle
          id="prototypes"
          no="②"
          title="原型"
          hint="写代码之前先画草图：先想好页面长什么样，再动手做，能少改很多东西。"
        />
        <div className="mt-4">
          {prototypes.length === 0 ? (
            <EmptyBox>
              <p className="font-medium text-slate-700">
                这一项还空着 —— 需要我亲自动手画一张草图。
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>拿纸笔画出首页大概长什么样（导航放哪、标题放哪、卡片怎么排）</li>
                <li>用手机拍下来</li>
                <li>
                  把照片存进项目的{" "}
                  <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-indigo-700">
                    public/images/
                  </code>{" "}
                  文件夹
                </li>
                <li>
                  打开{" "}
                  <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-indigo-700">
                    src/data/process.js
                  </code>
                  ，照着注释里的格式填一行
                </li>
              </ol>
            </EmptyBox>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {prototypes.map((item) => (
                <li
                  key={item.title}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={1200}
                    height={800}
                    className="h-auto w-full"
                  />
                  <div className="p-4">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    {item.note && (
                      <p className="mt-1.5 text-sm leading-6 text-slate-600">
                        {item.note}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ③ 提示词 */}
      <section className="mt-10">
        <SectionTitle
          id="prompts"
          no="③"
          title="提示词"
          hint="我和 AI 的对话记录。如实写出来，这不是减分项，反而是课程明确要求的「真实」证据。"
        />
        <div className="mt-4">
          {prompts.length === 0 ? (
            <EmptyBox>还没有记录。每次问完 AI，回来加一条。</EmptyBox>
          ) : (
            <ol className="space-y-4">
              {prompts.map((item, index) => (
                <li
                  key={`${item.date}-${index}`}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                      第 {index + 1} 次提问
                    </span>
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </div>

                  <div className="mt-4 space-y-3 text-sm leading-6">
                    <div>
                      <p className="font-semibold text-slate-900">我问 AI：</p>
                      <p className="mt-1.5 rounded-lg bg-slate-50 p-3 text-slate-600">
                        {item.question}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">AI 回答的要点：</p>
                      <p className="mt-1.5 rounded-lg bg-slate-50 p-3 text-slate-600">
                        {item.answer}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        我自己做了什么：
                      </p>
                      <p className="mt-1.5 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 text-slate-700">
                        {item.myChange}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* ④ 版本 */}
      <section className="mt-10">
        <SectionTitle
          id="versions"
          no="④"
          title="版本"
          hint="这个项目从第一版到现在，每一版分别做了什么。这条时间线能证明网站是一步步改出来的。"
        />
        <ol className="mt-4">
          {versions.map((item, index) => (
            <li
              key={item.version}
              className={
                "relative border-l-2 border-slate-200 pl-6 " +
                (index === versions.length - 1 ? "pb-0" : "pb-6")
              }
            >
              <span className="absolute top-1.5 -left-[5px] h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-slate-50" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                  {item.version}
                </span>
                <span className="text-xs text-slate-400">{item.date}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.what}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ⑤ 问题解决 */}
      <section className="mt-10">
        <SectionTitle
          id="problems"
          no="⑤"
          title="问题解决"
          hint="我遇到的报错和困难。把报错原文贴上来最有说服力 —— 它证明这些都是真实发生过的。"
        />
        <div className="mt-4">
          {problems.length === 0 ? (
            <EmptyBox>还没有记录。以后每次卡住又解决之后，回来加一条。</EmptyBox>
          ) : (
            <ul className="space-y-4">
              {problems.map((item, index) => (
                <li
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                    问题 {index + 1}
                  </span>

                  <div className="mt-3 space-y-3 text-sm leading-6">
                    <div>
                      <p className="font-semibold text-slate-900">遇到的情况</p>
                      <p className="mt-1.5 rounded-lg bg-rose-50/60 p-3 text-slate-700">
                        {item.problem}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">我的判断</p>
                      <p className="mt-1.5 text-slate-600">{item.cause}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">怎么解决的</p>
                      <p className="mt-1.5 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 text-slate-700">
                        {item.solution}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Link
        href="/"
        className="mt-10 inline-block text-sm font-semibold text-indigo-600 hover:underline"
      >
        ← 回到首页
      </Link>
    </div>
  );
}
