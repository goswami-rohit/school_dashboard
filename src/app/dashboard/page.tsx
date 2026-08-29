// src/app/dashboard/page.tsx
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { StatCards } from "@/components/stat-cards";
import { PaymentStatusChart } from "@/components/payment-status-chart";
import { MonthlyCollectionChart } from "@/components/monthly-collection-chart";
import { getDashboardStats } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  return (
    <>
      <SiteHeader
        title="Overview"
        description="Pending vs cleared payments across the school, at a glance."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </main>
    </>
  );
}

async function DashboardContent() {
  const stats = await getDashboardStats();

  return (
    <>
      <StatCards
        totalStudents={stats.totalStudents}
        totalDue={stats.totalDue}
        totalPaid={stats.totalPaid}
        totalPending={stats.totalPending}
        clearedPct={stats.clearedPct}
        pendingPct={stats.pendingPct}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <PaymentStatusChart data={stats.statusCounts} />
        <MonthlyCollectionChart data={stats.monthly} />
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    </div>
  );
}
