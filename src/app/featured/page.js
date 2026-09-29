import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "标志性成果" };

export default function FeaturedPage() {
  return (
    <ComingSoon
      title="标志性成果专题页"
      desc="从我做过的所有东西里，挑出最满意的一个，单独用一整页讲清楚。"
      todo={[
        "背景与目标：为什么做它、想解决什么问题",
        "过程与难点：中间卡在哪里、我试过哪些办法",
        "最终成果：截图、链接，以及别人的反馈",
        "反思：如果再做一次，我会怎么改",
      ]}
    />
  );
}
