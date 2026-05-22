import { AnimeImage } from "@/app/components/AnimeImage";
import type { HubDiscussion } from "@/lib/anilist/hub-types";
import { AnimeHubSection } from "./AnimeHubSection";

type AnimeHubDiscussionProps = {
  discussions: HubDiscussion[];
  title: string;
};

export function AnimeHubDiscussion({ discussions, title }: AnimeHubDiscussionProps) {
  return (
    <AnimeHubSection
      id="hub-discussions"
      title="Discussion Feed"
      subtitle={`Live threads from the ${title} community`}
      action={{ label: "Start a thread", href: "#communities" }}
    >
      <div className="hub-comment-compose mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/40">
          Start a thread
        </p>
        <textarea
          rows={2}
          readOnly
          placeholder={`Ask the ${title} community…`}
          className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/50 placeholder:text-white/30"
        />
        <a href="/#communities" className="mt-3 inline-flex hub-btn hub-btn--secondary text-xs">
          Post to community
        </a>
      </div>

      <div className="flex flex-col gap-3">
        {discussions.map((post) => (
          <article
            key={post.id}
            className={`hub-discussion ${post.pinned ? "hub-discussion--pinned" : ""}`}
          >
            {post.pinned && (
              <span className="mb-2 inline-block rounded-md bg-accent-orange/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-orange">
                Pinned
              </span>
            )}
            <div className="flex gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10">
                <AnimeImage
                  src={post.avatarUrl}
                  alt={post.author}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-white">@{post.author}</span>
                  <span className="text-[10px] text-white/35">{post.timeAgo}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{post.body}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
                  <button type="button" className="font-semibold transition-colors hover:text-accent-pink">
                    ♥ {post.likes.toLocaleString()}
                  </button>
                  <button type="button" className="font-semibold transition-colors hover:text-accent-cyan">
                    💬 {post.replies} replies
                  </button>
                  <button type="button" className="font-semibold transition-colors hover:text-accent-orange">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AnimeHubSection>
  );
}
