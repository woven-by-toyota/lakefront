import styled from '@emotion/styled';

export const RadioGroupWrapper = styled.div(({ theme }) => ({
    label: {
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        'input[type=radio]:not(:checked) + svg + div': {
            color: theme.foregrounds.secondary
        },
        'input[type=radio]:checked + svg': {
            fill: theme.foregrounds.primary
        }
    },
    svg: {
        height: '16px',
        width: '16px'
    }
}));
