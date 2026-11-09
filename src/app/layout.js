import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import ModuleFrame from "@/components/studio/ModuleFrame";
import RouteWave from "@/components/studio/RouteWave";
import { site } from "@/data/site";

// 这里设置浏览器标签页上的标题，以及搜索引擎看到的描述
export const metadata = {
  title: {
    default: site.title,
    template: `%s | ${site.title}`,
  },
  description: site.intro,
};

// 根布局 = 所有页面共用的"外壳"：导航栏 + 中间内容 + 页脚。
// children 就是每个页面的内容，会被塞到中间。
export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        <link
          rel="preload"
          href="/fonts/Poppins-Black.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <RouteWave />
        <SiteChrome>
          <ModuleFrame>{children}</ModuleFrame>
        </SiteChrome>
      </body>
    </html>
  );
}
