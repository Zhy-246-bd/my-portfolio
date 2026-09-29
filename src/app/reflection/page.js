import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "学习复盘" };

export default function ReflectionPage() {
  return (
    <ComingSoon
      title="最终学习复盘"
      desc="一学期结束后，回头看看自己从哪里走到了哪里。"
      todo={[
        "我学到了什么：知识点、工具，以及做事方法上的变化",
        "遇到的困难：最大的三个坎，以及我是怎么过去的",
        "还不足的地方：现在做不好、下学期想补上的部分",
        "下一步计划：接下来想学什么、做什么",
      ]}
    />
  );
}
