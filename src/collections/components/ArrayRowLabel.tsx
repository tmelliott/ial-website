"use client";

import { useRowLabel } from "@payloadcms/ui";

export default function ArrayRowLabel({ label }: { label?: string }) {
  const { data, rowNumber } = useRowLabel<{
    label?: string;
  }>();

  const customLabel =
    data.label || `${label || "Item"} ${String(rowNumber).padStart(2, "0")} `;

  return <div>{customLabel}</div>;
}
