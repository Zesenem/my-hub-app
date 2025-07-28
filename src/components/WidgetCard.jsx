const FocusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
    />
  </svg>
);

const UnfocusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
    />
  </svg>
);

export default function WidgetCard({
  title,
  children,
  widgetKey,
  isMaximized,
  onMaximize,
  onMinimize,
}) {
  const handleToggleMaximize = () => {
    if (isMaximized) {
      onMinimize();
    } else {
      onMaximize(widgetKey);
    }
  };

  return (
    <div className="ring-1 ring-black/5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b border-black/5 dark:border-white/5">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        <button
          onClick={handleToggleMaximize}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-300 transition-all duration-200"
          aria-label={isMaximized ? "Unfocus widget" : "Focus widget"}
        >
          <span className="transition-transform duration-200 ease-in-out">
            {isMaximized ? <UnfocusIcon /> : <FocusIcon />}
          </span>
          <span className="text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 max-w-0 group-hover:max-w-xs">
            {isMaximized ? "Unfocus" : "Focus"}
          </span>
        </button>
      </div>
      <div className="p-4 flex-grow">{children}</div>
    </div>
  );
}
