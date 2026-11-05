import type { Meta, StoryFn } from '@storybook/react-webpack5';


import DocBlock from '.storybook/DocBlock';
import Preview, { type PreviewProps } from './Preview';

export default {
    title: 'Lakefront/Theme/Colors',
    component: Preview,
    parameters: {
        docs: {
            page: DocBlock
        }
    },
    argTypes: {
        sortBy: {
            table: {
                disable: true
            }
        }
    }
} as Meta;

const Template: StoryFn<PreviewProps> = ({ sortBy }) => <Preview sortBy={sortBy} />;

export const SortedByColor = Template.bind({});
SortedByColor.args = {
    sortBy: 'color'
};

export const SortedByName = Template.bind({});
SortedByName.args = {
    sortBy: 'name'
};
