import type { CommunityPageData } from "@/lib/communities/types";
import { CommunityClips } from "../CommunityClips";
import { CommunityDiscussionSections } from "../CommunityDiscussionSections";
import { CommunityHeroSection, communityPageToHeroProps } from "../hero";
import { CommunitySidebar } from "../CommunitySidebar";
import { CommunityStats } from "../CommunityStats";
import { CommunityStickyJoin } from "../CommunityStickyJoin";
import { CommunityPageRailNav } from "./CommunityPageRailNav";

type CommunityPageLayoutProps = {
  community: CommunityPageData;
};

/**
 * Full community page shell — hero, main column (pulse → discussion → clips),
 * sidebar, and mobile sticky join. Mobile-first spacing and section hierarchy.
 */
export function CommunityPageLayout({ community }: CommunityPageLayoutProps) {
  const accent = community.accentColor ?? "#7c3aed";

  return (
    <div className="community-page hub-page relative min-h-screen bg-background pb-28 lg:pb-16">
      <div className="community-page__ambient pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div
          className="community-page__glow community-page__glow--primary absolute -left-32 top-0 h-[min(420px,55vh)] w-[min(420px,80vw)] rounded-full blur-[120px] opacity-20"
          style={{ backgroundColor: accent }}
        />
        <div className="community-page__glow community-page__glow--secondary absolute -right-32 top-[18%] h-[320px] w-[320px] rounded-full bg-accent-purple/10 blur-[100px]" />
        <div className="community-page__glow community-page__glow--floor absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      <CommunityHeroSection {...communityPageToHeroProps(community)} />

      <div className="community-page__shell relative z-10">
        <div className="community-page__container mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <CommunityPageRailNav />

          <div className="community-page__grid">
            <main className="community-page__main" id="community-main">
              <section
                id="community-pulse"
                className="community-page__section community-page__section--pulse lg:hidden"
                aria-label="Community pulse"
              >
                <CommunityStats stats={community.stats} />
              </section>

              <div className="community-page__section community-page__section--feed">
                <CommunityDiscussionSections community={community} />
              </div>

              <div className="community-page__divider" role="presentation" aria-hidden />

              <div className="community-page__section community-page__section--clips community-page__section--bleed">
                <CommunityClips clips={community.clips} />
              </div>

              <div className="community-page__divider community-page__divider--subtle hidden lg:block" role="presentation" aria-hidden />

              <section
                className="community-page__section community-page__section--pulse hidden lg:block"
                aria-label="Community activity summary"
              >
                <CommunityStats stats={community.stats} />
              </section>
            </main>

            <aside
              id="community-sidebar"
              className="community-page__aside"
              aria-label="Community sidebar"
            >
              <p className="community-page__aside-kicker lg:hidden">Explore the fandom</p>
              <CommunitySidebar sidebar={community.sidebar} />
            </aside>
          </div>
        </div>
      </div>

      <CommunityStickyJoin title={community.title} />
    </div>
  );
}
