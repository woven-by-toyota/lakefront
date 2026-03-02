import { fireEvent } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import ModeSelector from '../ModeSelector';
import * as Select from 'src/components/Select/Select';
import lakefrontColors from 'src/styles/lakefrontColors';

const PROPS = {
    title: 'Mode',
    modes: [
        { label: 'Mode 1', value: '1' },
        { label: 'Mode 2', value: '2' }
    ],
    selectedMode: '2',
    legend: [
        { label: 'First Mode', color: lakefrontColors.red },
        { label: 'Second Mode', color: lakefrontColors.blue }
    ],
    onModeSelect: (mode: string) => null
};

describe('ModeSelector', () => {
    it('renders the header', () => {
        const { getByText } = render(<ModeSelector {...PROPS} />);

        getByText(PROPS.title);
    });

    describe('selection dropdown', () => {
        it('renders a mode selection dropdown', () => {
            jest.spyOn(Select, 'default').mockImplementationOnce(() => <div>mockSelectDropdown</div>);
            const { getByText } = render(<ModeSelector {...PROPS} />);

            getByText('mockSelectDropdown');
        });

        it('provides the correct options to the selection dropdown', () => {
            const { container } = render(<ModeSelector {...PROPS} />);
            expect(container.getElementsByTagName('Option')).toHaveLength(2);

            // test out options labels
            expect(container.getElementsByTagName('Option')[0]).toHaveTextContent('Mode 1');
            expect(container.getElementsByTagName('Option')[1]).toHaveTextContent('Mode 2');
        });

        it('displays the provided (selected) mode', () => {
            const { getAllByText } = render(<ModeSelector {...PROPS} />);

            expect(getAllByText('Mode 2')).toHaveLength(2);
        });

        it('calls provided callback with selected option on mode select', () => {
            const onModeSelect = jest.fn();
            const { container } = render(<ModeSelector {...PROPS} onModeSelect={onModeSelect} />);

            fireEvent.change(container.getElementsByTagName('select')[0], {
                target: { value: '1' }
            });

            expect(onModeSelect.mock.calls.length).toBe(1);
            expect(onModeSelect).toHaveBeenCalledWith('1');
        });
    });

    describe('mode selector legend', () => {
        it('does not display if left undefined', () => {
            const { container } = render(<ModeSelector {...PROPS} legend={undefined} />);

            expect(container.querySelector('.mode-selector-legend')).not.toBeInTheDocument();
        });

        it('displays a key and label for each legend element', () => {
            const { container } = render(<ModeSelector {...PROPS} />);

            const legendRow1 = container.querySelector('.legend-row-0') as HTMLElement;
            const legendRow2 = container.querySelector('.legend-row-1') as HTMLElement;

            expect(container.querySelector('.mode-selector-legend')).toBeInTheDocument();

            expect(legendRow1.firstChild).toHaveStyle(`background-color: ${lakefrontColors.red}`);
            expect((legendRow1.lastChild as HTMLDivElement).innerHTML).toBe('First Mode');

            expect(legendRow2.firstChild).toHaveStyle(`background-color: ${lakefrontColors.blue}`);
            expect((legendRow2.lastChild as HTMLDivElement).innerHTML).toBe('Second Mode');
        });
    });
});
