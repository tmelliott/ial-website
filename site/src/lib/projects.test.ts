import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  filterProjectsByKeyword,
  findProjectKeyword,
  projectFileLabel,
  projectFileMeta,
  keywordsWithProjects,
  projectListSummary,
  projectsForPage,
  projectsListHref,
  readProjectsListQuery,
  visibleProjectPage,
  PROJECTS_PER_PAGE,
} from "./projects.ts";

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

const education = { id: 1, title: "Education", slug: "education" };
const health = { id: 2, title: "Health", slug: "health" };
const census = { id: 3, title: "Census", slug: "census" };

describe("project keyword filter", () => {
  const projects = [
    { id: "a", keywords: [education, health] },
    { id: "b", keywords: [1, census] },
    { id: "c", keywords: null },
  ];

  it("keeps every project when no keyword is selected", () => {
    assert.deepEqual(
      filterProjectsByKeyword(projects, null).map((project) => project.id),
      ["a", "b", "c"],
    );
  });

  it("keeps project order and ignores unresolved keyword ids", () => {
    assert.deepEqual(
      filterProjectsByKeyword(projects, "census").map((project) => project.id),
      ["b"],
    );
    assert.deepEqual(filterProjectsByKeyword(projects, "missing"), []);
  });

  it("lists each keyword that has a project, in title order", () => {
    assert.deepEqual(
      keywordsWithProjects(projects).map((keyword) => keyword.slug),
      ["census", "education", "health"],
    );
    assert.deepEqual(keywordsWithProjects([{ keywords: null }]), []);
  });

  it("names a selected keyword", () => {
    assert.deepEqual(findProjectKeyword(projects, "health"), health);
    assert.equal(findProjectKeyword(projects, "missing"), null);
  });
});

describe("project list pages", () => {
  it("clamps the page and slices the filtered list", () => {
    const projects = Array.from({ length: PROJECTS_PER_PAGE + 2 }, (_, index) => index);
    assert.equal(visibleProjectPage(0, projects.length), 1);
    assert.equal(visibleProjectPage(9, projects.length), 2);
    assert.deepEqual(projectsForPage(projects, 2), [PROJECTS_PER_PAGE, PROJECTS_PER_PAGE + 1]);
    assert.deepEqual(projectsForPage([], 4), []);
  });

  it("reads and writes the list query without a page reload path", () => {
    assert.equal(projectsListHref(null, 1), "/projects");
    assert.equal(projectsListHref("education", 1), "/projects?keyword=education");
    assert.equal(projectsListHref("education", 2), "/projects?keyword=education&page=2");
    assert.deepEqual(readProjectsListQuery("?keyword=education&page=2"), {
      keyword: "education",
      page: 2,
    });
    assert.deepEqual(readProjectsListQuery("?keyword=%20&page=0"), { keyword: null, page: 1 });
  });

  it("describes the visible range", () => {
    assert.equal(projectListSummary(0, 1, "Education"), "No projects tagged Education");
    assert.equal(projectListSummary(1, 1, null), "Showing 1 project");
    assert.equal(projectListSummary(20, 2, null), "Showing 8–14 of 20 projects");
    assert.equal(projectListSummary(3, 1, "Health"), "Showing 1–3 of 3 projects tagged Health");
  });
});
