import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDarkMode } from "@/contexts/DarkModeContext";

interface OrderStatsData {
  month: string;
  orders: number;
  revenue: number;
  avgOrderValue: number;
}

interface OrderStatsBarChartProps {
  data: OrderStatsData[];
  title?: string;
}

export default function OrderStatsBarChart({
  data,
  title = "Statistiques des commandes",
}: OrderStatsBarChartProps) {
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
    payload?: Array<{ value: number; dataKey: string; name: string }>;
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
          {payload.map((entry, index) => (
            <p
              key={index}
              style={{
                color:
                  entry.dataKey === "orders"
                    ? currentTheme.status.success
                    : currentTheme.status.info,
              }}>
              {entry.name}:{" "}
              {entry.dataKey === "revenue" ? `${entry.value}€` : entry.value}
            </p>
          ))}
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
        <BarChart data={data} margin={chartMargins}>
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
          <Bar
            dataKey="orders"
            fill={currentTheme.status.success}
            name="Commandes"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="revenue"
            fill={currentTheme.status.info}
            name="Revenus (€)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
