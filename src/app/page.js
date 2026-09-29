import Link from "next/link";
import { site, sections } from "@/data/site";

// 首页：网址打开后的第一页（对应网址 / ）
export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      {/* 顶部：自我介绍 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10">
        <p className="text-sm font-medium text-indigo-600">{site.tagline}</p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          你好，我是 {site.name} 👋
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          {site.intro}
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/works"
            className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            看看我的作业 →
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            先了解一下我
          </Link>
        </div>
      </section>

      {/* 中间：7 个板块的入口（内容来自 src/data/site.js） */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          网站内容导航
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          按课程要求组织成 7 个板块，点任意一张卡片进入。
        </p>

        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
              >
                <span className="text-2xl" aria-hidden="true">
                  {item.emoji}
                </span>
                <h3 className="mt-3 font-semibold text-slate-900 group-hover:text-indigo-600">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">
                  {item.desc}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 底部：迭代状态说明（课程要求"不能期末一次性补做"，所以特意写在首页） */}
      <section className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
        <h2 className="font-semibold text-slate-900">
          🛠 这个网站还在持续迭代中
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          最近一次更新：{site.lastUpdated}。我把每次修改的原因和效果都记在{" "}
          <Link
            href="/iterations"
            className="font-medium text-indigo-600 underline"
          >
            迭代记录
          </Link>{" "}
          里，欢迎查看。
        </p>
      </section>
    </div>
  );
}
