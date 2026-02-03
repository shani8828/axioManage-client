import { useState, useEffect } from "react";
import AttendanceChart from "../components/AttendanceChart";
import Timeline from "../components/Timeline";
import AttendanceDayChart from "../components/AttendanceDayChart";
import api from "../utils/api";
import toast from "react-hot-toast";

// Helpers
const getDateString = (date) => date.toISOString().split("T")[0];
const formatCompactDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1,
  ).padStart(2, "0")}`;
};
const generateDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(getDateString(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
const getTodayString = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    .toISOString()
    .split("T")[0];
};
const Attendance = () => {
  const [attendance, setAttendance] = useState({});
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [range, setRange] = useState("30");
  const [editStudent, setEditStudent] = useState(null); // { _id, name }
  const [editName, setEditName] = useState("");
  const todayStr = getTodayString();
  const today = new Date(todayStr);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth(), 3); //
  const endOfShow = new Date(todayStr);
  const startOfShow = new Date(endOfShow);
  startOfShow.setDate(startOfShow.getDate() - (Number(range) - 1));
  // Fixed start date (1 jan for your example)
  const startDate = new Date(2026, 0, 1); // month is 0-indexed → 0 = January
  const fetchStudents = async () => {
    const toastId = toast.loading("Loading students...");
    try {
      const data = await api.get("/students");
      setStudents(data);
      toast.success("Students loaded", { id: toastId });
    } catch (err) {
      toast.error("Failed to load students", { id: toastId });
    }
  };
  useEffect(() => {
    const datesRange = generateDateRange(startOfShow, endOfShow);
    setDates(datesRange);
    fetchStudents();
    const fetchAttendance = async () => {
      const toastId = toast.loading("Loading attendance...");
      try {
        const startStr = getDateString(startOfShow);
        const endStr = getDateString(endOfShow);
        const data = await api.get(
          `/attendance?startDate=${startStr}&endDate=${endStr}`,
        );
        const attendanceMap = {};
        data.forEach(({ studentId, date, status }) => {
          if (!attendanceMap[studentId]) attendanceMap[studentId] = {};
          attendanceMap[studentId][date] = status;
        });
        setAttendance(attendanceMap);
        toast.success("Attendance loaded", { id: toastId });
      } catch (err) {
        toast.error("Failed to load attendance", { id: toastId });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [todayStr, range]);
  const handleStatusChange = (studentId, date, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [date]: status,
      },
    }));
  };
  // Student % = from start date to today only
  const calcStudentPresencePercent = (studentId) => {
    const validDates = dates.filter((d) => d <= todayStr);
    const records = attendance[studentId] || {};
    let presentCount = 0;
    let total = validDates.length;
    validDates.forEach((date) => {
      if (records[date] === "Present") presentCount++;
    });
    return total ? ((presentCount / total) * 100).toFixed(2) : "0.00";
  };
  // Per-day % (only for past + today)
  const calcDatePresencePercent = (date) => {
    if (date > todayStr) return null; // skip future
    let presentCount = 0;
    let totalStudents = students.length;
    students.forEach(({ _id }) => {
      if (attendance[_id]?.[date] === "Present") presentCount++;
    });
    return totalStudents
      ? ((presentCount / totalStudents) * 100).toFixed(2)
      : "0.00";
  };
  const handleSubmitToday = async () => {
    const toastId = toast.loading("Saving attendance...");
    try {
      const records = students.map(({ _id, name }) => ({
        studentId: _id,
        name,
        date: todayStr,
        status: attendance[_id]?.[todayStr] || "Absent",
      }));
      await api.post("/attendance", { records });
      toast.success("Attendance saved", { id: toastId });
    } catch (error) {
      toast.error("Failed to save attendance", { id: toastId });
      console.error("Error submitting attendance:", error);
    }
  };
  const studentChartData = students.map((s) => ({
    name: s.name,
    percent: Number(calcStudentPresencePercent(s._id)),
  }));
  const dayChartData = dates
    .filter((d) => d <= todayStr)
    .map((date) => ({
      date: formatCompactDate(date),
      percent: Number(calcDatePresencePercent(date)),
    }));
  const handleEditStudent = async () => {
    if (!editName.trim()) return toast.error("Name cannot be empty");
    const toastId = toast.loading("Updating student...");
    try {
      await api.put(`/students/${editStudent._id}`, {
        name: editName,
      });
      toast.success("Student updated", { id: toastId });
      setEditStudent(null);
      fetchStudents();
    } catch {
      toast.error("Failed to update student", { id: toastId });
    }
  };
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Delete this student? Attendance will be removed.")) {
      return;
    }
    const toastId = toast.loading("Deleting student...");
    try {
      await api.delete(`/students/${studentId}`);
      toast.success("Student deleted", { id: toastId });
      fetchStudents();
    } catch {
      toast.error("Failed to delete student", { id: toastId });
    }
  };
  if (loading)
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/40 dark:bg-black/60 backdrop-blur-sm z-50">
        <div className="w-64 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full animate-[shimmer_2s_infinite]"></div>
        </div>
        <div className="mt-8 text-lg font-medium text-gray-700 dark:text-gray-300 tracking-wide">
          Loading attendance data...
        </div>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Please wait a moment
        </div>
      </div>
    );
  return (
    <div className="p-4 max-w-full mx-auto pt-20 text-gray-900 dark:text-gray-100">
      <Timeline />
      <h1 className="text-xl font-bold mb-4">
        Attendance Register ({dates[0]} - {dates[dates.length - 1]})
      </h1>{" "}
      <div className="flex gap-2 justify-between items-center my-3">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-1 rounded text-sm"
        >
          New student?
        </button>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border rounded px-2 py-1 text-sm dark:bg-gray-800"
        >
          <option value="7">Last week</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 dark:border-gray-600 w-full min-w-[1000px] text-xs">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 sticky left-0 bg-inherit z-10 w-8">
                #
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 sticky left-8 bg-inherit z-10 min-w-[120px]">
                Student
              </th>
              {dates.map((date) => (
                <th
                  key={date}
                  className="border border-gray-300 dark:border-gray-600 px-1 py-3 text-center align-bottom"
                  style={{
                    minWidth: "24px",
                    maxWidth: "24px",
                    verticalAlign: "bottom",
                  }}
                  title={date}
                >
                  <div
                    style={{
                      transform: "rotate(-60deg)",
                      whiteSpace: "nowrap",
                      marginBottom: "6px",
                      fontWeight: "600",
                    }}
                  >
                    {formatCompactDate(date)}
                  </div>
                </th>
              ))}
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 min-w-[48px]">
                %
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 sticky left-[200px] bg-inherit z-10">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr
                key={student._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 sticky left-0 bg-white dark:bg-gray-900 z-10 text-center">
                  {idx + 1}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 sticky left-8 bg-white dark:bg-gray-900 z-10">
                  {student.name}
                </td>
                {dates.map((date) => {
                  const currentStatus = attendance[student._id]?.[date] || "";
                  const isPast = date < todayStr;
                  const isToday = date === todayStr;
                  const isFuture = date > todayStr;
                  return (
                    <td
                      key={date}
                      className="border border-gray-300 dark:border-gray-600 px-0.5 py-0.5 text-center"
                      style={{ minWidth: "24px", maxWidth: "24px" }}
                    >
                      {isPast ? (
                        <span
                          className={`font-semibold ${
                            currentStatus === "Present"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                          title={currentStatus || "Absent"}
                        >
                          {currentStatus === "Present" ? "✓" : "✗"}
                        </span>
                      ) : isToday ? (
                        <select
                          className="border rounded text-[10px] p-0 w-full h-6 bg-white dark:bg-gray-800 dark:text-gray-100"
                          value={currentStatus}
                          onChange={(e) =>
                            handleStatusChange(
                              student._id,
                              date,
                              e.target.value,
                            )
                          }
                        >
                          <option value="">☐</option>
                          <option value="Present" className="text-green-500">✓</option>
                          <option value="Absent" className="text-red-500">✗</option>
                        </select>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                  );
                })}
                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-semibold">
                  {calcStudentPresencePercent(student._id)}%
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 sticky left-[200px] bg-white dark:bg-gray-900 z-10">
                  <div className="flex gap-2 text-xs items-center justify-evenly">
                    <button
                      onClick={() => {
                        setEditStudent(student);
                        setEditName(student.name);
                      }}
                      className="text-blue-600 hover:underline  hover:scale-105 transition-all duration-300"
                    >✎</button>
                    <button
                      onClick={() => handleDeleteStudent(student._id)}
                      className="text-red-600 hover:underline hover:scale-105 transition-all duration-300 font-bold"
                    >🗑⃨̅̅̅</button>
                  </div>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 dark:bg-gray-800 font-semibold">
              <td
                className="border border-gray-300 dark:border-gray-600 px-2 py-1"
                colSpan={2}
              >
                Total %
              </td>
              {dates.map((date) => (
                <td
                  key={date}
                  className="border border-gray-300 dark:border-gray-600 px-0.5 py-1 text-center"
                  style={{ minWidth: "24px", maxWidth: "24px" }}
                >
                  {calcDatePresencePercent(date)}
                </td>
              ))}
              <td className="border border-gray-300 dark:border-gray-600 px-2 py-1"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right">
        <button
          onClick={handleSubmitToday}
          className="bg-blue-600 text-white px-5 py-1 rounded hover:bg-blue-700 text-sm"
        >
          Save Today's Attendance
        </button>
      </div>
      {/* <Task3 /> */}
      <AttendanceChart data={studentChartData} />
      <AttendanceDayChart data={dayChartData} />
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-4 rounded w-72">
            <h3 className="font-semibold mb-3">Add Student</h3>
            <input
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="border w-full px-2 py-1 mb-3"
              placeholder="Student name"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={async () => {
                  const toastId = toast.loading("Adding student...");
                  try {
                    await api.post("/students", { name: newStudentName });
                    toast.success("Student added", { id: toastId });
                    setNewStudentName("");
                    setShowModal(false);
                    fetchStudents();
                  } catch (error) {
                    toast.error("Failed to add student", { id: toastId });
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {editStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-4 rounded w-72">
            <h3 className="font-semibold mb-3">Edit Student</h3>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border w-full px-2 py-1 mb-3"
              placeholder="Student name"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditStudent(null)}>Cancel</button>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={handleEditStudent}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Attendance;
