import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import { AdditionalJSONFilter as AdditionalJSONFilterFunction } from 'src/components/Filter/modules';
import FilterPage from '../components/FilterPage';
import AdditionalJSONFilterDocs, {
    ADDITIONAL_JSON_SELECT_FILTER_SOURCE_CODE,
    type AdditionalJSONFilterArgs
} from './AdditionalJSONFilterDocs';

export default {
    title: 'Lakefront/Filter/AdditionalJSONFilter',
    component: AdditionalJSONFilterDocs,
    argTypes: {
        additionalJSONFilterOptions: {
            control: false,
            description:
                'Any valid `FilterModule` property which will override default additional JSON filter behaviour.'
        }
    },
    parameters: {
        docs: {
            page: DocBlock,
            source: {
                code: ADDITIONAL_JSON_SELECT_FILTER_SOURCE_CODE
            }
        }
    }
} as Meta;

// Additional JSON Filter
const AdditionalJSONFilterTemplate: StoryFn = (args: AdditionalJSONFilterArgs) => {
    const pageFilters = {
        additionalJSONFilter: AdditionalJSONFilterFunction(args.additionalJSONFilterOptions)
    };

    return (
        <FilterPage
            pageFilters={pageFilters}
            hideFilterBar={false}
            initialActiveSection='additionalJSONFilter'
        />
    );
};

export const AdditionalJSONFilter = AdditionalJSONFilterTemplate.bind({});

AdditionalJSONFilter.args = {
    additionalJSONFilterOptions: {
        label: 'Additional JSON Filter',
        inputHidden: false,
        description: 'AdditionalJSONFilter is normally hidden, but can be overriden to display ui.',
        getApiQueryUrl: (key: string, value: { additionalJSONFilter: number }) => {
            return value?.additionalJSONFilter ? `&${key}=${encodeURIComponent(value.additionalJSONFilter)}` : '';
        },
        getDefaultFilterValue: () => ({ additionalJSONFilter: 1 }),
        parseInitialFilterValue: () => ({ additionalJSONFilter: 1 }),
        isDefaultFilterValue: () => false
    }
};
