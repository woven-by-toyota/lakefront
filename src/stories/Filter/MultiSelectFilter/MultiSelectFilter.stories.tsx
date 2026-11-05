import type { Meta, StoryFn } from '@storybook/react-webpack5';

import FilterPage, { MULTI_SELECT_FILTER_OPTIONS } from '../components/FilterPage';
import MultiSelectFilterDocs, { type MultiSelectFilterArgs, MULTI_SELECT_FILTER_SOURCE_CODE } from './MultiSelectFilterDocs';
import DocBlock from '.storybook/DocBlock';
import { MultiSelectFilter as MultiSelectFilterFunction } from 'src/components/Filter/modules';

export default {
    title: 'Lakefront/Filter/MultiSelectFilter',
    component: MultiSelectFilterDocs,
    argTypes: {
        multiSelectFilterProps: {
            control: {
                type: 'object'
            },
            description: 'The props required to be supplied as the first argument of the MultiSelectFilter component. If the *optional* `delimiter` prop is provided, input parsing will be enabled to allow typing/pasting multiple values seperated by the chosen delimiter.'
        },
        multiSelectFilterOptions: {
            control: false,
            description:
                'Any valid `FilterModule` property (excluding description and label) which will override default multi select filter behaviour.'
        }
    },
    parameters: {
        docs: {
            page: DocBlock,
            source: {
                code: MULTI_SELECT_FILTER_SOURCE_CODE
            }
        }
    }
} as Meta;

// Multi Select Filter
const MultiSelectFilterTemplate: StoryFn = (args: MultiSelectFilterArgs) => {
    const pageFilters = {
        multiSelectFilter: MultiSelectFilterFunction(args.multiSelectFilterProps, {})
    };

    return <FilterPage pageFilters={pageFilters} />;
};

export const MultiSelectFilter = MultiSelectFilterTemplate.bind({});

MultiSelectFilter.args = {
    multiSelectFilterProps: {
        label: 'Multi Select Filter',
        creatable: true,
        initialValue: ['colors'],
        options: MULTI_SELECT_FILTER_OPTIONS,
        description: 'MultiSelectFilter is a select dropdown control meant to multi select a value.'
    }
};

export const DelimiterParsing = MultiSelectFilterTemplate.bind({});
DelimiterParsing.args = {
    multiSelectFilterProps: {
        label: 'Delimiter Parsing',
        creatable: true,
        options: MULTI_SELECT_FILTER_OPTIONS,
        description: `Delimiter Parsing allows pasting in multiple values seperated
by a chosen delimiter. The "\\n" (e.g. new line) has been set as the delimiter here by default.`,
        delimiter: '\n'
    }
};
