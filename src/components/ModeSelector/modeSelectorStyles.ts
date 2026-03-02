import styled from '@emotion/styled';

export const ModeSelectorContainer = styled.div(({ theme }) => ({
    backgroundColor: theme.backgrounds.primary,
    borderRadius: 2,
    boxShadow: '0 2px 4px 0 rgb(0 0 0 / 50%)',
    padding: '12px 16px',
    height: '100%',

    h3: {
        color: theme.foregrounds.secondary,
        fontSize: 14,
        fontWeight: 'normal',
        marginBottom: '1em',
        textTransform: 'uppercase'
    },

    '.mode-selector-legend': {
        maxHeight: '60%',
        overflowY: 'auto',
        marginTop: 8,
    }
}));

interface LegendRowProps {
    color: string;
}

export const LegendRow = styled.div<LegendRowProps>(({ color }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    '.row-key': {
        backgroundColor: color,
        height: 20,
        width: 20,
        marginRight: 4
    }
}));
