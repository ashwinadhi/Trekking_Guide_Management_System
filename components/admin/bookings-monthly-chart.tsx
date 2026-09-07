"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export interface MonthlyChartPoint {
  month: string;
  confirmed: number;
  pending: number;
}

const chartConfig = {
  confirmed: {
    label: "Confirmed",
    color: "hsl(160 84% 39%)",
  },
  pending: {
    label: "Pending",
    color: "hsl(38 92% 50%)",
  },
} satisfies ChartConfig;

interface BookingsMonthlyChartProps {
  data: MonthlyChartPoint[];
}

export function BookingsMonthlyChart({ data }: BookingsMonthlyChartProps) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[320px] w-full">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          fontSize={12}
        />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} fontSize={12} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="confirmed" fill="var(--color-confirmed)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="pending" fill="var(--color-pending)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
