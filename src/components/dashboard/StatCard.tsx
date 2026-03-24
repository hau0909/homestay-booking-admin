import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  colorClass?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  colorClass = "bg-indigo-50 text-[#11009E]",
}: StatCardProps) {
  const trendColor =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
      ? "text-rose-600"
      : "text-slate-500";

  const trendIcon =
    trend === "up" ? "↑" : trend === "down" ? "↓" : "";

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <div className={`p-2 rounded-lg ${colorClass}`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      {(description || trendValue) && (
        <p className={`text-xs ${trendColor} flex items-center gap-1 font-medium mt-1`}>
          {trendIcon && <span>{trendIcon}</span>}
          {trendValue && <span>{trendValue}</span>}
          {description && <span className="text-slate-500 font-normal ml-1">{description}</span>}
        </p>
      )}
    </div>
  );
}
