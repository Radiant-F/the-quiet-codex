import { DISPLAY, TEXT_PRIMARY, TEXT_DIM, AURORA_2 } from "../lib/theme";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function DashboardHeader({
  title,
  subtitle,
  action,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {subtitle && (
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-[0.15em]"
            style={{ color: AURORA_2 }}
          >
            {subtitle}
          </p>
        )}
        <h1
          className="text-3xl font-semibold md:text-4xl"
          style={{ fontFamily: DISPLAY, color: TEXT_PRIMARY }}
        >
          {title}
        </h1>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
