import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useDarkMode } from '../../contexts/DarkModeContext';
import CategorySidebar from '../category/CategorySidebar';
import HamburgerMenu from '../ui/HamburgerMenu';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = React.memo(({ children }) => {
  const router = useRouter();
  const { currentTheme } = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [router.asPath]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSidebarOpen]);

  const mainContentStyles = useMemo(() => ({
    backgroundColor: currentTheme.background.primary,
  }), [currentTheme.background.primary]);

  return (
    <div className="flex h-full">
      {/* Desktop Sidebar - Always visible */}
      <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
        <CategorySidebar isOpen={true} onClose={() => {}} />
      </div>

      {/* Mobile Sidebar - Overlay */}
      <CategorySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden border-b" style={{ borderColor: currentTheme.border.primary }}>
          <div className="flex items-center justify-between px-4 py-3">
            <HamburgerMenu
              isOpen={isSidebarOpen}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <div className="flex-1" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1" style={mainContentStyles}>
          {children}
        </div>
      </div>
    </div>
  );
});

SidebarLayout.displayName = 'SidebarLayout';

export default SidebarLayout; 