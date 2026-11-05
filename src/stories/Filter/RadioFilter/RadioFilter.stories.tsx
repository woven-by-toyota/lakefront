import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import { RadioFilter as RadioFilterFunction } from 'src/components/Filter/modules';
import FilterPage from '../components/FilterPage';
import RadioFilterDocs, { RADIO_FILTER_SOURCE_CODE, type RadioFilterArgs } from './RadioFilterDocs';

export default {
    title: 'Lakefront/Filter/RadioFilter',
    component: RadioFilterDocs,
    argTypes: {
        radioFilterProps: {
            control: {
                type: 'object'
            },
            description: 'The props required to be supplied as the first argument of the RadioFilter component.'
        },
        radioFilterOptions: {
            control: false,
            description:
                'Any valid `FilterModule` property (excluding description and label) which will override default radio filter behaviour.'
        }
    },
    parameters: {
        docs: {
            page: DocBlock,
            source: {
                code: RADIO_FILTER_SOURCE_CODE
            }
        }
    }
} as Meta;

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

// Radio Filter
const RadioFilterTemplate: StoryFn = (args: RadioFilterArgs) => {
    const pageFilters = {
        radioFilter: RadioFilterFunction(args.radioFilterProps, {})
    };

    return <FilterPage pageFilters={pageFilters} />;
};

export const RadioFilter = RadioFilterTemplate.bind({});

RadioFilter.args = {
    radioFilterProps: {
        label: 'Radio Filter',
        initialValue: RADIO_FILTER_OPTIONS[0].value,
        defaultValue: '',
        options: RADIO_FILTER_OPTIONS,
        description: 'RadioFilter is a radio group control meant to single select a value.'
    }
};
