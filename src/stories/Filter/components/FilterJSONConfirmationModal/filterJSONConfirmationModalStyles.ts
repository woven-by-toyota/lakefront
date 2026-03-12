import styled from '@emotion/styled';
import { FilterJSONConfirmationModalProps } from 'src/components/Filter/types';

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

export const ModalContainer = styled.div<FilterJSONConfirmationModalProps>(({ theme, modalVisible = false }) => ({
    display: modalVisible ? 'block' : 'none',
    position: 'fixed',
    zIndex: 1,
    paddingTop: '100px',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: ['rgb(0,0,0)', 'rgba(0,0,0,0.4)'],
    color: theme.foregrounds.primary
}));

export const ModalContent = styled.div(({ theme }) => ({
    backgroundColor: '#fefefe',
    margin: '10% auto auto',
    padding: '20px',
    border: '1px solid #888',
    width: '80%',
    color: theme.foregrounds.primary
}));
