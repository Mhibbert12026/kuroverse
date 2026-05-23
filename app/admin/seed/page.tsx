import { SeedAdminPanel } from "@/app/components/admin/SeedAdminPanel";
import { getAdminSeedDashboardAction } from "@/lib/seeding/actions";

export default async function AdminSeedPage() {
  const dashboard = await getAdminSeedDashboardAction();

  if ("error" in dashboard) {
    return (
      <p className="admin-error" role="alert">
        {dashboard.error}
      </p>
    );
  }

  return <SeedAdminPanel initial={dashboard} />;
}
