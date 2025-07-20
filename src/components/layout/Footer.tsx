import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import DSG_INFO from '@/config/dsgInfo';

const footerLinks = [
  {
    title: "About",
    links: [
      { label: "Our Story", href: "#" },
      { label: "Team", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Find a Service", href: "#" },
      { label: "Become a Provider", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "FAQs", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Community", href: "#" },
      { label: "Guides", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  },
];

const socialLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
];

const Footer: React.FC = () => {
  const { currentTheme } = useDarkMode();
  return (
    <footer
      className="w-full pt-12 pb-8 px-4 border-t"
      style={{
        background: currentTheme.background.card,
        color: currentTheme.text.secondary,
        borderColor: currentTheme.border.primary,
      }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-8">
        {/* Info Columns */}
        {footerLinks.map((section) => (
          <div key={section.title} className="col-span-1">
            <h3
              className="text-lg font-semibold mb-4 tracking-wide"
              style={{ color: currentTheme.text.primary }}>
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:underline"
                    style={{ color: currentTheme.interactive.primary }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {/* Contact & Social */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          <div>
            <h3
              className="text-lg font-semibold mb-4 tracking-wide"
              style={{ color: currentTheme.text.primary }}>
              Contact
            </h3>
            <div className="space-y-2 text-base">
              <div>
                <span>Email: </span>
                <a
                  href={`mailto:${DSG_INFO.email}`}
                  className="hover:underline"
                  style={{ color: currentTheme.interactive.primary }}>
                  {DSG_INFO.email}
                </a>
              </div>
              <div>
                <span>Phone: </span>
                <span style={{ color: currentTheme.text.secondary }}>
                  {DSG_INFO.phone}
                </span>
              </div>
              <div>
                <span>Address: </span>
                <span style={{ color: currentTheme.text.secondary }}>
                  {DSG_INFO.address}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3
              className="text-lg font-semibold mb-4 tracking-wide"
              style={{ color: currentTheme.text.primary }}>
              Follow Us
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:underline text-base"
                  style={{ color: currentTheme.interactive.primary }}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className="max-w-7xl mx-auto mt-12 pt-6 border-t text-center text-sm font-medium tracking-wide"
        style={{
          borderColor: currentTheme.border.primary,
          color: currentTheme.text.muted,
        }}>
        DSG Marketplace &copy; {new Date().getFullYear()} &mdash; All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
