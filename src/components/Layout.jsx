import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SceneBackground from "./SceneBackground";

export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 overflow-x-hidden transition-colors duration-300">
      <div className="fixed inset-0 z-0">
        <SceneBackground />
      </div>
      <Toaster position="top-center" />
      <div className="relative z-10 flex flex-grow flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
              <Outlet />
            </Suspense>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
