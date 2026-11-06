import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import { TextFilter as TextFilterFunction } from 'src/components/Filter/modules';
import FilterPage from '../components/FilterPage';
import TextFilterDocs, { TEXT_FILTER_SOURCE_CODE, type TextFilterArgs } from './TextFilterDocs';

export default {
    title: 'Lakefront/Filter/TextFilter',
    component: TextFilterDocs,
    argTypes: {
        label: {
            control: 'text',
            description: 'The label to display for the text filter component.'
        },
        description: {
            control: 'text',
            description: 'The description/help text to display above the text filter component.'
        },
        textFilterOverrides: {
            control: false
        }
    },
    parameters: {
        docs: {
            page: DocBlock,
            source: {
                code: TEXT_FILTER_SOURCE_CODE
            }
        }
    }
} as Meta;

// Text Filter
const TextFilterTemplate: StoryFn = (args: TextFilterArgs) => {
    const pageFilters = {
        textFilter: TextFilterFunction(args.label, args.description, {}),
        numberFilter: TextFilterFunction(
            'Number Filter',
            'TextFilter input can be limited to accept numbers only.',
            {},
            { type: 'number' }
        )
    };

    return <FilterPage pageFilters={pageFilters} />;
};

export const TextFilter = TextFilterTemplate.bind({});

TextFilter.args = {
    label: 'Text Filter',
    description: 'TextFilter is a text input control meant to be used as a keyword(s) search.'
};
