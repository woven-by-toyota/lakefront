import { filterData, getCompareFormat, mapTableFilters, sortData } from '../useStatusTableUtil';

const FILTER_VALUES = {
    logId: 'id123',
    dateModified: '2020-01-20'
};

const DATA = [
    {
        log_id: 't408/data-10.tlog',
        data_modified: '2021-01-22T15:58:03.966361Z',
        count: 377
    },
    {
        log_id: 't408/data-110.tlog',
        data_modified: '2021-01-23T15:58:03.966361Z',
        count: 377
    },
    {
        log_id: 't408/data-12.tlog',
        data_modified: '2021-01-21T15:58:03.966361Z',
        count: 377
    },
    {
        log_id: 't408/data-110.tlog',
        data_modified: '2021-01-23T15:58:03.966361Z',
        count: 1400
    }
];

describe('mapTableFilters', () => {
    it('Maps valid filterValue keys to "new key, same value" pairs object.', () => {
        const validFilterMap = {
            logId: 'log_id',
            dateModified: 'date_modified'
        };

        const tableFilters = mapTableFilters(FILTER_VALUES, validFilterMap);

        expect(tableFilters.log_id).toBe(FILTER_VALUES.logId);
        expect(tableFilters.date_modified).toBe(FILTER_VALUES.dateModified);
    });

    it('Returns object without mapped keys if no valid filterValue keys are found.', () => {
        const invalidFilterMap = {
            LOG_ID: 'log_id',
            DATE_MODIFIED: 'discovered_on'
        };

        const tableFilters = mapTableFilters(FILTER_VALUES, invalidFilterMap);

        expect(tableFilters.log_id).toBeUndefined();
        expect(tableFilters.date_modified).toBeUndefined();
    });
});

describe('getCompareFormat', () => {
    it('Returns the value if input is a number.', () => {
        expect(getCompareFormat(1)).toBe(1);
    });

    it('Returns an uppercased string if input is not a number.', () => {
        expect(getCompareFormat('abc')).toBe('ABC');
    });
});

describe('filterData', () => {
    it('Returns two results when single filter matches multiple records.', () => {
        expect(filterData({ log_id: '10.tlog' })(DATA)).toHaveLength(3);
    });

    it('Returns one result when multiple filters match single record.', () => {
        expect(filterData({ log_id: '10.tlog', data_modified: DATA[1].data_modified })(DATA)).toHaveLength(2);
    });

    it('Returns no results when no records match filter criteria.', () => {
        expect(filterData({ log_id: '.txt' })(DATA)).toHaveLength(0);
    });

    it('Returns all results when filter is empty.', () => {
        expect(filterData({})(DATA)).toHaveLength(4);
    });
});

describe('sortData', () => {
    it('Returns results sorted in descending order when ascending is undefined', () => {
        const sortedData = sortData({ orderBy: 'data_modified' })(DATA);

        expect(sortedData[0].log_id).toBe(DATA[1].log_id);
        expect(sortedData[3].log_id).toBe(DATA[2].log_id);
    });

    it('Returns results sorted in the requested orderBy priority', () => {
        const sortedData = sortData({ orderBy: ['data_modified', 'count'] })(DATA);

        expect(sortedData[0].count).toBe(DATA[3].count);
    });

    it('Returns results sorted in ascending order when ascending is true', () => {
        const sortedData = sortData({ orderBy: 'data_modified', ascending: true })(DATA);

        expect(sortedData[3].count).toBe(DATA[3].count);
    });
});
