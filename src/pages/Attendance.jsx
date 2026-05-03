import { useState, useEffect } from "react";
import SEO from "../components/SEO";
import AttendanceChart from "../components/AttendanceChart";
import Timeline from "../components/Timeline";
import AttendanceDayChart from "../components/AttendanceDayChart";
import api from "../utils/api";
import { toast } from "sonner";
import { Edit2, Trash2 } from "lucide-react";

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
  const [editStudent, setEditStudent] = useState(null);
  const [editName, setEditName] = useState("");
  const todayStr = getTodayString();
  const today = new Date(todayStr);
  const endOfShow = new Date(todayStr);
  const startOfShow = new Date(endOfShow);
  startOfShow.setDate(startOfShow.getDate() - (Number(range) - 1));
  const startDate = new Date(2026, 0, 1);

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

  const calcDatePresencePercent = (date) => {
    if (date > todayStr) return null;
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
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        <div className="mt-8 text-lg font-display font-bold text-[#111111] tracking-widest uppercase">
          Loading attendance data...
        </div>
      </div>
    );

  return (
    <div className="p-4 max-w-6xl mx-auto pt-20 text-[#111111] bg-white min-h-screen space-y-10">
      <SEO 
        title="Attendance Tracker" 
        description="Monitor attendance records and track student or employee presence easily with Axio-Manage." 
      />
      <Timeline />

      <header className="flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-[#666666]/20 pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#111111] uppercase tracking-widest">
            ATTENDANCE REGISTER
          </h1>
          <p className="text-sm font-bold text-[#666666] uppercase tracking-widest mt-1">
            {dates[0]} TO {dates[dates.length - 1]}
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => setShowModal(true)}
            className="border border-[#111111] bg-[#d0f4e0] text-[#111111] px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-colors"
          >
            NEW STUDENT
          </button>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="border border-[#111111] bg-transparent px-3 py-2 text-xs font-bold uppercase tracking-widest focus:outline-none"
          >
            <option value="7">LAST WEEK</option>
            <option value="30">LAST 30 DAYS</option>
            <option value="90">LAST 3 MONTHS</option>
          </select>
        </div>
      </header>

      <div className="overflow-x-auto border border-[#111111] bg-white">
        <table className="table-auto w-full min-w-[1000px] text-xs font-bold uppercase tracking-widest">
          <thead>
            <tr className="bg-transparent border-b border-[#111111]">
              <th className="border-r border-[#111111] px-3 py-4 sticky left-0 bg-white z-10 w-8">
                #
              </th>
              <th className="border-r border-[#111111] px-4 py-4 sticky left-8 bg-white z-10 min-w-[120px] text-left">
                STUDENT
              </th>
              {dates.map((date) => (
                <th
                  key={date}
                  className="border-r border-[#666666]/20 px-1 py-4 text-center align-bottom"
                  style={{ minWidth: "28px", maxWidth: "28px" }}
                  title={date}
                >
                  <div
                    style={{
                      transform: "rotate(-90deg)",
                      whiteSpace: "nowrap",
                      marginBottom: "8px",
                    }}
                  >
                    {formatCompactDate(date)}
                  </div>
                </th>
              ))}
              <th className="border-l border-[#111111] px-3 py-4 min-w-[48px]">
                %
              </th>
              <th className="border-l border-[#111111] px-3 py-4 sticky right-0 bg-white z-10">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr
                key={student._id}
                className="hover:bg-[#666666]/5 transition-colors border-b border-[#666666]/20"
              >
                <td className="border-r border-[#111111] px-3 py-2 sticky left-0 bg-white z-10 text-center">
                  {idx + 1}
                </td>
                <td className="border-r border-[#111111] px-4 py-2 sticky left-8 bg-white z-10 text-left">
                  {student.name}
                </td>
                {dates.map((date) => {
                  const currentStatus = attendance[student._id]?.[date] || "";
                  const isPast = date < todayStr;
                  const isToday = date === todayStr;

                  return (
                    <td
                      key={date}
                      className="border-r border-[#666666]/20 px-1 py-1 text-center"
                      style={{ minWidth: "28px", maxWidth: "28px" }}
                    >
                      {isPast ? (
                        <span
                          className={`text-lg leading-none ${
                            currentStatus === "Present" ? "text-[#111111]" : "text-[#ff99c8]"
                          }`}
                          title={currentStatus || "Absent"}
                        >
                          {currentStatus === "Present" ? "●" : "○"}
                        </span>
                      ) : isToday ? (
                        <select
                          className="border border-[#111111] bg-transparent text-[10px] w-full h-6 focus:outline-none focus:ring-1 focus:ring-[#111111]"
                          value={currentStatus}
                          onChange={(e) =>
                            handleStatusChange(student._id, date, e.target.value)
                          }
                        >
                          <option value="">-</option>
                          <option value="Present">P</option>
                          <option value="Absent">A</option>
                        </select>
                      ) : (
                        <span className="text-[#666666]/50">-</span>
                      )}
                    </td>
                  );
                })}
                <td className="border-l border-[#111111] px-3 py-2 text-center text-[#111111] bg-[#d0f4e0]/10">
                  {calcStudentPresencePercent(student._id)}%
                </td>
                <td className="border-l border-[#111111] px-3 py-2 sticky right-0 bg-white z-10">
                  <div className="flex gap-3 justify-center items-center">
                    <button
                      onClick={() => {
                        setEditStudent(student);
                        setEditName(student.name);
                      }}
                      className="text-[#666666] hover:text-[#111111] transition-colors"
                    >
                      <Edit2 className="w-4 h-4 stroke-[1.5px]" />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student._id)}
                      className="text-[#666666] hover:text-[#ff99c8] transition-colors"
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.5px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            <tr className="bg-[#111111] text-white border-t-2 border-[#111111]">
              <td className="border-r border-white/20 px-3 py-3" colSpan={2}>
                TOTAL %
              </td>
              {dates.map((date) => (
                <td
                  key={date}
                  className="border-r border-white/20 px-1 py-3 text-center"
                  style={{ minWidth: "28px", maxWidth: "28px" }}
                >
                  {calcDatePresencePercent(date)}
                </td>
              ))}
              <td className="border-l border-white/20 px-3 py-3" colSpan={2}></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmitToday}
          className="border border-[#111111] bg-[#111111] text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#a8defa] hover:text-[#111111] transition-colors"
        >
          SAVE TODAY'S ATTENDANCE
        </button>
      </div>

      <div className="space-y-10">
        <AttendanceChart data={studentChartData} />
        <AttendanceDayChart data={dayChartData} />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-50">
          <div className="bg-white border border-[#111111] p-6 w-80 shadow-2xl">
            <h3 className="font-display font-bold text-xl mb-4 text-[#111111] uppercase tracking-widest">
              ADD STUDENT
            </h3>
            <input
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="border-b-2 border-[#111111] w-full px-2 py-2 mb-6 text-sm font-bold uppercase tracking-widest focus:outline-none bg-transparent"
              placeholder="STUDENT NAME"
            />
            <div className="flex justify-end gap-3">
              <button
                className="text-xs font-bold text-[#666666] hover:text-[#111111] uppercase tracking-widest"
                onClick={() => setShowModal(false)}
              >
                CANCEL
              </button>
              <button
                className="bg-[#111111] text-white border border-[#111111] px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#111111] transition-colors"
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
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}

      {editStudent && (
        <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-50">
          <div className="bg-white border border-[#111111] p-6 w-80 shadow-2xl">
            <h3 className="font-display font-bold text-xl mb-4 text-[#111111] uppercase tracking-widest">
              EDIT STUDENT
            </h3>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border-b-2 border-[#111111] w-full px-2 py-2 mb-6 text-sm font-bold uppercase tracking-widest focus:outline-none bg-transparent"
              placeholder="STUDENT NAME"
            />
            <div className="flex justify-end gap-3">
              <button
                className="text-xs font-bold text-[#666666] hover:text-[#111111] uppercase tracking-widest"
                onClick={() => setEditStudent(null)}
              >
                CANCEL
              </button>
              <button
                className="bg-[#111111] text-white border border-[#111111] px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#111111] transition-colors"
                onClick={handleEditStudent}
              >
                UPDATE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Attendance;
