import { type FC, useEffect, useRef, useState } from 'react';
import type { FilterBarProps, FilterModule } from 'src/components/Filter/types';
import { getFilterAppliedCount } from 'src/components/Filter/util';
import { FilterBarContainer } from './filterBarStyles';

interface FilterItemProps {
    resetFilter?(name: string): void;
    name: string;
    item: FilterModule<any>;
    value: any;
}

export const FilterItem: FC<FilterItemProps> = (props) => {
    const { name, resetFilter, item, value } = props;

    const handleCloseIcon = () => {
        resetFilter ? resetFilter(name) : undefined;
    };

    if (item.isDefaultFilterValue(value)) {
        return null;
    }

    const itemLabel = item.getFilterBarLabel(value);

    return (
        <div className='filterItem'>
            <span className='filterItemLabel'>{itemLabel}</span>
            {!item.required && (
                <div
                    className='filterItemClose'
                    onClick={handleCloseIcon}
                >
                    x
                </div>
            )}
        </div>
    );
};

const FilterBar: FC<FilterBarProps> = (props) => {
    const { filters, filterValues, resetFilter, resetAllFilters } = props;
    const [isMinimized, setMinimized] = useState(false);
    const filterBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMinimized(false);
        setTimeout(() => {
            // overflow occurring, set bar to minimized
            if (filterBarRef.current && filterBarRef.current.scrollHeight > 60) {
                setMinimized(true);
            }
        }, 150);
    }, [filterValues]);

    const filterKeys = Object.keys(filters);
    const filterCount = getFilterAppliedCount(filters, filterValues);

    return (
        <FilterBarContainer
            className='filterBar'
            ref={filterBarRef}
        >
            {isMinimized ? (
                <div className='filterItem'>{filterCount} Filters Applied</div>
            ) : (
                <>
                    {filterKeys.map((key) => (
                        <FilterItem
                            key={key}
                            name={key}
                            item={filters[key]}
                            value={filterValues[key]}
                            resetFilter={resetFilter}
                        />
                    ))}
                </>
            )}

            {filterCount > 0 && (
                <span
                    onClick={resetAllFilters}
                    className='resetAll'
                >
                    Reset All
                </span>
            )}
        </FilterBarContainer>
    );
};

export default FilterBar;
