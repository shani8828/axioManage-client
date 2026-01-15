import { Link } from "react-router-dom";

const apps = [
  {
    name: "Tasks",
    path: "/tasks",
    description: "Create, manage, and track your tasks effortlessly. Stay organized daily.",
    icon: "✅",
    color: "bg-indigo-600 dark:bg-indigo-500",
  },
  {
    name: "Diary",
    path: "/diary",
    description: "Write your thoughts, ideas, and reflections. Your notes are saved locally.",
    icon: "📔",
    color: "bg-green-600 dark:bg-green-500",
  },
  {
    name: "Habit Tracker",
    path: "/habit-tracker",
    description: "Track habits, see streaks, heatmaps, and progress over time.",
    icon: "🔥",
    color: "bg-orange-500 dark:bg-orange-400",
  },
  {
    name: "Expense Tracker",
    path: "/expense-tracker",
    description: "Monitor income, expenses, and view charts for better financial control.",
    icon: "💰",
    color: "bg-yellow-500 dark:bg-yellow-400",
  },
  {
    name: "Contact Book",
    path: "/contacts",
    description: "Save and manage all your contacts in one place, instantly searchable.",
    icon: "📇",
    color: "bg-pink-500 dark:bg-pink-400",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 md:px-12  space-y-16">
      {/* Welcome Section */}
      <section className="max-w-4xl mx-auto space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Welcome to Your Personal Hub</h1>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
          This app helps you manage your daily life with five powerful utilities:
          keep track of tasks, maintain a diary, track your habits, monitor expenses,
          and save contacts — all in one place.
        </p>
      </section>

      {/* How it helps you */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-semibold text-center">Why you’ll love using it</h2>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300 list-disc list-inside leading-relaxed">
          <li>Stay organized with your daily tasks and to-do lists.</li>
          <li>Capture your thoughts and reflections in a secure diary.</li>
          <li>Build and maintain habits with streak tracking and heatmaps.</li>
          <li>Monitor your income and expenses with visual charts and summaries.</li>
          <li>Keep all your contacts in one place and easily accessible.</li>
        </ul>
      </section>

      {/* AppHub Section */}
      <section className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Explore the Utilities</h2>
        <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
          Click on any card below to start using the tool.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <Link
              key={app.name}
              to={app.path}
              className={`group p-6 rounded-2xl shadow-lg transition transform hover:-translate-y-2 hover:shadow-2xl ${app.color} text-white`}
            >
              <div className="text-5xl mb-4">{app.icon}</div>
              <h3 className="text-2xl font-semibold mb-2 group-hover:underline">{app.name}</h3>
              <p className="text-sm opacity-90">{app.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto text-center text-gray-500 dark:text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-700 text-sm">
        Your all-in-one productivity hub.
      </footer>
    </div>
  );
}