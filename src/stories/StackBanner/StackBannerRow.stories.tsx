import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import type { ComponentPropsWithoutRef } from 'react';

import StackBannerRowComponent, { type StackBannerRowProps } from 'src/components/StackBanner/StackBannerRow';
import {
    ERROR_SEVERITY,
    NORMAL_SEVERITY,
    StackBannerStoryContent,
    WARNING_SEVERITY
} from 'src/components/StackBanner/stackBannerUtil';

export default {
    title: 'Lakefront/Stack Banner/Stack Banner Row',
    component: StackBannerRowComponent,
    argTypes: {
        icon: {
            control: 'boolean'
        },
        content: {
            control: 'text'
        }
    },
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<StackBannerRowProps & ComponentPropsWithoutRef<'div'>> = (args) => (
    <StackBannerRowComponent {...args} />
);

// named ErrorStory so it does not shadow the global Error; storyName keeps the Storybook label
export const ErrorStory = Template.bind({});
ErrorStory.storyName = 'Error';
ErrorStory.args = {
    content: <div>{StackBannerStoryContent.Error}</div>,
    severity: ERROR_SEVERITY,
    key: '1'
};

export const Warning = Template.bind({});
Warning.args = {
    content: <div>{StackBannerStoryContent.Warning}</div>,
    severity: WARNING_SEVERITY,
    key: '2'
};

export const Normal = Template.bind({});
Normal.args = {
    content: <div>{StackBannerStoryContent.Normal}</div>,
    severity: NORMAL_SEVERITY,
    key: '3'
};

export const Default = Template.bind({});
Default.args = {
    content: <div>{StackBannerStoryContent.Default}</div>,
    key: '4'
};
