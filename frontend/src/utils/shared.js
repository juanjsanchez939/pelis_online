export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export function getImageUrl(thumbnail) {
  if (!thumbnail) return "/portadas/default.jpg";
  if (thumbnail.startsWith("http")) return thumbnail;
  if (thumbnail.startsWith("/portadas/")) return thumbnail;
  return `${TMDB_IMAGE_BASE_URL}${thumbnail}`;
}
