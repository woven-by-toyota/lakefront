import styled from '@emotion/styled';
import colors from 'src/styles/lakefrontColors';
import { ReactComponent as ArrowUp } from './assets/arrow_drop_up.svg';
import { ReactComponent as ArrowDown } from './assets/arrow_drop_down.svg';
import { ReactComponent as Unsorted } from './assets/unsorted.svg'

export const TableStyle = styled.table(({ theme }) => ({
    padding: 0,
    margin: 0,
    borderSpacing: 0,
    width: '100%',
    'tr': {
        color: theme?.colors?.arsenic,
        ':last-child': {
            'td': {
                borderBottom: 0,
            }
        }
    },
    'th': {
        color: theme?.colors?.pavement,
        position: 'relative',
        textAlign: 'left',
        'svg': {
            marginTop: 2,
            position: 'absolute',
            top: 6,
            fill: colors.pavement,
        }
    },
    'th,td': {
        margin: 0,
        padding: '0.8rem',
        borderBottom: '1px solid',
        borderBottomColor: theme?.colors?.selago,

        '&.noBorder': {
            borderBottom: 0,
            padding: '0.4rem'
        },

        '&.marginBottom': {
            marginBottom: 5
        },
        svg: {
            fill: colors.pavement,          
        }
    }
}));

export const StyledHeader = styled.div({
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'flex-start',
    'div:first-of-type':{
        width: 'max-content'
    }
});

export const StyledHeaderContent = styled.div({
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'flex-start',
    'svg.sort-icon': {
        marginTop: 0,
        position: 'static',    
        fill: colors.pavement,        
    }
});

export const StyledArrowDown = styled(ArrowDown)({
    paddingLeft: 5,
    paddingTop: 3
});

export const StyledArrowUp = styled(ArrowUp)({
    paddingLeft: 5,
    paddingTop: 3
});

export const StyledUnsorted = styled(Unsorted)({
    marginLeft: 8,
    position: 'relative',
    top: 10
});

interface HideableTHeadProps {
    hide: boolean;
    sticky?: boolean;
}

export const HideableTHead = styled.thead<HideableTHeadProps>(({ hide, sticky, theme }) => ({
    visibility: hide ? 'collapse' : 'visible',
    ...(sticky && {
        position: 'sticky',
        top: 0,
        zIndex: 10,
        '& th': {
            backgroundColor: theme.backgrounds.primary,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }
    })
}));
