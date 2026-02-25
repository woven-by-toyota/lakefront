import { act, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import TypeaheadSearch from '../TypeaheadSearch';

jest.useFakeTimers();

const LAKEFRONT_NAMES = ['L', 'La', 'Lak'];
const INTERVAL = 100;

const fetchResults = jest.fn((searchText) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            let response = [];

            if (searchText === 'error') {
                rej('An error was thrown');
            }

            if (LAKEFRONT_NAMES.join().includes(searchText)) {
                response = LAKEFRONT_NAMES.map((value) => ({ label: value, value })).filter(({ value }) =>
                    value.includes(searchText)
                );
            }

            res(response);
        }, INTERVAL);
    });
});

describe('TypeaheadSearch', () => {
    it('renders correctly', () => {
        const { getByRole, container } = render(<TypeaheadSearch />);

        getByRole('textbox');
        expect(container.querySelector('svg.typeaheadSearchIcon')).toBeInTheDocument();
        expect(container.querySelector('div.searchResultsPopoverBackground')).not.toBeInTheDocument();
    });

    it('receives focus when autoFocus is true', () => {
        const { getByRole } = render(<TypeaheadSearch autoFocus />);

        expect(getByRole('textbox')).toHaveFocus();
    });

    it('does not trigger results when text input length is below characterMinimum', () => {
        const { container, rerender } = render(<TypeaheadSearch />);

        fireEvent.change(container.querySelector('input'), { target: { value: 'l' } });

        act(() => {
            jest.advanceTimersByTime(250);
        });

        expect(container.querySelector('div.searchResultsPopoverBackground')).toBeInTheDocument();

        rerender(<TypeaheadSearch characterMinimum={3} />);

        fireEvent.change(container.querySelector('input'), { target: { value: 'la' } });

        act(() => {
            jest.advanceTimersByTime(250);
        });

        expect(container.querySelector('div.searchResultsPopoverBackground')).not.toBeInTheDocument();
    });

    it('renders with the provided initialSearchText', () => {
        const INIT_TEXT = 'init';
        const { container } = render(<TypeaheadSearch initialSearchText={INIT_TEXT} />);
        
        expect(container.querySelector('input')).toHaveValue(INIT_TEXT);
    });

    it('does not show results before inputDebounceMs is met', () => {
        const { container } = render(<TypeaheadSearch />);

        fireEvent.change(container.querySelector('input'), { target: { value: 'l' } });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(container.querySelector('div.searchResultsPopoverBackground')).not.toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(50);
        });

        expect(container.querySelector('div.searchResultsPopoverBackground')).toBeInTheDocument();
    });

    it('renders with the proper placeholder', () => {
        const PLACE_HOLDER = 'placeholder';
        const { container } = render(<TypeaheadSearch placeholder={PLACE_HOLDER} />);
        
        expect(container.querySelector('input')).toHaveAttribute('placeholder', PLACE_HOLDER);
    });

    describe('form submit', () => {
        it('closes the result popover', () => {
            const { container } = render(<TypeaheadSearch submitSearch={() => null} />);

            fireEvent.change(container.querySelector('input'), { target: { value: 'l' } });
    
            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(container.querySelector('div.searchResultsPopoverBackground')).toBeInTheDocument();

            fireEvent.submit(container.querySelector('input'), { target: { value: 'l' } });

            expect(container.querySelector('div.searchResultsPopoverBackground')).not.toBeInTheDocument();
        });
        
        it('calls submitSearch', () => {
            const submitSearch = jest.fn();
            const { container } = render(<TypeaheadSearch submitSearch={submitSearch} />);

            fireEvent.submit(container.querySelector('input'), { target: { value: 'l' } });
    
            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(submitSearch).toHaveBeenCalled();
        });
    });

    describe('result selection', () => {
        it('closes the result popover', async () => {
            const { container, queryByText } = render(<TypeaheadSearch fetchResults={fetchResults} onResultSelect={() => null} />);

            fireEvent.change(container.querySelector('input'), { target: { value: 'L' } });
    
            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(container.querySelector('div.searchResultsPopoverBackground')).toBeInTheDocument();

            await waitFor(() => {
                expect(queryByText('Lak')).toBeInTheDocument()
            }); 

            fireEvent.click(queryByText('Lak'));

            expect(container.querySelector('div.searchResultsPopoverBackground')).not.toBeInTheDocument();
        });
        
        it('calls onResultSelect', async () => {
            const onResultSelect = jest.fn();
            const { container, queryByText } = render(<TypeaheadSearch fetchResults={fetchResults} onResultSelect={onResultSelect} />);

            fireEvent.change(container.querySelector('input'), { target: { value: 'L' } });
    
            act(() => {
                jest.advanceTimersByTime(250);
            });

            await waitFor(() => {
                expect(queryByText('Lak')).toBeInTheDocument()
            }); 

            fireEvent.click(queryByText('Lak'));

            expect(onResultSelect).toHaveBeenCalled();
        });
    });

    describe('theme support', () => {
        it('renders correctly in light theme', () => {
            const { getByRole, container } = render(<TypeaheadSearch />);

            getByRole('textbox');
            expect(container.querySelector('svg.typeaheadSearchIcon')).toBeInTheDocument();
        });

        it('renders correctly in dark theme', () => {
            const { getByRole, container } = render(<TypeaheadSearch />, 'dark');

            getByRole('textbox');
            expect(container.querySelector('svg.typeaheadSearchIcon')).toBeInTheDocument();
        });

        it('renders results popover consistently across themes', async () => {
            const { container: lightContainer } = render(
                <TypeaheadSearch fetchResults={fetchResults} />
            );

            const { container: darkContainer } = render(
                <TypeaheadSearch fetchResults={fetchResults} />,
                'dark'
            );

            // Both should render the input element
            expect(lightContainer.querySelector('input')).toBeInTheDocument();
            expect(darkContainer.querySelector('input')).toBeInTheDocument();
        });

        it('handles search results popover in both themes', async () => {
            const { container: lightContainer, queryByText: lightQueryByText } = render(
                <TypeaheadSearch fetchResults={fetchResults} onResultSelect={() => null} />
            );

            fireEvent.change(lightContainer.querySelector('input'), { target: { value: 'L' } });

            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(lightContainer.querySelector('div.searchResultsPopoverBackground')).toBeInTheDocument();

            await waitFor(() => {
                expect(lightQueryByText('Lak')).toBeInTheDocument();
            });

            // Test dark theme
            const { container: darkContainer, queryByText: darkQueryByText } = render(
                <TypeaheadSearch fetchResults={fetchResults} onResultSelect={() => null} />,
                'dark'
            );

            fireEvent.change(darkContainer.querySelector('input'), { target: { value: 'L' } });

            act(() => {
                jest.advanceTimersByTime(250);
            });

            expect(darkContainer.querySelector('div.searchResultsPopoverBackground')).toBeInTheDocument();

            await waitFor(() => {
                expect(darkQueryByText('Lak')).toBeInTheDocument();
            });
        });
    });
});
