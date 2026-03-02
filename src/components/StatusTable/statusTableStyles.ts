import styled from '@emotion/styled';
import { ReactComponent as UnfoldMoreIcon } from './__assets__/UnfoldMoreIcon.svg';
interface StatusTableStyleProps {
    cards?: boolean;
}

interface StatusProps {
    status?: string;
    onRowClick?: () => void;
    rowClick?: boolean;
}

export const StatusTableStyle = styled.div<StatusTableStyleProps>(({ cards, theme }) => ({
    'table': {
        borderCollapse: 'separate',
        borderSpacing: 0,
        width: '100%'
    },

    'th': {
        color: theme.foregrounds.tableHeading,
        ...theme.lettering.secondary,
        padding: '12px 12px 8px 12px',
        position: 'sticky',
        textAlign: 'left',
        top: 0,
        whiteSpace: 'nowrap',
        zIndex: 2,

        '&:first-of-type': {
            paddingLeft: '20px'
        },

        'svg': {
            fontSize: '18px'
        },

        'div': {
            cursor: 'pointer',
            display: 'flex'
        }
    },
    ...(cards && {

        borderSpacing: 0,

        '&:first-of-type': {
            'tr': {
                '&:hover': {
                    backgroundColor: theme.backgrounds.primary
                }
            }
        },

        'td': {
            borderBottom: '1px solid',
            borderBottomColor: theme.borderColors.primary,

            '&:first-of-type': {
                borderLeft: '1px solid',
                borderBottomColor: theme.borderColors.primary
            },

            '&:last-of-type': {
                borderRight: '1px solid',
                borderBottomColor: theme.borderColors.primary
            }
        },

        'h5': {
            marginBlockStart: '0px',
            marginBlockEnd: '5px',
            color: theme.foregrounds.primary,
            ...theme.lettering.secondary,
            fontWeight: 600
        }

    })
}));

export const DividerRow = styled.tr({
    height: '7px',
    opacity: '0'
});

export const StatusCellBadgeStyle = styled.div<StatusProps>(({ status, theme }) => ({
    paddingLeft: '24px',

    ':before': {
        borderRadius: '16px',
        content: '""',
        height: '16px',
        left: '10px',
        position: 'absolute',
        top: '33%',
        width: '16px'
    },

    ...((status === 'Running') && {
        '&:before': {
            backgroundColor: theme.foregrounds.success
        }
    }),

    ...((status === 'Enqueued') && {
        '&:before': {
            backgroundColor: theme.backgrounds.disabled
        }
    }),

    ...(((status === 'Failed') || (status === 'Error')) && {
        '&:before': {
            backgroundColor: theme.foregrounds.error
        }
    })
}));

export const StatusRowStyle = styled.tr<StatusProps>(({ status, onRowClick, rowClick, theme }) => ({
    backgroundColor: theme.backgrounds.primary,

    '&:hover': {
        backgroundColor: theme.backgrounds.hover,
    },

    '&:last-of-type': {
        'td': {
            borderBottom: '1px solid',
            borderBottomColor: theme.borderColors.primary
        }
    },

    'td': {
        borderTop: '1px solid',
        borderTopColor: theme.borderColors.primary,

        '&:first-of-type': {
            borderLeft: '1px solid',
            borderLeftColor: theme.borderColors.primary,
            paddingLeft: '20px',

            '&:before': {
                content: '""',
                height: '100%',
                left: 0,
                position: 'absolute',
                top: 0,
                width: '9px'
            }
        },

        '&:last-of-type': {
            borderRight: '1px solid',
            borderRightColor: theme.borderColors.primary
        },

        color: theme.foregrounds.secondary,
        padding: '12px',
        position: 'relative'
    },

    ...((status === 'Running') && {
        'td:first-of-type': {
            '&:before': {
                backgroundColor: theme.foregrounds.success
            }
        }
    }),

    ...((status === 'Enqueued') && {
        'td:first-of-type': {
            '&:before': {
                backgroundColor: theme.backgrounds.disabled
            }
        }
    }),

    ...(((status === 'Failed') || (status === 'Error')) && {
        'td:first-of-type': {
            '&:before': {
                backgroundColor: theme.foregrounds.error
            }
        }
    }),

    ...(rowClick && {
        cursor: 'pointer'
    }
    )

}));

export const SortIcon = styled(UnfoldMoreIcon)(({ theme }) => ({
    fill: theme.foregrounds.primary
}));
