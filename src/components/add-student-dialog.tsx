// src/components/add-student-dialog.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function AddStudentDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      admissionNo: form.get("admissionNo"),
      name: form.get("name"),
      class: form.get("class"),
      section: form.get("section") || null,
      rollNo: form.get("rollNo") || null,
      classTeacher: form.get("classTeacher") || null,
      fatherName: form.get("fatherName") || null,
      fatherPhone: form.get("fatherPhone") || null,
      motherName: form.get("motherName") || null,
      motherPhone: form.get("motherPhone") || null,
      address: form.get("address") || null,
      busNo: form.get("busNo") || null,
      hasSiblingInSchool: form.get("hasSiblingInSchool") === "on",
      siblingName: form.get("siblingName") || null,
      siblingClass: form.get("siblingClass") || null,
    };

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Could not save student.");
        return;
      }

      toast.success("Student added");
      formRef.current?.reset();
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
        <Button size="sm">
          <Plus /> Add student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add student</DialogTitle>
          <DialogDescription>
            Basic details for a new student record.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="admissionNo">Admission no.</Label>
              <Input id="admissionNo" name="admissionNo" placeholder="ADM-0123" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" placeholder="Name Surname" required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="class">Class</Label>
              <Input id="class" name="class" placeholder="1" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="section">Section</Label>
              <Input id="section" name="section" placeholder="A" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rollNo">Roll no.</Label>
              <Input id="rollNo" name="rollNo" placeholder="01" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="classTeacher">Class teacher</Label>
            <Input id="classTeacher" name="classTeacher" placeholder="Optional" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fatherName">Father&apos;s name</Label>
              <Input id="fatherName" name="fatherName" placeholder="Optional" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fatherPhone">Father&apos;s phone</Label>
              <Input id="fatherPhone" name="fatherPhone" placeholder="Optional" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="motherName">Mother&apos;s name</Label>
              <Input id="motherName" name="motherName" placeholder="Optional" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="motherPhone">Mother&apos;s phone</Label>
              <Input id="motherPhone" name="motherPhone" placeholder="Optional" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" placeholder="Optional" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="busNo">Bus no.</Label>
            <Input id="busNo" name="busNo" placeholder="Optional" />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="hasSiblingInSchool"
              name="hasSiblingInSchool"
              type="checkbox"
              className="size-4 rounded border-input accent-primary"
            />
            <Label htmlFor="hasSiblingInSchool" className="font-normal">
              Has a sibling in this school
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="siblingName">Sibling name</Label>
              <Input id="siblingName" name="siblingName" placeholder="Optional" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="siblingClass">Sibling class</Label>
              <Input id="siblingClass" name="siblingClass" placeholder="Optional" />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
