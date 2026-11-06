import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import type { ComponentPropsWithoutRef } from 'react';
import PropertyListComponent, { type Property, type PropertyListProps } from 'src/components/PropertyList';
export default {
    title: 'Lakefront/PropertyList',
    component: PropertyListComponent,
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const attributes: Property[] = [
    { caption: 'LongCaptionNameC1', content: (d) => d.p1 },
    { caption: 'C2', content: (d) => d.p2 }
];

const data = {
    p1: 'This is to demonstrate the rendering of content 1',
    p2: 'This is to demonstrate the rendering of content 2'
};

const Template: StoryFn<PropertyListProps & ComponentPropsWithoutRef<'div'>> = (args) => {
    return <PropertyListComponent {...args} />;
};

export const PropertyList = Template.bind({});
PropertyList.args = {
    attributes: attributes,
    data: data
};

export const PropertyListCaptionVariable = Template.bind({});
PropertyListCaptionVariable.args = {
    attributes: attributes,
    data: data,
    variant: 'variable'
};
