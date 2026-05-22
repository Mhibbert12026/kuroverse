import Link from "next/link";
import { AnimeImage } from "@/app/components/AnimeImage";
import type { JoinedFandom } from "@/lib/profile/fandoms";

type ProfileFandomsSectionProps = {
  fandoms: JoinedFandom[];
  isOwner: boolean;
};

export function ProfileFandomsSection({ fandoms, isOwner }: ProfileFandomsSectionProps) {
  if (fandoms.length === 0) {
    return (
      <section className="profile-section profile-fandoms profile-fandoms--empty" aria-labelledby="profile-fandoms-heading">
        <h2 id="profile-fandoms-heading" className="profile-section__title">
          Joined fandoms
        </h2>
        <p className="profile-section__empty">
          {isOwner
            ? "Post, like, or comment in a community hub to join fandoms and get post alerts."
            : "No joined fandoms yet."}
        </p>
        {isOwner ? (
          <Link href="/#communities" className="profile-section__cta">
            Explore communities
          </Link>
        ) : null}
      </section>
    );
  }

  return (
    <section className="profile-section profile-fandoms" aria-labelledby="profile-fandoms-heading">
      <div className="profile-section__head">
        <h2 id="profile-fandoms-heading" className="profile-section__title">
          Joined fandoms
        </h2>
        <span className="profile-section__count">{fandoms.length}</span>
      </div>
      <ul className="profile-fandoms__grid">
        {fandoms.map((fandom) => (
          <li key={fandom.slug}>
            <Link
              href={`/communities/${fandom.slug}`}
              className={`profile-fandom-card profile-fandom-card--${fandom.accent}`}
            >
              <AnimeImage
                src={fandom.coverUrl}
                alt=""
                width={160}
                height={90}
                className="profile-fandom-card__cover"
              />
              <span className="profile-fandom-card__scrim" aria-hidden />
              <span className="profile-fandom-card__title">{fandom.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
