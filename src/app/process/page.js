import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "过程证据" };

export default function ProcessPage() {
  return (
    <ComingSoon
      title="过程证据"
      desc="这一页是整份作业里最重要的一页：证明我是「想清楚再动手做」的，而不是直接抄一个结果。"
      todo={[
        "需求：我要做什么、做给谁看、要达到什么效果",
        "原型 / 草图：动手写代码之前，我先画了什么",
        "提示词记录：我怎么问 AI 的、AI 回答了什么、我在它的答案上做了哪些修改",
        "问题解决：我遇到过什么报错或困难、怎么定位的、最后怎么解决的（可以把报错原文贴上来）",
      ]}
    />
  );
}
