import { FC } from 'react';
import { SelectStyles, SelectStyledComponent } from './selectStyles';
import SelectOverlay from './SelectOverlay';
import { GetStyles, GroupBase } from 'react-select/dist/declarations/src/types';
import { AsyncProps as ReactAsyncSelectProps } from 'react-select/async';
import { Props as ReactSelectProps } from 'react-select';
import { extractNativeSelectProps } from 'src/components/Select/selectUtil';

export interface SelectOption {
    value: string | number | undefined;
    label: string;
}

export interface SelectProps extends ReactSelectProps {
    /**
     * This is to set the options of the dropdown.
     */
    options: SelectOption[];
    /**
     * This is called on a dropdown change event.
     */
    onChange(event: any): void;
    /**
     * This is called on dropdown blur event.
     */
    onBlur?(event: any): void;
    /**
     * This is to set the autofocus of the dropdown.
     */
    autoFocus?: boolean;
    /**
     * This is to set the dropdown class.
     */
    className?: string;
    /**
     * This is to set the id of the dropdown.
     */
    id?: string;
    /**
     * This is to enable/disable the dropdown by default.
     */
    disabled?: boolean;
    /**
     * This is to set the searchable property of the dropdown.
     * If set to true, the user can type the value to search from the available options.
     */
    isSearchable?: boolean;
    /**
     * This is to specify if multiple options can be selected.
     */
    isMulti?: boolean;
    /**
     * This is to leave the select menu open upon selection.
     */
    closeMenuOnSelect?: boolean;
    /**
     * This is to overwrite defaulted styles
     */
    styles?: Partial<GetStyles<SelectOption, true, GroupBase<SelectOption>>>;
    /**
     * This is the default text before an option is selected.
     */
    placeholder?: string;
    /**
     * The value of the select component (if you want to control externally).
     */
    value?: any[] | string | number;
    /**
     * A value of the multi-select component (if you want to control externally).
     */
    multiValue?: SelectOption[];
    /**
     * A value to initially set the multi-select component to.
     */
    multiDefaultValue?: SelectOption[];
    /**
     * Enable async select component.
     * Note: Some optional props that are applicable to both normal and async Select variants may
     * need to be explicitly defined in asyncConfig to work properly (e.g. noOptionsMessage, placeholder).
     */
    asyncConfig?: Partial<ReactAsyncSelectProps<SelectOption, boolean, GroupBase<SelectOption>>>;
}


/**
 *  The select component is used to render a dropdown with options. The user can set a selected option by default.
 *  The isSearchable property allows user to find the value from the options available.
 */
const Select: FC<SelectProps> = (props) => {
    const { options, className, isMulti, ...rest }  = props;
    const nativeSelectProps = extractNativeSelectProps(props);

    return (
        <SelectStyles>
            <SelectStyledComponent {...nativeSelectProps}>
                {options.map((option) => (
                    <option key={`${option.label}${option.value ?? ''}`} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </SelectStyledComponent>
            <SelectOverlay {...rest} options={options} isMulti={isMulti}/>
        </SelectStyles>
    );
};

export default Select;
