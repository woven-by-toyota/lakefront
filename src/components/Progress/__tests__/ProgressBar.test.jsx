import React from 'react';
import { renderWithTheme as render } from 'src/lib/testing';
import ProgressBar from '../ProgressBar';
import { PROGRESS_COLOR_SCHEME } from 'src/stories/Progress/progressColors';
const items = [
    { label: 'finished', value: 5 },
    { label: 'failed', value: 30 },
    { label: 'running', value: 10 },
    { label: 'pending', value: 5 }
]

describe('<ProgressBar />', () => {
    describe('general rendering', () => {
        it('renders default items', () => {
            const { container } = render(
                <ProgressBar theme={PROGRESS_COLOR_SCHEME} data={items} total={50} width={100} />
            );
            // check width of bar container
            expect(container.getElementsByTagName('div')[0]).toHaveAttribute('width', '100');
            // only 3 bars are rendered since pending is omitted
            expect(container.getElementsByTagName('span')).toHaveLength(3);

            // width of bars generated should be double the value since width / total is 2
            const finishedBar = container.getElementsByTagName('span')[0];
            expect(finishedBar).toHaveStyle('width:10px');
            expect(finishedBar).toHaveStyle('left:0');

            const failedBar = container.getElementsByTagName('span')[1];
            expect(failedBar).toHaveStyle('width:60px');
            expect(failedBar).toHaveStyle('left:10px');

            // running bar
            const runningBar = container.getElementsByTagName('span')[2];
            expect(runningBar).toHaveStyle('width:20px');
            expect(runningBar).toHaveStyle('left:70px');
        });
        it('does not render zero value items', () => {
            const items = [
                { label: 'finished', value: 0 },
                { label: 'failed', value: 0 },
                { label: 'running', value: 25 },
                { label: 'pending', value: 5 }
            ];
            const { container } = render(
                <ProgressBar theme={PROGRESS_COLOR_SCHEME} data={items} total={50} width={100} />
            );
            expect(container.getElementsByTagName('span')).toHaveLength(1);
            expect(container.getElementsByTagName('span')[0]).toHaveStyle('width:50px')
        });
        it('renders transparent color for a non existing label ', () => {
            const items = [
                { label: 'testlabel', value: 25 }
            ];
            const { container } = render(
                <ProgressBar theme={PROGRESS_COLOR_SCHEME} data={items} total={50} width={100} />
            );
            expect(container.getElementsByTagName('span')).toHaveLength(1);
            expect(container.getElementsByTagName('span')[0]).toHaveStyle('background-color:#e1e1e8')
        });
    })
});
