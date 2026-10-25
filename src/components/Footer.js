import { site } from "@/data/site";

// 页脚：所有页面共用（在 src/app/layout.js 里引用了一次）
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-500 sm:px-6">
        <h2 className="font-semibold text-slate-800">关于 AI 辅助的说明</h2>
        <p className="mt-2 leading-6">
          本网站由我本人规划、编写和修改，过程中使用了 AI
          编程助手（Claude）辅助。AI 参与较多的部分，我都记录在「过程证据」页的提示词记录里，并写清了我自己做了哪些调整。
        </p>
        {site.siteUrl && (
          <p className="mt-3 leading-6">
            本站已上线：{" "}
            <a
              href={site.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 hover:underline"
            >
              {site.siteUrl}
            </a>
            {site.siteUrlAlt && (
              <>
                {" · "}备用网址：{" "}
                <a
                  href={site.siteUrlAlt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-600 hover:underline"
                >
                  {site.siteUrlAlt}
                </a>
              </>
            )}
          </p>
        )}
        <p className="mt-4 text-xs text-slate-400">
          © {new Date().getFullYear()} {site.name} · 最近更新：{site.lastUpdated}
        </p>
      </div>
    </footer>
  );
}
