import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
// Smooth HSL hue interpolation from red (0°) to green (120°)
const getColorForPercentage = (percent) => {
  const p = Math.min(Math.max(percent, 0), 100);
  const hue = (p * 120) / 100; // 0 to 120 degrees (red to green)
  return `hsl(${hue}, 100%, 50%)`;
};
// ✅ Reuse the same 2 AM IST cutoff logic as Attendance.jsx
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
const ColorLegend = () => (
  <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
    {[0, 25, 50, 75, 100].map((pct) => (
      <div key={pct} style={{ textAlign: "center", margin: "0 10px" }}>
        <div
          style={{
            backgroundColor: getColorForPercentage(pct),
            width: 30,
            height: 20,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
        <div>{pct}%</div>
      </div>
    ))}
  </div>
);
const attendanceStatus = (percent) => {
  if (percent < 50) return "Low attendance";
  if (percent < 75) return "Moderate attendance";
  return "Excellent attendance";
};
const AttendanceChart = ({ data }) => {
  return (
    <div className="w-full h-[450px] p-4 bg-white dark:bg-gray-900 rounded-2xl shadow mb-20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Student Attendance %</h2>
      </div>
      <ColorLegend />
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={80}
          />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Bar dataKey="percent" barSize={40}>
            {data.map((d, i) => (
              <Cell key={i} fill={getColorForPercentage(d.percent)} />
            ))}
            <LabelList dataKey="percent" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;