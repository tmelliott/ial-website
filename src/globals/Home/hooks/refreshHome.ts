import refreshSite from "@/hooks/refreshSite";

export default function refreshHome(
  args?: Parameters<typeof refreshSite>[0],
) {
  refreshSite(args);
}
