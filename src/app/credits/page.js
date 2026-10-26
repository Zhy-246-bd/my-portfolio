import Link from "next/link";
import { credits } from "@/data/credits";

export const metadata = { title: "引用声明" };

// 还没填写的文字（以【待填】开头）会显示成黄色草稿框
function isDraft(text) {
  return typeof text === "string" && text.startsWith("【待填】");
}

// 引用声明页（对应网址 /credits）
// 内容全部来自 src/data/credits.js，如实说明模板、AI 辅助、同伴帮助等情况。
export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">引用声明</h1>
      <p className="mt-4 leading-7 text-slate-600">{credits.intro}</p>

      {credits.sections.map((section) => (
        <section key={section.title} className="mt-8">
          <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
          <ul className="mt-3 space-y-2">
            {section.items.map((item) =>
              isDraft(item) ? (
                <li
                  key={item}
                  className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-800"
                >
                  <span className="font-semibold">这段还是草稿，等我填上真实内容：</span>
                  {item.replace("【待填】", "")}
                </li>
              ) : (
                <li
                  key={item}
                  className="rounded-xl border border-slate-200 bg-white p-3.5 text-sm leading-6 text-slate-600"
                >
                  {item}
                </li>
              )
            )}
          </ul>
        </section>
      ))}

      <Link
        href="/"
        className="mt-10 inline-block text-sm font-semibold text-indigo-600 hover:underline"
      >
        ← 回到首页
      </Link>
    </div>
  );
}
