const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full shrink-0 py-5 px-6 text-center text-sm text-gray-500 dark:text-gray-400 ring-1 ring-black/5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl transition-colors duration-300">
      <p>
        &copy; {currentYear}{" "}
        <span className="font-semibold text-gray-700 dark:text-gray-200">MyHub Dashboard</span>. All
        Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
