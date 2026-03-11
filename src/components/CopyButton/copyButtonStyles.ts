import styled from '@emotion/styled';

interface CopyButtonContentProps {
    hasContent: boolean;
}

export const CopyButtonContent = styled.div<CopyButtonContentProps>(({ theme, hasContent }) => ({
    paddingLeft: hasContent ? 8 : 0,
    color: theme.foregrounds.primary
}));
