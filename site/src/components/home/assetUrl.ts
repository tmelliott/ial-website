export function assetUrl(asset: unknown): string {
  if (typeof asset === "string") return asset;
  if (
    asset &&
    typeof asset === "object" &&
    "src" in asset &&
    typeof asset.src === "string"
  ) {
    return asset.src;
  }
  return "";
}
