import { FC, MouseEventHandler } from 'react';
import { FilterSectionHeaderProps } from 'src/components/Filter/types';
import { ReactComponent as Add } from '../../assets/add.svg';
import { ReactComponent as Remove } from '../../assets/remove.svg';
import { ReactComponent as PinActive } from '../../assets/pinActive.svg';
import { ReactComponent as PinInactive } from '../../assets/pinInactive.svg';
import { ReactComponent as DragHandle } from '../../assets/dragHandle.svg';
import {
  ClearButton,
  FilterActions,
  FilterBadge,
  FilterDetails,
  FilterSectionHeaderContainer,
  StyledPinButton,
  DragHandleButton
} from './filterSectionHeaderStyles';
import FilterValueChips from './FilterValueChips';
import { getFilterCount } from './filterSectionHeaderUtil';
import { FilterChipsContainer } from 'src/components/Filter/filterStyles';
import Button from 'src/components/Button';

const FilterSectionHeader: FC<FilterSectionHeaderProps> = ({
  activeSection = '',
  resetFilter,
  filter,
  name,
  onClick,
  value,
  badgeThreshold,
  children,
  isPinned = false,
  onTogglePin,
  isDragEnabled = false,
  dragHandleRef
}) => {
  const handleClear: MouseEventHandler<SVGElement> = (event) => {
    event.stopPropagation();
    resetFilter(name);
  };

  const handleTogglePin: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    if (onTogglePin) {
      onTogglePin(name);
    }
  };

  const filterApplied = !filter.isDefaultFilterValue(value);
  const filterCount = getFilterCount(value, filter, filterApplied);
  const showChips = filterCount < badgeThreshold;

  return (
    <>
      <FilterSectionHeaderContainer onClick={onClick} className='filter-section-header'>
        <FilterDetails className='filter-details'>
          {isDragEnabled && dragHandleRef && (
            <DragHandleButton ref={dragHandleRef} title="Drag to reorder">
              <DragHandle />
            </DragHandleButton>
          )}
          {filter.label}
          {!showChips && (
            <FilterBadge className="filter-badge" aria-details="count of applied filters">
              <div>{filterCount}</div>
            </FilterBadge>
          )}
        </FilterDetails>
        <FilterActions className='filter-actions' data-has-toggle-pin={!!onTogglePin}>
          {filterApplied && <ClearButton onClick={handleClear} aria-label="clear" />}
          {onTogglePin ? (
            <StyledPinButton isPinned={isPinned}>
              <Button
                color="secondary"
                icon={isPinned ? <PinActive /> : <PinInactive />}
                onClick={handleTogglePin}
                aria-label={isPinned ? 'unpin filter' : 'pin filter'}
                title={isPinned ? 'Unpin filter' : 'Pin filter'}
              />
            </StyledPinButton>
          ) : null}
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
