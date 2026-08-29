// src/components/add-payment-dialog.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { SearchSelect } from "@/components/search-select";

type StudentOption = {
  id: number;
  name: string;
  admissionNo: string;
};

export function AddPaymentDialog({ students }: { students: StudentOption[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [hasAdvance, setHasAdvance] = React.useState(false);
  const [studentId, setStudentId] = React.useState<string>("");
  const [mode, setMode] = React.useState<string>("");
  const formRef = React.useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      studentId,
      totalAmount: form.get("totalAmount"),
      amountPaid: form.get("amountPaid") || 0,
      paidOnDate: form.get("paidOnDate") || null,
      nextPayDueDate: form.get("nextPayDueDate") || null,
      hasPaidAdvance: hasAdvance,
      advancePayAmount: hasAdvance ? form.get("advancePayAmount") || 0 : null,
      mode: mode || null,
      remarks: form.get("remarks") || null,
    };

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Could not save payment.");
        return;
      }

      toast.success("Payment recorded");
      formRef.current?.reset();
      setHasAdvance(false);
      setStudentId("");
      setMode("");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={students.length === 0}>
          <Plus /> Record payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record payment</DialogTitle>
          <DialogDescription>
            Log a fee payment entry for a student.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="studentId">Student</Label>
                      <div className="flex flex-col gap-1.5">
            <Label htmlFor="studentId">Student</Label>
            <SearchSelect
              options={students.map((s) => ({
                value: String(s.id),
                label: `${s.name} · ${s.admissionNo}`,
              }))}
              value={studentId}
              onChange={(val) => setStudentId(val as string)}
              placeholder="Select a student"
              searchPlaceholder="Search by name or admission no..."
              emptyMessage="No matching students."
              className="h-9 min-h-9"
            />
          </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="totalAmount">Total amount</Label>
              <Input id="totalAmount" name="totalAmount" type="number" min="0" step="0.01" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="amountPaid">Amount paid</Label>
              <Input id="amountPaid" name="amountPaid" type="number" min="0" step="0.01" defaultValue="0" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="paidOnDate">Paid on</Label>
              <Input id="paidOnDate" name="paidOnDate" type="date" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nextPayDueDate">Next pay due</Label>
              <Input id="nextPayDueDate" name="nextPayDueDate" type="date" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mode">Payment mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger id="mode" className="w-full">
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank_transfer">Bank transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="hasPaidAdvance"
              type="checkbox"
              checked={hasAdvance}
              onChange={(e) => setHasAdvance(e.target.checked)}
              className="size-4 rounded border-input accent-primary"
            />
            <Label htmlFor="hasPaidAdvance" className="font-normal">
              Paid in advance
            </Label>
          </div>

          {hasAdvance && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="advancePayAmount">Advance amount</Label>
              <Input
                id="advancePayAmount"
                name="advancePayAmount"
                type="number"
                min="0"
                step="0.01"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea id="remarks" name="remarks" placeholder="Optional note" rows={2} />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending || !studentId}>
              {pending ? "Saving…" : "Save payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
