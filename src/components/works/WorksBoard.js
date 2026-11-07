"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

function EntryArea({ project }) {
  if (!project) return null;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      {project.entry ? (
        <a
          href={project.entry}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          访问项目 ↗
        </a>
      ) : (
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
          即将上线
        </span>
      )}
    </div>
  );
}

export default function WorksBoard({ works, projects }) {
  const [selected, setSelected] = useState(null);
  const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));
  const sorted = [...works].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (!selected) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  const selectedProject = selected?.projectId
    ? projectById[selected.projectId]
    : undefined;

  return (
    <>
      <div className="mt-28 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {sorted.map((work) => {
          const project = work.projectId
            ? projectById[work.projectId]
            : undefined;
          return (
            <button
              key={work.order}
              type="button"
              onClick={() => setSelected(work)}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-[rgba(7,13,12,0.62)] p-3 text-left backdrop-blur-[14px] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200/40 hover:bg-[rgba(12,24,22,0.9)] hover:shadow-[0_14px_34px_rgba(0,0,0,0.35),0_0_24px_rgba(111,203,179,0.12)] active:translate-y-0 active:scale-[0.99]"
              aria-label={`查看作业：${work.title}`}
            >
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40 transition-colors duration-300 group-hover:border-emerald-200/30">
                {project?.cover ? (
                  <Image
                    src={project.cover}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center font-mono text-[10px] text-white/40">
                    {String(work.order).padStart(2, "0")}
                  </span>
                )}
              </span>

              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-100 transition-colors duration-300 group-hover:text-white">
                  {work.title}
                </span>
                <span className="mt-1 flex items-center gap-2 font-mono text-[10px] tracking-[0.06em] text-slate-500">
                  <span className="shrink-0 rounded bg-white/[0.06] px-1.5 py-0.5 text-emerald-200/60">
                    {work.stage}
                  </span>
                  <span className="truncate">{work.date}</span>
                </span>
              </span>

              <span
                aria-hidden="true"
                className="ml-auto shrink-0 text-sm text-emerald-200/0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-emerald-200/70"
              >
                ↗
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        点击任意一张卡片，查看这次作业的完整介绍。
      </p>

      {selected && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${selected.title} 作业详情`}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setSelected(null)}
            aria-label="关闭详情"
          />

          <div className="relative z-10 max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/15 bg-[#07100d] p-5 shadow-2xl sm:p-7">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-black/50 text-lg text-white/70 transition-colors hover:border-white/30 hover:text-white"
              aria-label="关闭"
            >
              ×
            </button>

            {selectedProject?.cover && (
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10">
                <Image
                  src={selectedProject.cover}
                  alt={`${selected.title} 页面预览`}
                  fill
                  sizes="(max-width: 768px) 90vw, 700px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-white/[0.08] px-3 py-1 font-mono text-emerald-200/70">
                {selected.stage}
              </span>
              <span className="text-slate-400">{selected.date}</span>
              {selected.status && (
                <span className="rounded-full bg-emerald-200/10 px-3 py-1 text-emerald-200/80">
                  {selected.status}
                </span>
              )}
            </div>

            <h2 className="mt-3 pr-10 text-2xl font-semibold text-white">
              {selected.title}
            </h2>

            <dl className="mt-5 space-y-4 text-sm leading-7">
              <div>
                <dt className="font-semibold text-slate-100">作业要求</dt>
                <dd className="mt-1 text-slate-400">{selected.goal}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-100">我的过程</dt>
                <dd className="mt-1 rounded-lg border border-emerald-200/10 bg-emerald-200/[0.05] p-4 text-slate-300">
                  {selected.whatIdid}
                </dd>
              </div>
            </dl>

            {selected.skills?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {selected.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded bg-white/[0.06] px-2.5 py-1 text-xs text-slate-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <EntryArea project={selectedProject} />
          </div>
        </div>
      )}
    </>
  );
}
