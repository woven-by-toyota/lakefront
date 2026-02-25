import styled from '@emotion/styled';
import { lightenDarkenColor } from 'src/styles/stylesUtil';
import { Theme } from '@emotion/react';
import { SelectOption } from 'src/types/global';
import { ReactComponent as baselineExpandSvg } from './baseline-expand_more-24px.svg';
import theme from 'src/styles/theme';
import { GetStyles, GroupBase } from 'react-select/dist/declarations/src/types';

export const SelectStyles = styled.div({
    select: {
        display: 'none'
    }
});

interface SelectState {
    isSelected: boolean;
    isFocused: boolean;
    selectProps: {
        isDisabled?: boolean;
    };
    theme: Theme;
}

export type SelectOverlayStyles = Partial<GetStyles<SelectOption<any>, true, GroupBase<SelectOption<any>>>>;

export const SELECT_OVERLAY_STYLES: SelectOverlayStyles = {
    control: (defaultStyles: SelectState, state: SelectState) => ({
        ...defaultStyles,
        flexWrap: undefined,
        display: 'flex',
        color: state.theme.foregrounds.primary,
        backgroundColor: state.selectProps.isDisabled ?
            state.theme.backgrounds.disabled :
            state.theme.backgrounds.primary,
        cursor: state.selectProps.isDisabled ? 'not-allowed' : 'pointer',
        alignItems: 'center',
        minWidth: 160,
        height: 36,
        padding: '0px 6px',
        borderRadius: 4,
        border: `1px solid ${state.theme.borderColors.primary}`,
        ...state.theme.lettering.primary,
        justifyContent: 'space-between',
        boxShadow: 'inset 0 1px 2px 0 rgb(0 0 0 / 20%), inset 0 0 0 1px rgb(0 0 0 / 20%)',
        ...(state.isFocused && {
            border: `1px solid ${state.theme.borderColors.pronounced}`,
            outline: 0
        }),
        ':hover': {
            backgroundColor: state.theme.backgrounds.hover,
            border: `1px solid ${state.theme.borderColors.pronounced}`,
            outline: 0
        }
    }),
    valueContainer: (defaultStyles: SelectState) => ({
        ...defaultStyles,
        padding: '2px 4px'
    }),
    menu: (defaultStyles: SelectState, state: SelectState) => ({
        ...defaultStyles,
        backgroundColor: state.theme.backgrounds.primary,
        border: `1px solid ${state.theme.borderColors.secondary}`,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        marginTop: 8,
        zIndex: 9999
    }),
    menuList: (defaultStyles: SelectState) => ({
        ...defaultStyles,
        overflowY: 'auto',
        overflowX: 'hidden',
        maxHeight: undefined
    }),
    option: (defaultStyles: SelectState, state: SelectState) => ({
        ...defaultStyles,
        alignItems: 'center',
        color: state.selectProps.isDisabled ?
            state.theme.foregrounds.disabled :
            state.theme.foregrounds.primary,
        cursor: 'pointer',
        display: 'flex',
        ...state.theme.lettering.primary,
        height: 40,
        minWidth: 160,
        padding: '0 12px',
        userSelect: 'none',
        ...(state.isSelected && {
            backgroundColor: state.theme.backgrounds.primary,
            ':hover': {
                backgroundColor: state.selectProps.isDisabled ?
                    state.theme.backgrounds.primary :
                    state.theme.backgrounds.hover,
                cursor: state.selectProps.isDisabled ? 'not-allowed' : undefined
            }
        }),
        ...(state.isFocused && {
            backgroundColor: state.theme.backgrounds.hover
        })
    })
};

export const SelectStyledComponent = styled.select(({ theme }) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    WebkitAppearance: 'none',
    borderRadius: '2px',
    boxShadow: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(0, 0, 0, 0.2)',
    border: `solid 1px ${theme.borderColors.primary}`,
    backgroundColor: theme.backgrounds.primary,
    color: theme.foregrounds.primary,
    ...theme.lettering.primary,
    minWidth: '200px',
    padding: '12px 32px 12px 12px',
    backgroundImage: `url(${baselineExpandSvg})`,
    backgroundPosition: '97% center',
    backgroundRepeat: 'no-repeat'
}));
