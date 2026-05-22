import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/app/components/layout/AppShell";
import { CommunityPageView } from "@/app/components/community/CommunityPageView";
import { FEATURED_COMMUNITY_SLUGS, getCommunityPage } from "@/lib/communities";
import { pageTitle } from "@/lib/brand";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return FEATURED_COMMUNITY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const community = await getCommunityPage(slug);
  if (!community) {
    return { title: pageTitle("Community Not Found") };
  }
  return {
    title: `${community.title} Community`,
    description: community.description,
  };
}

export default async function CommunityPage({ params }: PageProps) {
  const { slug } = await params;
  const community = await getCommunityPage(slug);

  if (!community) {
    notFound();
  }

  return (
    <AppShell ambience="community" mainMax="full" mainClassName="!px-0 !pt-0">
      <CommunityPageView community={community} />
    </AppShell>
  );
}
