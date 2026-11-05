import { useTheme } from '@emotion/react';
import { type FC, useEffect, useState } from 'react';
import Select, { type components, type OnChangeValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import ThemeErrorFallback from 'src/components/shared/ThemeErrorFallback';
import type { SelectOption } from 'src/types/global';
import MultiValueInput from './MultiValueInput';
import { getMultiSelectStyles } from './multiSelectStyles';
import { createUniqueOptions, getUniqueOptions, parseItems } from './multiSelectUtil';

export type MultiSelectOption = SelectOption<string>;

// at module scope so react-select sees one identity rather than a new component every render
const EmptyMenu = () => <></>;

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
}

export const MultiSelect: FC<MultiSelectProps> = ({
    items: propItems,
    value,
    selectItem,
    placeholder = 'Enter filter term(s)',
    title,
    creatable,
    handleCreateItem,
    disableMenu = false,
    autoFocus = true,
    delimiter
}) => {
    const theme = useTheme();

    const [items, setItems] = useState<MultiSelectOption[]>([...propItems, ...value]);
    const [selected, setSelected] = useState<string[]>([...value.map((option) => option.value)]);

    const handleChange = (selectedOptions: OnChangeValue<MultiSelectOption, true> | null) => {
        const items = selectedOptions ? selectedOptions.map((option: MultiSelectOption) => option.value) : [];
        setSelected(items);
        selectItem(items);
    };

    const handleCreate = (item: string) => {
        const parsedItems = parseItems(item, delimiter);
        const newOptions = createUniqueOptions(parsedItems);

        setItems((prev) => [...prev, ...newOptions]);
        setSelected((prev) => {
            const newSelected = [...prev, ...parsedItems];
            selectItem(newSelected);
            return newSelected;
        });

        if (handleCreateItem) {
            handleCreateItem(parsedItems);
        }
    };

    useEffect(() => {
        const initialItems = [...propItems, ...value];
        const availableOptionsResult = getUniqueOptions(initialItems);
        setItems(availableOptionsResult);
        setSelected(value.map((option) => option.value));
    }, [propItems, value]);

    const disabledMenuComponents = disableMenu
        ? {
              DropdownIndicator: null,
              Menu: EmptyMenu
          }
        : {};

    const parseMultiValueComponents: Partial<typeof components> | undefined = delimiter
        ? {
              /*
               * biome-ignore lint/correctness/noComponentHookFactories: this closes over handleCreate,
               * which is rebuilt every render along with the selectItem and setItems calls it makes, so
               * giving it a stable identity means stabilising that whole chain first.
               */
              Input: (props: any) => (
                  <MultiValueInput
                      {...props}
                      handleCreate={handleCreate}
                  />
              )
          }
        : {};

    if (!theme) return <ThemeErrorFallback componentName='MultiSelect' />;

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
            onChange={(value) => handleChange(value as MultiSelectOption[])}
            onCreateOption={handleCreate}
            options={items}
            styles={getMultiSelectStyles(theme)}
            theme={(defaultTheme) => ({
                ...defaultTheme,
                colors: {
                    ...defaultTheme.colors,
                    primary: theme.backgrounds.primary,
                    primary25: theme.backgrounds.hover,
                    neutral0: theme.backgrounds.primary,
                    neutral80: theme.foregrounds.primary, // Main text color
                    neutral20: theme.foregrounds.secondary, // Secondary text
                    neutral10: theme.backgrounds.secondary // Chip background
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
            onChange={handleChange}
            options={propItems}
            styles={getMultiSelectStyles(theme)}
            theme={(defaultTheme) => ({
                ...defaultTheme,
                colors: {
                    ...defaultTheme.colors,
                    primary: theme.backgrounds.primary,
                    primary25: theme.backgrounds.hover,
                    neutral0: theme.backgrounds.primary,
                    neutral80: theme.foregrounds.primary, // Main text color
                    neutral20: theme.foregrounds.secondary, // Secondary text
                    neutral10: theme.backgrounds.secondary // Chip background
                }
            })}
        />
    );
};

export default MultiSelect;
