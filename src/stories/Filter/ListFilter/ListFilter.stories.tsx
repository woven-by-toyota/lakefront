import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import { ListFilter as ListFilterFunction } from 'src/components/Filter/modules';
import FilterPage from '../components/FilterPage';
import ListFilterDocs, { LIST_FILTER_SOURCE_CODE, type ListFilterArgs } from './ListFilterDocs';
import { listFilterOptions } from './listFilterUtil';

export default {
    title: 'Lakefront/Filter/ListFilter',
    component: ListFilterDocs,
    argTypes: {
        label: {
            control: 'text',
            description: 'The label to display for the list filter component.'
        },
        description: {
            control: 'text',
            description: 'The description/help text to display above the list filter component.'
        },
        listFilterOverrides: {
            control: false
        }
    },
    parameters: {
        docs: {
            page: DocBlock,
            source: {
                code: LIST_FILTER_SOURCE_CODE
            }
        }
    }
} as Meta;

// ListFilter
const ListFilterTemplate: StoryFn = (args: ListFilterArgs) => {
    const pageFilters = {
        listFilter: ListFilterFunction(args.options, args.label, args.description, args.listFilterOptions)
    };

    return <FilterPage pageFilters={pageFilters} />;
};

export const ListFilter = ListFilterTemplate.bind({});
export const ListFilterOneInitialValue = ListFilterTemplate.bind({});

ListFilter.args = {
    label: 'List Filter',
    description: 'ListFilter is a checkbox group control meant to be used for multiple filter value combinations.',
    options: listFilterOptions,
    listFilterOptions: {
        allLabel: 'All Test Data'
    }
};

ListFilterOneInitialValue.args = {
    label: 'List Filter One Initial Value',
    description: 'ListFilter is a checkbox group control meant to be used for multiple filter value combinations.',
    listFilterOptions: {
        initialValue: 'better'
    },
    options: [
        {
            label: 'Good',
            value: 'good'
        },
        {
            label: 'Better',
            value: 'better'
        },
        {
            label: 'Best',
            value: 'best'
        }
    ]
};
