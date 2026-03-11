import styled from '@emotion/styled';
import Input from 'src/components/Input/Input';

export const StyledInput = styled(Input)(({ theme }) => ({
    width: '100%',
    color: theme.foregrounds.primary
}));
