// src/app/dashboard/layout.tsx
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full">
      <AppSidebar />
      <div className="flex min-h-svh flex-1 flex-col">{children}</div>
    </div>
  );
}
