import { Meta, StoryFn } from '@storybook/react-webpack5';

import Button from 'src/components/Button/Button';
import { ButtonComponentProps, COLORS } from 'src/components/Button/buttonUtil';
import ButtonsPage from './ButtonsPage';
import DocBlock from '.storybook/DocBlock';

export default {
    title: 'Lakefront/Button',
    component: Button,
    argTypes: {
        onClick: {
            action: 'clicked',
            table: {
                disable: true
            }
        },
        children: {
            name: 'text (children)',
            description: 'Usually text, but can accept other elements. If an icon is needed, use the icon prop.'
        },
        color: {
            control: {
                type: 'select',
                options: [COLORS.PRIMARY, COLORS.SECONDARY, COLORS.DESTRUCTIVE],
            },
        },
        disabled: {
            control: 'boolean',
            table: {
                defaultValue: { summary: false },
                type: { summary: 'boolean' }
            },
            description: 'HTML button element disabled prop.'
        },
        icon: {
            control: {
                type: 'boolean'
            }
        }
    },
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

// All Buttons
const AllTemplate: StoryFn = () => <ButtonsPage />;

export const AllButtons = AllTemplate.bind({});

AllButtons.args = {};

const Template: StoryFn<ButtonComponentProps> = (args) => <Button {...args} />;

// Individual Buttons (No Icon)
export const Primary = Template.bind({});
Primary.args = {
    children: 'Button',
    color: 'primary',
    iconPosition: undefined
};

export const Secondary = Template.bind({});
Secondary.args = {
    children: 'Button',
    color: 'secondary',
    iconPosition: undefined
};

export const Destructive = Template.bind({});
Destructive.args = {
    children: 'Button',
    color: 'destructive',
    iconPosition: undefined
};

export const Link = Template.bind({});
Link.args = {
  children: 'Button',
  color: 'link',
  iconPosition: undefined
};

// Individual Buttons (With Icon)
export const PrimaryDefaultIcon = Template.bind({});
PrimaryDefaultIcon.args = {
    ...Primary.args,
    iconLabel: 'Optional label text',
    icon: true
};

export const SecondaryDefaultIcon = Template.bind({});
SecondaryDefaultIcon.args = {
    ...Secondary.args,
    icon: true
};

export const DestructiveDefaultIcon = Template.bind({});
DestructiveDefaultIcon.args = {
    ...Destructive.args,
    icon: true
};

export const LinkDefaultIcon = Template.bind({});
LinkDefaultIcon.args = {
  ...Link.args,
  icon: true
};

// Icon Only Buttons
export const PrimaryIconButton = Template.bind({});
PrimaryIconButton.args = {
    children: undefined,
    color: 'primary',
    iconLabel: 'Optional label text',
    icon: true,
    iconPosition: undefined
};

export const SecondaryIconButton = Template.bind({});
SecondaryIconButton.args = {
    children: undefined,
    color: 'secondary',
    icon: true,
    iconPosition: undefined
};

export const DestructiveIconButton = Template.bind({});
DestructiveIconButton.args = {
    children: undefined,
    color: 'destructive',
    icon: true,
    iconPosition: undefined
};

export const LinkIconButton = Template.bind({});
LinkIconButton.args = {
  children: undefined,
  color: 'link',
  icon: true,
  iconPosition: undefined
};
