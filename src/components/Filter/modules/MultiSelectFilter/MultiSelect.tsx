import { Component } from 'react';

import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { SelectOption } from 'src/types/global';
import { getMultiSelectStyles } from './multiSelectStyles';
import { createUniqueOptions, getUniqueOptions, parseItems } from './multiSelectUtil';
import { withTheme, Theme } from '@emotion/react';
import MultiValueInput from './MultiValueInput';
import { GroupBase, OnChangeValue } from 'react-select/dist/declarations/src/types';
import { SelectComponents } from 'react-select/dist/declarations/src/components';

export type MultiSelectOption = SelectOption<string>;

/**
 * `MultiSelectProps` are the props to be provided to the MultiSelect
 * component.
 */
interface MultiSelectProps {
    items: MultiSelectOption[];
    value: MultiSelectOption[];
    selectItem(items: string[]): void;
    placeholder?: string;
    title: string;
    creatable?: boolean;
    handleCreateItem?: (item: string[]) => void;
    disableMenu?: boolean;
    autoFocus?: boolean;
    delimiter?: string;
    theme?: Theme;
}

/**
 * This represents the structure of the MultiSelect
 * component state.
 */
interface MultiSelectState {
    items: MultiSelectOption[];
    selected: string[];
}

export class MultiSelect extends Component<MultiSelectProps, MultiSelectState> {
    static defaultProps = {
        placeholder: 'Enter filter term(s)'
    };

    constructor(props: MultiSelectProps) {
        super(props);

        this.state = {
            items: [...props.items, ...props.value],
            selected: [...props.value.map((option) => option.value)]
        };
    }

    handleChange = (selectedOptions: OnChangeValue<MultiSelectOption, true> | null) => {
        const items = selectedOptions ? selectedOptions.map((option: MultiSelectOption) => option.value) : [];
        this.setState({ selected: items });
        this.props.selectItem(items);
    };

    handleCreate = (item: string) => {
        const { handleCreateItem, delimiter, selectItem } = this.props;
        const { items, selected } = this.state;

        const parsedItems = parseItems(item, delimiter);
        const newOptions = createUniqueOptions(parsedItems);

        this.setState({
            items: [...items, ...newOptions],
            selected: [...selected, ...parsedItems]
        });

        selectItem([...selected, ...parsedItems]);

        if (handleCreateItem) {
            handleCreateItem(parsedItems);
        }
    };

    componentDidMount = () => {
        const itemsStateCopy = [...this.state.items];
        const availableOptionsResult = getUniqueOptions(itemsStateCopy);

        this.setState({ items: availableOptionsResult });
    };


    render() {
        const {
            items,
            placeholder,
            value,
            title,
            creatable,
            disableMenu = false,
            autoFocus = true,
            delimiter,
            theme
        } = this.props;

        const disabledMenuComponents = disableMenu
            ? {
                DropdownIndicator: null,
                Menu: () => <></>
            }
            : {};

        const parseMultiValueComponents: Partial<SelectComponents<unknown, true, GroupBase<unknown>>> | undefined = delimiter
            ? {
                Input: (props) => (
                    <MultiValueInput {...props} handleCreate={this.handleCreate} />
                )
            }
            : {};

        if (!theme) return null;

        return creatable ? (
            <CreatableSelect
                components={{
                    ...disabledMenuComponents,
                    ...parseMultiValueComponents
                }}
                autoFocus={autoFocus}
                value={value}
                isMulti
                name={title}
                placeholder={placeholder}
                onChange={(value) => this.handleChange(value as MultiSelectOption[])}
                onCreateOption={this.handleCreate}
                options={this.state.items}
                styles={getMultiSelectStyles(theme)}
                theme={(defaultTheme) => ({
                    ...defaultTheme,
                    colors: {
                        ...defaultTheme.colors,
                        primary: theme.backgrounds.primary,
                        primary25: theme.backgrounds.hover,
                        neutral0: theme.backgrounds.primary,
                        neutral80: theme.foregrounds.primary,    // Main text color
                        neutral20: theme.foregrounds.secondary,  // Secondary text
                        neutral10: theme.backgrounds.secondary   // Chip background
                    }
                })}
            />
        ) : (
            <Select
                autoFocus={autoFocus}
                value={value}
                isMulti
                name={title}
                placeholder={placeholder}
                onChange={this.handleChange}
                options={items}
                styles={getMultiSelectStyles(theme)}
                theme={(defaultTheme) => ({
                    ...defaultTheme,
                    colors: {
                        ...defaultTheme.colors,
                        primary: theme.backgrounds.primary,
                        primary25: theme.backgrounds.hover,
                        neutral0: theme.backgrounds.primary,
                        neutral80: theme.foregrounds.primary,    // Main text color
                        neutral20: theme.foregrounds.secondary,  // Secondary text
                        neutral10: theme.backgrounds.secondary   // Chip background
                    }
                })}
            />
        );
    }
}

export default withTheme(MultiSelect);
