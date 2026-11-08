// ================================================================
// 【阶段作业】页面的内容          —— 对应课程要求 3.1「阶段作业」
//
// 这里按课程顺序记录每一次作业（一条 = 一个项目阶段）。
// 每个字段的意思：
//   order     → 课程顺序（1、2、3……按这个排序展示）
//   stage     → 阶段标签（第几周 / 第几个项目）
//   title     → 作业标题
//   date      → 完成时间（记不清具体日子就写"2026年9月 · 第 1 周"这种）
//   goal      → 这次作业的要求：要学什么、要做出什么
//   whatIdid  → 我的真实过程：做了什么、做到什么程度（口语一点没关系）
//   skills    → 这次用到的技能
//   status    → 已完成 / 进行中
//   projectId → 关联到 src/data/projects.js 里的项目档案
//               （有公网网址的项目，作业卡片上会自动出现「访问项目 ↗」按钮）
//
// 以后每多一个项目，两步：
//   ① 在 projects.js 里加一份档案
//   ② 在这里加一条记录，projectId 填那份档案的 id
// ================================================================

export const works = [
  {
    order: 1,
    stage: "第 1 周",
    title: "物理弹射小游戏",
    date: "2026年9月 · 第 1 周",
    goal: "第一次课程作业：用零代码平台做一个自己想做的小网站。",
    whatIdid:
      "我先让秒哒仿照「愤怒的小鸟」的思路生成游戏原型，然后一遍遍调试细节（弹弓力度、关卡难度等），反复迭代到能顺畅玩通为止。",
    skills: ["零代码平台", "提示词", "细节调试"],
    status: "已完成",
    projectId: "project-1",
  },
  {
    order: 2,
    stage: "第 3 周",
    title: "倒计时工具网页",
    date: "2026年9月 · 第 3 周",
    goal: "课程要求：练习「提示词工程」——把需求描述清楚，让工具按提示词生成应用。",
    whatIdid:
      "我按照课程文档的流程，一步一步写提示词、生成页面、检查效果，最后得到一个可以自定义目标时间的倒计时工具。",
    skills: ["提示词工程", "按文档流程操作"],
    status: "已完成",
    projectId: "project-2",
  },
  {
    order: 3,
    stage: "第 4-6 周",
    title: "美食盲盒",
    date: "2026年9-10月 · 第 4-6 周",
    goal: "课程要求：按照完整的项目开发流程，做一个自己想做的东西。",
    whatIdid:
      "我用 Trae（AI 编程工具）辅助：写提示词、生成代码框架，自己修改细节，最后把「今天吃什么盲盒」部署上线到 Netlify。",
    skills: ["HTML/CSS/JavaScript", "Trae（AI 编程）", "Netlify 部署"],
    status: "已完成",
    projectId: "project-3",
  },
  {
    order: 4,
    stage: "第 7-8 周",
    title: "待办事项网页",
    date: "2026年11月 · 第 7-8 周",
    goal: "第 7-8 周作业：完成《个人工具开发》PDF 里指定的项目，并把工具部署到公网。",
    whatIdid:
      "用 TRAE + DeepSeek 做出添加待办、分类/优先级筛选、搜索和完成统计；待办数据存在浏览器本地，刷新页面不会丢。",
    skills: ["TRAE", "DeepSeek", "表单与筛选", "LocalStorage"],
    status: "已完成",
    projectId: "project-4",
  },
  {
    order: 5,
    stage: "第 7-8 周",
    title: "番茄钟",
    date: "2026年11月 · 第 7-8 周",
    goal: "第 7-8 周作业：完成《个人工具开发》PDF 里指定的项目，并把工具部署到公网。",
    whatIdid:
      "用 TRAE + DeepSeek 做 25 分钟专注 / 5 分钟休息的计时器，支持开始、暂停、重置、设置，以及今日/本周完成统计；设置和统计存在浏览器本地。",
    skills: ["TRAE", "DeepSeek", "计时器", "通知与音效", "LocalStorage"],
    status: "已完成",
    projectId: "project-5",
  },
  {
    order: 6,
    stage: "第 7-8 周",
    title: "Markdown 笔记",
    date: "2026年11月 · 第 7-8 周",
    goal: "第 7-8 周作业：完成《个人工具开发》PDF 里指定的项目，并把工具部署到公网。",
    whatIdid:
      "用 TRAE + DeepSeek 做三栏 Markdown 笔记：左侧笔记列表和搜索、中间编辑、右侧实时预览；新建的笔记存在浏览器本地。",
    skills: ["TRAE", "DeepSeek", "Markdown", "LocalStorage"],
    status: "已完成",
    projectId: "project-6",
  },
  {
    order: 7,
    stage: "第 7-8 周",
    title: "天气查询",
    date: "2026年11月 · 第 7-8 周",
    goal: "第 7-8 周作业：完成《个人工具开发》PDF 里指定的项目，并把工具部署到公网。",
    whatIdid:
      "用 TRAE + DeepSeek 接入 OpenWeatherMap：城市搜索带候选、定位当前城市、当前天气、未来预报和收藏城市；部署在 Netlify。",
    skills: ["TRAE", "DeepSeek", "OpenWeatherMap API", "浏览器定位"],
    status: "已完成",
    projectId: "project-7",
  },
  {
    order: 8,
    stage: "第 9-10 周",
    title: "校园食鉴",
    date: "2026年11月 · 第 9-10 周",
    goal: "作业要求：做一个带后端的项目。",
    whatIdid:
      "用 TRAE 完成校园食鉴：多校区美食红黑榜，支持注册登录、推荐店铺、综合 / 红榜 / 黑榜筛选、搜索，以及「今天吃什么」随机推荐；用户和店铺数据保存在后端。",
    skills: ["TRAE", "后端", "数据库", "登录与权限"],
    status: "已完成",
    projectId: "project-8",
  },
];
