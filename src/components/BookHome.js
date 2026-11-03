"use client"; // 点击开合的交互必须在浏览器里运行

import { useState } from "react";

// 极淡噪点：用 SVG 滤镜给桌面做出深灰色的哑光颗粒感，不用任何图片文件
function noiseUrl(opacity) {
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='${opacity}'/%3E%3C/svg%3E")`;
}

// 首页：一本直接放在深灰哑光桌面上的活页本（3D 翻书魔术）。
// 封面照片 cover-cropped.jpg 被切成左右两半：
//   左侧 12.5% 是"固定层"（金属活页圈），永远不动、永远在最上面；
//   右侧 87.5% 是"翻转层"（牛皮纸页），点击后绕左边缘 3D 翻开（约 0.8 秒）。
// 两半用 background-size / background-position 的数学关系无缝拼接，
// 合上时看起来就是一张完整的照片，翻开时像掀门帘一样露出下面的内页。
// 12.5% 是实测出来的：照片里金属圈最右到图片的 x250（960px 的 12.5%），
// 这条缝正好把所有金属环都留在固定层里，右边纸页上的东西全部跟着翻走。
export default function BookHome() {
  const [isOpen, setIsOpen] = useState(false); // 书是合着还是翻开

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10"
      style={{
        // 深灰哑光桌面：中间略亮、四周更暗的灯光 + 一层极淡噪点
        backgroundImage:
          `${noiseUrl(0.07)}, ` +
          "radial-gradient(ellipse at 50% 42%, #373737 0%, #2a2a2a 55%, #1c1c1c 100%)",
      }}
    >
      {/* 3D 场景：perspective 让旋转有"近大远小"的立体感 */}
      <div className="relative [perspective:2200px]">
        {/* 书下面的影子，让书像真的放在桌面上 */}
        <div className="absolute -bottom-9 left-1/2 h-7 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/60 blur-lg" />

        <div
          className="relative w-[min(80vw,430px,41vh)]"
          style={{ aspectRatio: "960 / 1220" }}
        >
          {/* 内页：翻开后露出的褶皱纸，只占右侧 87.5%（和翻转层完全重合），
              翻开的封面会绕到书左侧，金属圈那边（左侧 12.5%）一直盖着不动。
              翻开状态下点击内页可以把书合上。 */}
          <div
            className="absolute bottom-0 left-[12.5%] right-0 top-0 cursor-pointer"
            onClick={() => isOpen && setIsOpen(false)}
            style={{
              backgroundImage: "url('/images/paper-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow:
                "inset 0 0 44px rgba(80,55,25,0.28), inset 0 0 6px rgba(70,45,18,0.25)",
            }}
          >
            {/* 边角装饰（从 decor.png 里裁下来的真实素材，中间留白不放任何内容）：
                左上=和纸胶带，左下=旧信纸，右下=复古花纹边框 */}
            <div
              className="absolute left-[7%] top-[7%] w-[38%] rotate-[-8deg]"
              style={{
                aspectRatio: "342 / 99",
                backgroundImage: "url('/images/decor-tape.png')",
                backgroundSize: "cover",
              }}
            />
            <div
              className="absolute bottom-[8%] left-[6%] w-[34%] rotate-[5deg]"
              style={{
                aspectRatio: "254 / 227",
                backgroundImage: "url('/images/decor-letter.png')",
                backgroundSize: "cover",
              }}
            />
            <div
              className="absolute bottom-[7%] right-[8%] w-[32%] rotate-[-5deg]"
              style={{
                aspectRatio: "204 / 207",
                backgroundImage: "url('/images/decor-frame.png')",
                backgroundSize: "cover",
              }}
            />
          </div>

          {/* 翻转层（右侧 87.5% 的牛皮纸页）：绕着左边缘旋转 -180 度向左翻开。
              点击它切换开合，悬浮时显示手型光标。 */}
          <div
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            aria-label={isOpen ? "合上封面" : "打开封面"}
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsOpen(!isOpen);
              }
            }}
            className={
              "absolute bottom-0 left-[12.5%] right-0 top-0 z-10 origin-left cursor-pointer [transform-style:preserve-3d] transition-transform duration-[800ms] ease-in-out " +
              (isOpen ? "[transform:rotateY(-180deg)]" : "")
            }
          >
            {/* 正面（合上时看到的一面）：照片右半张，background-position 取最右边。
                背景尺寸 114.2857%（=8/7）保证和左侧固定层按同一比例放大，
                接缝处两半的照片严丝合缝。 */}
            <div
              className="absolute inset-0 [backface-visibility:hidden]"
              style={{
                backgroundColor: "#6b5338", // 兜底：万一图片没加载，显示牛皮纸色
                backgroundImage: "url('/images/cover-cropped.jpg')",
                backgroundSize: "114.2857% auto",
                backgroundPosition: "right center",
                boxShadow: "inset 0 0 30px rgba(60,40,20,0.35)",
              }}
            />

            {/* 背面（翻开后看到的封面内侧）：压暗的牛皮纸衬里 */}
            <div
              className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
              style={{
                backgroundColor: "#52402d",
                boxShadow: "inset 0 0 40px rgba(18,10,4,0.55)",
              }}
            />
          </div>

          {/* 固定层（左侧 12.5% 的金属活页圈）：绝对不参与旋转、始终固定、
              z-index 最高。背景尺寸 800% 保证和翻转层同比例，取最左边。 */}
          <div
            className="absolute bottom-0 left-0 top-0 z-20 w-[12.5%]"
            aria-hidden="true"
            style={{
              backgroundImage: "url('/images/cover-cropped.jpg')",
              backgroundSize: "800% auto",
              backgroundPosition: "left center",
            }}
          />
        </div>
      </div>
    </div>
  );
}
