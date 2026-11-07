import Image from "next/image";
import Link from "next/link";
import { works } from "@/data/works";
import { projects } from "@/data/projects";

export const metadata = { title: "阶段作业" };

const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));

function EntryArea({ project }) {
  if (!project) return null;

  if (project.entry) {
    return (
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href={project.entry}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          访问项目 ↗
        </a>
        <Link
          href="/projects/"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          查看项目详情 ↗
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
        即将上线
      </span>
      <Link
        href="/projects/"
        className="text-sm font-medium text-indigo-600 hover:underline"
      >
        查看项目详情 ↗
      </Link>
    </div>
  );
}

export default function WorksPage() {
  const sorted = [...works].sort((a, b) => a.order - b.order);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-emerald-200/45">
            07 STAGES / COURSEWORK
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            阶段作业
          </h1>
        </div>
        <p className="max-w-md text-sm leading-7 text-slate-600">
          按课程顺序记录每一次作业：要求是什么、我真实做了什么、做到什么程度。
          卡片可以左右排开，也可以直接进入已经上线的项目。
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <h2 className="font-semibold text-slate-900">还没有录入作业</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            打开{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-indigo-700">
              src/data/works.js
            </code>{" "}
            照着里面的注释加一条，保存后这一页就会自动出现卡片。
          </p>
        </div>
      ) : (
        <div className="mt-10 grid items-start gap-5 lg:grid-cols-2">
          {sorted.map((work, index) => {
            const project = work.projectId
              ? projectById[work.projectId]
              : undefined;
            const cover = project?.cover;

            return (
              <article
                key={work.order}
                className={
                  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-transform duration-300 hover:-translate-y-1 " +
                  (index % 2 === 1 ? "lg:mt-14" : "")
                }
              >
                {cover && (
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-slate-200 bg-slate-100">
                    <Image
                      src={cover}
                      alt={`${work.title} 页面预览`}
                      width={900}
                      height={506}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-slate-950/70 px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-white backdrop-blur">
                      STAGE {String(work.order).padStart(2, "0")}
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
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

                  <h2 className="mt-3 text-xl font-semibold text-slate-900">
                    {work.title}
                  </h2>

                  <dl className="mt-4 space-y-3 text-sm leading-6">
                    <div>
                      <dt className="font-semibold text-slate-900">作业要求</dt>
                      <dd className="mt-1 text-slate-600">{work.goal}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-900">我的过程</dt>
                      <dd className="mt-1 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 text-slate-700">
                        {work.whatIdid}
                      </dd>
                    </div>
                  </dl>

                  {work.skills?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
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

                  <div className="mt-auto">
                    <EntryArea project={project} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
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
