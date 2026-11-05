import type { ComponentPropsWithoutRef } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import {
  NORMAL_SEVERITY,
  WARNING_SEVERITY,
  ERROR_SEVERITY,
  StackBannerStoryContent,
} from 'src/components/StackBanner/stackBannerUtil';

import StackBannerComponent, {
  type StackBannerProps,
} from 'src/components/StackBanner/StackBanner';
import DocBlock from '.storybook/DocBlock';

export default {
  title: 'Lakefront/Stack Banner',
  component: StackBannerComponent,
  argTypes: {
    rows: {
      control: false
    },
  },
  parameters: {
    docs: {
      page: DocBlock,
    },
  },
} as Meta;

const Template: StoryFn<StackBannerProps & ComponentPropsWithoutRef<'div'>> = (
  args
) => <StackBannerComponent {...args} />;

export const StackBanner = Template.bind({});
StackBanner.args = {
  rows: [
    {
      content: <div>{StackBannerStoryContent.Error}</div>,
      severity: ERROR_SEVERITY,
      key: '1',
    },
    {
      content: <div>{StackBannerStoryContent.Warning}</div>,
      severity: WARNING_SEVERITY,
      key: '2',
    },
    {
      content: <div>{StackBannerStoryContent.Normal}</div>,
      severity: NORMAL_SEVERITY,
      key: '3',
    },
    {
      content: <div>{StackBannerStoryContent.Default}</div>,
      key: '4',
    },
  ],
};
