import type { Project } from "@payload-types";

/**
 * Sorts projects according to the specified criteria:
 * 1. Priority (descending) - higher priority first
 * 2. Items with startDate but no endDate
 * 3. Items with endDate (sorted by endDate descending)
 * 4. Items with startDate (sorted by startDate descending)
 * 5. Items without startDate OR endDate go last
 * 6. Created at (descending) - more recent first (as tiebreaker)
 */
export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    // First: Priority (desc)
    if ((a.priority ?? 0) !== (b.priority ?? 0)) {
      return (b.priority ?? 0) - (a.priority ?? 0);
    }

    // Check if items have dates
    const aHasNoDates = !a.startDate && !a.endDate;
    const bHasNoDates = !b.startDate && !b.endDate;

    // Projects without start OR end date go last
    if (aHasNoDates !== bHasNoDates) {
      return aHasNoDates ? 1 : -1; // aHasNoDates goes last
    }

    // If both have no dates, sort by createdAt only
    if (aHasNoDates && bHasNoDates) {
      const aCreated = new Date(a.createdAt).getTime();
      const bCreated = new Date(b.createdAt).getTime();
      return bCreated - aCreated;
    }

    // Second: Items with startDate but no endDate come first
    const aHasStartNoEnd = a.startDate && !a.endDate;
    const bHasStartNoEnd = b.startDate && !b.endDate;
    if (aHasStartNoEnd !== bHasStartNoEnd) {
      return aHasStartNoEnd ? -1 : 1; // aHasStartNoEnd comes first
    }

    // Third: End date (desc) - more recent first
    if (a.endDate && b.endDate) {
      const aEnd = new Date(a.endDate).getTime();
      const bEnd = new Date(b.endDate).getTime();
      if (aEnd !== bEnd) {
        return bEnd - aEnd;
      }
    }

    // Fourth: Start date (desc) - more recent first
    if (a.startDate && b.startDate) {
      const aStart = new Date(a.startDate).getTime();
      const bStart = new Date(b.startDate).getTime();
      if (aStart !== bStart) {
        return bStart - aStart;
      }
    }

    // Fifth: Created at (desc) - more recent first (tiebreaker)
    const aCreated = new Date(a.createdAt).getTime();
    const bCreated = new Date(b.createdAt).getTime();
    return bCreated - aCreated;
  });
}
