import AboutDrawers from "@/components/about/AboutDrawers";
import { about } from "@/data/about";
import { site } from "@/data/site";

export const metadata = { title: "关于我" };

export default function AboutPage() {
  return <AboutDrawers about={about} email={site.email} />;
}
