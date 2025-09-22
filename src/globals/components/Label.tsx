"use client";

import { useRowLabel } from "@payloadcms/ui";

export default function ArrayRowLabel({
  label,
  labelProp,
}: {
  label?: string;
  labelProp?: string;
}) {
  const { data, rowNumber } = useRowLabel<
    {
      label?: string;
      heading?: string;
      submenu?: { label?: string }[];
    } & Record<string, string>
  >();

  const customLabel =
    labelProp && data[labelProp]
      ? `${data[labelProp]} `
      : data.label || data.heading || `${label ?? "Item"} ${rowNumber} `;

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
