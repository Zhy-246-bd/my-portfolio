import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "关于我" };

export default function AboutPage() {
  return (
    <ComingSoon
      title="个人简介与能力"
      desc="这一页用来介绍我是谁、我的学习目标和现在的能力水平。"
      todo={[
        "一段自我介绍：我的专业、年级、为什么学编程",
        "能力清单：会用哪些工具和语言，各自到什么程度（可以分「熟练 / 会用 / 学习中」）",
        "我这学期的学习目标，以及希望达到的效果",
      ]}
    />
  );
}
