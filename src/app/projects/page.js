import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "项目成果" };

export default function ProjectsPage() {
  return (
    <ComingSoon
      title="项目成果"
      desc="这一页用来展示我做的完整项目，而不只是单次作业。"
      todo={[
        "每个项目：项目名称、要解决的问题、我负责的部分",
        "具体做法和用到的技术",
        "成果展示：截图、网址链接、可以直接体验的东西",
        "我在这个项目里最大的收获",
      ]}
    />
  );
}
