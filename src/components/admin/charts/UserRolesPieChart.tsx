import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface UserRolesData {
  name: string;
  value: number;
  color: string;
}

interface UserRolesPieChartProps {
  data: UserRolesData[];
  title?: string;
}

export default function UserRolesPieChart({
  data,
  title = "Répartition des rôles",
}: UserRolesPieChartProps) {
  const { currentTheme } = useDarkMode();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: UserRolesData }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div
          className="p-3 rounded-lg border shadow-lg"
          style={{
            background: currentTheme.background.card,
            borderColor: currentTheme.border.primary,
            color: currentTheme.text.primary,
          }}>
          <p className="font-semibold">{data.name}</p>
          <p style={{ color: data.payload.color }}>
            Utilisateurs: {data.value}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({
    payload,
  }: {
    payload?: Array<{ value: string; color: string }>;
  }) => {
    if (!payload) return null;

    return (
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-1 text-xs"
            style={{ color: currentTheme.text.secondary }}>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`${
        isMobile ? "p-2" : "p-3 sm:p-4 md:p-6"
      } rounded-xl border h-full flex flex-col w-full`}
      style={{
        background: currentTheme.background.card,
        borderColor: currentTheme.border.primary,
      }}>
      <h3
        className={`${
          isMobile ? "text-base" : "text-lg"
        } font-semibold mb-4 flex-shrink-0`}
        style={{ color: currentTheme.text.primary }}>
        {title}
      </h3>
      <ResponsiveContainer
        width="100%"
        height="100%"
        minHeight={isMobile ? 150 : 200}
        className="flex-1">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={false}
            outerRadius={isMobile ? 30 : 80}
            fill="#8884d8"
            dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
