import { Dispatch, FC, MouseEventHandler, ReactElement, ReactNode, SetStateAction } from 'react';
import { MultiSelectOption } from 'src/components/Filter/modules/MultiSelectFilter/MultiSelect';
import { JSONObject } from 'src/types/global';
import { SelectOption } from 'src/components/Select/Select';

/**
 * FilterRenderProps are the required props of the renderComponent
 * function of the FilterModule.
 */
export interface FilterRenderProps<T> {
    name: string;
    value: T;
    update(value: T | null | undefined): void;
}

/**
 * FilterPostBody is a map of key/value pairs that's
 * intended to be sent as a JSON post body payload.
 */
export interface FilterPostBody extends JSONObject {}

/**
 * FilterModule is the minimum expected structure of a filter
 * to be used in the filter system.
 */
export interface FilterModule<T> {
    /**
     * Text label displayed above the filter input controls.
     */
    label: string;
    /**
     * Optional paragraph describing the filter (also displayed above the filter input controls).
     */
    description?: string;
    /**
     * When true, indicates that filter may not be dismissed and must always have a value. defaults to false.
     */
    required?: boolean;
    /**
     * When true, indicates that UI should not be displayed in left panel for this filter. defaults to false.
     */
    inputHidden?: boolean;
    /**
     * Gets the number of filter values this filter applies. If not supplied (and filter is not default value),
     * the count will be assumed to be `1`.
     */
    getFilterCount?(value?: T): number;
    /**
     * Generates filter url query param in API calls (&key=valueString).
     */
    getApiQueryUrl(key: string, value: T): string;
    /**
     * Generates post body used to apply this filter when used in a POST search request.
     */
    getApiPostBody(key: string, value: T): FilterPostBody | null | undefined;
    /**
     * Generates the url query param value(s) for saving filter value(s) in the browser address bar (key is automatic).
     * **Note: The output value here can be any valid object
     * of type `Record<string, any>` as it will be stringified in the useFilter hook using the query-string library
     * defaults (https://github.com/sindresorhus/query-string)**.
     */
    getBrowserQueryUrlValue(value: T): unknown;
    /**
     * Returns filter value that is set when filter is cleared.
     */
    getDefaultFilterValue(): T | null | undefined;
    /**
     * Returns boolean indicating if the current filter value matches the default value (if true, chip is hidden in the filter bar).
     */
    isDefaultFilterValue(value: T): boolean;
    /**
     * Generates the string in displayed on this filter's chip in the filter bar.
     */
    getFilterBarLabel(value: T): string;
    /**
     * Generates the array of labels to be displayed on this filter's section in the filter pane.
     */
    getFilterSectionLabel(value: T): string | string[];
    /**
     * Parses filter value from browser url query param value(s) and pre-populates the filter value on init.
     */
    parseInitialFilterValue(browserQueryUrlValue?: string | string[] | null | undefined | any): T | null | undefined;
    /**
     * Renders the filter input controls in the left filter drawer.
     */
    renderComponent(input: FilterRenderProps<T>): ReactElement;
    /**
     * Overrides the default FilterSectionHeader for a filter module. Recommended usage is to provide a customized
     * FilterSectionHeader component.
     */
    renderSectionHeader?(sectionHeaderParams: FilterSectionHeaderProps): ReactElement;
    /**
     * OPTIONAL (support direct JSON input) - extracts/parses the filter value from an API post body.
     * Note: should also delete this filter's key & value from the provided API post body, so that
     * unparsed JSON can be identified and separated into its own pseudo-filter.
     */
    getFilterValueFromApiPostBody?(key: string, mutableApiPostBody: FilterPostBody | null | undefined): T | null | undefined;
    /**
     * Partially clear a filter when a filter has multiple selected options.
     */
    clearPartialSingleFilter?(originalValue: T, value: string): T | null | undefined;
    /**
     * Support for filters that use multiple query param keys to store their value(s).
     */
    splitQueryParams?: string[];
}

/**
 * FilterSet is the current set of filter names and their
 * associated FilterModule.
 */
export interface FilterSet {
    [key: string]: FilterModule<any>;
}

/**
 * FilterValues is a map of each filter and their current values.
 */
export interface FilterValues {
    [filterName: string]: any;
}

/**
 * FilterHooks is the available values and functions returned from the useFilter hook.
 */
export interface FilterHooks<T = FilterPostBody> {
    /**
     * The currently available filter set.
     */
    filters: FilterSet;
    /**
     * The current url state after filters applied.
     */
    filterUrl: string;
    /**
     * The current post body after filters applied.
     */
    filterPostBody: T;
    /**
     * The current filter values.
     */
    filterValues: FilterValues;
    /**
     * The function to update a particular filter.
     */
    updateFilter(name: string, value: any): void;
    /**
     * The function to reset a particular filter.
     */
    resetFilter(name: string | string[], value?: any): void;
    /**
     * The function to reset all current filters.
     */
    resetAllFilters(): void;
    /**
     * The function to determine how filters update the post body.
     */
    applyApiPostBody(apiPostBody: T): void;

