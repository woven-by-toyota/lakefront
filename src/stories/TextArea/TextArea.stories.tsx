import type { ComponentPropsWithoutRef } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';

import TextArea, { type TextAreaProps } from 'src/components/TextArea/TextArea';
import DocBlock from '.storybook/DocBlock';

export default {
    title: 'Lakefront/TextArea',
    component: TextArea,
    argTypes: {
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
        },
        disabled: {
            control: 'boolean',
            table: {
                defaultValue: { summary: false },
                type: { summary: 'boolean' }
            },
            description: 'HTML textarea element disabled prop.'
        }
    },
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<TextAreaProps & ComponentPropsWithoutRef<'textarea'>> = (args) => <TextArea {...args} />;

export const Placeholder = Template.bind({});
Placeholder.args = {
    placeholder: 'Placeholder'
};

export const Filled = Template.bind({});
Filled.args = {
    value: 'Filled TextArea'
};

export const FilledLabeledAndHasError = Template.bind({});
FilledLabeledAndHasError.args = {
    value: 'Invalid TextArea',
    error: 'Please try again.',
    label: 'My textarea'
};

export const FilledAndHasError = Template.bind({});
FilledAndHasError.args = {
    value: 'Invalid TextArea',
    error: 'Please try again.'
};

export const Disabled = Template.bind({});
Disabled.args = {
    value: '',
    label: 'My textarea',
    disabled: true
};

export const DisabledWithText = Template.bind({});
DisabledWithText.args = {
    value: 'Disabled TextArea',
    label: 'My textarea',
    disabled: true
};
