import { BASE_URL } from "../api/config";

export function getImageUrl(url) {
  if (!url) return "https://via.placeholder.com/80";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
}