    /**
     * The function sets initial filter preset values.
     */
    initializePresetValues(presetValues: { [key: string]: any; }): void;
}

/**
 * FilterMap is the mapping of filters as they should
 * be applied to the url and post body.
 */
export interface FilterMap {
    [key: string]: string;
}

export interface FilterSectionHeaderProps {
    activeSection?: string;
    filter: FilterModule<any>;
    name: string;
    value: any;
    onClick?: MouseEventHandler<HTMLHeadingElement>;
    resetFilter: (name: string) => void;
    badgeThreshold: number;
    children?: ReactNode;
}

/**
 * FilterMode is the list of available states to display
 * the filter UI.
 */
export enum FilterMode {
    FilterUI = 'filter',
    JSON = 'json'
}

/**
 * LocationState is the current state of the location.
 */
interface LocationState {
    search: string;
    hash?: string;
}

/**
 * Location holds information about the current user location
 * and url state when using the consuming application.
 */
export interface Location {
    pathname: string;
    search: string;
    state: LocationState;
    hash: string;
    key?: string;
}

/**
 * UrlParameters is a map of the current url parameter name and values.
 */
export interface UrlParameters {
    [key: string]: string[] | string | null;
}

/**
 * UpdateHistory is the structure of a history update callback.
 */
export type UpdateHistory = ({ search, hash }: LocationState) => void;

/**
 * ContextSwitchMenuValue is the type of possible Context
 * Switch Menu values.
 */
export type ContextSwitchMenuValue = FilterMode | string;
/**
 * ContextSwitchMenuProps is the structure of the ContextSwitchMenu
 * component that can be used to toggle Filter component
 * views.
 */
export interface ContextSwitchMenuProps {
    options: Map<ContextSwitchMenuValue, string>;
    value: ContextSwitchMenuValue;
    onChange?: (filterMode: ContextSwitchMenuValue) => void;
    triggerClassName?: string;
}

/**
 * FilterBarProps is the structure of the FilterBar
 * component that can be used to display the applied filters.
 */
export interface FilterBarProps {
    filters: FilterSet;
    filterValues: FilterValues;
    resetFilter?: (name: string) => void;
    resetAllFilters?: () => void;
}

/**
 * FilterJSONConfirmationModalProps is the structure of the
 * FilterJSONConfirmationModal component that can be used to
 * confirm the user has finished making unsaved changes.
 */
export interface FilterJSONConfirmationModalProps {
    modalVisible: boolean;
    handleModalClose?: () => void;
    onConfirm?: () => void;
}

/**
 * FilterJSONInputProps is the structure of the
 * FilterJSONInput component that can be used by
 * the end user to edit the filter JSON parameters and values.
 */
export interface FilterJSONInputProps {
    filterHooks: FilterHooks;
    onInputModifiedChange?: Dispatch<SetStateAction<boolean>>;
}

/**
 * FilterComponentProps is the structure of the expected props
 * to be provided to the primary Filter component.
 */
export interface FilterComponentProps {
    /**
     * ContextSwitchMenu can be used to toggle Filter component views.
     */
    ContextSwitchMenu?: FC<ContextSwitchMenuProps>;
    /**
     * FilterBar can be used to display the applied filters.
     */
    FilterBar?: FC<FilterBarProps>;
    /**
     * FilterJSONConfirmationModal can be used to
     * confirm the user has finished making unsaved changes.
     */
    FilterJSONConfirmationModal?: FC<FilterJSONConfirmationModalProps>;
    /**
     * FilterJSONInput can be used by
     * the end user to edit the filter JSON parameters and values.
     */
    FilterJSONInput?: FC<FilterJSONInputProps>;
    /**
     * The children to display at the bottom of the filter container.
     */
    children?: ReactNode
    /**
     * Additional query params that can be provided separate from
     * the current filters.
     */
    additionalQueryParams?: {
        [key: string]: string;
    };
    /**
     * The available values and functions returned from the useFilter hook.
     */
    filterHooks: FilterHooks;
    /**
     * Controls whether the FilterBar component (if provided)
     * is visible.
     */
    hideFilterBar?: boolean;
    /**
     * Controls which filter (if any) is expanded by default.
     */
    initialActiveSection?: string;
    /**
     * Controls whether the filter side panel is expanded or collapsed.
     */
    isCollapsed?: boolean;
    /**
     * Controls whether the user can add additional filters via a JSON editor.
     */
    isJSONInputAllowed?: boolean;
    /**
     * The (mutable) location state which gets updated as filters are applied.
     */
    location: Location;
    /**
     * The callback that runs when the filter pane is collapsed.
     */
    onToggleCollapsed?(isCollapsed: boolean): void;
    /**
     * This controls how the location/history state is updated
     * as filters change.
     */
    updateHistory: UpdateHistory;
    /**
     * This is the max number of chips to display before switching to
     * a badge displaying the number of applied filters.
     */
    badgeThreshold?: number;
    /**
     * The classes to pass to the filter container.
     */
    className?: string;
    /**
     * This is the mapping for the preset filter dropdown. Each key in this map should match the type of filter passed
     * in the filter set.
     */
    filterMapping?: {
        [key: string]: any;
    };
}

