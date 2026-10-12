/** @type {import('next').NextConfig} */
const nextConfig = {
  // 部署用：构建时把整个网站打包成纯静态文件（生成 out 文件夹），
  // 任何静态托管（Netlify 拖拽上传等）都能直接放上去，不需要服务器
  output: "export",

  // 网址统一带斜杠结尾（如 /about/），在任意静态托管上直接访问都不会 404
  trailingSlash: true,

  images: {
    // 静态导出不支持图片自动优化，关掉即可；以后放截图不受影响
    unoptimized: true,
  },
};

export default nextConfig;
