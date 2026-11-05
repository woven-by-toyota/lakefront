import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import { type ComponentPropsWithoutRef, useState } from 'react';
import TabComponent, { type TabProps } from 'src/components/Tabs';

export default {
    title: 'Lakefront/Tabs',
    component: TabComponent,
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<TabProps & ComponentPropsWithoutRef<'div'>> = (args) => {
    const [keyValue, setKeyValue] = useState('Key1');

    const handleChange = (value: string) => {
        setKeyValue(value);
    };
    return (
        <TabComponent
            options={args.options}
            value={keyValue}
            onChange={handleChange}
        ></TabComponent>
    );
};

export const Tabs = Template.bind({});
Tabs.args = {
    options: [
        { key: 'Key1', caption: 'Caption1' },
        { key: 'Key2', caption: 'Caption2' }
    ]
};
