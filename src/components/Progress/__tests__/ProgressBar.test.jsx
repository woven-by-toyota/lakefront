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
    });

    describe('theme support', () => {
        it('renders correctly in light theme', () => {
            const { container } = render(
                <ProgressBar theme={PROGRESS_COLOR_SCHEME} data={items} total={50} width={100} />
            );

            expect(container.getElementsByTagName('div')[0]).toHaveAttribute('width', '100');
            expect(container.getElementsByTagName('span')).toHaveLength(3);
        });

        it('renders correctly in dark theme', () => {
            const { container } = render(
                <ProgressBar theme={PROGRESS_COLOR_SCHEME} data={items} total={50} width={100} />,
                'dark'
            );

            expect(container.getElementsByTagName('div')[0]).toHaveAttribute('width', '100');
            expect(container.getElementsByTagName('span')).toHaveLength(3);
        });

        it('renders bar segments consistently across themes', () => {
            const { container: lightContainer } = render(
                <ProgressBar theme={PROGRESS_COLOR_SCHEME} data={items} total={50} width={100} />
            );

            const { container: darkContainer } = render(
                <ProgressBar theme={PROGRESS_COLOR_SCHEME} data={items} total={50} width={100} />,
                'dark'
            );

            // Both should have same number of bars
            expect(lightContainer.getElementsByTagName('span')).toHaveLength(3);
            expect(darkContainer.getElementsByTagName('span')).toHaveLength(3);

            // Check that bar widths and positions are consistent
            const lightFinishedBar = lightContainer.getElementsByTagName('span')[0];
            const darkFinishedBar = darkContainer.getElementsByTagName('span')[0];

            expect(lightFinishedBar).toHaveStyle('width:10px');
            expect(darkFinishedBar).toHaveStyle('width:10px');
            expect(lightFinishedBar).toHaveStyle('left:0');
            expect(darkFinishedBar).toHaveStyle('left:0');
        });

        it('handles zero value items consistently across themes', () => {
            const zeroItems = [
                { label: 'finished', value: 0 },
                { label: 'failed', value: 0 },
                { label: 'running', value: 25 },
                { label: 'pending', value: 5 }
            ];

            const { container: lightContainer } = render(
                <ProgressBar theme={PROGRESS_COLOR_SCHEME} data={zeroItems} total={50} width={100} />
            );

            const { container: darkContainer } = render(
                <ProgressBar theme={PROGRESS_COLOR_SCHEME} data={zeroItems} total={50} width={100} />,
                'dark'
            );

            expect(lightContainer.getElementsByTagName('span')).toHaveLength(1);
            expect(darkContainer.getElementsByTagName('span')).toHaveLength(1);
            expect(lightContainer.getElementsByTagName('span')[0]).toHaveStyle('width:50px');
            expect(darkContainer.getElementsByTagName('span')[0]).toHaveStyle('width:50px');
        });

        it('renders default fallback colors consistently across themes', () => {
            const unknownItems = [
                { label: 'unknownlabel', value: 25 }
            ];

            const { container: lightContainer } = render(
                <ProgressBar theme={PROGRESS_COLOR_SCHEME} data={unknownItems} total={50} width={100} />
            );

            const { container: darkContainer } = render(
                <ProgressBar theme={PROGRESS_COLOR_SCHEME} data={unknownItems} total={50} width={100} />,
                'dark'
            );

            expect(lightContainer.getElementsByTagName('span')).toHaveLength(1);
            expect(darkContainer.getElementsByTagName('span')).toHaveLength(1);
            expect(lightContainer.getElementsByTagName('span')[0]).toHaveStyle('background-color:#e1e1e8');
            expect(darkContainer.getElementsByTagName('span')[0]).toHaveStyle('background-color:#e1e1e8');
        });

        it('maintains proper bar calculations across themes', () => {
            const testData = [
                { label: 'finished', value: 10 },
                { label: 'failed', value: 20 }
            ];

            const { container: lightContainer } = render(
                <ProgressBar theme={PROGRESS_COLOR_SCHEME} data={testData} total={100} width={200} />
            );

            const { container: darkContainer } = render(
                <ProgressBar theme={PROGRESS_COLOR_SCHEME} data={testData} total={100} width={200} />,
                'dark'
            );

            // Check both themes have same calculations
            const lightFinishedBar = lightContainer.getElementsByTagName('span')[0];
            const darkFinishedBar = darkContainer.getElementsByTagName('span')[0];
            const lightFailedBar = lightContainer.getElementsByTagName('span')[1];
            const darkFailedBar = darkContainer.getElementsByTagName('span')[1];

            // Width should be value/total * width: 10/100 * 200 = 20px, 20/100 * 200 = 40px
            expect(lightFinishedBar).toHaveStyle('width:20px');
            expect(darkFinishedBar).toHaveStyle('width:20px');
            expect(lightFailedBar).toHaveStyle('width:40px');
            expect(darkFailedBar).toHaveStyle('width:40px');

            // Position should be cumulative: finished at 0, failed at 20
            expect(lightFinishedBar).toHaveStyle('left:0px');
            expect(darkFinishedBar).toHaveStyle('left:0px');
            expect(lightFailedBar).toHaveStyle('left:20px');
            expect(darkFailedBar).toHaveStyle('left:20px');
        });
    });
});
