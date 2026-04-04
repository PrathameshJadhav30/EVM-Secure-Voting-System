import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#1E3A8A", "#334155", "#10B981", "#0EA5E9", "#F59E0B"];

export function VotePieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="votes" nameKey="candidateName" outerRadius={95} label={(entry) => `${entry.percentage}%`}>
          {data.map((entry, index) => (
            <Cell key={entry.candidateId || index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
