import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDarkMode } from "../../../contexts/DarkModeContext";
import { useAuth } from "../../../contexts/AuthContext";

const mainLinks = [
  {
    name: "Acceuil",
    href: "/",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
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
    name: "Profile",
    href: "/profile",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
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
        strokeWidth={2}
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2m-6 0h6"
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
        strokeWidth={2}
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-4 4H8a4 4 0 01-4-4v-1"
        />
      </svg>
    ),
  },
];

// Add prop type for links
interface MainNavBarProps {
  links?: typeof mainLinks;
}

export default function MainNavBar({ links }: MainNavBarProps) {
  const { currentTheme } = useDarkMode();
  const router = useRouter();
  const { user } = useAuth();
  const isDark =
    currentTheme.background.primary === "#0f172a" ||
    currentTheme.background.primary === "#0a0a0a";

  // Use provided links or default to mainLinks
  let navLinks = links || mainLinks.filter((link) => link.name !== "Messages");

  // Only move 'Profile' link to the first position if user is delivery agent
  if (user?.role === "delivery") {
    const profileIndex = navLinks.findIndex((link) => link.name === "Profile");
    if (profileIndex > 0) {
      const [profileLink] = navLinks.splice(profileIndex, 1);
      navLinks = [profileLink, ...navLinks];
    }
  }

  return (
    <nav
      className="w-full border-b md:static fixed bottom-0 left-0 z-50 border-t md:border-t-0 mainnav-container"
      style={
        {
          background: isDark
            ? "linear-gradient(120deg, #15222e, #1a2b3a, #27445d, #111c25)"
            : "linear-gradient(120deg, #e6efed, #cce0db, #e1f3f1, #c3e7e3)",
          borderColor: currentTheme.border.primary,
          "--primary-color": currentTheme.interactive.primary,
          "--primary-color-dark": currentTheme.interactive.secondary,
        } as React.CSSProperties
      }>
      <ul className="flex justify-center space-x-0 py-0 h-12">
        {navLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? router.pathname === "/"
              : router.pathname.startsWith(link.href);
          return (
            <li key={link.href} className="flex-1 h-full m-0 p-0">
              <Link
                href={link.href}
                className={`mainnav-link block w-full h-full font-normal text-sm transition-all duration-200 px-4 py-2 relative select-none text-center align-middle h-12 flex items-center justify-center${
                  isActive ? " active" : ""
                }`}
                style={{
                  color: isActive
                    ? currentTheme.interactive.primary
                    : currentTheme.text.primary,
                  background: currentTheme.background.secondary,
                  borderRadius: 0,
                }}>
                <span className="inline md:hidden">{link.icon}</span>
                <span className="hidden md:inline">{link.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
