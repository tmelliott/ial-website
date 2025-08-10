"use client";

import { useRowLabel } from "@payloadcms/ui";

export default function ArrayRowLabel() {
  const { data, rowNumber } = useRowLabel<{
    label?: string;
    submenu?: { label?: string }[];
  }>();

  console.log(data, rowNumber);

  const customLabel =
    data.label || `"Item"} ${String(rowNumber).padStart(2, "0")} `;

  const subItems = data.submenu
    ? data.submenu.map((x, i) => x.label ?? `Item ${i}`).join(" | ")
    : "";

  return (
    <div style={{ display: "flex", gap: "2em" }}>
      {customLabel}
      <span style={{ opacity: 0.6 }}>{subItems}</span>
    </div>
  );
}
