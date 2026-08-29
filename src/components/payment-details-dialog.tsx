// src/components/payment-details-dialog.tsx
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
import type { PaymentRow } from "@/components/payments-table";

function formatCurrency(n: number | string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n));
}

export function PaymentDetailsDialog({ payment }: { payment: PaymentRow }) {
  const pending = Number(payment.amountPending);
  const paid = Number(payment.amountPaid);

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
            {payment.studentName}
            {pending <= 0 ? (
              <Badge variant="success">Cleared</Badge>
            ) : paid > 0 ? (
              <Badge variant="secondary">Partial</Badge>
            ) : (
              <Badge variant="destructive">Pending</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Admission no. {payment.admissionNo}
            {payment.studentClass
              ? ` · Class ${payment.studentClass}${payment.studentSection ? `-${payment.studentSection}` : ""}`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <section className="grid grid-cols-3 gap-4">
            <DetailItem label="Total" value={formatCurrency(payment.totalAmount)} />
            <DetailItem label="Paid" value={formatCurrency(payment.amountPaid)} />
            <DetailItem label="Pending" value={formatCurrency(payment.amountPending)} />
          </section>

          <Separator />

          <section className="grid grid-cols-2 gap-4">
            <DetailItem label="Paid on" value={payment.paidOnDate} />
            <DetailItem label="Next pay due" value={payment.nextPayDueDate} />
            <DetailItem
              label="Payment mode"
              value={payment.mode ? payment.mode.replace("_", " ") : null}
              className="capitalize"
            />
            <DetailItem label="Recorded on" value={payment.createdAt?.slice(0, 10)} />
          </section>

          <Separator />

          <section>
            <h4 className="mb-3 text-sm font-medium">Advance payment</h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Paid in advance" value={payment.hasPaidAdvance ? "Yes" : "No"} />
              {payment.hasPaidAdvance ? (
                <DetailItem
                  label="Advance amount"
                  value={payment.advancePayAmount ? formatCurrency(payment.advancePayAmount) : null}
                />
              ) : null}
            </div>
          </section>

          {payment.remarks ? (
            <>
              <Separator />
              <section>
                <h4 className="mb-2 text-sm font-medium">Remarks</h4>
                <p className="text-muted-foreground text-sm">{payment.remarks}</p>
              </section>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}