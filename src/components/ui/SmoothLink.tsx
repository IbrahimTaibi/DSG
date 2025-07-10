import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface SmoothLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  prefetch?: boolean;
}

const SmoothLink: React.FC<SmoothLinkProps> = ({
  href,
  children,
  className = "",
  onClick,
  style,
  prefetch = true,
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Add a small delay for smooth transition
    setTimeout(() => {
      if (onClick) {
        onClick();
      }
      router.push(href);
    }, 150);
  };

  return (
    <Link
      href={href}
      className={`smooth-link ${className}`}
      onClick={handleClick}
      style={{
        ...style,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      prefetch={prefetch}>
      {children}
    </Link>
  );
};

export default SmoothLink;
