/**
 * Checks if a drag operation is attempting to move between pinned and unpinned sections
 */
export function isDraggingBetweenSections(
  sourceId: string,
  targetId: string,
  pinnedFilters: Set<string>
): boolean {
  const isSourcePinned = pinnedFilters.has(sourceId);
  const isTargetPinned = pinnedFilters.has(targetId);
  return isSourcePinned !== isTargetPinned;
}

/**
 * Checks if reordering is allowed within the same section
 */
export function isReorderAllowed(
  fromIndex: number,
  toIndex: number,
  filterOrder: string[],
  pinnedFilters: Set<string>
): boolean {
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return false;
  }

  const isSourcePinned = pinnedFilters.has(filterOrder[fromIndex]);
  const isTargetPinned = pinnedFilters.has(filterOrder[toIndex]);

  // Only allow reordering within the same section
  return isSourcePinned === isTargetPinned;
}
