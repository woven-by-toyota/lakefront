import { type ComponentPropsWithoutRef, useState, useEffect } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';

import CheckboxGroupComponent, { type CheckboxGroupProps } from 'src/components/CheckboxGroup/CheckboxGroup';
import DocBlock from '.storybook/DocBlock';
import { emerald } from 'src/styles/lakefrontColors';

export default {
    title: 'Lakefront/CheckboxGroup',
    component: CheckboxGroupComponent,
    argTypes: {
        onHandleChange: {
            control: false
        },
        selected: {
            table: {
                disable: true
            }
        }
    },
    parameters: {
        docs: {
            page: DocBlock,
            source: {
                transform: (source: string) => {
                    return source
                        .replace('onChange={function noRefCheck() {}}', '')
                        .replace(/\n/g, '')
                        .replace(/[ ]{2}/g, ' ');
                }
            }
        }
    }
} as Meta;

const JOB_TYPES = [
    { label: 'Finished', value: 'finished' },
    { label: 'Cancelled', value: 'canceled' },
    { label: 'Failed', value: 'failed' },
    { label: 'Running', value: 'running' },
    { label: 'Pending', value: 'enqueued' }
];

const Template: StoryFn<CheckboxGroupProps & ComponentPropsWithoutRef<'input'>> = (args) => {
    const [value, setValue] = useState(new Set(JOB_TYPES.map(item => item.value)));

    const handleClick = (option: any) => {
        setValue(option);
    };

    const getValue = (): any => {
        var values = [];
        value.forEach((element) => {
            values.push(element + ' ');
        });
        return values;
    };

    useEffect(() => {
        setValue(new Set(args.options.map(item => item.value)));
    }, [args.options]);

    return (
        <div>
            {value.size !== 0 && <div
                style={{
                    minHeight: 20,
                    backgroundColor: emerald,
                    padding: 8,
                    margin: '8px 0',
                }}
            >
                Selected Values :    {getValue()}
            </div>}
            <CheckboxGroupComponent
                options={args.options}
                allLabel={args.allLabel}
                className={args.className}
                allColor={args.allColor}
                name={args.name}
                selected={value}
                onHandleChange={handleClick}
            />
        </div>
    );
};

export const CheckboxGroup = Template.bind({});
CheckboxGroup.args = {
    options: JOB_TYPES,
    allLabel: 'All',
    name: 'checkBoxGrp'
};
