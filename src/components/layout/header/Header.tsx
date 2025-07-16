import Link from "next/link";
import { useState, useEffect } from "react";
import { useDarkMode } from "../../../contexts/DarkModeContext";
import { useAuth } from "../../../hooks/useAuth";
import { useNotifications } from "../../../contexts/NotificationContext";
import NotificationBell from "../../ui/NotificationBell";
import DashboardButton from "../../ui/DashboardButton";
import { CartIcon } from "../../ui/CartIcon";
import { useRef } from "react";
import React from "react";
import { useRouter } from "next/router";


export default function Header() {
  const { darkMode, toggleDarkMode, currentTheme } = useDarkMode();
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();


  // Notifications are now handled by the NotificationContext

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  // Mark notifications as read when popup is opened
  const handleShowNotifications = async () => {
    setShowNotifications((v) => !v);
    if (!showNotifications) {
      // Only mark as read when opening
      try {
        await markAllAsRead();
      } catch {}
    }
  };

  // Set CSS custom properties for hover effects
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--hover-bg-color",
      currentTheme.background.tertiary,
    );
    document.documentElement.style.setProperty(
      "--hover-text-color",
      currentTheme.text.primary,
    );
    document.documentElement.style.setProperty(
      "--primary-color-60",
      `${currentTheme.interactive.primary}60`,
    );
  }, [currentTheme]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log("Recherche pour:", searchQuery);
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.replace("/");
  };

  return (
    <>
      {/* Spacer to prevent content from being hidden behind the fixed header */}
      <div style={{ height: 64 }}></div>
      <header
        className="fixed top-0 left-0 w-full z-[1100] border-b backdrop-blur-md"
        style={{
          backgroundColor: `${currentTheme.background.primary}cc`,
          borderColor: currentTheme.border.primary,
        }}>
        {/* Blurred, colored overlay */}
        {darkMode && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              pointerEvents: "none",
              borderRadius: "inherit",
              filter: "blur(16px)",
              opacity: 0.7,
              background:
                "linear-gradient(120deg, #15222e 0%, #1a2b3a 50%, #27445d 100%)",
              transition: "background 0.3s",
            }}
          />
        )}
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ position: "relative", zIndex: 2 }}>
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 flex-shrink-0">
              <span
                className={`text-2xl font-bold tracking-tight ${
                  darkMode ? "logo-gradient-dark" : "logo-gradient-light"
                }`}>
                DSG
              </span>
            </Link>

            {/* Desktop Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher des services, prestataires ou lieux..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                      backgroundColor: currentTheme.background.secondary,
                      color: currentTheme.text.primary,
                      border: `1px solid ${currentTheme.border.primary}`,
                      boxShadow: `0 1px 3px ${currentTheme.border.primary}20`,
                    }}
                  />
                  <div
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: currentTheme.text.muted }}>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-opacity-10 transition-colors"
                      style={{
                        color: currentTheme.text.muted,
                        backgroundColor: `${currentTheme.text.muted}20`,
                      }}>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated && user?.role !== "store" && <DashboardButton />}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Cart Icon */}
                              <CartIcon onClick={() => (window as unknown as { openCartDrawer?: () => void }).openCartDrawer?.()} />

              {/* Notification Bell - Desktop only */}
              <div className="hidden md:block relative">
                <span onClick={handleShowNotifications}>
                  <NotificationBell unreadCount={unreadCount} />
                </span>
                {showNotifications && (
                  <div
                    ref={notifDropdownRef}
                    className="absolute right-0 mt-2 w-96 max-w-xs bg-white dark:bg-gray-900 rounded-xl shadow-lg border z-[1200]"
                    style={{
                      background: currentTheme.background.secondary,
                      color: currentTheme.text.primary,
                      border: `1px solid ${currentTheme.border.primary}`,
                    }}>
                    <div
                      className="p-4 border-b"
                      style={{ borderColor: currentTheme.border.primary }}>
                      <span className="font-bold text-lg">Notifications</span>
                    </div>
                    <div
                      className="max-h-80 overflow-y-auto divide-y"
                      style={{ borderColor: currentTheme.border.primary }}>
                      {notifications.length === 0 ? (
                        <div
                          className="p-4 text-center text-sm"
                          style={{ color: currentTheme.text.muted }}>
                          Aucune notification.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`p-4 transition flex items-start gap-3 ${
                              notif.read
                                ? "opacity-70"
                                : "bg-blue-50 dark:bg-blue-900/20"
                            }`}
                            style={{ cursor: "pointer" }}>
                            {/* Icon based on type */}
                            <div className="pt-1">
                              {notif.type === "order" ? (
                                <svg
                                  className="w-5 h-5 text-blue-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 7h18M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6"
                                  />
                                </svg>
                              ) : notif.type === "system" ? (
                                <svg
                                  className="w-5 h-5 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-5 h-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24">
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    strokeWidth={2}
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3"
                                  />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <div
                                className="font-semibold mb-1"
                                style={{
                                  color: notif.read
                                    ? currentTheme.text.muted
                                    : currentTheme.text.primary,
                                }}>
                                {notif.data?.message || notif.type}
                              </div>
                              <div
                                className="text-xs"
                                style={{ color: currentTheme.text.muted }}>
                                {new Date(notif.createdAt).toLocaleString(
                                  "fr-FR",
                                )}
                              </div>
                            </div>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    <div
                      className="border-t p-2 text-center"
                      style={{ borderColor: currentTheme.border.primary }}>
                      <Link
                        href="/notifications"
                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                        style={{ color: currentTheme.interactive.primary }}>
                        Voir toutes les notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Search Icon - Visible only on mobile */}
              <button
                onClick={toggleSearch}
                className={`md:hidden p-2.5 rounded-xl transition-all duration-300 ease-in-out hover:scale-105 header-button ${
                  isSearchExpanded ? "rotate-90 scale-110" : ""
                }`}
                style={{
                  backgroundColor: currentTheme.background.secondary,
                  color: currentTheme.text.secondary,
                  border: `1px solid ${currentTheme.border.primary}`,
                }}
                aria-label="Basculer la recherche">
                <svg
                  className="w-5 h-5 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Theme Toggle - Hidden on mobile when search is expanded */}
              <button
                onClick={toggleDarkMode}
                className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 header-button ${
                  isSearchExpanded ? "hidden" : ""
                }`}
                style={{
                  backgroundColor: currentTheme.background.secondary,
                  color: currentTheme.text.secondary,
                  border: `1px solid ${currentTheme.border.primary}`,
                }}
                aria-label="Basculer le mode sombre">
                {darkMode ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* User Menu or Auth Buttons */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-xl transition-all duration-200 hover:scale-105 header-button"
                    style={{
                      backgroundColor: currentTheme.background.secondary,
                      color: currentTheme.text.secondary,
                      border: `1px solid ${currentTheme.border.primary}`,
                    }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                      style={{
                        backgroundColor: currentTheme.interactive.primary,
                        color: "white",
                      }}>
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="hidden md:block text-sm font-medium">
                      {user?.name}
                    </span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200"
                      style={{
                        transform: showUserMenu
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div
                      className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 z-50"
                      style={{
                        backgroundColor: currentTheme.background.secondary,
                        border: `1px solid ${currentTheme.border.primary}`,
                        boxShadow: `0 10px 25px ${currentTheme.border.primary}40`,
                      }}>
                      <div
                        className="px-4 py-2 border-b"
                        style={{ borderColor: currentTheme.border.primary }}>
                        <p
                          className="text-sm font-medium"
                          style={{ color: currentTheme.text.primary }}>
                          {user?.name}
                        </p>
                        {user?.email && (
                          <p
                            className="text-xs"
                            style={{ color: currentTheme.text.muted }}>
                            {user.email}
                          </p>
                        )}
                        {user?.address && (
                          <p
                            className="text-xs"
                            style={{ color: currentTheme.text.muted }}>
                            {typeof user.address === "object"
                              ? (user.address.address || user.address.city || user.address.state || user.address.zipCode
                                  ? [
                                      user.address.address,
                                      user.address.city,
                                      user.address.state,
                                      user.address.zipCode
                                    ].filter(Boolean).join(", ")
                                  : <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{JSON.stringify(user.address, null, 2)}</pre>)
                              : user.address}
                          </p>
                        )}
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm transition-colors"
                        style={{ color: currentTheme.text.secondary }}
                        onClick={() => setShowUserMenu(false)}>
                        Mon profil
                      </Link>
                      {user?.role === "store" && (
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm transition-colors"
                          style={{ color: currentTheme.text.secondary }}
                          onClick={() => setShowUserMenu(false)}>
                          Tableau de bord
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm transition-colors"
                        style={{ color: currentTheme.text.secondary }}>
                        Se déconnecter
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Login Button - Hidden on mobile */}
                  <Link
                    href="/auth/login"
                    className="hidden md:block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 header-button"
                    style={{
                      color: currentTheme.text.secondary,
                      backgroundColor: currentTheme.background.secondary,
                      border: `1px solid ${currentTheme.border.primary}`,
                    }}>
                    Connexion
                  </Link>

                  {/* Sign Up Button - Hidden on mobile */}
                  <Link
                    href="/auth/register"
                    className="hidden md:block px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:scale-105 signup-button"
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.interactive.primary}, ${currentTheme.interactive.primaryHover})`,
                      boxShadow: `0 4px 12px ${currentTheme.interactive.primary}40`,
                    }}>
                    S&apos;inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* Mobile Search Bar - Expandable */}
      <div
        className={`md:hidden border-b transition-all duration-500 ease-in-out overflow-hidden ${
          isSearchExpanded ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          backgroundColor: currentTheme.background.primary,
          borderColor: currentTheme.border.primary,
        }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher des services, prestataires ou lieux..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: currentTheme.background.secondary,
                  color: currentTheme.text.primary,
                  border: `1px solid ${currentTheme.border.primary}`,
                  boxShadow: `0 1px 3px ${currentTheme.border.primary}20`,
                }}
                autoFocus
              />
              <div
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: currentTheme.text.muted }}>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                type="button"
                onClick={toggleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-opacity-10 transition-colors"
                style={{
                  color: currentTheme.text.muted,
                  backgroundColor: `${currentTheme.text.muted}20`,
                }}>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
