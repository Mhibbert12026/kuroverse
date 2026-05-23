import { getDailyFeatured } from "@/lib/seeding/featured";
import { DailyFeaturedBanner } from "./DailyFeaturedBanner";

export async function DailyFeaturedLoader() {
  const featured = await getDailyFeatured();
  return <DailyFeaturedBanner featured={featured} />;
}
