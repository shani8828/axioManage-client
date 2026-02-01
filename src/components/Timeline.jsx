import { useMemo, useState } from "react";
import { motion } from "framer-motion";

// ================== Helpers ==================
const year = 2026;
const start = new Date(2026, 0, 1); // Jan 1, 2026 (Day 1)
const end = new Date(2026, 3, 30); // Apr 30, 2026
const getToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// ================== Stats Calculation ==================
const getTimelineStats = () => {
  const today = getToday();
  const msInDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor((end - start) / msInDay) + 1;
  const currentDayNumber = Math.floor((today - start) / msInDay) + 1;
  const passedDays = Math.max(0, currentDayNumber - 1);
  const leftDays = Math.max(0, totalDays - currentDayNumber);
  const totalWeeks = Math.ceil(totalDays / 7);
  const passedWeeks = Math.floor(passedDays / 7);
  const progressPercent = Math.min(
    100,
    Math.max(0, (passedDays / totalDays) * 100),
  );
  const weeksLeft = Math.floor(leftDays / 7);
  const daysExtra = leftDays % 7;
  return {
    passedDays,
    leftDays,
    totalDays,
    totalWeeks,
    passedWeeks,
    progressPercent,
    weeksLeft,
    daysExtra,
    today,
    currentDayNumber,
  };
};

// Keep getDateString using IST
const getDateString = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())
    .toISOString()
    .split("T")[0];
const getMonthName = (monthIndex) =>
  new Date(year, monthIndex, 1).toLocaleString("default", { month: "long" });
const generateMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  let current = new Date(firstDay);
  while (current <= lastDay) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return { firstDay, days };
};

// ================== Quotes, Milestones, Badges ==================
const quotes = [
  "Small steps every day build big results.",
  "Consistency beats intensity.",
  "Progress, not perfection.",
  "Every day is a win if you keep moving.",
  "You're closer than you think.",
];

