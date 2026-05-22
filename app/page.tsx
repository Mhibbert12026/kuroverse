import { AppShell } from "./components/layout/AppShell";
import { HomeAnimeContent } from "./components/HomeAnimeContent";

export default function Home() {
  return (
    <AppShell ambience="home" footer mainClassName="home-page-main">
      <HomeAnimeContent />
    </AppShell>
  );
}
