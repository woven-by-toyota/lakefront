import { act, fireEvent, waitFor } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import TypeaheadResults, { ERROR_MESSAGE, HEADER_MESSAGE, LOADING_MESSAGE, NO_RESULTS_MESSAGE } from '../TypeaheadResults';

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

describe('TypeaheadResults', () => {
    it('renders loading when fetch is in progress.', () => {
        const { getByText } = render(
            <TypeaheadResults debouncedText="a" fetchResults={fetchResults} onResultSelect={() => null} />
        );

        getByText(LOADING_MESSAGE);
    });

    it(`renders ${ERROR_MESSAGE} when fetch throws an error`, async () => {
        const { queryByText } = render(
            <TypeaheadResults debouncedText="error" fetchResults={fetchResults} onResultSelect={() => null} />
        );

        expect(queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();
        
        act(() => {
            jest.advanceTimersByTime(INTERVAL);
        });

        await waitFor(() => {
            expect(queryByText(ERROR_MESSAGE)).toBeInTheDocument()
        });  
    });

    it(`renders ${NO_RESULTS_MESSAGE} when fetchResults is undefined`, () => {
        const { queryByText } = render(
            <TypeaheadResults debouncedText="error" onResultSelect={() => null} />
        );

        expect(queryByText(NO_RESULTS_MESSAGE)).toBeInTheDocument();
    });

    it(`renders ${NO_RESULTS_MESSAGE} when fetch returns empty list`, async () => {
        const { queryByText } = render(
            <TypeaheadResults debouncedText="abc" fetchResults={fetchResults} onResultSelect={() => null} />
        );

        expect(queryByText(NO_RESULTS_MESSAGE)).not.toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(INTERVAL);
        });

        await waitFor(() => {
            expect(queryByText(NO_RESULTS_MESSAGE)).toBeInTheDocument()
        }); 
    });

    it('renders the fetched results', async () => {
        const { container, queryByText } = render(
            <TypeaheadResults debouncedText="L" fetchResults={fetchResults} onResultSelect={() => null} />
        );

        expect(queryByText(HEADER_MESSAGE)).not.toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(INTERVAL);
        });

        await waitFor(() => {
            expect(queryByText(HEADER_MESSAGE)).toBeInTheDocument()
        });

        expect(container.querySelectorAll('li.resultItem')).toHaveLength(3);
    });

    it('calls onResultSelect on result item click', async () => {
        const onResultSelect = jest.fn();
        const { queryByText } = render(
            <TypeaheadResults debouncedText="Lak" fetchResults={fetchResults} onResultSelect={onResultSelect} />
        );

        act(() => {
            jest.advanceTimersByTime(INTERVAL);
        });

        await waitFor(() => {
            expect(queryByText('Lak')).toBeInTheDocument()
        });

        fireEvent.click(queryByText('Lak'));

        expect(onResultSelect).toHaveBeenCalled();
    });

    describe('theme support', () => {
        it('renders loading state consistently across themes', () => {
            const { getByText: lightGetByText } = render(
                <TypeaheadResults debouncedText="a" fetchResults={fetchResults} onResultSelect={() => null} />
            );

            const { getByText: darkGetByText } = render(
                <TypeaheadResults debouncedText="a" fetchResults={fetchResults} onResultSelect={() => null} />,
                'dark'
            );

            lightGetByText(LOADING_MESSAGE);
            darkGetByText(LOADING_MESSAGE);
        });

        it('renders error states consistently across themes', async () => {
            const { queryByText: lightQueryByText } = render(
                <TypeaheadResults debouncedText="error" fetchResults={fetchResults} onResultSelect={() => null} />
            );

            const { queryByText: darkQueryByText } = render(
                <TypeaheadResults debouncedText="error" fetchResults={fetchResults} onResultSelect={() => null} />,
                'dark'
            );

            act(() => {
                jest.advanceTimersByTime(INTERVAL);
            });

            await waitFor(() => {
                expect(lightQueryByText(ERROR_MESSAGE)).toBeInTheDocument();
                expect(darkQueryByText(ERROR_MESSAGE)).toBeInTheDocument();
            });
        });

        it('renders results consistently across themes', async () => {
            const { container: lightContainer, queryByText: lightQueryByText } = render(
                <TypeaheadResults debouncedText="L" fetchResults={fetchResults} onResultSelect={() => null} />
            );

            const { container: darkContainer, queryByText: darkQueryByText } = render(
                <TypeaheadResults debouncedText="L" fetchResults={fetchResults} onResultSelect={() => null} />,
                'dark'
            );

            act(() => {
                jest.advanceTimersByTime(INTERVAL);
            });

            await waitFor(() => {
                expect(lightQueryByText(HEADER_MESSAGE)).toBeInTheDocument();
                expect(darkQueryByText(HEADER_MESSAGE)).toBeInTheDocument();
            });

            expect(lightContainer.querySelectorAll('li.resultItem')).toHaveLength(3);
            expect(darkContainer.querySelectorAll('li.resultItem')).toHaveLength(3);
        });
    });
});