/**
 * FilterContainerProps is the structure of the expected props
 * to be provided to outermost container of the Filter component.
 */
export interface FilterContainerProps {
    isCollapsed: boolean;
    showJSONInput: boolean;
    hideFilterBar?: boolean;
}

/**
 * `AdditionalJSONFilterOptions` is any valid `FilterModule` property
 * meant to override default additional JSON filter behaviour.
 */
export interface AdditionalJSONFilterOptions extends Partial<FilterModule<JSONObject>> {}

/**
 * `DoubleMultiSelectData` is the definition for each select in the DoubleMultiSelect, such as `firstSelect` and `secondSelect`.
 */
export interface DoubleMultiSelectData {
    apiField: string;
    label?: string;
    name: string;
    creatable: boolean;
    items: MultiSelectOption[];
    barLabel: string;
    placeholder?: string;
    disableMenu?: boolean;
}

/**
 * `DoubleMultiSelectOptions` defines both multi selects in the DoubleMultiSelect component.
 */
export interface DoubleMultiSelectOptions {
    firstSelect: DoubleMultiSelectData,
    secondSelect: DoubleMultiSelectData
}

/**
 * `DoubleMultiSelectValues` is an object used in the DoubleMultiSelect onChange which contains an array of values
 *  stored for each MultiSelect.
 */
export interface DoubleMultiSelectValues {
    firstSelect: string[];
    secondSelect: string[];
}

/**
 * `DoubleMultiSelectFilterProps` defines the props for the DoubleMultiSelectFilter module.
 */
export interface DoubleMultiSelectFilterProps {
    label: string;
    description?: string;
    selectOptions: DoubleMultiSelectOptions;
}

/**
 * `MultiSelectFilterOptions` is any valid `FilterModule` property (excluding description and label)
 * meant to override default multi select filter behaviour.
 */
export interface DoubleMultiSelectFilterOptions extends Omit<Partial<FilterModule<DoubleMultiSelectValues>>, 'label' | 'description' | 'selectOptions'> {}

/**
 * `ListFilterOverrides` is any valid `FilterModule` property (excluding description and label)
 * meant to override default list filter behaviour.
 */
export interface ListFilterOverrides extends Omit<Partial<FilterModule<Set<string>>>, 'description' | 'label'> {}

/**
 * `MultiSelectFilterProps` are the props required to be supplied as the
 * first argument of the MultiSelectFilter component.
 */
export interface MultiSelectFilterProps {
    options: MultiSelectOption[];
    label: string;
    description?: string;
    initialValue?: any[];
    creatable?: boolean;
    handleCreateItem?: (item: string[]) => void;
    disableMenu?: boolean;
    delimiter?: string;
}

/**
 * `MultiSelectFilterOptions` is any valid `FilterModule` property (excluding description and label)
 * meant to override default multi select filter behaviour.
 */
 export interface MultiSelectFilterOptions extends Omit<Partial<FilterModule<string[]>>, 'description' | 'label'> {}

/**
 * `RadioFilterProps` are the props required to be supplied as the first argument of
 * the RadioFilter component.
 */
export interface RadioFilterProps {
    initialValue: string;
    defaultValue: string;
    options: {
        label: string;
        value: string;
    }[];
    label: string;
    description?: string;
}

/**
 * `RadioFilterOptions` is any valid `FilterModule` property (excluding description and label)
 * meant to override default text filter behaviour.
 */
 export interface RadioFilterOptions extends Omit<Partial<FilterModule<string>>, 'description' | 'label'> {}

/**
 * `SingleSelectFilterProps` are the props required to be supplied as the
 * first argument of the SingleSelectFilter component.
 */
 export interface SingleSelectFilterProps {
    options: SelectOption[];
    label: string;
    description?: string;
    selectPlaceholderLabel?: string;
    filterLabelPrefix?: string;
    initialValue?: string | number;
    required?: boolean;
}

/**
 * `SingleSelectFilterOptions` is any valid `FilterModule` property (excluding description, label, and required)
 * meant to override default single select filter behaviour.
 */
 export interface SingleSelectFilterOptions extends Omit<Partial<FilterModule<string>>, 'description' | 'label' | 'required'> {}

/**
 * `TextFilterOverrides` is any valid `FilterModule` property (excluding description and label)
 * meant to override default text filter behaviour.
 */
 export interface TextFilterOverrides extends Omit<Partial<FilterModule<string>>, 'description' | 'label'> {}
