import type { Meta, StoryFn } from '@storybook/react-webpack5';

import LoadingComponent, { type LoadingProps } from 'src/components/Loading/Loading';
import DocBlock from '.storybook/DocBlock';
import {ReactComponent as CycleDemo} from './assets/cycle-demo.svg';

export default {
    title: 'Lakefront/Loading',
    component: LoadingComponent,
    argTypes: {
        spinDirection: {
            control: {
                type: 'radio',
                options: ['LEFT', 'RIGHT']
            }
        }
    },
    parameters: {
        docs: {
            page: DocBlock,
        }
    }
} as Meta;

const Template: StoryFn<LoadingProps> = (args) => (
    <div style={{ display: 'flex' }}>
        <LoadingComponent {...args} />
    </div>
);

export const LoadingWithDefaultWovenIcon = Template.bind({});
LoadingWithDefaultWovenIcon.args = {
    iconVariant: 'primary'
};

export const LoadingWithTRIIcon = Template.bind({});
LoadingWithTRIIcon.args ={
    iconVariant: 'secondary'
};

export const LoadingWithSvgAsIcon = Template.bind({});
LoadingWithSvgAsIcon.args ={
    svg: CycleDemo
};

export const LoadingWithLabel = Template.bind({});
LoadingWithLabel.args = {
    label: 'Loading...'
};
