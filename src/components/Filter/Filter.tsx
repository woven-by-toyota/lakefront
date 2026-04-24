import { ChangeEvent, ComponentProps, FC, useCallback, useEffect, useMemo, useState } from 'react';
import queryString from 'query-string';
import { ContextSwitchMenuValue, FilterComponentProps, FilterMode, UrlParameters } from './types';
import {
  FILTER_MODE_OPTIONS,
  getCurrentBrowserQueryParams,
  getDefaultJsonViewValue,
  convertToFilterDropdownOptions
} from './util';
import {
  FilterContainer,
  FilterHeader,
  FiltersSection,
  SidePanel,
  PresetFiltersContainer,
  FilterChipsContainer,
  FilterPaneControls,
  FilterControl
} from './filterStyles';
import { ReactComponent as FilterIcon } from './assets/filterIcon.svg';
import { FilterSectionContent, SortableSection } from './components';
import FilterValueChips from './components/FilterSectionHeader/FilterValueChips';
import Select from '../Select';
import { DragDropProvider } from '@dnd-kit/react';
import { isSortableOperation } from '@dnd-kit/react/sortable';
import { move } from '@dnd-kit/helpers';
import { isDraggingBetweenSections, isReorderAllowed } from './util/filterDragDropUtil';

/**
 * Filter Component
 *
 * The Filter component can be used to display the effects
 * the `useFilter` hook (or other filter state manager) has on
 * a given page. Various components can be provided to increase/limit
 * what changes are displayed.
 */
