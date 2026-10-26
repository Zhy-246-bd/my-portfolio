// ================================================================
// 【全站基本信息】
// 想改名字、简介、邮箱，只改这一个文件就行 —— 所有页面会自动跟着变，
// 不用一页一页去改。（这就是"数据和页面分开"的好处）
// ================================================================

export const site = {
  name: "张海燕", // ← TODO: 改成你的名字
  title: "我的数智编程作品集",
  tagline: "从零开始学编程 · 持续迭代记录",
  intro:
    "这是我在数智编程课上的个人作品集。这里不只放最后的成品，还记录了我每一阶段的作业、遇到问题时是怎么解决的，以及每次修改的原因和效果。",
  email: "2034267621@qq.com", // ← TODO: 改成你的邮箱
  siteUrl: "https://zhymy-portfolio.netlify.app/", // 部署后的公网网址（页脚会显示）
  siteUrlAlt: "https://my-portfolio-d8uz1evf2-zhhy.vercel.app", // 备用网址（Vercel）
  github: "", // 有 GitHub 就填网址，没有就留空字符串
  lastUpdated: "2026-10-25",
};

// 【导航栏】这里的顺序就是网页上显示的顺序。
// 以后想加一个新页面，在这里加一行就行。
export const navItems = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于我" },
  { href: "/works", label: "阶段作业" },
  { href: "/projects", label: "项目成果" },
  { href: "/process", label: "过程证据" },
  { href: "/iterations", label: "迭代记录" },
  { href: "/featured", label: "标志性成果" },
  { href: "/reflection", label: "学习复盘" },
  { href: "/credits", label: "引用声明" },
];

// 【首页的板块卡片】改这里，首页的卡片会自动更新。
export const sections = [
  {
    href: "/about",
    emoji: "👤",
    title: "个人简介与能力",
    desc: "我是谁、我的学习目标，以及我正在掌握的工具和能力。",
  },
  {
    href: "/works",
    emoji: "📚",
    title: "阶段作业",
    desc: "按课程顺序整理每一阶段的作业与完成情况。",
  },
  {
    href: "/projects",
    emoji: "🚀",
    title: "项目成果",
    desc: "我做的项目：做了什么、怎么做的、最后的效果如何。",
  },
  {
    href: "/process",
    emoji: "🔍",
    title: "过程证据",
    desc: "需求 → 原型 → 提示词 → 问题解决，完整记录每一步。",
  },
  {
    href: "/iterations",
    emoji: "🔄",
    title: "迭代记录",
    desc: "每次改了什么、为什么改、效果如何、下一步做什么。",
  },
  {
    href: "/featured",
    emoji: "⭐",
    title: "标志性成果",
    desc: "我最满意的一个代表作，单独成页详细讲清楚。",
  },
  {
    href: "/reflection",
    emoji: "🎓",
    title: "最终学习复盘",
    desc: "这一学期我学到了什么、还有哪些不足、接下来怎么走。",
  },
];
