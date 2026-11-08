import Link from "next/link";
import { reflection } from "@/data/reflection";

export const metadata = { title: "学习复盘" };

export default function ReflectionPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-2 pb-16 sm:px-6">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
          学习复盘
        </h1>
        <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
          {reflection.intro}
        </p>
      </header>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-white">能力变化</h2>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {reflection.abilityChanges.map((item) => (
            <article
              key={item.ability}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <h3 className="text-[15px] font-medium leading-6 text-white">
                {item.ability}
              </h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-[11px] tracking-[0.08em] text-white/35">
                    之前
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-white/55">
                    {item.before}
                  </p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-[11px] tracking-[0.08em] text-emerald-200/60">
                    现在
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-white/75">
                    {item.after}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-white">做事的办法</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {reflection.methods.map((item) => (
            <article
              key={item.name}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
            >
              <h3 className="text-base font-medium text-white">{item.name}</h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-white">踩过的坑</h2>
        <div className="mt-5 space-y-3">
          {reflection.failures.map((item, index) => (
            <article
              key={item.what}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6"
            >
              <h3 className="text-base font-medium leading-6 text-white">
                {item.what}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {item.lesson}
              </p>
              {index === reflection.failures.length - 1 && (
                <p className="mt-3 text-xs leading-5 text-white/35">
                  这些问题的完整排查过程，都记在「过程证据」和「迭代记录」里。
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-white">下一步</h2>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {reflection.plan.map((item) => (
            <article
              key={item.period}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="text-xs text-emerald-200/55">{item.period}</p>
              <p className="mt-3 text-sm leading-7 text-white/70">
                {item.goal}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6 text-sm">
        <Link
          href="/projects/"
          className="text-emerald-200/80 transition-colors hover:text-emerald-100"
        >
          继续看项目成果 →
        </Link>
        <Link
          href="/process/"
          className="text-white/45 transition-colors hover:text-white/75"
        >
          过程证据
        </Link>
        <Link
          href="/works/"
          className="text-white/45 transition-colors hover:text-white/75"
        >
          阶段作业
        </Link>
      </div>
    </div>
  );
}
