import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import type { ComponentPropsWithoutRef } from 'react';
import Input, { type InputProps } from 'src/components/Input/Input';

export default {
    title: 'Lakefront/Input',
    component: Input,
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
            description: 'HTML input element disabled prop.'
        }
    },
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<InputProps & ComponentPropsWithoutRef<'input'>> = (args) => <Input {...args} />;

export const Placeholder = Template.bind({});
Placeholder.args = {
    placeholder: 'Placeholder'
};

export const Filled = Template.bind({});
Filled.args = {
    value: 'Filled Input'
};

export const FilledLabeledAndHasError = Template.bind({});
FilledLabeledAndHasError.args = {
    value: 'Invalid Input',
    error: 'Please try again.',
    label: 'My input'
};

export const FilledAndHasError = Template.bind({});
FilledAndHasError.args = {
    value: 'Invalid Input',
    error: 'Please try again.'
};

export const Disabled = Template.bind({});
Disabled.args = {
    value: '',
    label: 'My input',
    disabled: true
};

export const DisabledWithText = Template.bind({});
DisabledWithText.args = {
    value: 'Disabled Input',
    label: 'My input',
    disabled: true
};

export const RequiredField = Template.bind({});
RequiredField.args = {
    value: 'Value must be provided',
    label: 'Required Field',
    required: true
};
