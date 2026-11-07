import Link from "next/link";
import WorksBoard from "@/components/works/WorksBoard";
import { works } from "@/data/works";
import { projects } from "@/data/projects";

export const metadata = { title: "阶段作业" };

export default function WorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-2 pb-12 sm:px-6 sm:pt-2 sm:pb-16 lg:-mt-40">
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
          按课程顺序记录每一次作业。先看卡片标题，点进去再看这次的要求、过程和结果。
        </p>
      </div>

      <WorksBoard works={works} projects={projects} />

      <Link
        href="/"
        className="mt-10 inline-block text-sm font-semibold text-indigo-600 hover:underline"
      >
        ← 回到首页
      </Link>
    </div>
  );
}
