export type AnimeFavorite = {
  id: string;
  animeId: number;
  animeTitle: string;
  animeCoverUrl: string | null;
  createdAt: string;
};

export type FavoriteActionResult = {
  ok: boolean;
  error?: string;
  favorite?: AnimeFavorite;
};
