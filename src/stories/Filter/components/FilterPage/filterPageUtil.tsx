import {
    DoubleMultiSelectFilter,
    DurationFilter,
    ListFilter,
    MultiSelectFilter,
    RadioFilter,
    SingleSelectFilter,
    TextFilter
} from 'src/components/Filter/modules';
import { listFilterOptions } from 'src/stories/Filter/ListFilter/listFilterUtil';

export const MULTI_SELECT_FILTER_OPTIONS = [
    {
        label: 'colors',
        value: 'colors'
    },
    {
        label: 'sizes',
        value: 'sizes'
    },
    {
        label: 'shapes',
        value: 'shapes'
    }
];

export const SINGLE_SELECT_FILTER_OPTIONS = [
    {
        label: 'Red',
        value: 'red'
    },
    {
        label: 'Green',
        value: 'green'
    },
    {
        label: 'Blue',
        value: 'blue'
    }
];

const RADIO_FILTER_OPTIONS = [
    {
        label: 'North',
        value: 'north'
    },
    {
        label: 'East',
        value: 'east'
    },
    {
        label: 'South',
        value: 'south'
    },
    {
        label: 'West',
        value: 'west'
    }
];

export const FILTERS = {
    doubleMultiSelectFilter: DoubleMultiSelectFilter({
        label: 'Double Multi Select Filter',
        selectOptions: {
            firstSelect: {
                apiField: 'first',
                label: 'First Filter',
                name: 'first',
                creatable: true,
                items: [],
                placeholder: 'Type or paste',
                disableMenu: true,
                barLabel: 'First Filter'
            },
            secondSelect: {
                apiField: 'second',
                label: 'Second Filter',
                name: 'second',
                creatable: true,
                items: [],
                placeholder: 'Type or paste',
                disableMenu: true,
                barLabel: 'Second Filter'
            }
        }
    }),
    multiSelectFilter: MultiSelectFilter(
        {
            label: 'Multi Select Filter',
            creatable: true,
            initialValue: ['colors'],
            options: MULTI_SELECT_FILTER_OPTIONS,
            description: 'MultiSelectFilter is a select dropdown control meant to multi select a value.'
        },
        {
            getDefaultFilterValue: () => ['colors'],
            isDefaultFilterValue(value): boolean {
                return value.length === 1 && value[0] === 'colors';
            }
        }
    ),
    listFilter: ListFilter(
        listFilterOptions,
        'List Filter',
        'ListFilter is a checkbox group control meant to be used for multiple filter value combinations.'
    ),
    radioFilter: RadioFilter(
        {
            label: 'Radio Filter',
            defaultValue: RADIO_FILTER_OPTIONS[0].value,
            initialValue: RADIO_FILTER_OPTIONS[0].value,
            options: RADIO_FILTER_OPTIONS,
            description: 'RadioFilter is a radio group control meant to single select a value.'
        },
        {
            getFilterBarLabel: (value: string) => `Radio Filter: ${value}`
        }
    ),
    singleSelectFilter: SingleSelectFilter({
        label: 'Single Select Filter',
        selectPlaceholderLabel: 'Select a color',
        filterLabelPrefix: 'Single Select Filter',
        options: SINGLE_SELECT_FILTER_OPTIONS,
        description: 'SingleSelectFilter is a select dropdown control meant to single select a value.'
    }),
    textFilter: TextFilter(
        'Text Filter',
        'TextFilter is a text input control meant to be used as a keyword(s) search. (Tab or Enter to apply)',
        {
            isDefaultFilterValue: (value) => value === 'lakefront',
            getDefaultFilterValue: () => 'lakefront',
            parseInitialFilterValue: (browserQueryUrlValue: string): string => browserQueryUrlValue || 'lakefront',
            getFilterBarLabel: (value: string) => `Text Filter: ${value}`
        }
    ),
    durationFilter: DurationFilter({
        label: 'Duration Filter',
        description:
            'Duration Filter is an input control meant to be used to filter according to the minimum and maximum input'
    })
};

export const LOCATION = {
    pathname: 'path',
    search: '',
    state: {
        search: ''
    },
    hash: '',
    key: 'key'
};
