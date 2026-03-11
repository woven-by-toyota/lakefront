import styled from '@emotion/styled';

interface ItemGridContainerProps {
    columnWidthMin: string;
    columnWidth: number;
    rowGap?: number;
    columnGap?: number;
}

export const ItemGridContainer = styled.div<ItemGridContainerProps>(({ theme, columnWidthMin, columnWidth, rowGap, columnGap }) => ({
    gridTemplateColumns: `repeat(auto-fill, minmax(${columnWidthMin}, ${columnWidth}vw))`,
    gridGap: `${rowGap}px ${columnGap}px`,
    display: 'grid',
    color: theme.foregrounds.primary
}));
