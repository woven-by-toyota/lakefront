import type { ComponentPropsWithoutRef } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import DeviceProgressBarComponent, { type DeviceProgressProps } from 'src/components/Progress/DeviceProgressBar';
import DocBlock from '.storybook/DocBlock';
import colors from 'src/styles/lakefrontColors';

export default {
    title: 'Lakefront/Progress/DeviceProgress',
    component: DeviceProgressBarComponent,
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<DeviceProgressProps & ComponentPropsWithoutRef<'div'>> = (args) => {
    return (
        <section style={{ display: 'inline-flex' }}>
            <DeviceProgressBarComponent {...args} />
        </section>
    );
};

export const DefaultProgressBar = Template.bind({});
DefaultProgressBar.args = {
    total: 1374389534720,
    used: 1175916642304,
    available: 198472892416,
    capacity: '86%'
};

export const BarWithCapacityAndSubTextBelow = Template.bind({});
BarWithCapacityAndSubTextBelow.args = {
    total: 1374389534720,
    used: 1175916642304,
    available: 198472892416,
    capacity: '86%',
    capacityLocation: 'below',
    capacitySubText: 'Full'
};

export const BarWithThresholds = Template.bind({});
BarWithThresholds.args = {
    total: 1374389534720,
    used: 1175916642304,
    available: 198472892416,
    capacity: '86%',
    thresholds: [
        {
            id: 'warning',
            percentage: '70%',
            color: colors.yellow
        },
        {
            id: 'danger',
            percentage: '80%',
            color: colors.red
        },
    ]
};
