import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import CardClient from "../home/CardClient";
import type { KeywordLink, MediaImage } from "../home/types";
import {
  filterProjectsByKeyword,
  findProjectKeyword,
  projectListSummary,
  projectPageCount,
  projectsForPage,
  projectsListHref,
  readProjectsListQuery,
  visibleProjectPage,
  type ProjectKeyword,
} from "../../lib/projects";
import { cn } from "./cn";

export type BrowserProject = {
  id: number;
  title: string;
  slug: string;
  contentHtml: string;
  banner: MediaImage | null;
  bannerBlur?: string;
  keywords: KeywordLink[];
};

function plainClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.button === 0 &&
    !event.defaultPrevented &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

function KeywordSelect({
  keywords,
  value,
  onChange,
}: {
  keywords: ProjectKeyword[];
  value: string | null;
  onChange: (slug: string | null) => void;
}) {
  const known = !value || keywords.some((keyword) => keyword.slug === value);
  return (
    <label className="relative inline-flex text-base font-normal text-white">
      <span className="sr-only">Filter by keyword</span>
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className="min-h-11 min-w-52 appearance-none rounded border border-white/40 bg-white/10 py-2 pr-10 pl-3 text-base font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [&_option]:bg-white [&_option]:text-gray-900"
      >
        <option value="">All keywords</option>
        {!known && value && <option value={value}>{value.replaceAll("-", " ")}</option>}
        {keywords.map((keyword) => (
          <option key={keyword.slug} value={keyword.slug}>
            {keyword.title}
          </option>
        ))}
      </select>
      <FiChevronDown
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
        aria-hidden="true"
      />
    </label>
  );
}

function WorkstreamLinks({
  workstreams,
  compact = false,
}: {
  workstreams: ProjectKeyword[];
  compact?: boolean;
}) {
  if (workstreams.length === 0) return null;
  return (
    <div className={compact ? undefined : "mt-4 lg:mt-6"}>
      <h5 className={cn("mb-2 font-semibold", compact ? "text-sm" : "text-lg @lg:text-xl")}>
        {compact ? "Our workstreams" : "Explore our workstreams"}
      </h5>
      <div className="flex flex-wrap gap-2">
        {workstreams.map((keyword) => (
          <a
            key={keyword.slug}
            href={`/keywords/${keyword.slug}`}
            className={cn(
              "rounded border border-white px-2 py-1 text-white transition hover:bg-white hover:text-black",
              compact ? "text-sm" : "text-sm @lg:text-base",
            )}
          >
            {keyword.title}
          </a>
        ))}
      </div>
    </div>
  );
}

function IntroCard({
  headingHtml,
  workstreams,
}: {
  headingHtml: string;
  workstreams: ProjectKeyword[];
}) {
  return (
    <div className="@container h-full overflow-clip rounded text-white shadow-card">
      <div className="card-gradient-bright hidden h-full flex-col justify-between gap-4 p-4 @3xs:flex lg:p-8">
        {headingHtml && (
          <div className="pr-12 text-lg leading-normal font-semibold lg:text-2xl">
            <div className="payload-richtext" dangerouslySetInnerHTML={{ __html: headingHtml }} />
          </div>
        )}
        <WorkstreamLinks workstreams={workstreams} />
      </div>
      {workstreams.length > 0 && (
        <div className="card-gradient-bright flex h-full flex-col justify-between gap-2 p-4 @3xs:hidden">
          <WorkstreamLinks workstreams={workstreams} compact />
        </div>
      )}
    </div>
  );
}

