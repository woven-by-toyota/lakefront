import styled from '@emotion/styled';

export const AttributeGrid = styled.div(({ theme }) => ({
    // Use CSS grid.
    // The grid has one template row and automatically creates additional rows.
    // The width of the first column of the grid is the width of the widest element in the column --
    // so captions don't wrap.
    // The second column is the remaining width in the grid.
    // If any content wraps, the height of the row automatically expands to allow for it.
    display: 'grid',
    gridTemplateColumns: 'max-content auto',
    rowGap: '0.5rem',
    columnGap: '1rem',
    color: theme.foregrounds.primary
}));

export const Caption = styled.span<any>(({ theme }) => ({
    gridColumnStart: 1,
    gridColumnEnd: 2,
    color: theme.foregrounds.secondary,
    textAlign: 'right',
    '&::after': {
        content: '": "'
    }
}));

export const Content = styled.span<any>(({ theme }) => ({
    gridColumnStart: 2,
    gridColumnEnd: 3,
    color: theme.foregrounds.primary
}));

export const AttributeList = styled.span(({ theme }) => ({
    display: 'block',
    div: {
        marginBottom: 6
    },
    'span:nth-child(1)': {
        color: theme.foregrounds.secondary,
        textAlign: 'right',
        marginRight: '2px',
        '&::after': {
            content: '": "'
        }
    },
    'span:nth-child(2)': {
        color: theme.foregrounds.primary
    }
}));
