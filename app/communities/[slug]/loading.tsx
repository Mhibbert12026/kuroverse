import { TopNav } from "@/app/components/TopNav";
import { CommunityPageSkeleton } from "@/app/components/community/CommunityPageSkeleton";

export default function CommunityLoading() {
  return (
    <div className="film-grain relative min-h-screen bg-background">
      <TopNav />
      <main className="pt-16">
        <CommunityPageSkeleton />
      </main>
    </div>
  );
}
