/**
 * `createSourceCode` is a util function for generating demo
 * code showing how a filter module should be used.
 * The `filterObjectString` parameter should include an object with
 * an appropriately named key (e.g. textFilter), the filter
 * function call as the value (e.g. TextFilter(...args)), and any revelant arguments.
 * For example, when using this to display `RadioFilter` code, you might
 * include a string similar to the below example. *Note: The example below may
 * not include all required escape characters*:
 * ```
 * {
        radioFilter: RadioFilter(
            {
                label: 'Radio Filter',
                initialValue: 'north',
                defaultValue: '',
                options: [
                    {label: 'North', value: 'north'},
                    ...additionalRadioGroupOptions
                ],
                description: 'RadioFilter is a radio group control meant to single select a value.'
            },
            {
                getFilterBarLabel: (value: string) => `Radio Filter: ${value}`,
                ...additionalRadioFilterOptions
            }
        )
    }
    ```
 */
export const createFilterSourceCode = (filtersObjectString: string) => {
    return `
const FILTERS = ${filtersObjectString};

const filterHooks = useFilter(FILTERS, true, {}, () => null);

return (
    <Filter filterHooks={filterHooks}>
        Page Body
  </Filter>
);
`;
};
