import type { ComponentPropsWithoutRef } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';

import PageComponent, { type PageProps } from 'src/components/Page/Page';
import HeaderComponent from 'src/components/Page/Header';
import DocBlock from '.storybook/DocBlock';
import FilterPageWithCollapse from '../Filter/components/FilterPage/FilterPageWithCollapse';
import { RadioFilter as RadioFilterFunction } from 'src/components/Filter/modules';

export default {
    title: 'Lakefront/Page',
    component: PageComponent,
    argTypes: {
        children: {
            table: {
                disable: true
            }
        },
        className: {
            type: 'string'
        }
    },
    parameters: {
        docs: {
            page: DocBlock
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

const Template: StoryFn<PageProps & ComponentPropsWithoutRef<'div'>> = (args) => {
    const pageFilters = {
        radioFilter: RadioFilterFunction({
            label: 'Radio Filter',
            initialValue: RADIO_FILTER_OPTIONS[0].value,
            defaultValue: '',
            options: RADIO_FILTER_OPTIONS,
            description: 'RadioFilter is a radio group control meant to single select a value.'
        }, {})
    };
    return (
        <PageComponent className={args.className}>
            <HeaderComponent>
                {args.children}
            </HeaderComponent>
            <p>
                This page shows filter and 3 collapsible sections. The Page component
                can render any child component.
            </p>
            <br />
            <FilterPageWithCollapse pageFilters={pageFilters} />
        </PageComponent>
    );
};

export const Page = Template.bind({});
Page.args = {
    children: <div>Page with Filter and Collapsible sections</div>
};
