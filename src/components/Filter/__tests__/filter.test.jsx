import React from 'react';
import { fireEvent, cleanup, within, getAllByText } from '@testing-library/react';
import { renderWithTheme as render } from 'src/lib/testing';
import { Filter } from '../Filter';
import { FILTERS, LOCATION } from './filter.data';
import { useFilter } from '../util';
import * as FilterSectionHeader from 'src/components/Filter/components/FilterSectionHeader';

const mockUseFilter = jest.fn(useFilter);

beforeEach(() => {
    jest.clearAllMocks();
});

afterAll(cleanup);

const mockBadges = () => {
    jest.spyOn(FilterSectionHeader, 'default')
        .mockImplementation(({ badgeThreshold }) => <div>badge: {badgeThreshold}</div>);
};

const TestComponent = (props = {}) => {
    const location = { ...LOCATION };
    const updateHistory = jest.fn;
    const filterHooks = mockUseFilter(FILTERS, false, location, updateHistory);

    return <Filter filterHooks={filterHooks} location={location} updateHistory={updateHistory} {...props} />;
};

const ContextSwitchMenu = ({ onChange, value, options }) => {
    return (
        <>
            <div>ContextSwitchMenu</div>
            <select onChange={(e) => onChange(e.target.value)} value={value}>
                {Array.from(options.entries()).map(([key, label]) => (
                    <option key={key} value={key}>
                        {label}
                    </option>
                ))}
            </select>
        </>
    );
};

const FilterBar = () => {
    return <div>FilterBar</div>;
};

const FilterJSONConfirmationModal = ({ modalVisible }) => {
    if (modalVisible) {
        return <div>FilterJSONConfirmationModal</div>;
    }
    return null;
};

const FilterJSONInput = ({ onInputModifiedChange }) => {
    return <input onChange={onInputModifiedChange} />;
};

