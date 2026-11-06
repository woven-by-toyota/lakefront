import type { FC } from 'react';
import { createFilterSourceCode } from 'src/stories/Filter/filterStoriesUtil';
export interface DurationFilterArgs {
    /**
     * The label to display for the duration filter component.
     */
    label: string;
    /**
     * The description/help text to display above the duration filter component.
     */
    description?: string;
}

/**
 * Example of text filter source code.
 */
export const DURATION_FILTER_SOURCE_CODE = createFilterSourceCode(`{
    DurationFilter: DurationFilter(
        'Duration Filter',
        'Duration Filter is an input control meant to be used to filter according to the minimum and maximum input',
    )
}`);

/**
 * Duration Filter Component
 *
 * The Duration Filter Component meant to be used to filter according to the minimum and maximum input.
 * You can specify the minimum value and maximum value in the input control. The default value for Min is set as 0.
 */
const DurationFilterDocs: FC<DurationFilterArgs> = () => null;

export default DurationFilterDocs;
