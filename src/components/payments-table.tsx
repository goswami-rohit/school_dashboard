// src/components/payments-table.tsx
"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { DateRange } from "react-day-picker";
import { isWithinInterval, startOfDay, endOfDay, parseISO } from "date-fns";

import { GlobalFilterBar } from "@/components/global-filter-bar";
import { DataTableReusable } from "@/components/data-table-reusable";
import { PaymentDetailsDialog } from "@/components/payment-details-dialog";
import { Badge } from "@/components/ui/badge";

export type PaymentRow = {
  id: number;
  totalAmount: string;
  amountPaid: string;
  amountPending: string;
  paidOnDate: string | null;
  nextPayDueDate: string | null;
  hasPaidAdvance: boolean;
  advancePayAmount: string | null;
  mode: string | null;
  remarks: string | null;
  createdAt: string | null;
  studentName: string;
  admissionNo: string;
  studentClass: string;
  studentSection: string | null;
};

function formatCurrency(n: number | string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n));
}

const columns: ColumnDef<PaymentRow>[] = [
  {
    id: "student",
    header: "Student",
    accessorFn: (row) => `${row.studentName} ${row.admissionNo}`,
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.studentName}
        <span className="text-muted-foreground ml-1.5 text-xs">{row.original.admissionNo}</span>
      </span>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => formatCurrency(row.original.totalAmount),
  },
  {
    accessorKey: "amountPaid",
    header: "Paid",
    cell: ({ row }) => formatCurrency(row.original.amountPaid),
  },
  {
    accessorKey: "amountPending",
    header: "Pending",
    cell: ({ row }) => formatCurrency(row.original.amountPending),
  },
  {
    accessorKey: "mode",
    header: "Mode",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.mode?.replace("_", " ") ?? "—"}</span>
    ),
  },
  {
    accessorKey: "nextPayDueDate",
    header: "Next due",
    cell: ({ row }) => row.original.nextPayDueDate ?? "—",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const pending = Number(row.original.amountPending);
      const paid = Number(row.original.amountPaid);
      if (pending <= 0) return <Badge variant="success">Cleared</Badge>;
      if (paid > 0) return <Badge variant="secondary">Partial</Badge>;
      return <Badge variant="destructive">Pending</Badge>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => <PaymentDetailsDialog payment={row.original} />,
  },
];

export function PaymentsTable({ payments }: { payments: PaymentRow[] }) {
  const [search, setSearch] = React.useState("");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

  const filtered = React.useMemo(() => {
    return payments.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const matches =
          p.studentName.toLowerCase().includes(q) || p.admissionNo.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (dateRange?.from) {
        if (!p.paidOnDate) return false;
        const paidOn = parseISO(p.paidOnDate);
        const from = startOfDay(dateRange.from);
        const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
        if (!isWithinInterval(paidOn, { start: from, end: to })) return false;
      }

      return true;
    });
  }, [payments, search, dateRange]);

  return (
    <>
      <GlobalFilterBar
        showSearch
        showDateRange
        searchVal={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by student or admission no..."
        dateRangeVal={dateRange}
        onDateRangeChange={setDateRange}
        dateRangeLabel="Filter by paid-on date"
      />

      <DataTableReusable
        columns={columns}
        data={filtered}
        emptyMessage="No payments match these filters."
      />
    </>
  );
}