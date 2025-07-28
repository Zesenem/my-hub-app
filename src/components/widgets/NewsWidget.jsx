import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTopHeadlines } from "../../app/features/news/newsSlice";
import Spinner from "../Spinner";

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const ArticleItem = ({ article }) => (
  <a
    href={article.url}
    target="_blank"
    rel="noopener noreferrer"
    className="block p-3 rounded-xl bg-gray-50/80 dark:bg-gray-700/50 hover:bg-gray-100/90 dark:hover:bg-gray-700/80 transition-all duration-200"
  >
    <div className="flex items-start gap-4">
      <img
        src={article.image}
        alt={article.title}
        className="w-20 h-20 object-cover rounded-lg flex-shrink-0 bg-gray-300 dark:bg-gray-600"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/400x400/e2e8f0/64748b?text=News";
        }}
      />
      <div className="flex-grow">
        <h3 className="font-bold text-base text-gray-800 dark:text-gray-100 leading-tight">
          {article.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1.5">
          <span className="font-medium truncate pr-2">{article.source.name}</span>
          <span className="flex-shrink-0">{formatTimeAgo(article.publishedAt)}</span>
        </div>
      </div>
    </div>
  </a>
);

const ErrorState = ({ error }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full mb-3">
      <svg
        className="w-8 h-8 text-red-600 dark:text-red-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.636-1.214 2.476-1.214 3.112 0l5.57 10.647A1.75 1.75 0 0115.253 16H4.42a1.75 1.75 0 01-1.686-2.254l5.523-10.647zM10 9a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5A.75.75 0 0110 9zm0 6a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <p className="font-semibold text-gray-700 dark:text-gray-200">Failed to load news</p>
    <p className="text-sm text-red-500 dark:text-red-400 mt-1 max-w-xs">{error}</p>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4">
    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-3">
      <svg
        className="w-8 h-8 text-blue-600 dark:text-blue-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.25 13.5a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V13.5z" />
        <path
          fillRule="evenodd"
          d="M3 6a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V6zm2-1.5A1.5 1.5 0 003.5 6v8A1.5 1.5 0 005 15.5h10A1.5 1.5 0 0016.5 14V6A1.5 1.5 0 0015 4.5H5z"
          clipRule="evenodd"
        />
        <path d="M9.75 10.5a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75v-.01zM7 8.25a.75.75 0 000 1.5h.01a.75.75 0 000-1.5H7z" />
      </svg>
    </div>
    <p className="font-semibold text-gray-700 dark:text-gray-200">No Articles Found</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
      There are no news articles to display at this time.
    </p>
  </div>
);

export default function NewsWidget() {
  const dispatch = useDispatch();
  const { articles, status, error } = useSelector((state) => state.news);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTopHeadlines());
    }
  }, [status, dispatch]);

  return (
    <div className="h-full flex flex-col">
      {status === "loading" && <Spinner text="Fetching news..." />}
      {status === "failed" && <ErrorState error={error} />}
      {status === "succeeded" &&
        (articles.length > 0 ? (
          <div className="space-y-2 h-[450px] overflow-y-auto pr-1.5 -mr-1.5">
            {articles.map((article) => (
              <ArticleItem key={article.url} article={article} />
            ))}
          </div>
        ) : (
          <EmptyState />
        ))}
    </div>
  );
}
