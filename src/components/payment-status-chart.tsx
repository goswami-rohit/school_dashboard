// src/components/payment-status-chart.tsx
"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const STATUS_META: Record<string, { label: string; color: string }> = {
  cleared: { label: "Cleared", color: "var(--success)" },
  partial: { label: "Partial", color: "var(--chart-3)" },
  pending: { label: "Pending", color: "var(--chart-2)" },
};

export function PaymentStatusChart({
  data,
}: {
  data: { status: string; count: number }[];
}) {
  const chartData = data.map((d) => ({
    name: STATUS_META[d.status]?.label ?? d.status,
    value: d.count,
    color: STATUS_META[d.status]?.color ?? "var(--chart-4)",
  }));

  const hasData = chartData.some((d) => d.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment status breakdown</CardTitle>
        <CardDescription>Share of payment entries by status</CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="var(--card)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend verticalAlign="bottom" height={28} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-muted-foreground flex h-64 items-center justify-center text-sm">
            No payment entries yet — record one to see this chart.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
