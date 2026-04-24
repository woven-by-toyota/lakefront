import { Meta, StoryFn } from '@storybook/react-webpack5';
import { FC, useState } from 'react';

import FilterComponent from 'src/components/Filter/Filter';
import { useFilter } from 'src/components/Filter/util';
import { ContextSwitchMenu, FilterBar, FilterJSONConfirmationModal, FilterJSONInput, UrlPreview } from './components';
import { FilterComponentProps } from 'src/components/Filter/types';
import { DefaultWrapper, PageBody } from './components/FilterPage/filterPageStyles';
import { FILTERS, LOCATION } from './components/FilterPage/filterPageUtil';
import DocBlock from '.storybook/DocBlock';
import { useTheme } from '@emotion/react';

export default {
    title: 'Lakefront/Filter/Pinning and Drag & Drop',
    component: FilterComponent,
    parameters: {
        docs: {
            page: DocBlock,
            description: {
                component: 'Demonstrates filter pinning and drag-and-drop reordering capabilities. Pinned filters appear at the top and can be reordered. Unpinned filters appear below and can also be reordered independently.'
            }
        }
    }
} as Meta;

// Filter page with pinning and drag-drop
const FilterPageWithPinning: FC<Pick<FilterComponentProps, 'isJSONInputAllowed' | 'hideFilterBar' | 'initialActiveSection' | 'enableFilterPinning' | 'enableFilterDragDrop'>> = (
    props
) => {
    const theme = useTheme();
    const location = { ...LOCATION };
    const updateHistory = () => null;

    // State for filter order and pinned filters
    const [filterOrder, setFilterOrder] = useState<string[]>(Object.keys(FILTERS));
    const [pinnedFilters, setPinnedFilters] = useState<Set<string>>(new Set());

    const baseFilterHooks = useFilter(FILTERS, props.isJSONInputAllowed, location, updateHistory);

    // Extend filter hooks with pinning functionality
    const filterHooks = {
        ...baseFilterHooks,
        filterOrder,
        pinnedFilters,
        setFilterOrder,
        togglePinFilter: (filterName: string) => {
            setPinnedFilters((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(filterName)) {
                    newSet.delete(filterName);
                } else {
                    newSet.add(filterName);
                }
                return newSet;
            });
        }
    };

    return (
        <DefaultWrapper>
            <FilterComponent
                {...props}
                ContextSwitchMenu={ContextSwitchMenu}
                FilterBar={FilterBar}
                FilterJSONConfirmationModal={FilterJSONConfirmationModal}
                FilterJSONInput={FilterJSONInput}
                filterHooks={filterHooks}
                location={location}
                updateHistory={updateHistory}
            >
                <PageBody>
                    <UrlPreview queryParams={filterHooks.filterUrl.substring(1)} />
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: 8,
                        margin: 18,
                        padding: 16,
                        backgroundColor: theme.backgrounds.primary,
                        border: `1px solid ${theme.borderColors.primary}`,
                        borderRadius: 4
                     }}>
                        <div>
                            <div>Instructions:</div>
                            <ul>
                                <li><strong>Pin filters:</strong> Click the pin icon next to any filter to pin it to the top.</li>
                                <li><strong>Reorder filters:</strong> Use the drag handle (⋮⋮) to drag and reorder filters.</li>
                                <li><strong>Sections:</strong> Pinned and unpinned filters are kept in separate sections during reordering.</li>
                            </ul>
                        </div>
                    </div>
                </PageBody>
            </FilterComponent>
        </DefaultWrapper>
    );
};

// Story: Filter with pinning only
const PinningOnlyTemplate: StoryFn = (args) => <FilterPageWithPinning {...args} />;

export const PinningOnly = PinningOnlyTemplate.bind({});
PinningOnly.args = {
    hideFilterBar: true,
    isJSONInputAllowed: false,
    enableFilterPinning: true,
    enableFilterDragDrop: false
};
PinningOnly.parameters = {
    docs: {
        description: {
            story: 'Filters can be pinned to the top of the list. Click the pin icon to toggle pinning. Pinned filters appear first in FIFO order.'
        }
    }
};

// Story: Filter with drag-and-drop only
const DragDropOnlyTemplate: StoryFn = (args) => <FilterPageWithPinning {...args} />;

export const DragAndDropOnly = DragDropOnlyTemplate.bind({});
DragAndDropOnly.args = {
    hideFilterBar: true,
    isJSONInputAllowed: false,
    enableFilterPinning: false,
    enableFilterDragDrop: true
};
DragAndDropOnly.parameters = {
    docs: {
        description: {
            story: 'Filters can be reordered by dragging the handle icon (⋮⋮). The order is preserved throughout the session.'
        }
    }
};

// Story: Filter with both pinning and drag-and-drop
const BothFeaturesTemplate: StoryFn = (args) => <FilterPageWithPinning {...args} />;

export const PinningAndDragDrop = BothFeaturesTemplate.bind({});
PinningAndDragDrop.args = {
    hideFilterBar: true,
    isJSONInputAllowed: false,
    enableFilterPinning: true,
    enableFilterDragDrop: true
};
PinningAndDragDrop.parameters = {
    docs: {
        description: {
            story: 'Combines both features: pin filters to the top and reorder them via drag-and-drop. Pinned and unpinned filters are kept in separate sections during reordering to maintain the visual hierarchy.'
        }
    }
};

// Story: With FilterBar and JSON input
const FullFeaturesTemplate: StoryFn = (args) => <FilterPageWithPinning {...args} />;

export const FullFeatures = FullFeaturesTemplate.bind({});
FullFeatures.args = {
    hideFilterBar: false,
    isJSONInputAllowed: true,
    enableFilterPinning: true,
    enableFilterDragDrop: true
};
FullFeatures.parameters = {
    docs: {
        description: {
            story: 'Complete demonstration with FilterBar, JSON input toggle, pinning, and drag-and-drop all enabled.'
        }
    }
};
