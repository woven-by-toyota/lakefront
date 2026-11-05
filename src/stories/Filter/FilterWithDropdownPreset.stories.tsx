import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import FilterComponent from 'src/components/Filter/Filter';
import FilterPage from './components/FilterPage';

export default {
    title: 'Lakefront/Filter/AllFiltersWithPreset',
    component: FilterComponent,
    argTypes: {
        ContextSwitchMenu: {
            control: false
        },
        FilterBar: {
            control: false
        },
        FilterJSONConfirmationModal: {
            control: false
        },
        FilterJSONInput: {
            control: false
        },
        additionalQueryParams: {
            control: false
        },
        filterHooks: {
            control: false
        },
        hideFilterBar: {
            control: {
                type: 'boolean'
            }
        },
        initialActiveSection: {
            control: {
                type: 'text'
            }
        },
        isCollapsed: {
            control: {
                type: 'boolean'
            }
        },
        isJSONInputAllowed: {
            control: {
                type: 'boolean'
            }
        },
        location: {
            control: false
        },
        onToggleCollapsed: {
            control: false
        },
        updateHistory: {
            control: false
        }
    },
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

// All Filters
const AllTemplate: StoryFn = (args) => <FilterPage {...args} />;
export const FilterWithPresets = AllTemplate.bind({});

FilterWithPresets.args = {
    hideFilterBar: false,
    isJSONInputAllowed: true,
    filterMapping: {
        easyMode: {
            doubleMultiSelectFilter: {
                firstSelect: ['hi'],
                secondSelect: ['what up']
            }
        },
        hardMode: {
            doubleMultiSelectFilter: {
                firstSelect: ['hello world'],
                secondSelect: ['this is difficult']
            }
        }
    }
};
