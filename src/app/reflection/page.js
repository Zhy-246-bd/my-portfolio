import ReflectionStory from "@/components/reflection/ReflectionStory";
import { reflection } from "@/data/reflection";

export const metadata = { title: "学习复盘" };

export default function ReflectionPage() {
  return <ReflectionStory reflection={reflection} />;
}
