import { Link } from "react-router-dom";

export default function NoPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-6 py-12 text-gray-800">
      {/* Big error number */}
      <h1 className="text-8xl font-extrabold text-red-600 mb-6">404</h1>

      {/* Main message */}
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
        Oops! Page Not Found
      </h2>

      {/* Explanation */}
      <p className="text-center text-gray-600 max-w-2xl mb-6">
        The page you are looking for might have been moved, deleted, or the URL you typed may be incorrect. 
        Sometimes even the best explorers get lost in the vast expanse of the internet.
        Don’t worry though, we’ve prepared some ways to help you get back on track.
      </p>

      {/* Suggestions / links */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-center"
        >
          Go to Home
        </Link>
        <Link
          to="/about"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition text-center"
        >
          Learn About Us
        </Link>
        <a
          href="mailto:support@example.com"
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-center"
        >
          Contact Support
        </a>
      </div>

      {/* Fun / motivational note */}
      <blockquote className="italic text-gray-500 text-center max-w-xl mb-6">
        “Sometimes getting lost is the best way to find something new. Let’s turn this misstep into a discovery!”
      </blockquote>

      {/* Optional illustration or emoji */}
      <div className="text-9xl mb-6 select-none">🗺️</div>

      {/* Tips section */}
      <div className="max-w-3xl text-gray-700 space-y-4">
        <h3 className="text-xl font-semibold">Tips to get back on track:</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Check the URL for typos or incorrect spelling.</li>
          <li>Use the navigation menu to go to another section of the site.</li>
          <li>Return to the homepage and explore from there.</li>
          <li>If you believe this is an error, contact our support team.</li>
          <li>Remember, even the internet has mysterious corners — you just discovered one!</li>
        </ul>
      </div>

      {/* Footer / encouragement */}
      <p className="mt-8 text-center text-gray-500 text-sm">
        No page is lost forever. Keep exploring, and you’ll find what you’re looking for. 🌟
      </p>
    </div>
  );
}