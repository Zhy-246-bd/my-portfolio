import IterationsTimeline from "@/components/iterations/IterationsTimeline";
import { iterations as baseIterations } from "@/data/iterations";
import { recentIterations } from "@/data/iterations-recent";

const iterations = [...baseIterations, ...recentIterations].sort(
  (a, b) => a.no - b.no,
);

export const metadata = { title: "迭代记录" };

export default function IterationsPage() {
  return <IterationsTimeline iterations={iterations} />;
}
