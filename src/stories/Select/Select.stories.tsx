import { ComponentPropsWithoutRef, useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-webpack5';
import { useTheme } from '@emotion/react';
import SelectComponent, { getSelectOverlayStyles, SelectProps } from 'src/components/Select';
import DocBlock from '.storybook/DocBlock';
import { emerald } from 'src/styles/lakefrontColors';
import { SelectOption } from 'src/components/Select/Select';

export default {
    title: 'Lakefront/Select',
    component: SelectComponent,
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const Template: StoryFn<SelectProps & ComponentPropsWithoutRef<'div'>> = (args) => {
    const theme = useTheme();
    const [value, setValue] = useState(args.value);
    const handleOnChange = (event) => {
        setValue(event.target.value);
    };

    const areValuesSelected = () => {
        if (!args.isMulti){
            return value !== undefined;
        }
        else {
            return value != undefined && value.length > 0;
        }
    };

    return (
        <>
            <div
                style={{
                    minHeight: 20,
                    backgroundColor: areValuesSelected() && emerald,
                    padding: 8,
                    margin: '8px 0',
                    textAlign: 'center',
                    width: '100%'
                }}
            >
                {areValuesSelected() && !args.isMulti && `The selected value is ${value}`}
                {areValuesSelected() && value.length > 0 && args.isMulti && `The selected values are: ${value.map(v => ` ${v}`)}`}
            </div>
            <section style={{ display: 'inline-flex', height: '150px' }}>
                <SelectComponent
                  value={value}
                  onChange={handleOnChange}
                  styles={{
                    ...getSelectOverlayStyles(theme),
                    control: (baseStyles, state) => ({
                      ...getSelectOverlayStyles(theme).control(baseStyles, state),
                      minWidth: 300
                    })
                  }}
                  {...args}
                />
            </section>
        </>
    );
};

export const Select = Template.bind({});
Select.args = {
    options: [{ label: 'Km', value: 'metric' }, { label: 'Mi', value: 'imperial' }],
    value: 'imperial',
    isMulti: false
};

export const MultiSelect = Template.bind({});
MultiSelect.args = {
    options: [{ label: 'Km', value: 'metric' }, { label: 'Mi', value: 'imperial' }, {label: 'Made up system', value: 'made up'}],
    value: '',
    isMulti: true
};

export const MultiSelectWithDefaultValues = Template.bind({});
MultiSelectWithDefaultValues.args = {
  options: [{ label: 'Km', value: 'metric' }, { label: 'Mi', value: 'imperial' }, {label: 'Made up system', value: 'made up'}],
  multiDefaultValue: [{ label: 'Mi', value: 'imperial' }, {label: 'Made up system', value: 'made up'}],
  isMulti: true
};

export const AsyncSelect = Template.bind({});
AsyncSelect.args = {
  options: [],
  multiDefaultValue: [],
  isMulti: true,
  openMenuOnClick: false,
  isSearchable: true,
  asyncConfig: {
    placeholder: 'Start typing to fetch options.',
    noOptionsMessage: ({ inputValue }) => inputValue.length < 3 ? 'Input at least 3 characters.' : 'No matching options. Try typing "Some"',
    loadOptions: (inputValue: string, callback: (options: SelectOption[]) => void) => {
      if (inputValue.length < 3) {
        callback([]);
        return;
      }
      // Simulate an async call to fetch options based on the input value
      setTimeout(() => {
        // Here you would typically make an API call to fetch options
        const filteredOptions = [{ label: 'Some', value: 'some' }, {label: 'Something', value: 'something'}, {label: 'Some things', value: 'some_things'}].filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filteredOptions);
      }, 1000); // Simulate network delay
    }
  }
};
