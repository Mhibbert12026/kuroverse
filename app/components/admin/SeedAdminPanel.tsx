"use client";

import { useState, useTransition } from "react";
import {
  runSeedNowAction,
  toggleSeedingAction,
  updateSeedConfigAction,
  type AdminSeedDashboard,
} from "@/lib/seeding/actions";
type SeedAdminPanelProps = {
  initial: AdminSeedDashboard;
};

export function SeedAdminPanel({ initial }: SeedAdminPanelProps) {
  const [config, setConfig] = useState(initial.config);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const saveConfig = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await updateSeedConfigAction(config);
      setMessage(result.ok ? "Settings saved." : result.error ?? "Save failed.");
    });
  };

  const runNow = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await runSeedNowAction();
      if (result.ok) {
        setMessage(
          `Seeded ${result.postsCreated ?? 0} posts. Featured anime #${result.featuredAnimeId ?? "—"}.`,
        );
      } else {
        setMessage(result.error ?? "Run failed.");
      }
    });
  };

  const toggleEnabled = () => {
    const next = !config.enabled;
    setConfig((c) => ({ ...c, enabled: next }));
    startTransition(async () => {
      const result = await toggleSeedingAction(next);
      setMessage(result.ok ? (next ? "Seeding enabled." : "Seeding paused.") : result.error ?? "Failed.");
    });
  };

  return (
    <div className="admin-seed">
      <header className="admin-seed__header">
        <p className="admin-seed__eyebrow">Moderator · KuroVerse</p>
        <h1 className="admin-seed__title">Content seeding engine</h1>
        <p className="admin-seed__subtitle">
          Auto-drop fandom-native threads, episode chats, hot takes, trending recs, and daily
          featured anime. Runs on a schedule or on demand.
        </p>
      </header>

      <section className="admin-seed__panel">
        <div className="admin-seed__panel-head">
          <h2 className="admin-seed__panel-title">Controls</h2>
          <button
            type="button"
            className={`admin-seed__toggle${config.enabled ? " admin-seed__toggle--on" : ""}`}
            onClick={toggleEnabled}
            disabled={pending}
          >
            {config.enabled ? "Seeding ON" : "Seeding OFF"}
          </button>
        </div>

        <div className="admin-seed__grid">
          <label className="admin-field">
            <span>Posts per run</span>
            <input
              type="number"
              min={1}
              max={24}
              value={config.postsPerRun}
              onChange={(e) =>
                setConfig((c) => ({ ...c, postsPerRun: Number(e.target.value) }))
              }
            />
          </label>
          <label className="admin-field">
            <span>Episode threads</span>
            <input
              type="number"
              min={0}
              max={8}
              value={config.episodeThreadsPerRun}
              onChange={(e) =>
                setConfig((c) => ({ ...c, episodeThreadsPerRun: Number(e.target.value) }))
              }
            />
          </label>
          <label className="admin-field">
            <span>Hot takes</span>
            <input
              type="number"
              min={0}
              max={8}
              value={config.hotTakesPerRun}
              onChange={(e) =>
                setConfig((c) => ({ ...c, hotTakesPerRun: Number(e.target.value) }))
              }
            />
          </label>
          <label className="admin-field">
            <span>AI summaries</span>
            <input
              type="number"
              min={0}
              max={4}
              value={config.summariesPerRun}
              onChange={(e) =>
                setConfig((c) => ({ ...c, summariesPerRun: Number(e.target.value) }))
              }
            />
          </label>
          <label className="admin-field">
            <span>Trending recs</span>
            <input
              type="number"
              min={0}
              max={8}
              value={config.trendingRecsPerRun}
              onChange={(e) =>
                setConfig((c) => ({ ...c, trendingRecsPerRun: Number(e.target.value) }))
              }
            />
          </label>
          <label className="admin-field">
            <span>Schedule (hours)</span>
            <input
              type="number"
              min={1}
              max={168}
              value={config.scheduleHours}
              onChange={(e) =>
                setConfig((c) => ({ ...c, scheduleHours: Number(e.target.value) }))
              }
            />
          </label>
        </div>

        <label className="admin-field admin-field--row">
          <input
            type="checkbox"
            checked={config.useAiSummaries}
            onChange={(e) =>
              setConfig((c) => ({ ...c, useAiSummaries: e.target.checked }))
            }
          />
          <span>Use AI summaries when OPENAI_API_KEY is set</span>
        </label>

        <label className="admin-field">
          <span>Seed bot user ID (UUID)</span>
          <input
            type="text"
            value={config.seedUserId ?? ""}
            placeholder="KUROVERSE_SEED_USER_ID"
            onChange={(e) =>
              setConfig((c) => ({ ...c, seedUserId: e.target.value || null }))
            }
          />
        </label>

        <div className="admin-seed__actions">
          <button type="button" className="admin-seed__btn admin-seed__btn--primary" onClick={saveConfig} disabled={pending}>
            Save settings
          </button>
          <button type="button" className="admin-seed__btn" onClick={runNow} disabled={pending}>
            Run seed drop now
          </button>
        </div>

        {message ? (
          <p className="admin-seed__message" role="status">
            {message}
          </p>
        ) : null}

        <dl className="admin-seed__meta">
          <div>
            <dt>Last run</dt>
            <dd>{config.lastRunAt ? new Date(config.lastRunAt).toLocaleString() : "Never"}</dd>
          </div>
          <div>
            <dt>Next run</dt>
            <dd>{config.nextRunAt ? new Date(config.nextRunAt).toLocaleString() : "ASAP"}</dd>
          </div>
        </dl>
      </section>

      {initial.featured ? (
        <section className="admin-seed__panel">
          <h2 className="admin-seed__panel-title">Today&apos;s featured anime</h2>
          <p className="admin-seed__featured-name">{initial.featured.animeTitle}</p>
          <p className="admin-seed__featured-tagline">{initial.featured.tagline}</p>
          <p className="admin-seed__featured-summary">{initial.featured.summary}</p>
        </section>
      ) : null}

      <section className="admin-seed__panel">
        <h2 className="admin-seed__panel-title">Recent batches</h2>
        <ul className="admin-seed__batches">
          {initial.batches.length === 0 ? (
            <li className="admin-seed__empty">No runs yet.</li>
          ) : (
            initial.batches.map((b) => (
              <li key={b.id} className="admin-seed__batch">
                <span className="admin-seed__batch-time">
                  {new Date(b.createdAt).toLocaleString()}
                </span>
                <span>
                  {b.triggeredBy} · {b.postsCreated} posts
                  {b.featuredAnimeId ? ` · anime ${b.featuredAnimeId}` : ""}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
