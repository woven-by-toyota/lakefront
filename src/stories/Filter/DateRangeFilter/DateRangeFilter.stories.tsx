import { Meta, StoryFn } from '@storybook/react-webpack5';
import FilterComponent from 'src/components/Filter/Filter';
import FilterPage from '../components/FilterPage';
import DocBlock from '.storybook/DocBlock';
import { DateRangeFilter } from 'src/stories/Filter/DateRangeFilter/DateRangeFilter';

export default {
    title: 'Lakefront/Filter/DateRangeFilter',
    component: FilterComponent,
    argTypes: {
        ContextSwitchMenu: {
            control: false
        },
        FilterBar: {
            control: false
        },
        FilterJSONConfirmationModal: {
            control: false
        },
        FilterJSONInput: {
            control: false
        },
        additionalQueryParams: {
            control: false
        },
        filterHooks: {
            control: false
        },
        hideFilterBar: {
            control: {
                type: 'boolean'
            }
        },
        initialActiveSection: {
            control: {
                type: 'text'
            }
        },
        isCollapsed: {
            control: {
                type: 'boolean'
            }
        },
        isJSONInputAllowed: {
            control: {
                type: 'boolean'
            }
        },
        location: {
            control: false
        },
        onToggleCollapsed: {
            control: false
        },
        updateHistory: {
            control: false
        }
    },
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

/**
 * This story demonstrates the use of `splitQueryParams` in a filter.
 *
 * The DateRangeFilter uses `splitQueryParams: ['startDate', 'endDate']` to tell
 * the filter system that it stores its value across multiple query parameters
 * instead of a single one.
 *
 * When you select a date range, the URL will contain separate `startDate` and `endDate`
 * parameters (e.g., `?startDate=2024-01-01&endDate=2024-12-31`) instead of a single
 * combined parameter.
 *
 * This is useful for filters that:
 * - Represent ranges (date ranges, number ranges)
 * - Need to maintain compatibility with existing APIs that expect separate parameters
 * - Want clearer, more semantic query parameters in the URL
 */

const FILTERS_WITH_DATE_RANGE = {
    dateRange: DateRangeFilter({
        label: 'Date Range',
        description: 'Select a start and end date. This filter demonstrates splitQueryParams by storing the date range as separate startDate and endDate query parameters in the URL.'
    })
};

const DateRangeTemplate: StoryFn = (args) => <FilterPage {...args} pageFilters={FILTERS_WITH_DATE_RANGE} />;

export const WithSplitQueryParams = DateRangeTemplate.bind({});

WithSplitQueryParams.args = {
    hideFilterBar: false,
    isJSONInputAllowed: false
};

WithSplitQueryParams.parameters = {
    docs: {
        description: {
            story: `This story showcases a DateRangeFilter that uses the \`splitQueryParams\` feature. 

Instead of storing the date range as a single query parameter like \`dateRange=2024-01-01~2024-12-31\`, 
the filter stores it as two separate parameters: \`startDate=2024-01-01&endDate=2024-12-31\`.

**Key Implementation Details:**

1. The filter specifies \`splitQueryParams: ['startDate', 'endDate']\` to declare which query params it uses
2. The \`parseInitialFilterValue\` method receives an object with the split params instead of a single string
3. The filter system automatically handles clearing both parameters when the filter is reset
4. The \`getBrowserQueryUrlValue\` returns the full object which gets split into separate params

Try selecting a date range and observe how the URL preview shows separate \`startDate\` and \`endDate\` parameters.`
        }
    }
};
