import type { ComponentPropsWithoutRef } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';

import CollapsibleComponent, { type CollapsibleProps } from 'src/components/Collapsible/Collapsible';
import DocBlock from '.storybook/DocBlock';

export default {
    title: 'Lakefront/Collapsible',
    component: CollapsibleComponent,
    argTypes: {
        title: {
            control: {
                type: 'text'
            }
        },
        subtitle: {
            control: {
                type: 'text'
            }
        },
        onChange: {
            action: 'changed',
            table: {
                disable: true
            }
        },
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

const Template: StoryFn<CollapsibleProps & ComponentPropsWithoutRef<'div'>> = (
  args
) => (
  <CollapsibleComponent {...args}>
    <div>
      <p>You can have any content here.</p>
      <p>It could be text, images, graphs, etc.</p>
      <p>You could also just leave it blank.</p>
    </div>
  </CollapsibleComponent>
);

export const Collapsible = Template.bind({});
Collapsible.args = {
  expanded: true,
  title: 'Collapsible Component',
  subtitle: <div>Additional Info | <strong>100</strong> Count | Updated <strong>Today</strong></div>
};

export const NonCollapsible = Template.bind({});
NonCollapsible.args = {
  expanded: true,
  title: 'Non Collapsible Component',
  subtitle: <div>Additional Info | <strong>100</strong> Count | Updated <strong>Today</strong></div>,
  collapsible: false
};
