import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center text-center py-16">
    <div className="p-8 rounded-2xl shadow-lg ring-1 ring-black/5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl max-w-lg w-full">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
        <svg
          className="w-10 h-10 text-blue-600 dark:text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
        404
      </h1>
      <p className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-100">Page Not Found</p>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Oops! The page you're looking for seems to have gotten lost.
      </p>
      <div className="mt-8">
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
