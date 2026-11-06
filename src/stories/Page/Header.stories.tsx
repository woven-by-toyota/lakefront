import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import type { ComponentPropsWithoutRef } from 'react';
import HeaderComponent from 'src/components/Page/Header';

export default {
    title: 'Lakefront/Header',
    component: HeaderComponent,
    argTypes: {
        children: {
            table: {
                disable: true
            }
        }
    },
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<ComponentPropsWithoutRef<'div'>> = (args) => {
    return <HeaderComponent>{args.children}</HeaderComponent>;
};

export const Header = Template.bind({});
Header.args = {
    children: <div>The header goes here.</div>
};
