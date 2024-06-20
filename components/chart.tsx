"use client";

import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

type ChartProps = {
  data: {
    name: string;
    participations: number;
    attendances: number;
    attendanceRate: number;
  }[];
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${payload[0].payload.name}`}</p>
        <p className="intro">{`Participations: ${payload[0].payload.participations}`}</p>
        <p className="intro">{`Attendance Rate: ${payload[0].payload.attendanceRate.toFixed(
          2
        )}%`}</p>
      </div>
    );
  }

  return null;
};

export const Chart = ({ data }: ChartProps) => {
  return (
    <Card>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickCount={
              data.reduce(
                (max, item) => Math.max(max, item.participations),
                0
              ) /
                5 +
              1
            }
            interval={0}
            domain={[
              0,
              data.reduce(
                (max, item) => Math.max(max, item.participations),
                0
              ) + 5,
            ]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="participations"
            fill="#0369a1"
            name="Participations"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="attendances"
            fill="#82ca9d"
            name="Attendances"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