// ================== Component ==================
export default function Timeline() {
  const {
    passedDays,
    leftDays,
    totalDays,
    totalWeeks,
    passedWeeks,
    progressPercent,
    weeksLeft,
    daysExtra,
    today,
    currentDayNumber,
  } = useMemo(() => getTimelineStats(), []);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  // const year = 2026;
  const { firstDay, days } = generateMonthDays(year, currentMonth);
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const milestones = [
    { day: 30, label: "🚀 First 30 Days" },
    { day: Math.floor(totalDays / 2), label: "🌟 Halfway" },
    { day: totalDays - 30, label: "🔥 Final Stretch" },
  ];
  const badges = [
    { unlocked: passedDays >= 7, label: "✅ First Week" },
    { unlocked: progressPercent >= 50, label: "🌟 50% Done" },
    { unlocked: passedDays >= totalDays, label: "🏆 Completed" },
  ];
  // Allowed months (Jan - Apr)
  const minMonth = 0;
  const maxMonth = 3;
  return (
    <div className="w-full max-w-5xl mx-auto px-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-800 dark:text-slate-200">
        🎯 Challenge Timeline
      </h2>
      {/* Progress Bar */}
      <div className="relative w-full h-6 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-md">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"
        />
        {milestones.map((m, idx) => {
          const leftPercent = (m.day / totalDays) * 100;
          return (
            <div
              key={idx}
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${leftPercent}%`, transform: "translateX(-50%)" }}
            >
              <span className="text-lg">📍</span>
              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Markers */}
      <div className="flex justify-between text-xs font-semibold mt-2 text-slate-600 dark:text-slate-300">
        <div>{start.toDateString()}</div>
        <div className="text-center">
          Today <br />
          <span className="text-sm font-bold">
            Day {currentDayNumber} / {totalDays}
          </span>
          <span className="pl-4 text-sm font-semibold italic">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div>{end.toDateString()}</div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4 mt-8">
        <StatCard
          title="Days Passed"
          value={passedDays}
          color="text-blue-600 dark:text-blue-400"
          delay={0.2}
        />
        <StatCard
          title="Days Left"
          value={leftDays}
          color="text-green-600 dark:text-green-400"
          delay={0.4}
        />
        <StatCard
          title="Weeks Done"
          value={`${passedWeeks} / ${totalWeeks}`}
          color="text-purple-600 dark:text-purple-400"
          delay={0.6}
        />
        <StatCard
          title="Current Day"
          value={`Day ${currentDayNumber}`}
          color="text-red-600 dark:text-red-400"
          delay={0.8}
        />
      </div>
      {/* Countdown */}
      <div className="mt-6 text-center text-lg font-semibold text-slate-800 dark:text-slate-200">
        ⏳ {weeksLeft} weeks and {daysExtra} days left
      </div>
      {/* Week-by-Week Dots */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200 text-center">
          📌 Week-by-Week Progress
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {Array.from({ length: totalWeeks }).map((_, idx) => {
            const startDay = idx * 7 + 1;
            const endDay = Math.min((idx + 1) * 7, totalDays);
            const isDone = passedDays >= endDay;
            const isCurrent =
              currentDayNumber >= startDay && currentDayNumber <= endDay;
            let weekPercent = 0;
            if (isDone) weekPercent = 100;
            else if (isCurrent) {
              const daysIntoWeek = currentDayNumber - startDay;
              weekPercent = Math.round(
                (daysIntoWeek / (endDay - startDay + 1)) * 100,
              );
            }
            return (
              <div key={idx} className="flex flex-col items-center w-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold shadow
                    ${
                      isDone || isCurrent
                        ? "bg-gradient-to-r from-green-400 to-blue-500 text-white"
                        : "bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300"
                    }`}
                >
                  {idx + 1}
                </motion.div>
                <span className="text-[10px] mt-1 text-slate-700 dark:text-slate-300">
                  {weekPercent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Badges */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-center text-slate-800 dark:text-slate-200">
          🏅 Achievements
        </h3>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {badges.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: badge.unlocked ? 1 : 0.8 }}
              transition={{ delay: idx * 0.2 }}
              className={`px-4 py-2 rounded-full text-sm font-semibold shadow ${
                badge.unlocked
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                  : "bg-slate-300 dark:bg-slate-700 text-slate-500"
              }`}
            >
              {badge.label}
            </motion.div>
          ))}
        </div>
      </div>
      {/* Motivational Quote */}
      <div className="mt-12 text-center text-xl italic font-medium text-slate-700 dark:text-slate-300">
        💡 {randomQuote}
      </div>
      {/* Calendar Heatmap with Month Nav */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth((m) => Math.max(minMonth, m - 1))}
            disabled={currentMonth === minMonth}
            className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 disabled:opacity-40"
          >
            ←
          </button>
          <h2 className="text-lg font-bold">
            {getMonthName(currentMonth)} {year}
          </h2>
          <button
            onClick={() => setCurrentMonth((m) => Math.min(maxMonth, m + 1))}
            disabled={currentMonth === maxMonth}
            className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 disabled:opacity-40"
          >
            →
          </button>
        </div>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
            <div
              key={idx}
              className={`text-center ${
                idx === 0 || idx === 6 ? "text-red-500 dark:text-red-400" : ""
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 text-[11px]">
          {Array.from({ length: firstDay.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((d) => {
            const dateStr = getDateString(d);
            const todayStr = getDateString(today);
            const normalize = (x) =>
              new Date(x.getFullYear(), x.getMonth(), x.getDate());
            const isPast = normalize(d) < normalize(today);
            const isFuture = normalize(d) > normalize(today);
            const isToday = dateStr === todayStr;
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            return (
              <div
                key={dateStr}
                className={`w-8 h-8 flex items-center justify-center rounded text-center
                  ${isPast ? "bg-green-500 text-white" : ""}
                  ${
                    isFuture
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      : ""
                  }
                  ${isToday ? "border-2 border-blue-500 font-bold" : ""}
                  ${isWeekend ? "ring-2 ring-red-400 dark:ring-red-500" : ""}
                `}
                title={`Day ${Math.floor((d - start) / (1000 * 60 * 60 * 24)) + 1}`}
              >
                {d.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ================== Stat Card ==================
function StatCard({ title, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow text-center"
    >
      <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
        {title}
      </p>
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
    </motion.div>
  );
}