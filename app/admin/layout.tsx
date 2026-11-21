import "./admin.css";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-dashboard">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
