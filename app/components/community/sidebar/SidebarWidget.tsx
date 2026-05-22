import type { ReactNode } from "react";
import Link from "next/link";

export type SidebarWidgetProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  icon?: ReactNode;
  className?: string;
  fullWidth?: boolean;
  variant?: "default" | "accent";
};

export function SidebarWidget({
  title,
  subtitle,
  children,
  actionLabel,
  actionHref,
  icon,
  className = "",
  fullWidth = false,
  variant = "default",
}: SidebarWidgetProps) {
  return (
    <section
      className={`sidebar-widget ${variant === "accent" ? "sidebar-widget--accent" : ""} ${
        fullWidth ? "sidebar-widget--full" : ""
      } ${className}`.trim()}
    >
      <header className="sidebar-widget__header">
        <div className="sidebar-widget__title-row">
          {icon ? <span className="sidebar-widget__icon">{icon}</span> : null}
          <div className="min-w-0">
            <h3 className="sidebar-widget__title">{title}</h3>
            {subtitle ? <p className="sidebar-widget__subtitle">{subtitle}</p> : null}
          </div>
        </div>
        {actionLabel && actionHref ? (
          <Link href={actionHref} className="sidebar-widget__action">
            {actionLabel}
          </Link>
        ) : null}
      </header>
      <div className="sidebar-widget__body">{children}</div>
    </section>
  );
}
