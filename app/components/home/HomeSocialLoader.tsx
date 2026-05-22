import { getHomeActivityPage, getHomeLiveSnapshot } from "@/lib/home";
import { HomeSocialHub } from "./HomeSocialHub";

export async function HomeSocialLoader() {
  const [initialActivity, initialLive] = await Promise.all([
    getHomeActivityPage(1),
    getHomeLiveSnapshot(),
  ]);

  return <HomeSocialHub initialActivity={initialActivity} initialLive={initialLive} />;
}
