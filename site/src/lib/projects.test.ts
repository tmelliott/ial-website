import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { projectFileLabel, projectFileMeta } from "./projects.ts";

describe("project files", () => {
  it("uses the editor title, then the filename", () => {
    assert.equal(projectFileLabel({ alt: "  Workshop notes  ", name: "notes.pdf" }), "Workshop notes");
    assert.equal(projectFileLabel({ alt: "  ", name: "notes.pdf" }), "notes.pdf");
    assert.equal(projectFileLabel({}), "Download");
  });

  it("shows the extension and a readable size", () => {
    assert.equal(projectFileMeta({ ext: ".pdf", size: 240.2 }), "PDF · 240 KB");
    assert.equal(projectFileMeta({ ext: "txt", size: 0.2 }), "TXT · 1 KB");
    assert.equal(projectFileMeta({ size: 1536 }), "1.5 MB");
    assert.equal(projectFileMeta({}), null);
  });
});
