import type { Meta, StoryFn } from '@storybook/react-webpack5';

import FilterPage from '../components/FilterPage';
import DocBlock from '.storybook/DocBlock';
import MinMaxFilterDocs, {
  MIN_MAX_FILTER_SOURCE_CODE,
  type MinMaxFilterArgs
} from './MinMaxFilterDocs';
import { MinMaxFilter as MinMaxFilterFunction } from 'src/components/Filter/modules';

export default {
  title: 'Lakefront/Filter/MinMaxFilter',
  component: MinMaxFilterDocs,
  argTypes: {
    label: {
      control: 'text',
      description: 'The label to display for the min max filter component.'
    },
    description: {
      control: 'text',
      description:
        'The description/help text to display above the min max filter component.'
    },
    unitsOfMeasurement: {
      control: 'text',
      description:
        'The units of measurement text to display within the bar label section fo the filter'
    }
  },
  parameters: {
    docs: {
      page: DocBlock,
      source: {
        code: MIN_MAX_FILTER_SOURCE_CODE
      }
    }
  }
} as Meta;

// Min Max Filter
const MinMaxFilterTemplate: StoryFn = (args: MinMaxFilterArgs) => {
  const pageFilters = {
    minMaxFilter: MinMaxFilterFunction({ ...args })
  };

  return <FilterPage pageFilters={pageFilters} />;
};

export const MinMaxFilter = MinMaxFilterTemplate.bind({});

MinMaxFilter.args = {
  label: 'Vehicle Speed',
  description:
    'Min Max Filter is a input control to be used to filter according to the minimum and maximum input. (ex: speed)',
  unitsOfMeasurement: 'm/hr'
};
