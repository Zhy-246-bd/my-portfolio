import Link from "next/link";
import { works } from "@/data/works";

export const metadata = { title: "阶段作业" };

// 阶段作业页（对应网址 /works ）
// 这一页会自动显示 src/data/works.js 里录入的作业，不用改这里的代码。
export default function WorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">阶段作业</h1>
      <p className="mt-4 leading-7 text-slate-600">
        按课程顺序记录每一阶段的作业：这一阶段学了什么、我做了什么、完成到什么程度、还有哪些地方要改。
      </p>

      {works.length === 0 ? (
        // 还没录入作业时，显示这段提示
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <h2 className="font-semibold text-slate-900">还没有录入作业</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            打开{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-indigo-700">
              src/data/works.js
            </code>{" "}
            ，照着里面的示例往数组里加一条，保存后这一页就会自动出现卡片，
            完全不需要改这个页面的代码。
          </p>
        </div>
      ) : (
        // 有作业时，一条作业显示成一张卡片
        <ul className="mt-8 space-y-4">
          {works.map((work) => (
            <li
              key={work.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700">
                  {work.stage}
                </span>
                <span className="text-slate-400">{work.date}</span>
                {work.status && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                    {work.status}
                  </span>
                )}
              </div>

              <h2 className="mt-3 font-semibold text-slate-900">{work.title}</h2>

              {work.summary && (
                <p className="mt-1.5 text-sm leading-6 text-slate-600">
                  {work.summary}
                </p>
              )}

              {work.skills?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {work.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {work.link && (
                <a
                  href={work.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
                >
                  查看作品 →
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/"
        className="mt-10 inline-block text-sm font-semibold text-indigo-600 hover:underline"
      >
        ← 回到首页
      </Link>
    </div>
  );
}
