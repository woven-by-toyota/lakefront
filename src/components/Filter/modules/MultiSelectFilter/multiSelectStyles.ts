import styled from '@emotion/styled';
import { MultiSelectOption } from './MultiSelect';
import TextArea from 'src/components/TextArea/TextArea';
import { GetStyles, GroupBase } from 'react-select/dist/declarations/src/types';
import { Theme } from '@emotion/react';

export const getMultiSelectStyles = (theme: Theme): Partial<GetStyles<MultiSelectOption, true, GroupBase<MultiSelectOption>>> => ({
    control: (styles: any, state: { isFocused: any; }) => ({
        ...styles,
        backgroundColor: theme.backgrounds.primary,
        borderRadius: 4,
        border: `1px solid ${theme.borderColors.primary}`,
        boxShadow: 'inset 0 1px 2px 0 rgb(0 0 0 / 20%), inset 0 0 0 1px rgb(0 0 0 / 20%)',
        ...(state.isFocused && {
            border: `1px solid ${theme.borderColors.pronounced}`,
            outline: 0
        }),
        ':hover': {
            backgroundColor: theme.backgrounds.hover,
            border: `1px solid ${theme.borderColors.pronounced}`,
            outline: 0
        }
    }),
    multiValue: (styles: any) => ({
        ...styles,
        backgroundColor: theme.backgrounds.secondary,
        color: theme.foregrounds.primary,
        ':hover': {
            backgroundColor: theme.backgrounds.hover
        }
    }),
    multiValueLabel: (styles: any) => ({
        ...styles,
        color: theme.foregrounds.primary
    }),
    multiValueRemove: (styles: any) => ({
        ...styles,
        color: theme.foregrounds.primary,
        ':hover': {
            backgroundColor: theme.backgrounds.hover,
            color: theme.foregrounds.primary
        }
    }),
    option: (styles: any, state: { isFocused: any; }) => ({
        ...styles,
        backgroundColor: state.isFocused ? theme.backgrounds.hover : theme.backgrounds.primary
    })
});

export const MultiValueInputContainer = styled.div(({ theme }) => ({
    color: theme.foregrounds.primary,
    'textarea + div': {
        minHeight: 0,
        marginTop: 0
    }
}));

export const StyledMultiValueInput = styled(TextArea)(({ theme }) => ({
    height: 20,
    width: '125%',
    borderColor: 'transparent',
    ':focus': {
        borderColor: 'transparent'
    },
    backgroundColor: 'transparent',
    margin: '-8px 0 0 0',
    textIndent: -10,
    color: theme.foregrounds.primary
}));
