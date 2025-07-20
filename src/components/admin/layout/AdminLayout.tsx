import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDarkMode } from "../../../contexts/DarkModeContext";
import { useAuth } from "../../../hooks/useAuth";
import AdminProtected from "./AdminProtected";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/users", label: "Utilisateurs" },
  { href: "/admin/orders", label: "Commandes" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/reviews", label: "Avis" },
  { href: "/admin/settings", label: "Paramètres" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentTheme, toggleDarkMode, darkMode } = useDarkMode();
  const { logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const Sidebar = (
    <aside
      className="w-56 flex-shrink-0 flex flex-col gap-2 py-8 px-4 border-r border-2 shadow-2xl h-screen bg-opacity-95 justify-between sticky top-0"
      style={{
        background: currentTheme.background.card,
        borderColor: currentTheme.border.primary,
      }}>
      <div>
        {/* Back to site button */}
        <Link
          href="/"
          className="flex items-center gap-2 mb-6 px-2 py-2 rounded font-medium text-sm transition-colors hover:shadow-md hover:text-primary-500 dark:hover:text-accent-500"
          style={{ color: currentTheme.text.primary }}
          aria-label="Retour au site">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path
              d="M13 16l-5-5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Retour au site
        </Link>
        <div
          className="mb-8 text-xl font-extrabold tracking-tight text-center"
          style={{ color: currentTheme.text.primary }}>
          Admin
        </div>
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-2 font-medium transition-all text-sm ${
                router.pathname === link.href ? "admin-nav-active" : ""
              }`}
              style={{
                color:
                  router.pathname === link.href
                    ? currentTheme.interactive.primary
                    : currentTheme.text.primary,
                background:
                  router.pathname === link.href
                    ? currentTheme.interactive.primary + "18"
                    : "transparent",
              }}
              onClick={() => setSidebarOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {/* Theming and logout controls */}
      <div className="flex flex-col gap-2 mt-8">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded font-medium text-sm transition-colors hover:shadow-md hover:text-primary-500 dark:hover:text-accent-500"
          style={{ color: currentTheme.text.primary }}
          onClick={toggleDarkMode}
          aria-label="Changer le thème">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path
              d="M10 2v2M10 16v2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M2 10h2M16 10h2M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {darkMode ? "Mode clair" : "Mode sombre"}
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded font-medium text-sm transition-colors hover:bg-red-100 dark:hover:bg-red-800 text-red-600 dark:text-red-400"
          onClick={logout}
          aria-label="Se déconnecter">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path
              d="M6 6v8m0 0h7m-7 0l3-3m-3 3l3 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Se déconnecter
        </button>
      </div>
    </aside>
  );

  return (
    <AdminProtected>
      <div
        className="h-screen flex relative admin-root-container"
        style={{ background: currentTheme.background.primary }}>
        {/* Desktop sidebar */}
        <div className="hidden md:block">{Sidebar}</div>
        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Overlay */}
            <div
              className="flex-1 backdrop-blur-sm"
              style={{
                backgroundColor: `${currentTheme.background.overlay}`,
              }}
              onClick={() => setSidebarOpen(false)}
              aria-label="Fermer le menu admin"
            />
            {/* Sidebar drawer - full width on mobile */}
            <div
              className="w-full max-w-xs sm:max-w-sm md:w-56 h-full bg-opacity-95 shadow-xl animate-slide-in-right relative z-10 flex flex-col"
              style={{
                background: currentTheme.background.card,
                borderRight: `1px solid ${currentTheme.border.primary}`,
              }}>
              <button
                className="absolute top-4 right-4 p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-lg"
                onClick={() => setSidebarOpen(false)}
                aria-label="Fermer le menu"
                style={{ color: currentTheme.text.primary }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M6 6l12 12M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <div className="pt-16 pb-4 px-4 flex-1 overflow-y-auto">
                {Sidebar}
              </div>
            </div>
          </div>
        )}
        {/* Hamburger button for mobile */}
        <button
          className="md:hidden fixed top-4 left-4 z-40 p-3 rounded-full bg-opacity-90 shadow border border-gray-300"
          style={{
            background: currentTheme.background.card,
            color: currentTheme.text.primary,
            border: `1px solid ${currentTheme.border.primary}`,
          }}
          onClick={() => setSidebarOpen(true)}
          aria-label="Ouvrir le menu admin">
          <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
            <rect y="6" width="28" height="3" rx="1.5" fill="currentColor" />
            <rect y="13" width="28" height="3" rx="1.5" fill="currentColor" />
            <rect y="20" width="28" height="3" rx="1.5" fill="currentColor" />
          </svg>
        </button>
        {/* Main content */}
        <main
          className="flex-1 p-2 sm:pl-4 sm:pt-4 sm:pb-4 sm:pr-2 md:pl-8 md:pt-8 md:pb-8 md:pr-4 h-full min-w-0 admin-main-content"
          style={{ background: currentTheme.background.primary }}>
          <div className="w-full max-w-full min-w-0 overflow-x-auto admin-content-wrapper">{children}</div>
        </main>
        <style jsx global>{`
          /* Prevent horizontal scroll on admin pages globally */
          .admin-root-container {
            overflow-x: hidden !important;
          }
          .admin-main-content {
            overflow-x: hidden !important;
            min-width: 0 !important;
          }
          .admin-content-wrapper {
            min-width: 0 !important;
            overflow-x: auto !important;
          }
          /* Prevent any child from exceeding viewport width on mobile */
          @media (max-width: 768px) {
            .admin-root-container, .admin-main-content, .admin-content-wrapper {
              width: 100vw !important;
              max-width: 100vw !important;
              min-width: 0 !important;
              overflow-x: hidden !important;
            }
            .admin-root-container *, .admin-main-content *, .admin-content-wrapper * {
              box-sizing: border-box !important;
              max-width: 100vw !important;
              min-width: 0 !important;
              word-break: break-word;
            }
          }
          .admin-nav-active {
            font-weight: 600;
          }
          @keyframes slide-in-right {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-slide-in-right {
            animation: slide-in-right 0.25s cubic-bezier(0.4,0,0.2,1);
          }
          @media (max-width: 480px) {
            .admin-content {
              padding: 8px !important;
            }
            .admin-card {
              padding: 8px !important;
            }
          }
        `}</style>
      </div>
    </AdminProtected>
  );
}
