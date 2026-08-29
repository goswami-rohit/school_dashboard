// src/app/dashboard/students/page.tsx
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { AddStudentDialog } from "@/components/add-student-dialog";
import { StudentsTable } from "@/components/students-table";
import { getStudentsWithBalances } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentsPage() {
  return (
    <>
      <SiteHeader title="Students" description="Everyone enrolled, with their fee balance." />
      <main className="flex flex-1 flex-col gap-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Add students here, then record their payments from the Payments tab.
          </p>
          <AddStudentDialog />
        </div>

        <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
          <StudentsTableSection />
        </Suspense>
      </main>
    </>
  );
}

async function StudentsTableSection() {
  const students = await getStudentsWithBalances();
  return <StudentsTable students={students} />;
}