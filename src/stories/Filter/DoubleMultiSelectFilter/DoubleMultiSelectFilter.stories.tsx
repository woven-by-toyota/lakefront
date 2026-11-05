import DocBlock from '.storybook/DocBlock';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import { DoubleMultiSelectFilter as DoubleMultiSelectFilterFunction } from 'src/components/Filter/modules';
import FilterPage from '../components/FilterPage';
import DoubleMultiSelectFilterDocs, {
    DOUBLE_MULTI_SELECT_FILTER_SOURCE_CODE,
    type DoubleMultiSelectFilterArgs
} from './DoubleMultiSelectFilterDocs';

export default {
    title: 'Lakefront/Filter/DoubleMultiSelectFilter',
    component: DoubleMultiSelectFilterDocs,
    argTypes: {
        doubleMultiSelectFilterProps: {
            control: {
                type: 'object'
            },
            description:
                'The props required to be supplied as the first argument of the DoubleMultiSelectFilter component.'
        },
        doubleMultiSelectFilterOptions: {
            control: false,
            description:
                'Any valid `FilterModule` property (excluding label, description, and selectOptions) which will override default double multi select filter behaviour.'
        }
    },
    parameters: {
        docs: {
            page: DocBlock,
            source: {
                code: DOUBLE_MULTI_SELECT_FILTER_SOURCE_CODE
            }
        }
    }
} as Meta;

// Double Multi Select Filter
const DoubleMultiSelectFilterTemplate: StoryFn = (args: DoubleMultiSelectFilterArgs) => {
    const pageFilters = {
        doubleMultiSelectFilter: DoubleMultiSelectFilterFunction(
            args.doubleMultiSelectFilterProps,
            args.doubleMultiSelectFilterOptions
        )
    };

    return <FilterPage pageFilters={pageFilters} />;
};

export const DoubleMultiSelectFilter = DoubleMultiSelectFilterTemplate.bind({});

DoubleMultiSelectFilter.args = {
    doubleMultiSelectFilterProps: {
        label: 'Double Multi Select Filter',
        selectOptions: {
            firstSelect: {
                apiField: 'first',
                label: 'First Filter',
                name: 'first',
                creatable: true,
                items: [],
                placeholder: 'Type or paste',
                disableMenu: true,
                barLabel: 'First Filter'
            },
            secondSelect: {
                apiField: 'second',
                label: 'Second Filter',
                name: 'second',
                creatable: true,
                items: [],
                placeholder: 'Type or paste',
                disableMenu: true,
                barLabel: 'Second Filter'
            }
        }
    }
};
