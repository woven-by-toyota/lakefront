import { FC, MouseEventHandler } from 'react';
import { FilterSectionHeaderProps } from 'src/components/Filter/types';
import { ReactComponent as Add } from '../../assets/add.svg';
import { ReactComponent as Remove } from '../../assets/remove.svg';
import {
  ClearButton,
  FilterActions,
  FilterBadge,
  FilterDetails,
  FilterSectionHeaderContainer
} from './filterSectionHeaderStyles';
import FilterValueChips from './FilterValueChips';
import { getFilterCount } from './filterSectionHeaderUtil';
import { FilterChipsContainer } from 'src/components/Filter/filterStyles';

const FilterSectionHeader: FC<FilterSectionHeaderProps> = ({
  activeSection = '',
  resetFilter,
  filter,
  name,
  onClick,
  value,
  badgeThreshold,
  children
}) => {
  const handleClear: MouseEventHandler<SVGElement> = (event) => {
    event.stopPropagation();
    resetFilter(name);
  };

  const filterApplied = !filter.isDefaultFilterValue(value);
  const filterCount = getFilterCount(value, filter, filterApplied);
  const showChips = filterCount < badgeThreshold;

  return (
    <>
      <FilterSectionHeaderContainer onClick={onClick} className='filter-section-header'>
        <FilterDetails className='filter-details'>
          {filter.label}
          {!showChips && (
            <FilterBadge className="filter-badge" aria-details="count of applied filters">
              <div>{filterCount}</div>
            </FilterBadge>
          )}
        </FilterDetails>
        <FilterActions className='filter-actions'>
          {filterApplied && <ClearButton onClick={handleClear} aria-label="clear" />}
          {activeSection !== name ? <Add aria-label="add" /> : <Remove aria-label="remove" />}
        </FilterActions>
      </FilterSectionHeaderContainer>
      {
        children ?? (
          <FilterChipsContainer className='filter-chips-container'>
            <FilterValueChips label={filter.label} name={''} visible={showChips}
                              value={filter.getFilterSectionLabel(value)} />
          </FilterChipsContainer>
        )
      }
    </>
  );
};

export default FilterSectionHeader;
