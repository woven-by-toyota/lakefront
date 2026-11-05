import { type ComponentPropsWithoutRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';

import AnchorCopyComponent, { type AnchorCopyProps } from 'src/components/AnchorCopy';
import Input from 'src/components/Input/Input';
import DocBlock from '.storybook/DocBlock';
import { green, saturatedRed, blue, storm } from 'src/styles/lakefrontColors';

export default {
    title: 'Lakefront/AnchorCopy',
    component: AnchorCopyComponent,
    argTypes: {
        AnchorContent: {
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

const Template: StoryFn<AnchorCopyProps & ComponentPropsWithoutRef<'div'>> = (args) => {
    const [title, setTitle] = useState('anchor-copy');
    const [copied, setCopied] = useState('');

    const handleChange = ({ target: { value } }) => {
        setCopied('');
        setTitle(value);
    };

    const handleCopy = (copiedHash: string) => {
        setCopied(`Copied "${copiedHash}"`);
    };

    return (
        <div>
            <AnchorCopyComponent
                {...args}
                disabled={args.disabled || !title}
                title={args.title || 'Modify text below and click the link icon to copy it.'}
                hashId={args.hashId || title}
                onCopy={handleCopy}
            />
            <Input value={args.hashId || title} onChange={handleChange} style={{ marginTop: 8 }} />
            <div style={{ color: green, minHeight: 24 }}>
                {copied}
                <span style={{ color: saturatedRed, minHeight: 24 }}>
                    {!title && 'Copying is disabled due to empty input.'}
                </span>
            </div>
        </div>
    );
};

export const AnchorCopy = Template.bind({});

export const CustomAnchor = Template.bind({});
CustomAnchor.args = {
    AnchorContent: () => (
        <div
            style={{
                fontWeight: 'bold',
                marginRight: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                borderRadius: 4,
                backgroundColor: blue,
                border: `1px solid ${storm}`,
                width: 64,
                height: 32
            }}
        >
            <div style={{ fontSize: 8 }}>Copy</div>
            <div style={{ paddingBottom: 4, fontSize: 40 }}>🚤</div>
        </div>
    )
};
