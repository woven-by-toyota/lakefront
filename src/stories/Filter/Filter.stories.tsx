import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import FilterComponent from 'src/components/Filter/Filter';
import FilterPage from './components/FilterPage';

export default {
    title: 'Lakefront/Filter/AllFilters',
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

export const NoFilterBar = AllTemplate.bind({});
export const WithFilterBar = AllTemplate.bind({});

NoFilterBar.args = {
    hideFilterBar: true,
    isJSONInputAllowed: true
};

WithFilterBar.args = {
    hideFilterBar: false,
    isJSONInputAllowed: true
};
