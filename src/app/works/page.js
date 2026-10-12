import Link from "next/link";
import { works } from "@/data/works";
import { projects } from "@/data/projects";

export const metadata = { title: "阶段作业" };

// 把项目档案按 id 排好，作业卡片要显示「访问项目」入口时从这里查
const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));

// 入口区域：
//   有公网网址 → 醒目的「访问项目 ↗」按钮（新窗口打开）
//   没有网址   → 灰色「即将上线」标签（纯文字，不是链接，绝不会出现死链接）
function EntryArea({ project }) {
  if (!project) return null;

  if (project.entry) {
    return (
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a
          href={project.entry}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          访问项目 ↗
        </a>
        <Link
          href={`/projects#${project.id}`}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          查看项目详情 →
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
        即将上线
      </span>
      <Link
        href={`/projects#${project.id}`}
        className="text-sm font-medium text-indigo-600 hover:underline"
      >
        查看项目详情 →
      </Link>
    </div>
  );
}

// 阶段作业页（对应网址 /works）
// 内容全部来自 src/data/works.js，按 order（课程顺序）自动排序展示。
export default function WorksPage() {
  const sorted = [...works].sort((a, b) => a.order - b.order);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">阶段作业</h1>
      <p className="mt-4 leading-7 text-slate-600">
        按课程顺序记录每一次作业：这次的要求是什么、我真实做了什么、做到什么程度。
        卡片上的按钮可以直接访问我已经上线的东西。
      </p>

      {works.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <h2 className="font-semibold text-slate-900">还没有录入作业</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            打开{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-indigo-700">
              src/data/works.js
            </code>{" "}
            照着里面的注释加一条，保存后这一页就会自动出现卡片，不需要改这里的代码。
          </p>
        </div>
      ) : (
        <ol className="mt-8">
          {sorted.map((work, index) => {
            const project = work.projectId ? projectById[work.projectId] : undefined;
            return (
              <li
                key={work.order}
                className={
                  "relative border-l-2 border-slate-200 pl-6 " +
                  (index === sorted.length - 1 ? "pb-0" : "pb-8")
                }
              >
                {/* 时间线上的序号圆点 */}
                <span className="absolute top-1.5 -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white ring-4 ring-slate-50">
                  {work.order}
                </span>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-slate-900 px-2.5 py-1 font-semibold text-white">
                      {work.stage}
                    </span>
                    <span className="text-slate-400">{work.date}</span>
                    {work.status && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                        {work.status}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-3 text-lg font-semibold text-slate-900">
                    {work.title}
                  </h2>

                  <dl className="mt-3 space-y-2.5 text-sm leading-6">
                    <div>
                      <dt className="font-semibold text-slate-900">作业要求</dt>
                      <dd className="mt-0.5 text-slate-600">{work.goal}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">我的过程</dt>
                      <dd className="mt-0.5 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 text-slate-700">
                        {work.whatIdid}
                      </dd>
                    </div>
                  </dl>

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

                  <EntryArea project={project} />
                </div>
              </li>
            );
          })}
        </ol>
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
