"use server";

import { revalidatePath } from "next/cache";
import { getSeedConfig, updateSeedConfig } from "./config";
import { requireModerator } from "./admin";
import { getRecentSeedBatches } from "./batches";
import { runSeedEngine } from "./runner";
import { getDailyFeatured } from "./featured";
import type { SeedConfig, SeedRunResult } from "./types";

export type AdminSeedDashboard = {
  config: SeedConfig;
  batches: Awaited<ReturnType<typeof getRecentSeedBatches>>;
  featured: Awaited<ReturnType<typeof getDailyFeatured>>;
};

export async function getAdminSeedDashboardAction(): Promise<
  AdminSeedDashboard | { error: string }
> {
  const mod = await requireModerator();
  if (!mod.ok) return { error: mod.error };

  const [config, batches, featured] = await Promise.all([
    getSeedConfig(),
    getRecentSeedBatches(),
    getDailyFeatured(),
  ]);

  return { config, batches, featured };
}

export async function updateSeedConfigAction(
  config: SeedConfig,
): Promise<{ ok: boolean; error?: string }> {
  const mod = await requireModerator();
  if (!mod.ok) return { ok: false, error: mod.error };

  const result = await updateSeedConfig(config);
  if (result.ok) revalidatePath("/admin/seed");
  return result;
}

export async function runSeedNowAction(): Promise<SeedRunResult> {
  const mod = await requireModerator();
  if (!mod.ok) return { ok: false, error: mod.error };

  return runSeedEngine({
    triggeredBy: "admin",
    actorId: mod.userId,
    force: true,
  });
}

export async function toggleSeedingAction(
  enabled: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const mod = await requireModerator();
  if (!mod.ok) return { ok: false, error: mod.error };

  const result = await updateSeedConfig({ ...(await getSeedConfig()), enabled });
  if (result.ok) revalidatePath("/admin/seed");
  return result;
}
