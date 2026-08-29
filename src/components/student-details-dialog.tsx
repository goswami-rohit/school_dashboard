// src/components/student-details-dialog.tsx
"use client";

import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DetailItem } from "@/components/detail-item";
import type { StudentRow } from "@/components/students-table";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function StudentDetailsDialog({ student }: { student: StudentRow }) {
  const cleared = student.totalDue > 0 && student.totalPending <= 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground size-8"
        >
          <Eye />
          <span className="sr-only">View details</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {student.name}
            {student.totalDue === 0 ? (
              <Badge variant="outline">No payments yet</Badge>
            ) : cleared ? (
              <Badge variant="success">Cleared</Badge>
            ) : student.totalPaid > 0 ? (
              <Badge variant="secondary">Partial</Badge>
            ) : (
              <Badge variant="destructive">Pending</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Admission no. {student.admissionNo} · {student.isActive ? "Active" : "Inactive"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <section className="grid grid-cols-2 gap-4">
            <DetailItem
              label="Class"
              value={`${student.class}${student.section ? `-${student.section}` : ""}`}
            />
            <DetailItem label="Roll no." value={student.rollNo} />
            <DetailItem label="Class teacher" value={student.classTeacher} className="col-span-2" />
          </section>

          <Separator />

          <section>
            <h4 className="mb-3 text-sm font-medium">Guardian details</h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Father's name" value={student.fatherName} />
              <DetailItem label="Father's phone" value={student.fatherPhone} />
              <DetailItem label="Mother's name" value={student.motherName} />
              <DetailItem label="Mother's phone" value={student.motherPhone} />
              <DetailItem label="Address" value={student.address} />
              <DetailItem label="Bus no." value={student.busNo} />
            </div>
          </section>

          <Separator />

          <section>
            <h4 className="mb-3 text-sm font-medium">Sibling</h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                label="Has sibling in school"
                value={student.hasSiblingInSchool ? "Yes" : "No"}
              />
              {student.hasSiblingInSchool ? (
                <>
                  <DetailItem label="Sibling name" value={student.siblingName} />
                  <DetailItem label="Sibling class" value={student.siblingClass} />
                </>
              ) : null}
            </div>
          </section>

          <Separator />

          <section>
            <h4 className="mb-3 text-sm font-medium">Fee summary</h4>
            <div className="grid grid-cols-3 gap-4">
              <DetailItem label="Total due" value={formatCurrency(student.totalDue)} />
              <DetailItem label="Paid" value={formatCurrency(student.totalPaid)} />
              <DetailItem label="Pending" value={formatCurrency(student.totalPending)} />
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}