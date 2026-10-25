import Link from "next/link";
import { featured } from "@/data/featured";
import { projects } from "@/data/projects";

export const metadata = { title: "标志性成果" };

// 还没填写的文字（以【待填】开头）会显示成黄色草稿框
function isDraft(text) {
  return typeof text === "string" && text.startsWith("【待填】");
}

// 入口按钮（和「项目成果」页同一套逻辑）：
//   有公网网址 → 「访问项目 ↗」按钮（新窗口打开）
//   没有网址   → 「即将上线」标签（纯文字，绝不出现死链接）
function EntryButton({ entry }) {
  if (entry) {
    return (
      <a
        href={entry}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        访问项目 ↗
      </a>
    );
  }
  return (
    <span className="rounded-full bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-500">
      即将上线
    </span>
  );
}

// 一段文字：还没填就显示黄色草稿框
function TextOrDraft({ text }) {
  if (isDraft(text)) {
    return (
      <p className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-800">
        <span className="font-semibold">这段还是草稿，等我填上真实内容：</span>
        {text.replace("【待填】", "")}
      </p>
    );
  }
  return <p className="text-sm leading-6 text-slate-600">{text}</p>;
}

// 标志性成果页（对应网址 /featured）
// 内容来自 src/data/featured.js；
// ④ 演示的入口网址、关键页、技术说明自动从关联的项目档案（projects.js）取，改一处两页同步。
export default function FeaturedPage() {
  const project = projects.find((p) => p.id === featured.projectId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">标志性成果</h1>
      <p className="mt-4 leading-7 text-slate-600">
        从这一学期做过的所有东西里，挑出我最满意的一个，按评分标准讲透：
        ① 问题、② 用户、③ 方案、④ 演示、⑤ 复盘。
      </p>

      {/* 顶部：作品名片 + 为什么选它 */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">{featured.title}</h2>
        {project?.summary && (
          <p className="mt-3 text-sm leading-6 text-slate-600">{project.summary}</p>
        )}
        <p className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 text-sm leading-6 text-slate-700">
          <span className="font-semibold text-indigo-700">为什么选它当代表作：</span>
          {featured.whyThis}
        </p>
      </div>

      {/* ① 问题 */}
      <section className="mt-6">
        <h3 className="text-sm font-bold text-slate-900">
          <span className="mr-1.5 text-indigo-600">①</span>
          问题（要解决什么）
        </h3>
        <div className="mt-2 rounded-xl border border-slate-200 bg-white p-5">
          <TextOrDraft text={featured.problem} />
        </div>
      </section>

      {/* ② 用户 */}
      <section className="mt-6">
        <h3 className="text-sm font-bold text-slate-900">
          <span className="mr-1.5 text-indigo-600">②</span>
          用户（做给谁用）
        </h3>
        <div className="mt-2 rounded-xl border border-slate-200 bg-white p-5">
          <TextOrDraft text={featured.users} />
        </div>
      </section>

      {/* ③ 方案 */}
      <section className="mt-6">
        <h3 className="text-sm font-bold text-slate-900">
          <span className="mr-1.5 text-indigo-600">③</span>
          方案（我的思路和做法）
        </h3>
        <ol className="mt-2 list-decimal space-y-1.5 rounded-xl border border-slate-200 bg-white p-5 pl-10 text-sm leading-6 text-slate-600">
          {featured.solution.map((step) => (
            <li key={step} className={isDraft(step) ? "text-amber-700" : ""}>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* ④ 演示（入口 + 关键页 + 技术说明，来自项目档案） */}
      <section className="mt-6">
        <h3 className="text-sm font-bold text-slate-900">
          <span className="mr-1.5 text-indigo-600">④</span>
          演示（能真的打开玩）
        </h3>
        <div className="mt-2 rounded-xl border border-slate-200 bg-white p-5">
          {featured.demoText && <TextOrDraft text={featured.demoText} />}

          {project ? (
          <>
          <div className="mt-3">
            <EntryButton entry={project.entry} />
          </div>

          {project.keyPages?.length > 0 && (
            <>
              <h4 className="mt-5 text-sm font-bold text-slate-900">关键页</h4>
              <ul className="mt-2 grid gap-3 sm:grid-cols-2">
                {project.keyPages.map((page) => (
                  <li
                    key={page.title}
                    className="overflow-hidden rounded-lg border border-slate-200"
                  >
                    {page.image ? (
                      <img
                        src={page.image}
                        alt={page.title}
                        className="h-auto w-full"
                      />
                    ) : (
                      <div className="bg-slate-50 px-3 py-2 text-xs text-slate-400">
                        截图待补充（以后可拍照放入 public/images/）
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {page.title}
                      </p>
                      {page.description && (
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {page.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {project.tech?.length > 0 && (
            <>
              <h4 className="mt-5 text-sm font-bold text-slate-900">技术说明</h4>
              <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-600">
                {project.tech.map((item) => (
                  <li key={item.name}>
                    <span className="font-semibold text-slate-900">
                      {item.name}
                    </span>
                    ：{item.what}
                  </li>
                ))}
              </ul>
            </>
          )}

          <Link
            href={`/projects#${project.id}`}
            className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
          >
            查看完整项目档案 →
          </Link>
          </>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
              还没有选定代表作：在{" "}
              <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-indigo-700">
                src/data/featured.js
              </code>{" "}
              里填好 projectId，这里就会自动显示访问入口、关键页和技术说明。
            </div>
          )}
        </div>
      </section>

      {/* ⑤ 复盘 */}
      <section className="mt-6">
        <h3 className="text-sm font-bold text-slate-900">
          <span className="mr-1.5 text-indigo-600">⑤</span>
          复盘（好 / 不好 / 重做怎么改）
        </h3>
        <div className="mt-2 space-y-3 rounded-xl border border-slate-200 bg-white p-5">
          {featured.review.good?.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-emerald-700">做得好的</h4>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                {featured.review.good.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {featured.review.notGood?.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-amber-700">做得不够好的</h4>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                {featured.review.notGood.map((item) => (
                  <li key={item} className={isDraft(item) ? "text-amber-700" : ""}>
                    {isDraft(item) ? item.replace("【待填】", "") + "（待填）" : item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {featured.review.redo && (
            <div>
              <h4 className="text-sm font-bold text-indigo-700">如果重做，我会这样改</h4>
              <div className="mt-1.5">
                <TextOrDraft text={featured.review.redo} />
              </div>
            </div>
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
