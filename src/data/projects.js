// ================================================================
// 【项目成果】页面的内容          —— 对应课程要求 3.1「项目成果」
//
// 每个项目是一份完整的"档案"，评分标准要求的 4 个要素都在这里：
//   ① 功能     → features   （这个项目能做什么）
//   ② 入口     → entry      （公网网址；没有就留空字符串 ""，
//                             页面会自动显示「即将上线」标签，不会出现死链接）
//   ③ 关键页   → keyPages   （最重要的页面/画面：文字说明 + 以后可补截图）
//   ④ 技术说明 → tech       （用了什么技术、各自负责什么）
//
// 另外：
//   id      → 唯一编号，被 src/data/works.js 引用（阶段作业卡片靠它找到这里）
//   learned → 我的收获；还写着【待填】的话，页面会显示成黄色草稿框
//
// ⚠️ 名称、功能、关键页是 AI 根据我提供的网址抓取页面后草拟的，
//    请逐条核对，不对的直接改。
// ================================================================

export const projects = [
  {
    id: "project-1",
    name: "物理弹射小游戏",
    cover: "/images/project-1.webp",
    summary:
      "弹弓发射小鸟，利用重力与碰撞摧毁建筑物，完成多关卡挑战并获得星级评价。",
    role: "独立完成",

    // ① 功能
    features: [
      "弹弓发射：按住拖拽调整角度和力度",
      "物理效果：重力、碰撞、倒塌都是实时计算的",
      "多关卡挑战：完成一关解锁下一关",
      "星级评价：按摧毁程度获得 1~3 星",
    ],

    // ② 入口（公网网址）
    entry: "https://app-e8w92xyw3qbm.miaoda.online/",

    // ③ 关键页（截图以后补进 image，先留空）
    keyPages: [
      {
        title: "游戏主界面",
        description: "弹弓在左、建筑在右，上方显示关卡与得分",
        image: "",
      },
      {
        title: "结算界面",
        description: "通关后显示星级评价和「下一关」按钮",
        image: "",
      },
    ],

    // ④ 技术说明（如实说明 AI 辅助）
    tech: [
      {
        name: "秒哒（低代码/AI 生成平台）",
        what: "按提示词生成游戏页面、物理效果与关卡，一键发布成公网网址",
      },
      {
        name: "AI 辅助",
        what: "参考 AI 的提示词思路，帮助把需求描述清楚",
      },
    ],

    learned: "做完这个项目，我最大的收获是不懂编程的小白也可以利用现有的工具做出一个项目",
  },
  {
    id: "project-2",
    name: "倒计时工具网页",
    cover: "/images/project-2.webp",
    summary:
      "自定义目标日期时间，以天、时、分、秒实时展示剩余时间，到期弹窗提醒，刷新后状态自动恢复。",
    role: "独立完成",

    features: [
      "自定义目标：自己设置目标日期和时间",
      "实时倒计时：天、时、分、秒大字实时更新",
      "到期提醒：时间一到弹窗提醒",
      "状态保存：用本地存储实现刷新页面后自动恢复",
    ],

    entry: "https://app-eegp5tm99wxt.miaoda.online",

    keyPages: [
      {
        title: "倒计时主界面",
        description: "大字实时显示剩余的天、时、分、秒",
        image: "",
      },
      {
        title: "目标设置",
        description: "选择目标日期和时间，保存后开始倒计时",
        image: "",
      },
    ],

    tech: [
      {
        name: "秒哒（低代码/AI 生成平台）",
        what: "按提示词生成倒计时页面与本地存储逻辑，一键发布",
      },
      {
        name: "AI 辅助",
        what: "参考 AI 的提示词思路，帮助把需求描述清楚",
      },
    ],

    learned: "做完这个项目，我最大的收获是做一个市面上普遍存在的项目很难做出更新的东西",
  },
  {
    id: "project-3",
    name: "美食盲盒",
    cover: "/images/project-3.webp",
    summary:
      "9 张卡片翻牌抽取今天吃什么，带抽取权重与结果展示，解决「今天吃什么」的选择困难。",
    role: "独立完成",

    features: [
      "9 张卡片翻牌：点开一张卡片随机抽一道美食",
      "抽取权重：不同的美食被抽中的概率不一样",
      "结果展示：抽中的美食醒目地显示出来",
      "再来一轮：可以重新开始新一轮抽取",
    ],

    entry: "https://eatwhat-blindbox.netlify.app/",

    keyPages: [
      {
        title: "翻牌主界面",
        description: "9 张卡片随机排列，点击开始抽取",
        image: "",
      },
      {
        title: "抽中结果",
        description: "展示抽中的美食，提供再来一轮按钮",
        image: "",
      },
    ],

    // 这个项目用 Trae（AI 编程工具）辅助，技术说明如实分开写
    tech: [
      {
        name: "HTML + CSS + JavaScript",
        what: "网页的技术基础：页面结构、翻牌动画和抽奖逻辑",
      },
      {
        name: "Trae（AI 编程工具）",
        what: "在 Trae 里用提示词生成代码，自己修改细节",
      },
      {
        name: "Netlify",
        what: "免费部署，生成公网网址",
      },
    ],

    learned: "做完这个项目，我最大的收获是与编程工具的交流确实需要严格依照提示词工程来，想把我脑子里的想法做出来需要很多的交流",
  },
  {
    id: "project-4",
    name: "待办事项网页",
    cover: "/images/project-todo.webp",
    summary:
      "把任务记下来，按分类、优先级和截止日期管理，并用底部统计看出完成情况。",
    role: "独立完成",

    features: [
      "添加待办：标题、描述、分类（工作 / 生活 / 学习 / 其他）、优先级（低 / 中 / 高）、截止日期",
      "筛选与搜索：按分类、优先级筛选，按标题或描述搜索",
      "完成状态：勾选完成 / 未完成，底部实时统计总任务、已完成、未完成",
      "本地保存：待办存在浏览器 LocalStorage，刷新页面不丢",
    ],

    entry: "https://nodelaygogo.netlify.app/",

    keyPages: [
      {
        title: "添加待办",
        description: "标题、描述、分类、优先级、截止日期，以及空状态提示",
        image: "/images/project-todo.webp",
      },
      {
        title: "待办列表与统计",
        description: "按分类和优先级筛选、搜索，底部显示总任务 / 已完成 / 未完成",
        image: "",
      },
    ],

    tech: [
      {
        name: "TRAE",
        what: "AI 编程工具，按提示词生成页面和交互逻辑",
      },
      {
        name: "DeepSeek",
        what: "辅助梳理需求、生成和修改代码",
      },
      {
        name: "LocalStorage",
        what: "把待办存在浏览器本地，刷新后自动恢复",
      },
      {
        name: "Netlify",
        what: "免费部署，生成公网网址",
      },
    ],

    learned: "",
  },
  {
    id: "project-5",
    name: "番茄钟",
    cover: "/images/project-pomodoro.webp",
    summary:
      "25 分钟专注 + 5 分钟休息的计时器，带今日 / 本周完成统计和可调设置。",
    role: "独立完成",

    features: [
      "专注 / 休息切换：默认 25 分钟专注、5 分钟休息",
      "开始、暂停、重置：圆环进度随剩余时间变化",
      "设置：可以调整专注和休息时长",
      "统计：今日已完成、本周已完成，数据存在浏览器本地",
      "提醒：计时结束播放提示音，并支持系统通知",
    ],

    entry: "https://tomatoclocks.netlify.app/",

    keyPages: [
      {
        title: "计时主界面",
        description: "圆环倒计时、开始 / 暂停按钮、今日和本周统计",
        image: "/images/project-pomodoro.webp",
      },
      {
        title: "设置与统计",
        description: "调整专注 / 休息时长，查看按天记录的完成数",
        image: "",
      },
    ],

    tech: [
      {
        name: "TRAE",
        what: "AI 编程工具，按提示词生成页面和计时逻辑",
      },
      {
        name: "DeepSeek",
        what: "辅助梳理需求、生成和修改代码",
      },
      {
        name: "Web Notifications + 音频",
        what: "计时结束时播放提示音，并在允许时发系统通知",
      },
      {
        name: "LocalStorage",
        what: "保存设置和每日专注记录，刷新后还在",
      },
      {
        name: "Netlify",
        what: "免费部署，生成公网网址",
      },
    ],

    learned: "",
  },
  {
    id: "project-6",
    name: "Markdown 笔记",
    cover: "/images/project-markdown.webp",
    summary:
      "三栏 Markdown 笔记：左侧笔记列表，中间编辑，右侧实时预览。",
    role: "独立完成",

    features: [
      "新建 / 删除笔记：左侧列表管理，支持按标题搜索",
      "Markdown 编辑：中间输入框支持标题、列表、加粗等语法",
      "实时预览：右侧同步渲染 Markdown 结果",
      "本地保存：笔记存在浏览器 LocalStorage，刷新不丢",
    ],

    entry: "https://markdownnotesss.netlify.app/",

    keyPages: [
      {
        title: "笔记列表与编辑",
        description: "左侧新建 / 搜索，中间输入 Markdown，右侧预览",
        image: "/images/project-markdown.webp",
      },
      {
        title: "实时预览",
        description: "输入标题、列表等语法后，右侧同步显示渲染结果",
        image: "",
      },
    ],

    tech: [
      {
        name: "TRAE",
        what: "AI 编程工具，按提示词生成三栏页面和编辑逻辑",
      },
      {
        name: "DeepSeek",
        what: "辅助梳理需求、生成和修改代码",
      },
      {
        name: "Markdown 渲染",
        what: "把输入的 Markdown 语法实时转换成右侧预览",
      },
      {
        name: "LocalStorage",
        what: "把笔记以数组形式存在浏览器本地",
      },
      {
        name: "Netlify",
        what: "免费部署，生成公网网址",
      },
    ],

    learned: "",
  },
  {
    id: "project-7",
    name: "天气查询",
    cover: "/images/project-weather.webp",
    summary:
      "输入城市或定位，查看当前天气和未来预报；数据来自 OpenWeatherMap。",
    role: "独立完成",

    features: [
      "城市搜索：输入城市 / 区县，带防抖候选列表",
      "定位：用浏览器定位按经纬度查询当前位置天气",
      "当前天气：温度、体感温度、湿度、风速和天气图标",
      "未来预报：把 3 小时间隔的数据聚合成按天展示",
      "收藏城市：把常看的城市存到浏览器本地",
    ],

    // 线上已在 Netlify 配置 VITE_WEATHER_API_KEY 并重新部署，天气查询可以正常返回。
    entry: "https://lovely-cascaron-3db639.netlify.app/",

    keyPages: [
      {
        title: "搜索与当前天气",
        description: "城市候选、定位按钮，以及温度 / 体感 / 湿度 / 风速",
        image: "/images/project-weather.webp",
      },
      {
        title: "未来预报与收藏",
        description: "按天展示未来预报，收藏城市可以一键切换",
        image: "",
      },
    ],

    tech: [
      {
        name: "TRAE",
        what: "AI 编程工具，按提示词生成页面和交互",
      },
      {
        name: "DeepSeek",
        what: "辅助梳理需求、生成和修改代码",
      },
      {
        name: "OpenWeatherMap API",
        what: "提供当前天气、城市候选和未来预报数据",
      },
      {
        name: "浏览器 Geolocation",
        what: "获取当前位置的经纬度，再按坐标查询天气",
      },
      {
        name: "Netlify 环境变量",
        what: "线上部署在 Netlify 配置 VITE_WEATHER_API_KEY，构建时注入，天气查询才能返回数据",
      },
    ],

    learned: "",
  },
  {
    id: "project-8",
    name: "校园食鉴",
    cover: "/images/project-8.webp",
    summary:
      "多校区美食红黑榜：同学可以注册登录、推荐店铺、按红榜 / 黑榜筛选，还能随机决定今天吃什么；用户和店铺数据由后端保存。",
    role: "独立完成",

    features: [
      "注册 / 登录：账号数据保存在后端，不只存在浏览器本地",
      "推荐店铺：提交校区、店名、菜品和种草 / 避雷理由",
      "红黑榜筛选：综合、红榜种草、黑榜避雷",
      "搜索与校区筛选：按菜名、学校快速查找",
      "今天吃什么：从店铺里随机推荐一家，解决选择困难",
    ],

    entry: "https://campus-food-5tr.pages.dev/",

    keyPages: [
      {
        title: "首页与美食筛选",
        description: "顶部是搜索、校区和红黑榜分类，下面是店铺卡片与随机推荐入口",
        image: "/images/project-8.webp",
      },
      {
        title: "登录 / 注册",
        description: "账号数据保存在后端，登录后才能推荐新店和参与红黑榜",
        image: "",
      },
    ],

    tech: [
      {
        name: "TRAE",
        what: "AI 编程工具，用它生成和修改前端页面、后端接口与数据库逻辑",
      },
      {
        name: "后端接口",
        what: "处理注册登录、店铺提交、筛选查询和随机推荐，不再只依赖浏览器本地存储",
      },
      {
        name: "数据库",
        what: "保存用户账号、店铺信息和红黑榜评价，刷新或换设备后数据仍然存在",
      },
      {
        name: "Cloudflare Pages",
        what: "部署前端页面和线上访问地址",
      },
    ],

    learned: "第一次把前端、后端和数据库真正连起来，理解了「页面能用」和「数据能存住」是两件不同的事。",
  },
];
