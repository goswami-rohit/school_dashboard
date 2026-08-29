// src/components/stat-cards.tsx
import { GraduationCap, CircleCheck, CircleAlert, Wallet } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function StatCards({
  totalStudents,
  totalDue,
  totalPaid,
  totalPending,
  clearedPct,
  pendingPct,
}: {
  totalStudents: number;
  totalDue: number;
  totalPaid: number;
  totalPending: number;
  clearedPct: number;
  pendingPct: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <GraduationCap className="size-3.5" /> Total students
          </CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">
            {totalStudents}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-xs">
          Across all grades and sections
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <Wallet className="size-3.5" /> Total fee due
          </CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">
            {formatCurrency(totalDue)}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-xs">
          Sum of all recorded payment entries
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5 text-success">
            <CircleCheck className="size-3.5" /> Cleared
          </CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">
            {clearedPct}%
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Progress value={clearedPct} indicatorClassName="bg-success" />
          <span className="text-muted-foreground text-xs">
            {formatCurrency(totalPaid)} collected
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5 text-destructive">
            <CircleAlert className="size-3.5" /> Pending
          </CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums">
            {pendingPct}%
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Progress value={pendingPct} indicatorClassName="bg-destructive" />
          <span className="text-muted-foreground text-xs">
            {formatCurrency(totalPending)} outstanding
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
