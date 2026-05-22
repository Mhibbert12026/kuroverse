export const ANIME_MEDIA_FIELDS = `
  id
  title {
    romaji
    english
  }
  coverImage {
    extraLarge
    large
    medium
    color
  }
  genres
  averageScore
  episodes
  status
  popularity
`;

export const ANIME_DETAIL_FIELDS = `
  id
  title {
    romaji
    english
    native
  }
  description(asHtml: false)
  coverImage {
    extraLarge
    large
    medium
    color
  }
  bannerImage
  genres
  averageScore
  episodes
  status
  popularity
  format
  seasonYear
  trailer {
    id
    site
  }
`;

export const ANIME_LIST_QUERY = `
  query AnimeList($page: Int, $perPage: Int, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: $sort) {
        ${ANIME_MEDIA_FIELDS}
      }
    }
  }
`;

export const ANIME_BY_IDS_QUERY = `
  query AnimeByIds($ids: [Int], $perPage: Int) {
    Page(page: 1, perPage: $perPage) {
      media(id_in: $ids, type: ANIME) {
        ${ANIME_MEDIA_FIELDS}
      }
    }
  }
`;

export const ANIME_DETAIL_QUERY = `
  query AnimeDetail($id: Int) {
    Media(id: $id, type: ANIME) {
      ${ANIME_DETAIL_FIELDS}
    }
  }
`;

export const ANIME_RECOMMENDATIONS_QUERY = `
  query AnimeRecommendations($id: Int, $perPage: Int) {
    Media(id: $id, type: ANIME) {
      recommendations(page: 1, perPage: $perPage, sort: RATING_DESC) {
        edges {
          node {
            mediaRecommendation {
              ${ANIME_MEDIA_FIELDS}
            }
          }
        }
      }
    }
  }
`;

export const ANIME_RELATED_BY_GENRE_QUERY = `
  query AnimeRelatedByGenre($genres: [String], $perPage: Int, $excludeId: Int) {
    Page(page: 1, perPage: $perPage) {
      media(
        type: ANIME
        genre_in: $genres
        sort: POPULARITY_DESC
        id_not_in: [$excludeId]
      ) {
        ${ANIME_MEDIA_FIELDS}
      }
    }
  }
`;
