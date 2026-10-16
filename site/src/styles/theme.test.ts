import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { describe, it } from "node:test";

type Token = { name: string; value: string | Record<string, string> };
type Style = { name: string; fontSize: string; lineHeight: number; fontWeight: number };

const tokens = JSON.parse(readFileSync(new URL("../../../design-system/tokens.json", import.meta.url), "utf8"));
const css = readFileSync(new URL("./global.css", import.meta.url), "utf8");
const tailwindTheme = readFileSync(createRequire(import.meta.url).resolve("tailwindcss/theme.css"), "utf8");

/** Custom properties declared in the first @theme block of a stylesheet. */
function themeVars(source: string): Map<string, string> {
  const block = /@theme[^{]*\{([\s\S]*?)\n\}/.exec(source);
  assert.ok(block, "no @theme block");
  const vars = new Map<string, string>();
  for (const [, name, value] of block[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars.set(name, value.trim());
  return vars;
}

const theme = themeVars(css);
const defaults = themeVars(tailwindTheme);

/** tokens.json writes an alias as {name}; the theme writes it as var(--color-name). */
function colour(token: Token): string {
  const value = typeof token.value === "string" ? token.value : Object.values(token.value)[0];
  const alias = /^\{(.+)\}$/.exec(value);
  return alias ? `var(--color-${alias[1]})` : value.toLowerCase();
}

const builtIn = (name: string) => name === "white" || name === "black" || name.startsWith("gray-");
const logoOnly = (name: string) => name.startsWith("logo-");

describe("Tailwind theme matches design-system/tokens.json", () => {
  for (const token of tokens.color.tokens as Token[]) {
    if (logoOnly(token.name)) continue;
    if (builtIn(token.name)) {
      if (token.name.startsWith("gray-")) {
        it(`${token.name} is Tailwind's default`, () => {
          assert.equal(defaults.get(`--color-${token.name}`), colour(token));
        });
      }
      continue;
    }
    it(`colour ${token.name}`, () => {
      assert.equal(theme.get(`--color-${token.name}`), colour(token));
    });
  }

  it("has no colours the design system removed", () => {
    const removed = [...theme.keys()].filter((name) => name.startsWith("--color-secondary-"));
    assert.deepEqual(removed, []);
  });

  for (const token of tokens.shadow.tokens as Token[]) {
    it(`shadow ${token.name}`, () => {
      assert.equal(theme.get(`--${token.name}`), token.value);
    });
  }

  for (const style of tokens.type.groups.flatMap((group: { styles: Style[] }) => group.styles) as Style[]) {
    it(`type style ${style.name}`, () => {
      assert.equal(theme.get(`--text-${style.name}`), style.fontSize);
      assert.equal(theme.get(`--text-${style.name}--line-height`), String(style.lineHeight));
      const weight = theme.get(`--text-${style.name}--font-weight`);
      assert.equal(weight ?? "400", String(style.fontWeight));
    });
  }

  it("spacing and radius are Tailwind's defaults", () => {
    assert.equal(theme.get("--spacing") ?? defaults.get("--spacing"), "0.25rem");
    const radius = (tokens.radius.tokens as Token[]).find((token) => token.name === "radius");
    assert.equal(defaults.get("--radius-sm"), radius?.value);
  });

  it("layout widths", () => {
    const layout = new Map((tokens.layout.tokens as Token[]).map((token) => [token.name, token.value]));
    assert.equal(theme.get("--container-content"), layout.get("container-content"));
    assert.equal(theme.get("--header-height"), layout.get("header-height"));
  });

  it("never defines a container key that shadows a sizing keyword", () => {
    const clashes = ["max", "min", "fit", "full", "screen", "auto"].filter((key) => theme.has(`--container-${key}`));
    assert.deepEqual(clashes, []);
  });
});
