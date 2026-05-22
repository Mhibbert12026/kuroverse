export function JoinCommunityCTA() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 glass-panel-deep cinematic-vignette glow-border-purple">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/15 via-accent-pink/10 to-accent-orange/15" />
      <div className="absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent-purple/30 blur-[80px] animate-pulse-glow" />
      <div className="absolute -right-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent-orange/25 blur-[80px] animate-pulse-glow" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(2,2,8,0.4)_100%)]" />

      <div className="relative flex flex-col items-center gap-6 px-6 py-12 text-center sm:px-12 sm:py-16 lg:flex-row lg:text-left">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-orange">
            Your fandom awaits
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Ready to dive into the{" "}
            <span className="gradient-text">ultimate anime community</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base lg:mx-0">
            Connect with millions of fans, share clips, join legendary servers, and
            never miss what&apos;s trending this season.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <a
            href="#communities"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-purple px-8 py-4 text-sm font-bold text-white shadow-[0_0_40px_rgba(255,90,31,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(255,90,31,0.5)] animate-glow-pulse"
          >
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l-.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72m0 0a9.094 9.094 0 003.74.477M12 21c2.17 0 4.207-.576 5.963-1.584"
              />
            </svg>
            Join the Community
          </a>
          <a
            href="#trending-anime"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:shadow-[0_0_24px_rgba(255,255,255,0.08)]"
          >
            Explore Trending
          </a>
        </div>
      </div>
    </section>
  );
}
