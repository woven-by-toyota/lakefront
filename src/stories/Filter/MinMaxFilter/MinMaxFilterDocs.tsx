import type { FC } from 'react';
import { createFilterSourceCode } from 'src/stories/Filter/filterStoriesUtil';
export interface MinMaxFilterArgs {
    /**
     * The label to display for the duration filter component.
     */
    label: string;
    /**
     * The description/help text to display above the duration filter component.
     */
    description?: string;

    /**
     * The units of measurement to display within the filter label.
     */
    unitsOfMeasurement?: string;
}

/**
 * Example of text filter source code.
 */
export const MIN_MAX_FILTER_SOURCE_CODE = createFilterSourceCode(`{
    MinMaxFilter: MinMaxFilter(
        'Vehicle Speed',
        'Min Max Filter is a input control to be used to filter according to the minimum and maximum input. (ex: speed)',
        'm/hr'
    )
}`);

/**
 * Min Max Filter Component
 *
 * The Min Max Filter Component meant to be used to filter according to the minimum and maximum input.
 * You can specify the minimum value and maximum value in the input control. The default value for Min is set as 0.
 */
const MinMaxFilterDocs: FC<MinMaxFilterArgs> = () => null;

export default MinMaxFilterDocs;
