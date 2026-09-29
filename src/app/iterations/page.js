import ComingSoon from "@/components/ComingSoon";

export const metadata = { title: "迭代记录" };

export default function IterationsPage() {
  return (
    <ComingSoon
      title="迭代记录"
      desc="课程要求网站必须持续迭代，不能期末一次性补做。这一页就是证据：每一次改动都按四步记录下来。"
      todo={[
        "改了什么：这次具体动了哪个页面、哪个部分",
        "为什么改：是发现了问题，还是想让效果更好",
        "效果如何：改完之后有什么变化，可以放前后对比截图",
        "下一步：接下来还打算改什么",
      ]}
    />
  );
}
