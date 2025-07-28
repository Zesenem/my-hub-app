const Spinner = ({ text = "Loading...", size = "md", layout = "full" }) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
  };

  const spinnerElement = (
    <div
      className={`animate-spin rounded-full border-blue-500 border-t-transparent ${sizeClasses[size]}`}
      role="status"
      aria-label={text}
    />
  );

  if (layout === "button") {
    return spinnerElement;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
      {spinnerElement}
      {text && <p className="text-lg font-medium text-gray-600 dark:text-gray-400">{text}</p>}
    </div>
  );
};

export default Spinner;
