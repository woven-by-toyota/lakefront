import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { LoadingProps } from './Loading';

const spinAnimation = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

export const StyledLoadingContainer = styled.div<LoadingProps>(
    ({ theme, animated, labelPosition, svg, spinDirection }) => ({
        display: 'flex',
        flexDirection: labelPosition === 'BOTTOM' ? 'column' : 'row',
        alignItems: 'center',
        'svg': {
            ...(animated && { animation: `${spinAnimation} 2s linear infinite` }),
            ...(spinDirection === 'LEFT' && { animationDirection: 'reverse' }),
            marginLeft: 5,
            marginRight: 10,
            path: {
                ...(!svg && { fill: theme.foregrounds.loading })
            }
        },
        div: {
            color: theme.foregrounds.loading,
            paddingTop: labelPosition === 'BOTTOM' ? 8 : 0,
        }
    })
);
