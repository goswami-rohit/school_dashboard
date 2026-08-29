// src/components/students-table.tsx
"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";

import { GlobalFilterBar } from "@/components/global-filter-bar";
import { DataTableReusable } from "@/components/data-table-reusable";
import { StudentDetailsDialog } from "@/components/student-details-dialog";
import { Badge } from "@/components/ui/badge";

export type StudentRow = {
  id: number;
  admissionNo: string;
  name: string;
  class: string;
  section: string | null;
  rollNo: string | null;
  classTeacher: string | null;
  fatherName: string | null;
  fatherPhone: string | null;
  motherName: string | null;
  motherPhone: string | null;
  address: string | null;
  busNo: string | null;
  hasSiblingInSchool: boolean;
  siblingName: string | null;
  siblingClass: string | null;
  isActive: boolean;
  createdAt: string | null;
  totalDue: number;
  totalPaid: number;
  totalPending: number;
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

const columns: ColumnDef<StudentRow>[] = [
  {
    accessorKey: "admissionNo",
    header: "Admission no.",
    cell: ({ row }) => <span className="font-medium">{row.original.admissionNo}</span>,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "class",
    header: "Class",
    accessorFn: (row) => `${row.class}${row.section ? `-${row.section}` : ""}`,
  },
  {
    accessorKey: "totalDue",
    header: "Fee due",
    cell: ({ row }) => formatCurrency(row.original.totalDue),
  },
  {
    accessorKey: "totalPaid",
    header: "Paid",
    cell: ({ row }) => formatCurrency(row.original.totalPaid),
  },
  {
    accessorKey: "totalPending",
    header: "Pending",
    cell: ({ row }) => formatCurrency(row.original.totalPending),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const { totalDue, totalPaid, totalPending } = row.original;
      if (totalDue === 0) return <Badge variant="outline">No payments yet</Badge>;
      if (totalPending <= 0) return <Badge variant="success">Cleared</Badge>;
      if (totalPaid > 0) return <Badge variant="secondary">Partial</Badge>;
      return <Badge variant="destructive">Pending</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => <StudentDetailsDialog student={row.original} />,
  },
];

export function StudentsTable({ students }: { students: StudentRow[] }) {
  const [search, setSearch] = React.useState("");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

  const filtered = React.useMemo(() => {
    return students.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        const matches =
          s.name.toLowerCase().includes(q) || s.admissionNo.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (dateRange?.from) {
        if (!s.createdAt) return false;
        const created = new Date(s.createdAt);
        const from = startOfDay(dateRange.from);
        const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
        if (!isWithinInterval(created, { start: from, end: to })) return false;
      }

      return true;
    });
  }, [students, search, dateRange]);

  return (
    <>
      <GlobalFilterBar
        showSearch
        showDateRange
        searchVal={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or admission no..."
        dateRangeVal={dateRange}
        onDateRangeChange={setDateRange}
        dateRangeLabel="Filter by date added"
      />

      <DataTableReusable
        columns={columns}
        data={filtered}
        emptyMessage="No students match these filters."
      />
    </>
  );
}