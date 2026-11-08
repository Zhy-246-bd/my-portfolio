import Link from "next/link";
import AboutProfileCard from "@/components/about/AboutProfileCard";
import HobbyGallery from "@/components/about/HobbyGallery";
import { about } from "@/data/about";
import { site } from "@/data/site";

export const metadata = { title: "关于我" };

function SectionHead({ index, title }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs tracking-[0.18em] text-emerald-200/45">
          {index}
        </span>
        <h2 className="text-xl font-semibold text-white sm:text-2xl">{title}</h2>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-2 pb-12 sm:px-6 sm:pt-2 sm:pb-16">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">关于我</h1>

      <div className="mt-10 grid gap-10 lg:-mt-32 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-8">
        <section aria-label="个人照片">
          <AboutProfileCard photos={about.photos} />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-10 lg:mt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.18em] text-emerald-200/45">
                HELLO, I AM
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white">
                {about.profile.name}
              </h2>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300/75">
            {about.profile.tagline}
          </p>
          <p className="mt-3 max-w-2xl text-base leading-8 text-slate-400">
            {about.profile.intro}
          </p>

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6 sm:grid-cols-4 lg:grid-cols-2">
            {about.profile.facts.map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[11px] tracking-[0.14em] text-slate-500">
                  {label}
                </dt>
                <dd className="mt-1 text-sm text-slate-200">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section className="mt-36">
        <SectionHead
          index="01"
          title="我的故事"
          note="为什么开始学编程，以及这个作品集想留下什么。"
        />
        <div className="mt-5 max-w-4xl space-y-4 text-base leading-8 text-slate-300/70">
          {about.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHead
          index="02"
          title="爱好与日常"
          note="除了作业和项目，我也是会出门走走、寻找美食、打游戏和做饭的人。"
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {about.hobbies.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-white/10 bg-white/[0.025] p-5"
            >
              <p className="font-mono text-[11px] tracking-[0.16em] text-emerald-200/35">
                {item.tag}
              </p>
              <h3 className="mt-2 text-base font-semibold text-slate-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                {item.text}
              </p>
            </article>
          ))}
        </div>
        <HobbyGallery />
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
              <h3 className="text-base font-semibold text-slate-100">
                {item.title}
              </h3>
              <p className="mt-2 text-base leading-8 text-slate-400">
                {item.text}
              </p>
              <p className="mt-3 font-mono text-[11px] leading-6 tracking-[0.08em] text-emerald-200/35">
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
              <p className="font-mono text-[11px] tracking-[0.16em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-2 text-3xl font-semibold text-emerald-100/90">
                {item.value}
              </p>
              <h3 className="mt-1 text-base font-semibold text-slate-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                {item.text}
              </p>
            </article>
          ))}
        </div>
        <Link
          href="/projects/"
          className="mt-4 inline-flex items-center gap-1 font-mono text-xs tracking-[0.12em] text-emerald-200/60 hover:text-emerald-100"
        >
          查看全部项目成果 ↗
        </Link>
      </section>

      <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
        <h2 className="text-base font-semibold text-slate-100">联系我</h2>
        <p className="mt-2 text-base text-slate-400">
          邮箱：
          <a
            href={`mailto:${site.email}`}
            className="text-emerald-200/80 hover:underline"
          >
            {site.email}
          </a>
        </p>
        <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-7 text-slate-500">
          {about.aiStatement}
        </p>
      </section>

      <Link
        href="/"
        className="mt-8 inline-block font-mono text-xs tracking-[0.12em] text-emerald-200/60 hover:text-emerald-100"
      >
        ← 回到首页
      </Link>
    </div>
  );
}
