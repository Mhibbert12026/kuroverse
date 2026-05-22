import { SidebarWidget } from "./SidebarWidget";

export function SidebarPremiumCta() {
  return (
    <SidebarWidget title="KuroVerse Premium" variant="accent" fullWidth className="sidebar-premium-cta">
      <p className="sidebar-premium-cta__copy">
        Custom roles, early clip drops, ad-free browsing, and exclusive watch parties.
      </p>
      <ul className="sidebar-premium-cta__perks">
        <li>⚡ Early episode alerts</li>
        <li>🎬 HD clip uploads</li>
        <li>✨ Profile flair packs</li>
      </ul>
      <button type="button" className="hub-btn hub-btn--primary sidebar-premium-cta__btn w-full justify-center text-xs">
        Upgrade
      </button>
    </SidebarWidget>
  );
}
