import styled from '@emotion/styled';
import { ReactComponent as GpsFixedIcon } from './assets/navigation.svg';
import { ReactComponent as AddIcon } from './assets/plus.svg';
import { ReactComponent as RemoveIcon } from './assets/minus.svg';

export const GraphContainer = styled.div({
    height: '100%',
    margin: 0,
    position: 'relative'
});

export const StyledCanvas = styled.canvas({
    cursor: 'grab',
    height: '100%',
    width: '100%'
});

export const GraphControls = styled.div(({theme}) => ({
    bottom: 16,
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    right: 16,
    svg: {
        height: 17
    },
    div: {
        backgroundColor: theme.backgrounds.inverted,
        borderRadius: 2,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
        height: 32,
        width: 32
    },
    'div:first-of-type': {
        marginBottom: 15
    },
    'div:nth-of-type(2)': {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    'div:nth-of-type(3)': {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderTop: `1px solid ${theme.borderColors.secondary}`
    },
    'svg path:nth-of-type(2)': {
        fill: theme.foregrounds.inverted
    }
}));

export const StyledGpsFixedIcon = styled(GpsFixedIcon)(() => ({
    height: 17,
}));

export const StyledAddIcon = styled(AddIcon)(() => ({
    height: 17,
}));

export const StyledRemoveIcon = styled(RemoveIcon)(() => ({
    height: 17,
}));
