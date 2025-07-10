import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface MessageBubbleProps {
  from: string;
  date: string;
  content: string;
  isOwn?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  from,
  date,
  content,
  isOwn,
}) => {
  const { currentTheme } = useDarkMode();
  return (
    <div
      className={`rounded-xl p-4 border shadow-sm mx-2 md:mx-0 ${
        isOwn ? "ml-12 bg-opacity-80" : "mr-12"
      }`}
      style={{
        background: currentTheme.background.card,
        border: `1px solid ${currentTheme.border.primary}`,
        color: currentTheme.text.primary,
      }}>
      <div className="flex justify-between items-center mb-1">
        <span
          className="font-semibold"
          style={{ color: currentTheme.text.secondary }}>
          {from}
        </span>
        <span className="text-xs" style={{ color: currentTheme.text.muted }}>
          {date}
        </span>
      </div>
      <div>{content}</div>
    </div>
  );
};

export default MessageBubble;
