import type { ReactNode } from "react";

type AnimeHubSectionProps = {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  children: ReactNode;
  id?: string;
};

export function AnimeHubSection({
  title,
  subtitle,
  action,
  children,
  id,
}: AnimeHubSectionProps) {
  return (
    <section id={id} className="hub-panel">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-white sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-white/45">{subtitle}</p>}
        </div>
        {action && (
          <a
            href={action.href}
            className="text-sm font-semibold text-accent-orange transition-colors hover:text-accent-pink"
          >
            {action.label} →
          </a>
        )}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
