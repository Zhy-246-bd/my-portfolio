import Link from "next/link";
import { about } from "@/data/about";
import { site } from "@/data/site";

export const metadata = { title: "关于我" };

// 三个能力等级对应的标签颜色（绿=熟练 / 蓝=会用 / 灰=学习中）
const LEVEL_STYLES = {
  熟练: "border-emerald-200 bg-emerald-50 text-emerald-700",
  会用: "border-indigo-200 bg-indigo-50 text-indigo-700",
  学习中: "border-slate-200 bg-slate-100 text-slate-600",
};

// 判断这段文字是不是还没填写的草稿（草稿会显示成黄色提示框）
function isDraft(text) {
  return text.startsWith("【待填写】");
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">关于我</h1>
      <p className="mt-3 text-sm text-slate-500">个人简介与能力</p>

      {/* ① 自我介绍 */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-slate-900">自我介绍</h2>
        <div className="mt-4 space-y-4">
          {about.intro.map((paragraph) =>
            isDraft(paragraph) ? (
              <p
                key={paragraph}
                className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-800"
              >
                <span className="font-semibold">这段还是草稿，等我填上真实内容：</span>
                {paragraph.replace("【待填写】", "")}
              </p>
            ) : (
              <p key={paragraph} className="leading-7 text-slate-600">
                {paragraph}
              </p>
            )
          )}
        </div>
      </section>

      {/* ② 能力清单 */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">能力清单</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          分三档如实标注：
          <strong className="font-semibold text-slate-700">熟练</strong>
          ＝不看教程也能独立做出来；
          <strong className="font-semibold text-slate-700">会用</strong>
          ＝需要查资料但能做出东西；
          <strong className="font-semibold text-slate-700">学习中</strong>
          ＝刚接触，还在跟着做。
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {about.skills.map((group) => (
            <section
              key={group.category}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <h3 className="font-semibold text-slate-900">{group.category}</h3>
              <ul className="mt-3 space-y-2.5">
                {group.items.map((skill) => (
                  <li
                    key={skill.name}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <span className="leading-6 text-slate-700">
                      {skill.name}
                    </span>
                    <span
                      className={
                        "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium " +
                        (LEVEL_STYLES[skill.level] ?? LEVEL_STYLES["学习中"])
                      }
                    >
                      {skill.level}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      {/* ③ 学习目标 */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-slate-900">学习目标</h2>
        <ul className="mt-4 space-y-3">
          {about.goals.map((goal) => (
            <li
              key={goal.period}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <p className="text-sm font-semibold text-indigo-600">
                {goal.period}
              </p>
              {isDraft(goal.text) ? (
                <p className="mt-1.5 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-800">
                  <span className="font-semibold">这段还是草稿，等我填上真实内容：</span>
                  {goal.text.replace("【待填写】", "")}
                </p>
              ) : (
                <p className="mt-1.5 leading-6 text-slate-600">{goal.text}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* ④ 联系方式 */}
      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-slate-900">联系我</h2>
        <p className="mt-2 text-sm text-slate-600">
          邮箱：
          <a
            href={`mailto:${site.email}`}
            className="font-medium text-indigo-600 hover:underline"
          >
            {site.email}
          </a>
        </p>
      </section>

      <Link
        href="/"
        className="mt-8 inline-block text-sm font-semibold text-indigo-600 hover:underline"
      >
        ← 回到首页
      </Link>
    </div>
  );
}
