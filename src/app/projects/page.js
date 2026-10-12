import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";

export const metadata = { title: "项目成果" };

// 还没填写的文字（以【待填】开头）会显示成黄色草稿框
function isDraft(text) {
  return typeof text === "string" && text.startsWith("【待填】");
}

// 入口按钮：
//   有公网网址 → 醒目的「访问项目 ↗」大按钮（新窗口打开）
//   没有网址   → 灰色「即将上线」标签（纯文字，不是链接，绝不会出现死链接）
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

// 项目成果页（对应网址 /projects）
// 内容全部来自 src/data/projects.js，每份档案按评分标准的 4 个要素分区展示。
// 每个档案卡片带 id 锚点，「阶段作业」页的「查看项目详情 →」会跳到这里。
export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">项目成果</h1>
      <p className="mt-4 leading-7 text-slate-600">
        每个项目按评分标准展示 4 个要素：① 功能、② 入口、③ 关键页、④
        技术说明。点「访问项目」按钮会在新窗口打开我已经上线的东西。
      </p>

      {projects.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <h2 className="font-semibold text-slate-900">还没有录入项目</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            打开{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-indigo-700">
              src/data/projects.js
            </code>{" "}
            照着里面的注释加一份档案，保存后这一页就会自动出现卡片，不需要改这里的代码。
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-6">
          {projects.map((project) => (
            <li
              key={project.id}
              id={project.id}
              className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {project.name}
              </h2>
              {project.role && (
                <p className="mt-1 text-sm text-slate-500">
                  我的角色：{project.role}
                </p>
              )}

              {project.summary && (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {project.summary}
                </p>
              )}

              {/* ① 功能 */}
              <section className="mt-5">
                <h3 className="text-sm font-bold text-slate-900">
                  <span className="mr-1.5 text-indigo-600">①</span>
                  功能（能做什么）
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                  {project.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </section>

              {/* ② 入口 */}
              <section className="mt-5">
                <h3 className="text-sm font-bold text-slate-900">
                  <span className="mr-1.5 text-indigo-600">②</span>
                  入口（在哪里能打开）
                </h3>
                <div className="mt-2">
                  <EntryButton entry={project.entry} />
                </div>
              </section>

              {/* ③ 关键页 */}
              {project.keyPages?.length > 0 && (
                <section className="mt-5">
                  <h3 className="text-sm font-bold text-slate-900">
                    <span className="mr-1.5 text-indigo-600">③</span>
                    关键页
                  </h3>
                  <ul className="mt-2 grid gap-3 sm:grid-cols-2">
                    {project.keyPages.map((page) => (
                      <li
                        key={page.title}
                        className="overflow-hidden rounded-lg border border-slate-200"
                      >
                        {page.image ? (
                          <Image
                            src={page.image}
                            alt={page.title}
                            width={1200}
                            height={800}
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
                </section>
              )}

              {/* ④ 技术说明 */}
              {project.tech?.length > 0 && (
                <section className="mt-5">
                  <h3 className="text-sm font-bold text-slate-900">
                    <span className="mr-1.5 text-indigo-600">④</span>
                    技术说明
                  </h3>
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
                </section>
              )}

              {/* 我的收获（还没写就显示黄色草稿框） */}
              {project.learned && (
                <section className="mt-5">
                  <h3 className="text-sm font-bold text-slate-900">我的收获</h3>
                  {isDraft(project.learned) ? (
                    <p className="mt-2 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-800">
                      <span className="font-semibold">
                        这段还是草稿，等我填上真实内容：
                      </span>
                      {project.learned.replace("【待填】", "")}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {project.learned}
                    </p>
                  )}
                </section>
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
