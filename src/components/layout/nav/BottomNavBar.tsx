import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDarkMode } from "../../../contexts/DarkModeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useCart } from "../../../contexts/CartContext";
import { useNotifications } from "../../../contexts/NotificationContext";
import { ShoppingCart } from "lucide-react";

export default function BottomNavBar() {
  const { currentTheme } = useDarkMode();
  const { user } = useAuth();
  const { state: cartState } = useCart();
  const { unreadCount } = useNotifications();
  const router = useRouter();

  const isLoggedIn = !!user;
  
  // Define the link interface
  interface NavLink {
    name: string;
    href: string;
    icon: React.ReactNode;
    isCart?: boolean;
  }
  
  // Base links for all users
  const baseLinks: NavLink[] = [
    {
      name: "Acceuil",
      href: "/",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v11a1 1 0 01-1 1h-3m-4 0h4"
          />
        </svg>
      ),
    },
    {
      name: "Panier",
      href: "#",
      icon: (
        <span className="relative inline-block">
          <ShoppingCart className="w-6 h-6" />
          {/* Cart badge */}
          {cartState.itemCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full px-1 py-0.5 shadow"
              style={{
                minWidth: 14,
                height: 14,
                lineHeight: "12px",
                textAlign: "center",
                border: "1.5px solid white",
                padding: 0,
              }}>
              {cartState.itemCount > 99 ? "99+" : cartState.itemCount}
            </span>
          )}
        </span>
      ),
      isCart: true,
    },
    {
      name: isLoggedIn ? "Profile" : "Login",
      href: isLoggedIn ? "/profile" : "/login",
      icon: isLoggedIn ? (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          />
        </svg>
      ) : (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12H3m6-6l-6 6 6 6"
          />
          <circle cx="19" cy="12" r="2" />
        </svg>
      ),
    },
    {
      name: "Mes commandes",
      href: "/orders",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.5 7h13l-1.38 12.03A2 2 0 0115.13 21H8.87a2 2 0 01-1.99-1.97L5.5 7zm3.5 0V5a3 3 0 116 0v2"
          />
        </svg>
      ),
    },
    {
      name: "Contactez le Fournisseur",
      href: "/contact",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6A8.38 8.38 0 0112.5 3a8.5 8.5 0 018.5 8.5z"
          />
        </svg>
      ),
    },
  ];

  // Add dashboard for admin
  if (user?.role === "admin") {
    baseLinks.splice(1, 0, {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13h8V3H3v10zm10 8h8v-6h-8v6zm0-8h8V3h-8v10zm-10 8h8v-6H3v6z"
          />
        </svg>
      ),
    });
  }

  // Add notification bell for all users
  baseLinks.splice(baseLinks.length - 1, 0, {
    name: "Notifications",
    href: "/notifications",
    icon: (
      <span className="relative inline-block">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {/* Notification badge */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full px-1 py-0.5 shadow"
            style={{
              minWidth: 14,
              height: 14,
              lineHeight: "12px",
              textAlign: "center",
              border: "1.5px solid white",
              padding: 0,
            }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </span>
    ),
  });

  return (
    <>
      <nav
        className="w-full border-t fixed bottom-0 left-0 z-50 md:hidden bottomnav-container"
        style={
          {
            borderColor: currentTheme.border.primary,
            background: currentTheme.background.primary,
            "--primary-color": currentTheme.interactive.primary,
            "--primary-color-dark": currentTheme.interactive.secondary,
          } as React.CSSProperties
        }>
        <ul className="flex justify-around py-0 h-14">
          {baseLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? router.pathname === "/"
                : router.pathname === link.href ||
                  router.asPath.startsWith(link.href);
            
            // Handle cart button differently
            if (link.isCart) {
              return (
                <li key={link.href} className="flex-1 h-full m-0 p-0">
                  <button
                    onClick={() => (window as unknown as { openCartDrawer?: () => void }).openCartDrawer?.()}
                    className={`bottomnav-link flex flex-col items-center justify-center w-full h-full transition-all duration-200${
                      isActive ? " active" : ""
                    }`}
                    style={{
                      color: isActive
                        ? currentTheme.interactive.primary
                        : currentTheme.text.primary,
                      background: "transparent",
                      borderRadius: 0,
                      border: "none",
                      cursor: "pointer",
                    }}>
                    {link.icon}
                  </button>
                </li>
              );
            }
            
            return (
              <li key={link.href} className="flex-1 h-full m-0 p-0">
                <Link
                  href={link.href}
                  className={`bottomnav-link flex flex-col items-center justify-center w-full h-full transition-all duration-200${
                    isActive ? " active" : ""
                  }`}
                  style={{
                    color: isActive
                      ? currentTheme.interactive.primary
                      : currentTheme.text.primary,
                    background: "transparent",
                    borderRadius: 0,
                  }}>
                  {link.icon}
                </Link>
              </li>
            );
          })}
        </ul>
              </nav>
      </>
    );
}
