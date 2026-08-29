// src/app/dashboard/payments/page.tsx
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { AddPaymentDialog } from "@/components/add-payment-dialog";
import { PaymentsTable } from "@/components/payments-table";
import { getPayments, getStudents } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";

export default async function PaymentsPage() {
  const students = await getStudents();
  const studentOptions = students.map((s) => ({
    id: s.id,
    name: s.name,
    admissionNo: s.admissionNo,
  }));

  return (
    <>
      <SiteHeader title="Payments" description="Every payment entry recorded, across students." />
      <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {students.length === 0
              ? "Add a student first, then record their payments here."
              : "Record a new payment or review past entries."}
          </p>
          <AddPaymentDialog students={studentOptions} />
        </div>

        <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
          <PaymentsTableSection />
        </Suspense>
      </main>
    </>
  );
}

async function PaymentsTableSection() {
  const payments = await getPayments();
  return <PaymentsTable payments={payments} />;
}