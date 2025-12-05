import styled from '@emotion/styled';

export const FilterBarContainer = styled.div(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: theme.backgrounds.primary,
    borderBottom: `1px solid ${theme.borderColors.primary}`,
    padding: '0 1rem',
    '.filterItem': {
        borderRadius: 2,
        border: `solid 1px ${theme.borderColors.primary}`,
        backgroundColor: theme.backgrounds.secondary,
        color: theme.foregrounds.primary,
        padding: '4px 6px',
        display: 'inline-flex',
        marginRight: 8,
        alignItems: 'center',
        '.filterItemLabel': {
            maxWidth: 325,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        '.filterItemClose': {
            borderLeft: `1px solid ${theme.borderColors.pronounced}`,
            marginLeft: 8,
            paddingLeft: 8,
            fontSize: 20,
            cursor: 'pointer'
        }
    },
    '.resetAll': {
        color: theme.foregrounds.hyperlink,
        cursor: 'pointer'
    }
}));
