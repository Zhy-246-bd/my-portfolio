import AdminApp from "@/components/admin/AdminApp";

export const metadata = {
  title: "内容管理",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
