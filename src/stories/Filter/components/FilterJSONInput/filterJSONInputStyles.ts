import styled from '@emotion/styled';
import TextArea from 'src/components/TextArea/TextArea';

export const ButtonWrapper = styled.div(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1em',
    color: theme.foregrounds.primary,
    button: {
        flex: 1
    },
    'button:first-of-type': {
        marginRight: 2
    },
    'button:last-of-type': {
        marginLeft: 2
    }
}));

export const JSONEditor = styled(TextArea)(({ theme }) => ({
    marginTop: '1em',
    width: 231,
    color: theme.foregrounds.primary
}));
