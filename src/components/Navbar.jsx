import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import { toggleSocial, setSocialUrl } from "../app/features/socials/socialsSlice";
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  InstagramIcon,
  FacebookIcon,
  RedditIcon,
  TiktokIcon,
  YoutubeIcon,
  WhatsappIcon,
  SettingsIcon,
  MoonIcon,
  SunIcon,
} from "./Icons";

const ALL_SOCIALS = [
  { key: "github", name: "GitHub", icon: <GithubIcon /> },
  { key: "linkedin", name: "LinkedIn", icon: <LinkedinIcon /> },
  { key: "twitter", name: "X (Twitter)", icon: <TwitterIcon /> },
  { key: "instagram", name: "Instagram", icon: <InstagramIcon /> },
  { key: "facebook", name: "Facebook", icon: <FacebookIcon /> },
  { key: "reddit", name: "Reddit", icon: <RedditIcon /> },
  { key: "tiktok", name: "TikTok", icon: <TiktokIcon /> },
  { key: "youtube", name: "YouTube", icon: <YoutubeIcon /> },
  { key: "whatsapp", name: "WhatsApp", icon: <WhatsappIcon /> },
];

const SocialsModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { selected, urls } = useSelector((state) => state.socials);

  const handleToggleSocial = useCallback((key) => dispatch(toggleSocial(key)), [dispatch]);
  const handleUrlChange = useCallback(
    (key, url) => dispatch(setSocialUrl({ key, url })),
    [dispatch]
  );

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/70 animate-fade-in-fast" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4">
        <div className="p-6 rounded-2xl shadow-2xl ring-1 ring-black/5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl animate-slide-up-fast">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Configure Social Links
          </h2>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-3 -mr-3">
            {ALL_SOCIALS.map((social) => (
              <div
                key={social.key}
                className="p-3 bg-gray-50/60 dark:bg-gray-700/50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    id={`social-${social.key}`}
                    className="h-5 w-5 shrink-0 cursor-pointer rounded-md border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    checked={selected.includes(social.key)}
                    onChange={() => handleToggleSocial(social.key)}
                  />
                  <label
                    htmlFor={`social-${social.key}`}
                    className="flex-grow flex items-center gap-3 cursor-pointer"
                  >
                    <span className="w-6 h-6 text-gray-600 dark:text-gray-300">{social.icon}</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {social.name}
                    </span>
                  </label>
                </div>
                {selected.includes(social.key) && (
                  <div className="mt-3 pl-9 animate-fade-in-fast">
                    <input
                      type="url"
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500 transition"
                      value={urls[social.key] || ""}
                      onChange={(e) => handleUrlChange(social.key, e.target.value)}
                      placeholder={`https://...`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-right mt-6">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selected, urls } = useSelector((state) => state.socials);

  const visibleSocials = useMemo(
    () => ALL_SOCIALS.filter((s) => selected.includes(s.key)),
    [selected]
  );
  const toggleTheme = useCallback(
    () => setTheme(theme === "light" ? "dark" : "light"),
    [theme, setTheme]
  );

  const navButtonStyles =
    "relative p-2 rounded-full text-gray-600 dark:text-gray-300 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/90 dark:hover:bg-gray-700/90 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900";

  return (
    <>
      <nav className="p-4 shadow-md ring-1 ring-black/5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-gray-900 dark:text-white text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            MyHub
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-3">
              {visibleSocials.map((social) => (
                <a
                  key={social.key}
                  href={urls[social.key] || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200 hover:scale-110"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className={navButtonStyles}
              aria-label="Configure social links"
            >
              <SettingsIcon className="h-5 w-5" />
            </button>

            <button onClick={toggleTheme} className={navButtonStyles} aria-label="Toggle theme">
              {theme === "light" ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <SocialsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
