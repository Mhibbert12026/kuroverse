"use client";

import { useState } from "react";
import type { HomeActivityPage, HomeLiveSnapshot } from "@/lib/home/types";
import { HomeActivityFeed } from "./HomeActivityFeed";
import { HomeLiveSidebar } from "./HomeLiveSidebar";

type HomeSocialHubProps = {
  initialActivity: HomeActivityPage;
  initialLive: HomeLiveSnapshot;
};

export function HomeSocialHub({ initialActivity, initialLive }: HomeSocialHubProps) {
  const [liveSnapshot, setLiveSnapshot] = useState(initialLive);

  return (
    <section id="live-feed" className="home-social-hub">
      <div className="home-social-hub__layout">
        <div className="home-social-hub__main">
          <HomeActivityFeed
            initialPage={initialActivity}
            onLiveUpdate={setLiveSnapshot}
          />
        </div>
        <HomeLiveSidebar snapshot={liveSnapshot} />
      </div>
    </section>
  );
}
