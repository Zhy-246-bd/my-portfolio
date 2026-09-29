import Link from "next/link";

// 这是一个"页面占位牌"。
// 作用：有些页面还没开始做，先用它顶一下，这样点导航不会看到报错页。
// 等到正式做那一页时，把对应 page.js 里的内容换成真的内容就行。
export default function ComingSoon({ title, desc, todo }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        这一页还在建设中
      </p>

      <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
        {title}
      </h1>

      <p className="mt-4 leading-7 text-slate-600">{desc}</p>

      {todo && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            接下来要在这页放什么
          </h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-600">
            {todo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <Link
        href="/"
        className="mt-8 inline-block text-sm font-semibold text-indigo-600 hover:underline"
      >
        ← 回到首页
      </Link>
    </div>
  );
}
