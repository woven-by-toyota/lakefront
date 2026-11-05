import { useState, useEffect } from 'react';
import type { FilterValues, FilterMap } from 'src/components/Filter/types';
import { type SortOptions, mapTableFilters, filterData, sortData } from './useStatusTableUtil';
import pipe from 'src/lib/pipe';

export interface StatusTableHooks<T> {
    data: T[];
    handleSort(field: string, bidirectional?: boolean): void;
}

export interface StatusTableOptions {
    filters?: {
        filterMap: FilterMap,
        filterValues: FilterValues
    };
    sort?: SortOptions;
}

export const useStatusTable = <T,>(
    inboundData: T[] | null,
    { filters: filterOptions, sort: sortOptions }: StatusTableOptions = {}
): StatusTableHooks<T> => {
    const [sort, setSort] = useState<SortOptions>(sortOptions || { orderBy: '' });
    const [filter, setFilter] = useState<FilterMap>({});
    const [data, setData] = useState<T[]>([]);
    const filterValues = filterOptions?.filterValues;
    const filterMap = filterOptions?.filterMap;

    /*
        * initialize data to inboundData passed in
        * (re-)apply user-defined data sorting
        * (re-)apply user-defined data filters
    */
    useEffect(() => {
        if (inboundData) {
            const filterWithMap = filterData(filter);
            const sortWithOptions = sortData(sort);

            pipe(filterWithMap, sortWithOptions, setData)(inboundData);
        }
    }, [inboundData, filter, sort]);

    // updates filters any time user updates filter input(s)
    useEffect(() => {
        if (filterValues && filterMap) {
            const filters = mapTableFilters(filterValues, filterMap);

            setFilter(filters);
        }
    }, [filterValues]);

    const handleSort = (field: string, bidirectional = true) => {
        if (bidirectional) {
            const newDirection = sort.orderBy === field ? !sort.ascending : true;

            setSort({ ...sort, ...{ orderBy: field, ascending: newDirection } });
        } else {
            setSort({ orderBy: field, ascending: false });
        }
    };

    return {
        handleSort,
        data
    };
};
