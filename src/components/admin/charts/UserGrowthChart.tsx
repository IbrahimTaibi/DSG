import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface UserGrowthData {
  month: string;
  newUsers: number;
  totalUsers: number;
}

interface UserGrowthChartProps {
  data: UserGrowthData[];
  title?: string;
}

export default function UserGrowthChart({
  data,
  title = "Croissance des utilisateurs",
}: UserGrowthChartProps) {
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
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; dataKey: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="p-3 rounded-lg border shadow-lg"
          style={{
            background: currentTheme.background.card,
            borderColor: currentTheme.border.primary,
            color: currentTheme.text.primary,
          }}>
          <p className="font-semibold">{label}</p>
          <p style={{ color: currentTheme.status.success }}>
            Nouveaux utilisateurs: {payload[0].value}
          </p>
          <p style={{ color: currentTheme.status.info }}>
            Total: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Responsive margins based on screen size
  const chartMargins = isMobile
    ? { top: 5, right: 15, left: 15, bottom: 5 }
    : { top: 5, right: 30, left: 20, bottom: 5 };

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
        <AreaChart data={data} margin={chartMargins}>
          <defs>
            <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={currentTheme.status.success}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={currentTheme.status.success}
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="colorTotalUsers" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={currentTheme.status.info}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={currentTheme.status.info}
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={currentTheme.border.primary}
            opacity={0.3}
          />
          <XAxis
            dataKey="month"
            stroke={currentTheme.text.secondary}
            fontSize={isMobile ? 8 : 12}
          />
          <YAxis
            stroke={currentTheme.text.secondary}
            fontSize={isMobile ? 8 : 12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="newUsers"
            stroke={currentTheme.status.success}
            fillOpacity={1}
            fill="url(#colorNewUsers)"
            name="Nouveaux utilisateurs"
          />
          <Area
            type="monotone"
            dataKey="totalUsers"
            stroke={currentTheme.status.info}
            fillOpacity={1}
            fill="url(#colorTotalUsers)"
            name="Total utilisateurs"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
