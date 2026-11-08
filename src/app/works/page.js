import Link from "next/link";
import WorksBoard from "@/components/works/WorksBoard";
import { works } from "@/data/works";
import { projects } from "@/data/projects";

export const metadata = { title: "阶段作业" };

export default function WorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-2 pb-12 sm:px-6 sm:pt-2 sm:pb-16 lg:-mt-32">
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
