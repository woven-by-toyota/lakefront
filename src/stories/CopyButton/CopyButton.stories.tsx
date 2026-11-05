import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';

import CopyButtonComponent, { type CopyButtonProps } from 'src/components/CopyButton';
import { type ButtonComponentProps, COLORS } from 'src/components/Button/buttonUtil';
import Input from 'src/components/Input/Input';
import DocBlock from '.storybook/DocBlock';
import { green, saturatedRed } from 'src/styles/lakefrontColors';

export default {
    title: 'Lakefront/CopyButton',
    component: CopyButtonComponent,
    argTypes: {
        as: {
            control: {
                type: 'select',
                options: ['a', 'button', 'div', 'span']
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
            table: {
                disable: true
            }
        },
        onCopy: {
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

const Template: StoryFn<CopyButtonProps & Omit<ButtonComponentProps, 'onCopy'>> = (args) => {
    const [copyText, setCopyText] = useState('Text to copy');
    const [copied, setCopied] = useState('');

    const handleChange = ({ target: { value } }) => {
        setCopied('');
        setCopyText(value);
    };

    const handleCopy = (copiedText: string) => {
        setCopied(`Copied "${copiedText}"`);
    };

    return (
        <div>
            <p>Modify text below and click the button to copy it.</p>
            <CopyButtonComponent
                {...args}
                valueToCopy={args.valueToCopy || copyText}
                disabled={args.disabled || !copyText}
                onCopy={handleCopy}
            />
            <Input value={args.valueToCopy || copyText} onChange={handleChange} style={{ marginTop: 8 }} />
            <div style={{ color: green, minHeight: 24 }}>
                {copied}
                <span style={{ color: saturatedRed, minHeight: 24 }}>
                    {!copyText && 'Copying is disabled due to empty input.'}
                </span>
            </div>
        </div>
    );
};

export const CopyButton = Template.bind({});
