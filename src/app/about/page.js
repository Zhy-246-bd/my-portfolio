import Link from "next/link";
import AboutProfileCard from "@/components/about/AboutProfileCard";
import { about } from "@/data/about";
import { site } from "@/data/site";

export const metadata = { title: "关于我" };

function SectionHead({ index, title, note }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] tracking-[0.18em] text-emerald-200/45">
          {index}
        </span>
        <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
      </div>
      {note && (
        <p className="max-w-md text-xs leading-6 text-slate-400">{note}</p>
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] tracking-[0.2em] text-emerald-200/45">
        ABOUT / 01
      </p>
      <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">关于我</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-300/70">
        一个正在学习用代码做东西的人。这里放我的照片、学习经历、能力、课程成果和日常，
        也放这个作品集背后的过程。
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-6">
        <section aria-label="个人照片">
          <AboutProfileCard photos={about.photos} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="font-mono text-[9px] tracking-[0.18em] text-emerald-200/45">
                HELLO, I AM
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {about.profile.name}
              </h2>
            </div>
            <p className="font-mono text-[10px] tracking-[0.12em] text-slate-400">
              {about.profile.role}
            </p>
          </div>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300/75">
            {about.profile.tagline}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            {about.profile.intro}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-5 sm:grid-cols-4 lg:grid-cols-2">
            {about.profile.facts.map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[8px] tracking-[0.14em] text-slate-500">
                  {label}
                </dt>
                <dd className="mt-1 text-xs text-slate-200">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section className="mt-12">
        <SectionHead
          index="01"
          title="我的故事"
          note="为什么开始学编程，以及这个作品集想留下什么。"
        />
        <div className="mt-5 max-w-3xl space-y-4 text-sm leading-8 text-slate-300/70">
          {about.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHead
          index="02"
          title="学习经历"
          note="从零基础到能把一个网站做出来、部署上线。"
        />
        <ol className="mt-5">
          {about.journey.map((item, index) => (
            <li
              key={item.date}
              className={
                "relative border-l border-white/10 pl-5 " +
                (index === about.journey.length - 1 ? "pb-0" : "pb-6")
              }
            >
              <span className="absolute top-1.5 -left-[4px] h-2 w-2 rounded-full bg-emerald-200/60 ring-4 ring-[#06100d]" />
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-[9px] tracking-[0.12em] text-emerald-200/45">
                  {item.date}
                </span>
                <h3 className="text-sm font-semibold text-slate-100">
                  {item.title}
                </h3>
              </div>
              <p className="mt-1.5 max-w-2xl text-sm leading-7 text-slate-400">
                {item.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <SectionHead
          index="03"
          title="能力与工具"
          note="不写空泛的“学习能力强”，只写现在能做出什么。"
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {about.capabilities.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-white/10 bg-white/[0.025] p-5"
            >
              <h3 className="text-sm font-semibold text-slate-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                {item.text}
              </p>
              <p className="mt-3 font-mono text-[9px] leading-5 tracking-[0.08em] text-emerald-200/35">
                {item.tools}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHead
          index="04"
          title="成绩与成果"
          note="课程完成情况、上线地址和过程记录，都可以在站内点开核对。"
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {about.achievements.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-white/10 bg-white/[0.025] p-5"
            >
              <p className="font-mono text-[8px] tracking-[0.16em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-100/90">
                {item.value}
              </p>
              <h3 className="mt-1 text-sm font-semibold text-slate-100">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-400">
                {item.text}
              </p>
            </article>
          ))}
        </div>
        <Link
          href="/projects/"
          className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.12em] text-emerald-200/60 hover:text-emerald-100"
        >
          查看全部项目成果 ↗
        </Link>
      </section>

      <section className="mt-12">
        <SectionHead
          index="05"
          title="爱好与日常"
          note="除了作业和项目，我也是会为光线、咖啡和散步停下来的人。"
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {about.hobbies.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-white/10 bg-white/[0.025] p-5"
            >
              <p className="font-mono text-[8px] tracking-[0.16em] text-emerald-200/35">
                {item.tag}
              </p>
              <h3 className="mt-2 text-sm font-semibold text-slate-100">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-400">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHead
          index="06"
          title="下一步"
          note="这门课结束后，还想继续补什么、做什么。"
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {about.goals.map((goal) => (
            <article
              key={goal.period}
              className="rounded-xl border border-white/10 bg-white/[0.025] p-5"
            >
              <p className="font-mono text-[9px] tracking-[0.14em] text-emerald-200/45">
                {goal.period}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300/75">
                {goal.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
        <h2 className="text-sm font-semibold text-slate-100">联系我</h2>
        <p className="mt-2 text-sm text-slate-400">
          邮箱：
          <a
            href={`mailto:${site.email}`}
            className="text-emerald-200/80 hover:underline"
          >
            {site.email}
          </a>
        </p>
        <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-6 text-slate-500">
          {about.aiStatement}
        </p>
      </section>

      <Link
        href="/"
        className="mt-8 inline-block font-mono text-[10px] tracking-[0.12em] text-emerald-200/60 hover:text-emerald-100"
      >
        ← 回到首页
      </Link>
    </div>
  );
}