describe('Filter', () => {
    it('toggles the side panel', () => {
        const { container } = render(<TestComponent />);

        const h2 = container.querySelector('h2');
        const filterIcon = container.querySelector('svg');
        expect(h2.textContent).toBe('Filter Results');

        fireEvent.click(filterIcon);
        expect(h2.textContent).toBe('');
    });

    it('toggles the active section', () => {
        const { getByText } = render(<TestComponent />);

        const keywordSection = getByText(FILTERS.keywords.label).parentElement;
    
        expect(keywordSection.querySelector('svg[aria-label="add"]')).toBeInTheDocument();
        expect(keywordSection.querySelector('svg[aria-label="remove"]')).not.toBeInTheDocument();

        fireEvent.click(keywordSection);

        expect(keywordSection.querySelector('svg[aria-label="remove"]')).toBeInTheDocument();
        expect(keywordSection.querySelector('svg[aria-label="add"]')).not.toBeInTheDocument();
    });

    describe('when onToggleCollapsed callback is provided as a prop', () => {
        const toggleCallback = jest.fn();

        const TestComponentWithCallback = () => {
            const location = { ...LOCATION };
            const updateHistory = jest.fn;
            const filterHooks = mockUseFilter(FILTERS, false, location, updateHistory);

            return (
                <Filter
                    filterHooks={filterHooks}
                    location={location}
                    updateHistory={updateHistory}
                    onToggleCollapsed={toggleCallback}
                />
            );
        };

        it('executes callback on side panel toggle', () => {
            const { container } = render(<TestComponentWithCallback />);

            const filterIcon = container.querySelector('svg');
            fireEvent.click(filterIcon);
            fireEvent.click(filterIcon);

            expect(toggleCallback.mock.calls.length).toBe(2);
            expect(toggleCallback.mock.calls[0][0]).toBe(true);
            expect(toggleCallback.mock.calls[1][0]).toBe(false);
        });
    });

    describe('when components are passed in', () => {
        it('displays the context switch menu when provided', () => {
            const { getByText } = render(<TestComponent isJSONInputAllowed ContextSwitchMenu={ContextSwitchMenu} />);

            getByText('ContextSwitchMenu');
        });

        it('displays the filter JSON input when provided', () => {
            const { getByRole } = render(
                <TestComponent
                    isJSONInputAllowed
                    ContextSwitchMenu={ContextSwitchMenu}
                    FilterJSONInput={FilterJSONInput}
                />
            );

            fireEvent.change(getByRole('combobox'), {
                target: {
                    value: 'json'
                }
            });

            getByRole('textbox');
        });

        it('displays the JSON confirmation modal when provided', () => {
            const ContextSwitchMenu = ({ onChange, value, options }) => {
                return (
                    <select onChange={(e) => onChange(e.target.value)} value={value}>
                        {Array.from(options.entries()).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                );
            };

            const { getByRole, getByText } = render(
                <TestComponent
                    isJSONInputAllowed
                    ContextSwitchMenu={ContextSwitchMenu}
                    FilterJSONInput={FilterJSONInput}
                    FilterJSONConfirmationModal={FilterJSONConfirmationModal}
                />
            );

            fireEvent.change(getByRole('combobox'), {
                target: {
                    value: 'json'
                }
            });
            fireEvent.change(getByRole('textbox'), {
                target: {
                    value: 'changed'
                }
            });
            fireEvent.change(getByRole('combobox'), {
                target: {
                    value: 'filter'
                }
            });

            getByText('FilterJSONConfirmationModal');
        });

        it('displays the filter bar when provided', () => {
            const { getByText } = render(
                <TestComponent isJSONInputAllowed FilterBar={FilterBar} hideFilterBar={false} />
            );

            getByText('FilterBar');
        });
    });

    describe('preset filter dropdown functionality', () => {
        it('does not display dropdown when there is not a filter mapping', () => {
            const { container } = render(
                <TestComponent  />
            );

            expect(container.querySelector('select[aria-label="preset-filter-dropdown"]')).toBeNull();
        });

        it('does not display dropdown if the filter mapping is empty', () => {
            const { container } = render(
                <TestComponent  filterMapping={{}} />
            );
            expect(container.querySelector('select[aria-label="preset-filter-dropdown"]')).toBeNull();
        });

        it('displays dropdown when there is a filter mapping', () => {
            const filterMapping = {
                devMode: {
                    phrases: ''
                },
                prodMode: {
                    phrases: ''
                }
            };
            const { container } = render(
                <TestComponent filterMapping={filterMapping}/>
            );

            expect(container.querySelector('select[aria-label="preset-filter-dropdown"]')).toBeInTheDocument();
        });

        it('selects prod mode from the dropdown menu', () => {
            const filterMapping = {
                devMode: {
                    phrases: 'easy'
                },
                prodMode: {
                    phrases: 'hard'
                }
            };
            const { container, getAllByText } = render(
                <TestComponent filterMapping={filterMapping}/>
            );
            fireEvent.change(container.getElementsByTagName('select')[0], {
                target: { value: 'prodMode' }
            });
            expect(getAllByText('hard')[0]).toBeInTheDocument();
        });
    });

    describe('reset filters functionality', () => {
        it('displays a "Reset Filters" control in container after filter chips container', () => {
            const { container } = render(
                <TestComponent isJSONInputAllowed FilterBar={FilterBar} hideFilterBar={false} />
            );

            const filterChipsContainer = container.querySelector('.filter-chips-container');
            const controlsContainer = filterChipsContainer.nextElementSibling;

            within(controlsContainer).getByText('Reset Filters');
        });

        it('calls filter hook resetFilters when button is clicked', () => {
            const resetAllFilters = jest.fn();
            mockUseFilter.mockReturnValueOnce({
                filters: {},
                filterUrl: '',
                filterPostBody: {},
                filterValues: {},
                updateFilter: () => null,
                resetFilter: () => null,
                resetAllFilters,
                applyApiPostBody: () => null,
                initializePresetValues: () => null
            });
            const { getByText } = render(
                <TestComponent isJSONInputAllowed FilterBar={FilterBar} hideFilterBar={false} />
            );

            expect(resetAllFilters).not.toHaveBeenCalled();

            fireEvent.click(getByText('Reset Filters'));
            expect(resetAllFilters).toHaveBeenCalled();
        });
    });

    describe('badge display', () => {
        it('defaults to 1 as the threshold if left undefined', () => {
            mockBadges();
            const { getAllByText } = render(
                <TestComponent FilterBar={FilterBar} />
            );

            expect(getAllByText('badge: 1')).toHaveLength(2);
        });

        it('makes use of provided badge threshold', () => {
            mockBadges();
            const { getAllByText } = render(
                <TestComponent FilterBar={FilterBar} badgeThreshold={4} />
            );

            expect(getAllByText('badge: 4')).toHaveLength(2);
        });
    });
});
