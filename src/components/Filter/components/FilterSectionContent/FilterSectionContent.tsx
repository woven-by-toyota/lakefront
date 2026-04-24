import { FC } from 'react';
import FilterSectionHeader from '../FilterSectionHeader';
import { FilterSectionBody, FilterSectionDescription } from '../../filterStyles';

interface FilterSectionContentProps {
  filterKey: string;
  filter: any;
  activeSection: string;
  filterValues: any;
  resetFilter: (name: string) => void;
  updateFilter: (name: string, value: any) => void;
  toggleSection: (section: string) => void;
  badgeThreshold: number;
  pinnedFilters: Set<string>;
  effectiveTogglePinFilter?: (name: string) => void;
  isDragEnabled?: boolean;
  dragHandleRef?: any;
}

const FilterSectionContent: FC<FilterSectionContentProps> = ({
  filterKey,
  filter,
  activeSection,
  filterValues,
  resetFilter,
  updateFilter,
  toggleSection,
  badgeThreshold,
  pinnedFilters,
  effectiveTogglePinFilter,
  isDragEnabled = false,
  dragHandleRef = null
}) => {
  return (
    <>
      {filter.renderSectionHeader ? (
        filter.renderSectionHeader({
          activeSection,
          filter,
          name: filterKey,
          onClick: () => toggleSection(filterKey),
          resetFilter,
          value: filterValues[filterKey],
          badgeThreshold,
          isPinned: pinnedFilters.has(filterKey),
          onTogglePin: effectiveTogglePinFilter,
          isDragEnabled,
          dragHandleRef
        })
      ) : (
        <FilterSectionHeader
          activeSection={activeSection}
          filter={filter}
          name={filterKey}
          onClick={() => toggleSection(filterKey)}
          resetFilter={resetFilter}
          value={filterValues[filterKey]}
          badgeThreshold={badgeThreshold}
          isPinned={pinnedFilters.has(filterKey)}
          onTogglePin={effectiveTogglePinFilter}
          isDragEnabled={isDragEnabled}
          dragHandleRef={dragHandleRef}
        />
      )}
      {activeSection === filterKey && (
        <>
          <FilterSectionDescription>
            {filter.description}
          </FilterSectionDescription>
          <FilterSectionBody>
            {filter.renderComponent({
              name: filterKey,
              value: filterValues[filterKey],
              update: (value: string) => updateFilter(filterKey, value)
            })}
          </FilterSectionBody>
        </>
      )}
    </>
  );
};

export default FilterSectionContent;
