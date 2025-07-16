import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface ActivityItem {
  id: string;
  type: "user" | "order" | "product" | "review";
  action: string;
  description: string;
  timestamp: string;
  user: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  title?: string;
}

export default function RecentActivity({
  activities,
  title = "Activité récente",
}: RecentActivityProps) {
  const { currentTheme } = useDarkMode();

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "user":
        return <span className="text-lg">👤</span>;
      case "order":
        return <span className="text-lg">📦</span>;
      case "product":
        return <span className="text-lg">🛍️</span>;
      case "review":
        return <span className="text-lg">⭐</span>;
      default:
        return <span className="text-lg">📝</span>;
    }
  };

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "user":
        return currentTheme.status.info;
      case "order":
        return currentTheme.status.success;
      case "product":
        return currentTheme.status.warning;
      case "review":
        return currentTheme.status.error;
      default:
        return currentTheme.text.secondary;
    }
  };

  return (
    <div
      className="p-3 sm:p-4 md:p-6 rounded-xl border h-full flex flex-col w-full"
      style={{
        background: currentTheme.background.card,
        borderColor: currentTheme.border.primary,
      }}>
      <h3
        className="text-lg font-semibold mb-4 flex-shrink-0"
        style={{ color: currentTheme.text.primary }}>
        {title}
      </h3>
      <div className="space-y-4 flex-1 overflow-y-auto hide-scrollbar">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg border transition-colors hover:bg-opacity-50"
            style={{
              borderColor: currentTheme.border.primary,
              backgroundColor: `${getActivityColor(activity.type)}10`,
            }}>
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: currentTheme.text.primary }}>
                  {activity.action}
                </p>
                <span
                  className="text-xs"
                  style={{ color: currentTheme.text.secondary }}>
                  {activity.timestamp}
                </span>
              </div>
              <p
                className="text-sm mb-1"
                style={{ color: currentTheme.text.secondary }}>
                {activity.description}
              </p>
              <p
                className="text-xs"
                style={{ color: getActivityColor(activity.type) }}>
                par {activity.user}
              </p>
            </div>
          </div>
        ))}
      </div>
      {activities.length === 0 && (
        <div
          className="text-center py-8 flex-1 flex items-center justify-center"
          style={{ color: currentTheme.text.secondary }}>
          <p>Aucune activité récente</p>
        </div>
      )}
    </div>
  );
}