export const Filter: FC<FilterComponentProps & ComponentProps<'div'>> = ({
  ContextSwitchMenu,
  FilterBar,
  FilterJSONConfirmationModal,
  FilterJSONInput,
  additionalQueryParams,
  children,
  filterHooks,
  hideFilterBar = true,
  initialActiveSection = '',
  isCollapsed: isCollapsedProp,
  isJSONInputAllowed = false,
  location,
  onToggleCollapsed,
  updateHistory,
  badgeThreshold = 1,
  className,
  filterMapping,
  enableFilterPinning = false,
  enableFilterDragDrop = false,
  ...rest
}) => {
  const presetFilterDropdownOptions = useMemo(() => convertToFilterDropdownOptions(filterMapping), [filterMapping]);
  const urlParams = queryString.parse(location.search) as UrlParameters;
  const [isCollapsedState, setIsCollapsedState] = useState(false);
  const [activeSection, setActiveSection] = useState(initialActiveSection);
  const [jsonQueryParams, setJsonQueryParams] = useState(
    isJSONInputAllowed ? { jsonView: getDefaultJsonViewValue(urlParams) } : {}
  );
  const [isJSONInputModified, setIsJSONInputModified] = useState(false);
  const [isJSONModifiedModalShowing, setIsJSONModifiedModalShowing] = useState(false);
  const [presetFilterValue, setPresetFilterValue] = useState('');

  // use isCollapsed prop if provided to track state externally, otherwise track state internally
  const isCollapsed = isCollapsedProp === undefined ? isCollapsedState : isCollapsedProp;

  const {
    filters,
    filterValues,
    updateFilter,
    resetFilter,
    resetAllFilters,
    initializePresetValues,
    filterOrder: filterOrderFromHooks,
    pinnedFilters: pinnedFiltersFromHooks,
    togglePinFilter
  } = filterHooks;

  // Memoize default values to prevent re-creating objects on each render
  const defaultFilterOrder = useMemo(() => Object.keys(filters), [filters]);
  const defaultPinnedFilters = useMemo(() => new Set<string>(), []);

  // Only use pinning-related values if the feature is enabled
  const filterOrder = enableFilterPinning && filterOrderFromHooks ? filterOrderFromHooks : defaultFilterOrder;
  const pinnedFilters = enableFilterPinning && pinnedFiltersFromHooks ? pinnedFiltersFromHooks : defaultPinnedFilters;
  const effectiveTogglePinFilter = enableFilterPinning ? togglePinFilter : undefined;

  // Sort filters: pinned first (in order), then unpinned (in order)
  const sortedFilterKeys = useMemo(() => {
    const pinned = filterOrder.filter(key => pinnedFilters.has(key));
    const unpinned = filterOrder.filter(key => !pinnedFilters.has(key));
    return [...pinned, ...unpinned];
  }, [filterOrder, pinnedFilters]);

  // Filter out hidden filters from sorted list
  const visibleFilterKeys = sortedFilterKeys.filter(key => filters[key] && !filters[key].inputHidden);

  // save the additional query parameters in the browser url
  useEffect(() => {
    const excludeKeys = [
      ...Object.keys(additionalQueryParams || {}),
      ...(isJSONInputAllowed ? Object.keys(jsonQueryParams) : [])
    ];
    const existingQueryParams = getCurrentBrowserQueryParams(location, excludeKeys);

    const newQueryParams = {
      ...existingQueryParams,
      ...additionalQueryParams,
      ...(isJSONInputAllowed ? jsonQueryParams : {})
    };
    updateHistory({ search: queryString.stringify(newQueryParams), hash: location.hash });
  }, [additionalQueryParams, jsonQueryParams]);

  useEffect(() => {
    if (presetFilterDropdownOptions.length && filterMapping) {
      initializePresetValues(filterMapping[presetFilterDropdownOptions[0].value]);
    }
  }, [presetFilterDropdownOptions]);

  const toggleCollapsed = () => {
    const collapsedState = !isCollapsed;
    setIsCollapsedState(collapsedState);
    if (onToggleCollapsed) {
      onToggleCollapsed(collapsedState);
    }
  };
  const setJsonViewParam = (jsonView: boolean) => {
    setJsonQueryParams((params) => ({ ...params, jsonView }));
  };
  const toggleJsonView = (mode: ContextSwitchMenuValue) => {
    const jsonView = mode === FilterMode.JSON;

    // if switching back to the filter UI but there is unapplied JSON, show confirmation modal before proceeding
    if (!jsonView && isJSONInputModified) {
      setIsJSONModifiedModalShowing(true);
    } else {
      setJsonViewParam(jsonView);
    }
  };
  const confirmSwitchToFilterUI = () => {
    setJsonViewParam(false);
    setIsJSONInputModified(false);
  };
  const toggleSection = (section: string) => {
    const newSection = activeSection === section ? '' : section;
    setActiveSection(newSection);
  };

  const updateFiltersWithPresets = (filterMappingKey: string) => {
    if (filterMapping) {
      const filtersToPreset = filterMapping[filterMappingKey];
      Object.entries(filtersToPreset).forEach(([key, value]) => {
        updateFilter(key, value);
      });
      setPresetFilterValue(filterMappingKey);
    }
  };

  const presetFilters = (event: ChangeEvent<HTMLInputElement>) => {
    updateFiltersWithPresets(event.target.value);
  };

  // Drag over handler to prevent visual dragging between sections
  const handleDragOver = useCallback(
    (event: any) => {
      if (!filterOrder) return;

      const { operation } = event;

      if (!operation.source || !operation.target) return;
      if (!isSortableOperation(operation)) return;

      const pinnedSet = pinnedFilters || new Set();

      // Prevent visual drag between pinned and unpinned sections
      if (isDraggingBetweenSections(String(operation.source.id), String(operation.target.id), pinnedSet)) {
        event.preventDefault();
      }
    },
    [filterOrder, pinnedFilters]
  );

  // Drag and drop handler
  const handleDragEnd = useCallback(
    (event: any) => {
      if (!filterHooks.setFilterOrder || !filterOrder) return;

      const { operation } = event;

      if (!operation.source || !operation.target) return;
      if (!isSortableOperation(operation)) return;

      const oldOrder = filterOrder;
      const newOrder = move(oldOrder, event);

      const draggedId = String(operation.source.id);
      const fromIndex = oldOrder.indexOf(draggedId);
      const toIndex = newOrder.indexOf(draggedId);

      const pinnedSet = pinnedFilters || new Set();

      // Only apply the reorder if it's allowed within the same section
      if (isReorderAllowed(fromIndex, toIndex, oldOrder, pinnedSet)) {
        filterHooks.setFilterOrder(newOrder);
      }
    },
    [filterOrder, filterHooks, pinnedFilters]
  );

  const standardMode = !isJSONInputAllowed || !jsonQueryParams.jsonView;
  const isDragDropEnabled = enableFilterDragDrop;

  return (
    <FilterContainer
      showJSONInput={Boolean(isJSONInputAllowed && jsonQueryParams.jsonView)}
      isCollapsed={isCollapsed}
      hideFilterBar={hideFilterBar}
      className={className}
      {...rest}
    >
      <SidePanel className="sidePanel">
        <FilterHeader className="filterHeader">
          {!isCollapsed &&
            ((ContextSwitchMenu && isJSONInputAllowed) ? (
              <ContextSwitchMenu
                options={FILTER_MODE_OPTIONS}
                value={jsonQueryParams.jsonView ? FilterMode.JSON : FilterMode.FilterUI}
                onChange={toggleJsonView}
                triggerClassName="filterContextTriggerContent"
              />
            ) : (
              'Filter Results'
            ))}
          <FilterIcon className="filterMenuIcon" onClick={toggleCollapsed} />
        </FilterHeader>
        {filterMapping && Object.keys(filterMapping).length &&
          <PresetFiltersContainer>
            <Select aria-label="preset-filter-dropdown"
                    options={presetFilterDropdownOptions} onChange={presetFilters}
                    value={presetFilterValue}
            />
          </PresetFiltersContainer>
        }
        <div className="header-chips">
          {standardMode && (
            <FiltersSection className="filters">
              <FilterChipsContainer className="filter-chips-container">
                {visibleFilterKeys.map((key) => {
                    const itemFilterLabelValues = filters[key].getFilterSectionLabel(filterValues[key]);

                    return (
                      <FilterValueChips
                        label={filters[key].label}
                        resetFilter={resetFilter}
                        key={key}
                        name={key}
                        notDefaultValues={filters[key] ? !filters[key].isDefaultFilterValue(filterValues[key]) : false}
                        value={itemFilterLabelValues}
                        visible={true} />
                    );
                  })}
              </FilterChipsContainer>
              <FilterPaneControls className="filter-pane-controls">
                <FilterControl
                  color="secondary"
                  onClick={resetAllFilters}
                  className={'filter-pane-reset-button'}
                >
                  Reset Filters
                </FilterControl>
              </FilterPaneControls>
            </FiltersSection>
          )}
        </div>
        {standardMode && (
          <FiltersSection className="filters">
            {isDragDropEnabled ? (
              <DragDropProvider onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
                {visibleFilterKeys.map((key, index) => (
                  <SortableSection key={key} id={key} index={index} isDragEnabled={isDragDropEnabled}>
                    {(handleRef: any) => (
                      <FilterSectionContent
                        filterKey={key}
                        filter={filters[key]}
                        activeSection={activeSection}
                        filterValues={filterValues}
                        resetFilter={resetFilter}
                        updateFilter={updateFilter}
                        toggleSection={toggleSection}
                        badgeThreshold={badgeThreshold}
                        pinnedFilters={pinnedFilters}
                        effectiveTogglePinFilter={effectiveTogglePinFilter}
                        isDragEnabled={isDragDropEnabled}
                        dragHandleRef={handleRef}
                      />
                    )}
                  </SortableSection>
                ))}
              </DragDropProvider>
            ) : (
              visibleFilterKeys.map((key) => (
                <section key={key}>
                  <FilterSectionContent
                    filterKey={key}
                    filter={filters[key]}
                    activeSection={activeSection}
                    filterValues={filterValues}
                    resetFilter={resetFilter}
                    updateFilter={updateFilter}
                    toggleSection={toggleSection}
                    badgeThreshold={badgeThreshold}
                    pinnedFilters={pinnedFilters}
                    effectiveTogglePinFilter={effectiveTogglePinFilter}
                  />
                </section>
              ))
            )}
          </FiltersSection>
        )}

        {isJSONInputAllowed && jsonQueryParams.jsonView && FilterJSONInput && (
          <div className="jsonInputSection">
            <FilterJSONInput filterHooks={filterHooks} onInputModifiedChange={setIsJSONInputModified} />
          </div>
        )}

        {isJSONInputAllowed && FilterJSONConfirmationModal && (
          <FilterJSONConfirmationModal
            modalVisible={isJSONModifiedModalShowing}
            handleModalClose={() => setIsJSONModifiedModalShowing(false)}
            onConfirm={confirmSwitchToFilterUI}
          />
        )}
      </SidePanel>

      {!hideFilterBar && FilterBar && (
        <FilterBar
          filters={filters}
          filterValues={filterValues}
          resetFilter={resetFilter}
          resetAllFilters={resetAllFilters}
        />
      )}

      {children}
    </FilterContainer>
  );
};

export default Filter;
