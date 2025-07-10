import React, { useEffect, useRef, useState } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";

interface TopProgressBarProps {
  loading: boolean;
  color?: string;
  height?: number;
  minDuration?: number; // ms
}

const TopProgressBar: React.FC<TopProgressBarProps> = ({
  loading,
  color,
  height = 3,
  minDuration = 400,
}) => {
  const { currentTheme } = useDarkMode();
  const barColor = color || currentTheme.interactive.primary;
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (loading) {
      setVisible(true);
      setProgress(0);
      startTimeRef.current = Date.now();
      // Animate to 80% quickly
      setTimeout(() => setProgress(80), 50);
    } else {
      // Only finish if minDuration has passed
      const elapsed = startTimeRef.current
        ? Date.now() - startTimeRef.current
        : 0;
      const remaining = Math.max(minDuration - elapsed, 0);
      timeoutRef.current = setTimeout(() => {
        setProgress(100);
        // Hide after short delay
        setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 300);
      }, remaining);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [loading, minDuration]);

  return visible ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${progress}%`,
        height,
        background: barColor,
        zIndex: 9999,
        transition:
          progress === 0 ? "none" : "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: `0 2px 8px 0 ${barColor}33`,
        pointerEvents: "none",
      }}
    />
  ) : null;
};

export default TopProgressBar;