export default function ProjectBrowser({
  projects,
  keywords,
  workstreams,
  headingHtml,
  initialKeyword,
  initialPage,
}: {
  projects: BrowserProject[];
  keywords: ProjectKeyword[];
  workstreams: ProjectKeyword[];
  headingHtml: string;
  initialKeyword: string | null;
  initialPage: number;
}) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [requestedPage, setRequestedPage] = useState(initialPage);
  const filtered = filterProjectsByKeyword(projects, keyword);
  const page = visibleProjectPage(requestedPage, filtered.length);
  const visible = projectsForPage(filtered, page);
  const totalPages = projectPageCount(filtered.length);
  const selected = findProjectKeyword(projects, keyword);
  const keywordTitle = selected?.title ?? (keyword ? keyword.replaceAll("-", " ") : null);
  const summary = projectListSummary(filtered.length, page, keywordTitle);
  const showIntro = page === 1 && (headingHtml.length > 0 || workstreams.length > 0);

  useEffect(() => {
    const onPop = () => {
      const next = readProjectsListQuery(window.location.search);
      setKeyword(next.keyword);
      setRequestedPage(next.page);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (page === requestedPage) return;
    history.replaceState({ keyword, page }, "", projectsListHref(keyword, page));
    setRequestedPage(page);
  }, [keyword, page, requestedPage]);

  function selectKeyword(next: string | null) {
    const href = projectsListHref(next, 1);
    const current = `${window.location.pathname}${window.location.search}`;
    if (href !== current) history.pushState({ keyword: next, page: 1 }, "", href);
    setKeyword(next);
    setRequestedPage(1);
  }

  function openPage(event: MouseEvent<HTMLAnchorElement>, nextPage: number) {
    if (!plainClick(event)) return;
    event.preventDefault();
    const href = projectsListHref(keyword, nextPage);
    const current = `${window.location.pathname}${window.location.search}`;
    if (href !== current) history.pushState({ keyword, page: nextPage }, "", href);
    setRequestedPage(nextPage);
    if (nextPage !== page) {
      requestAnimationFrame(() => {
        document.getElementById("project-list")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }

  let pager: ReactNode = null;
  if (totalPages > 1) {
    pager = (
      <nav
        aria-label="Projects pages"
        className="col-span-full flex items-center justify-center gap-4"
      >
        {page > 1 && (
          <a
            href={projectsListHref(keyword, page - 1)}
            aria-label="Previous page"
            onClick={(event) => openPage(event, page - 1)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center"
          >
            <FiChevronLeft />
          </a>
        )}
        {Array.from({ length: totalPages }, (_, index) => {
          const number = index + 1;
          const current = number === page;
          return (
            <a
              key={number}
              href={projectsListHref(keyword, number)}
              aria-label={`Page ${number}`}
              aria-current={current ? "page" : undefined}
              onClick={(event) => openPage(event, number)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center"
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded bg-gray-100 shadow-card",
                  current && "bg-accent-fill text-white",
                )}
              >
                {number}
              </span>
            </a>
          );
        })}
        {page < totalPages && (
          <a
            href={projectsListHref(keyword, page + 1)}
            aria-label="Next page"
            onClick={(event) => openPage(event, page + 1)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center"
          >
            <FiChevronRight />
          </a>
        )}
      </nav>
    );
  }

  return (
    <>
      <header className="bg-linear-170 from-15% from-[var(--color-bg-gradient-start)] to-[125%] to-[var(--color-bg-gradient-end)] p-8 text-white shadow-card">
        <div className="mx-auto mb-24 max-w-(--container-content) pt-12 lg:pt-36">
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4 pb-12">
            <h1 className="text-display flex flex-col gap-4">
              <span>Kaupapa</span>
              <span className="text-gray-300">Projects</span>
            </h1>
            {keywords.length > 0 && (
              <div className="ml-auto">
                <KeywordSelect keywords={keywords} value={keyword} onChange={selectKeyword} />
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="relative z-10 px-4 sm:px-8">
        <section
          id="project-list"
          className="mx-auto -mt-24 mb-24 flex max-w-(--container-content) scroll-mt-[var(--header-height)] flex-col gap-8 md:grid md:grid-cols-2 lg:grid-cols-6 lg:scroll-mt-0 lg:gap-12"
        >
          <p className="sr-only" aria-live="polite">
            {summary}
          </p>
          {showIntro && (
            <div className="h-full md:col-span-2 lg:col-span-4">
              <IntroCard headingHtml={headingHtml} workstreams={workstreams} />
            </div>
          )}
          {visible.map((project, index) => {
            const wide = page > 1 && index < 4;
            return (
              <div key={project.id} className={cn("lg:col-span-2", wide && "lg:col-span-3")}>
                <CardClient
                  title={project.title}
                  banner={project.banner}
                  bannerBlur={project.bannerBlur}
                  url={`/projects/${project.slug}`}
                  type="project"
                  keywords={project.keywords}
                  featured={index === 0}
                  direction={wide ? "horizontal" : "vertical"}
                  contentHtml={project.contentHtml}
                />
              </div>
            );
          })}
          {visible.length === 0 && (
            <div className="col-span-full rounded bg-white p-8 shadow-card">
              <p className="text-lg font-semibold text-gray-900">{summary}</p>
              {keyword && (
                <a
                  href="/projects"
                  onClick={(event) => {
                    if (!plainClick(event)) return;
                    event.preventDefault();
                    selectKeyword(null);
                  }}
                  className="mt-3 inline-flex min-h-11 items-center text-accent-text underline underline-offset-2"
                >
                  Show all projects
                </a>
              )}
            </div>
          )}
          {pager}
        </section>
      </div>
    </>
  );
}
