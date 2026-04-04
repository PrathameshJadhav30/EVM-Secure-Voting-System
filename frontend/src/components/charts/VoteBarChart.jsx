import { BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar } from "recharts";

export function VoteBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="candidateName" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="votes" fill="#1E3A8A" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
