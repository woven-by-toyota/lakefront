import styled from '@emotion/styled';
import { SelectOption } from 'src/types/global';
import { ReactComponent as baselineExpandSvg } from './baseline-expand_more-24px.svg';
import {
    StylesConfig,
    GroupBase,
} from 'react-select';

export const SelectStyles = styled.div({
    select: {
        display: 'none'
    }
});

export type SelectOverlayStyles = Partial<StylesConfig<SelectOption<any>, boolean, GroupBase<SelectOption<any>>>>;

export const getSelectOverlayStyles = (theme: any): SelectOverlayStyles => ({
    control: (defaultStyles, state) => ({
        ...defaultStyles,
        flexWrap: undefined,
        display: 'flex',
        color: theme.foregrounds.primary,
        backgroundColor: state.selectProps.isDisabled ?
            theme.backgrounds.disabled :
            theme.backgrounds.primary,
        cursor: state.selectProps.isDisabled ? 'not-allowed' : 'pointer',
        alignItems: 'center',
        minWidth: 160,
        height: 36,
        padding: '0px 6px',
        borderRadius: 4,
        border: `1px solid ${theme.borderColors.primary}`,
        ...theme.lettering.primary,
        justifyContent: 'space-between',
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
    valueContainer: (defaultStyles) => ({
        ...defaultStyles,
        padding: '2px 4px'
    }),
    menu: (defaultStyles) => ({
        ...defaultStyles,
        backgroundColor: theme.backgrounds.primary,
        border: `1px solid ${theme.borderColors.secondary}`,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        marginTop: 8,
        zIndex: 9999
    }),
    menuList: (defaultStyles) => ({
        ...defaultStyles,
        overflowY: 'auto',
        overflowX: 'hidden',
        maxHeight: undefined
    }),
    option: (defaultStyles, state) => ({
        ...defaultStyles,
        alignItems: 'center',
        color: state.selectProps.isDisabled ?
            theme.foregrounds.disabled :
            theme.foregrounds.primary,
        cursor: 'pointer',
        display: 'flex',
        ...theme.lettering.primary,
        height: 40,
        minWidth: 160,
        padding: '0 12px',
        userSelect: 'none',
        ...(state.isSelected && {
            backgroundColor: theme.backgrounds.primary,
            ':hover': {
                backgroundColor: state.selectProps.isDisabled ?
                    theme.backgrounds.primary :
                    theme.backgrounds.hover,
                cursor: state.selectProps.isDisabled ? 'not-allowed' : undefined
            }
        }),
        ...(state.isFocused && {
            backgroundColor: theme.backgrounds.hover
        })
    }),
    multiValue: (defaultStyles) => ({
        ...defaultStyles,
        backgroundColor: theme.backgrounds.secondary,
        color: theme.foregrounds.primary,
        ':hover': {
            backgroundColor: theme.backgrounds.hover
        }
    }),
    multiValueLabel: (defaultStyles) => ({
        ...defaultStyles,
        color: theme.foregrounds.primary
    }),
    multiValueRemove: (defaultStyles) => ({
        ...defaultStyles,
        color: theme.foregrounds.primary,
        ':hover': {
            backgroundColor: theme.backgrounds.hover,
            color: theme.foregrounds.primary
        }
    })
});

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
    backgroundRepeat: 'no-repeat',
    svg: {
      fill: theme.foregrounds.primary
    }
}));
