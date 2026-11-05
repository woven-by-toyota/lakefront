
import type { ComponentPropsWithoutRef } from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import CircularProgressComponent, { type CircularProgressProps } from 'src/components/Progress/CircularProgress';
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
    title: 'Lakefront/Progress/CircularProgress',
    component: CircularProgressComponent,
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<CircularProgressProps & ComponentPropsWithoutRef<'div'>> = (args) => {
    return (
        <section style={{ display: 'inline-flex' }}>
            <CircularProgressComponent width={args.width} data={args.data} theme={args.theme} text={args.text}>
            </CircularProgressComponent>
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

export const CircularProgress = Template.bind({});
CircularProgress.args = {
    data: [
        { label: 'finished', value: 5 },
        { label: 'failed', value: 30 },
        { label: 'running', value: 10 },
        { label: 'pending', value: 5 }
    ],
    width: 100,
    theme: PROGRESS_COLOR_SCHEME,
    text: '12%'
};
