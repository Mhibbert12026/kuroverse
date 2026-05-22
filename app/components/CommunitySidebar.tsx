import { communities } from "@/lib/data";
import { PLATFORM_PLUS } from "@/lib/brand";
import { SectionHeader } from "./SectionHeader";

export function CommunitySidebar() {
  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1 feed-scroll">
      <div className="rounded-2xl border border-white/8 glass-panel-deep p-4 sm:p-5 glow-border-purple">
        <SectionHeader
          title="More Servers"
          subtitle="Discover active communities"
        />

        <div className="relative mt-4 mb-4">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="search"
            placeholder="Find a server..."
            className="h-9 w-full rounded-lg border border-white/8 bg-white/5 pl-9 pr-3 text-xs text-white placeholder:text-white/35 transition-all duration-200 focus:border-accent-purple/40 focus:outline-none focus:ring-1 focus:ring-accent-purple/20 focus:shadow-[0_0_16px_rgba(147,51,234,0.15)]"
          />
        </div>

        <ul className="flex flex-col gap-1">
          {communities.map((community) => (
            <li key={community.id}>
              <button
                type="button"
                className="group flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-all duration-300 hover:bg-white/5 hover:shadow-[inset_0_0_20px_rgba(255,90,31,0.05)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-gradient-to-br from-white/10 to-white/5 text-lg transition-all duration-300 group-hover:scale-110 group-hover:border-accent-orange/30 group-hover:shadow-[0_0_16px_rgba(255,90,31,0.2)]">
                  {community.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-white transition-colors duration-200 group-hover:text-accent-orange">
                      {community.name}
                    </span>
                    {community.trending && (
                      <span className="shrink-0 rounded bg-accent-orange/25 px-1.5 py-0.5 text-[9px] font-bold uppercase text-accent-orange shadow-[0_0_8px_rgba(255,90,31,0.3)]">
                        Hot
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-white/38">
                    {community.category} · {community.members} members
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    {community.online.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-white/28">online</span>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <a
          href="#communities"
          className="mt-4 flex w-full items-center justify-center rounded-xl border border-dashed border-white/12 py-3 text-xs font-semibold text-white/45 transition-all duration-300 hover:border-accent-purple/40 hover:bg-accent-purple/5 hover:text-white hover:shadow-[0_0_20px_rgba(147,51,234,0.1)]"
        >
          Browse all communities →
        </a>
      </div>

      <div className="rounded-2xl border border-accent-orange/25 bg-gradient-to-br from-accent-orange/15 via-surface-card to-accent-purple/10 p-4 sm:p-5 shadow-[0_0_40px_rgba(255,90,31,0.08)]">
        <p className="text-xs font-bold uppercase tracking-widest text-accent-orange">
          {PLATFORM_PLUS}
        </p>
        <h3 className="mt-1 font-display text-base font-bold text-white">
          Go premium
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-white/45">
          Ad-free streaming, glowing profile badges, and early simulcast access.
        </p>
        <button
          type="button"
          className="mt-4 w-full rounded-full bg-gradient-to-r from-accent-orange to-accent-pink py-2.5 text-xs font-bold text-white shadow-[0_0_24px_rgba(255,90,31,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(255,90,31,0.45)]"
        >
          Try 7 days free
        </button>
      </div>
    </aside>
  );
}
