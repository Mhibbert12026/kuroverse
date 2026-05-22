import { getUser } from "@/lib/auth/session";
import { getPersonalizedRecommendations } from "@/lib/home/personalized";
import { HomePersonalizedSection } from "./HomePersonalizedSection";

export async function HomePersonalizedLoader() {
  const user = await getUser();
  const initial = user ? await getPersonalizedRecommendations(user.id, 1) : null;

  return <HomePersonalizedSection initial={initial} />;
}
