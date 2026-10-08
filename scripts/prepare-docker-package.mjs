import fs from "node:fs";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

for (const section of ["dependencies", "devDependencies"]) {
  for (const [name, version] of Object.entries(pkg[section] ?? {})) {
    if (typeof version === "string" && version.startsWith("^")) {
      pkg[section][name] = version.slice(1);
    }
  }
}

// The app imports this directly. npm hoists it; pnpm will not unless it is declared.
pkg.dependencies.lexical = "0.28.0";

fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");

fs.writeFileSync(
  ".npmrc",
  "node-linker=hoisted\n",
);

// pnpm 11+ ignores package.json build allow-lists. Approve the native deps.
fs.writeFileSync(
  "pnpm-workspace.yaml",
  ["allowBuilds:", "  esbuild: true", "  sharp: true", "  unrs-resolver: true", ""].join(
    "\n",
  ),
);
