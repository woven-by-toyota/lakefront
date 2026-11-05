import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import { SingleSelectFilter as SingleSelectFilterFunction } from 'src/components/Filter/modules';
import FilterPage, { SINGLE_SELECT_FILTER_OPTIONS } from '../components/FilterPage';
import SingleSelectFilterDocs, {
    SINGLE_SELECT_FILTER_SOURCE_CODE,
    type SingleSelectFilterArgs
} from './SingleSelectFilterDocs';

export default {
    title: 'Lakefront/Filter/SingleSelectFilter',
    component: SingleSelectFilterDocs,
    argTypes: {
        singleSelectFilterProps: {
            control: {
                type: 'object'
            },
            description: 'The props required to be supplied as the first argument of the SingleSelectFilter component.'
        },
        singleSelectFilterOptions: {
            control: false,
            description:
                'Any valid `FilterModule` property (excluding description, label, and required) which will override default single select filter behaviour.'
        }
    },
    parameters: {
        docs: {
            page: DocBlock,
            source: {
                code: SINGLE_SELECT_FILTER_SOURCE_CODE
            }
        }
    }
} as Meta;

// Single Select Filter
const SingleSelectFilterTemplate: StoryFn = (args: SingleSelectFilterArgs) => {
    const pageFilters = {
        singleSelectFilter: SingleSelectFilterFunction(args.singleSelectFilterProps, {})
    };

    return <FilterPage pageFilters={pageFilters} />;
};

export const SingleSelectFilter = SingleSelectFilterTemplate.bind({});

SingleSelectFilter.args = {
    singleSelectFilterProps: {
        label: 'Single Select Filter',
        selectPlaceholderLabel: 'Select a color',
        filterLabelPrefix: 'Single Select Filter',
        options: SINGLE_SELECT_FILTER_OPTIONS,
        description: 'SingleSelectFilter is a select dropdown control meant to single select a value.'
    }
};
