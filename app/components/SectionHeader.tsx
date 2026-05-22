type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: { label: string; href?: string };
  id?: string;
};

export function SectionHeader({ title, subtitle, action, id }: SectionHeaderProps) {
  return (
    <div id={id} className="flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-sm text-white/45 sm:text-base">{subtitle}</p>
        )}
      </div>
      {action && (
        <a
          href={action.href ?? "#"}
          className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition-all duration-300 hover:border-accent-orange/40 hover:bg-accent-orange/10 hover:text-accent-orange hover:shadow-[0_0_20px_rgba(255,90,31,0.2)]"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}
