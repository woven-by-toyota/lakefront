import styled from '@emotion/styled';

export const BoundingBoxesContainer = styled.canvas(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    color: theme.foregrounds.primary
}));
