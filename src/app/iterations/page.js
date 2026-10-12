import Link from "next/link";
import { iterations } from "@/data/iterations";

export const metadata = { title: "迭代记录" };

// 每条记录要展示的 4 个要素（评分标准要求的四要素）
const FIELDS = [
  { key: "what", label: "改了什么", dot: "bg-indigo-500" },
  { key: "why", label: "为什么改", dot: "bg-amber-500" },
  { key: "effect", label: "效果如何", dot: "bg-emerald-500" },
  { key: "next", label: "下一步", dot: "bg-slate-400" },
];

// 迭代记录页（对应网址 /iterations）
// 内容全部来自 src/data/iterations.js，按 no（第几次迭代）从小到大展示：
// 最新的在最下面，和 README 里的记录顺序一致。
export default function IterationsPage() {
  const sorted = [...iterations].sort((a, b) => a.no - b.no);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">迭代记录</h1>
      <p className="mt-4 leading-7 text-slate-600">
        课程要求「网站必须持续迭代，不能期末一次性补做」。这一页就是证据：每一次改动都记下
        <span className="font-semibold text-slate-900">改了什么、为什么改、效果如何、下一步做什么</span>
        ，每条都带日期和版本号，可以和 Git 的提交时间戳互相印证。
      </p>

      {sorted.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <h2 className="font-semibold text-slate-900">还没有迭代记录</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            打开{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-indigo-700">
              src/data/iterations.js
            </code>{" "}
            照着里面的注释加一条，保存后这一页就会自动出现卡片，不需要改这里的代码。
          </p>
        </div>
      ) : (
        <>
          <p className="mt-4 text-sm text-slate-500">
            共 {sorted.length} 次迭代 · {sorted[0].date} 开始 · 最新一次在页面最下面
          </p>

          <ol className="mt-8">
            {sorted.map((item, index) => (
              <li
                key={item.no}
                className={
                  "relative border-l-2 border-slate-200 pl-6 " +
                  (index === sorted.length - 1 ? "pb-0" : "pb-8")
                }
              >
                {/* 时间线上的版本圆点 */}
                <span className="absolute top-1.5 -left-[13px] rounded-full bg-indigo-500 px-1.5 py-0.5 text-[10px] font-bold text-white ring-4 ring-slate-50">
                  {item.version}
                </span>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-indigo-600">
                      第 {item.no} 次迭代
                    </span>
                    <span className="rounded-full bg-slate-900 px-2.5 py-0.5 font-semibold text-white">
                      {item.version}
                    </span>
                    <span className="text-slate-400">{item.date}</span>
                  </div>

                  <h2 className="mt-2 text-lg font-semibold text-slate-900">
                    {item.title}
                  </h2>

                  <dl className="mt-3 space-y-2.5 text-sm leading-6">
                    {FIELDS.map((field) => (
                      <div key={field.key}>
                        <dt className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <span className={`h-1.5 w-1.5 rounded-full ${field.dot}`} />
                          {field.label}
                        </dt>
                        <dd
                          className={
                            "mt-0.5 text-slate-600 " +
                            (field.key === "next"
                              ? "rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 text-slate-700"
                              : "")
                          }
                        >
                          {item[field.key]}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </li>
            ))}
          </ol>
        </>
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
