import styled from '@emotion/styled';
import { MultiSelectOption } from './MultiSelect';
import { lightenDarkenColor } from 'src/styles/stylesUtil';
import TextArea from 'src/components/TextArea/TextArea';
import theme from 'src/styles/theme';
import { GetStyles, GroupBase } from 'react-select/dist/declarations/src/types';

const DARKEN_LEAST = -10;

export const MULTI_SELECT_STYLES: Partial<GetStyles<MultiSelectOption, true, GroupBase<MultiSelectOption>>> = {
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
        ':hover': {
            backgroundColor: theme.backgrounds.hover
        }
    }),
    option: (styles: any, state: { isFocused: any; }) => ({
        ...styles,
        backgroundColor: state.isFocused ? theme.backgrounds.hover : theme.backgrounds.primary
    })
};

export const MultiValueInputContainer = styled.div({
    'textarea + div': {
        minHeight: 0,
        marginTop: 0
    }
});

export const StyledMultiValueInput = styled(TextArea)({
    height: 20,
    width: '125%',
    borderColor: 'transparent',
    ':focus': {
        borderColor: 'transparent'
    },
    backgroundColor: 'transparent',
    margin: '-8px 0 0 0',
    textIndent: -10
});
