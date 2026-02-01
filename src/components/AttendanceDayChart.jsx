import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";

// Format dates
const formatCompactDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}`;
};

// ✅ Get "today" in IST with cutoff at 2:00 AM
const getISTTodayString = () => {
  const now = new Date();
  // Convert UTC → IST
  const istOffset = 5.5 * 60 * 60 * 1000;
  const nowIST = new Date(now.getTime() + istOffset);
  // Cutoff: before 2 AM → count as yesterday
  if (nowIST.getHours() < 2) {
    nowIST.setDate(nowIST.getDate() - 1);
  }
  // Return YYYY-MM-DD string in IST
  const year = nowIST.getFullYear();
  const month = String(nowIST.getMonth() + 1).padStart(2, "0");
  const day = String(nowIST.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
// Function to calculate per-day percentage
const calcDatePresencePercent = (attendance, date) => {
  const todayStr = getISTTodayString();
  if (date > todayStr) return null; // skip future days
  let presentCount = 0;
  let totalStudents = AttendanceData.length;
  AttendanceData.forEach(({ id }) => {
    if (attendance[id]?.[date] === "Present") presentCount++;
  });
  return totalStudents ? (presentCount / totalStudents) * 100 : 0;
};
const AttendanceDayChart = ({ data, range, onRangeChange }) => {
  return (
    <div className="w-full h-80 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">
          Daily Attendance Percentage
        </h2>
      </div>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Area
            type="monotone"
            dataKey="percent"
            fill="url(#hueFill)"
            stroke="hsl(200,70%,45%)"
          />
          <Line
            type="monotone"
            dataKey="percent"
            stroke="hsl(200,80%,40%)"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceDayChart;