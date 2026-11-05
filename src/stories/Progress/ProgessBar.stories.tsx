import type { ComponentPropsWithoutRef } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import ProgressBarComponent, { type ProgressBarProps } from 'src/components/Progress/ProgressBar';
import DocBlock from '.storybook/DocBlock';
import { PROGRESS_COLOR_SCHEME } from 'src/stories/Progress/progressColors';
import styled from '@emotion/styled';

const Chips = styled.div(() => ({
    minWidth: 22,
    padding: '6px 16px',
    fontSize: '12px',
    textAlign: 'center',
    display: 'inline-flex',
    justifyContent: 'center',
    borderRadius: '2px',
    alignItems: 'center'
}));

const Row = styled.li(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: 2,
    alignItems: 'center',
    marginBottom: 5,
    'span:first-of-type': {
        marginRight: 1
    }
}));

export default {
    title: 'Lakefront/Progress/ProgressBar',
    component: ProgressBarComponent,
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<ProgressBarProps & ComponentPropsWithoutRef<'div'>> = (args) => {
    return (
        <section style={{ display: 'inline-flex' }}>
            <ProgressBarComponent width={args.width} data={args.data} theme={args.theme} total={args.total}>
            </ProgressBarComponent>
            <section style={{ marginLeft: 20 }}>
                <ul style={{ margin: 0 }}>
                    {args.data.map((res) => {
                        return (
                            <Row key={res.label}>
                                <span>{res.label}:</span>
                                <Chips style={{ backgroundColor: args.theme[res.label].bgColor, color: args.theme[res.label].fgColor }}>
                                    {res.value}
                                </Chips>
                            </Row>
                        );

                    })}
                </ul>
            </section>
        </section>
    );
};

export const ProgressBar = Template.bind({});
ProgressBar.args = {
    data: [
        { label: 'finished', value: 5 },
        { label: 'failed', value: 30 },
        { label: 'running', value: 10 },
        { label: 'pending', value: 5 }
    ],
    width: 300,
    theme: PROGRESS_COLOR_SCHEME,
    text: '12%',
    total: 50
};
