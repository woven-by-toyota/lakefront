import styled from '@emotion/styled';
import type { CSSProperties } from 'react';
import Button from '../Button';

export const HOVER_OFFSET = -2;
const REVERSE_OFFSET = HOVER_OFFSET * -1;

export const ButtonGroupContainer = styled('div')<{ mode: 'toggle' | 'group' }>(({ theme, mode }) => ({
    display: 'inline-block',
    ...(mode === 'group' && {
        display: 'inline-flex',
        justifyContent: 'space-between',
        gap: 2
    }),
    borderRadius: 8,
    marginLeft: REVERSE_OFFSET,
    boxSizing: 'border-box',
    position: 'relative',
    '.primary': {
        zIndex: 1,
        boxShadow: `0 1px 4px ${theme.shadowColors.boxShadow}`
    }
}));

export const SelectedStylesButton = styled(Button)<{ selectedStyles: CSSProperties }>(({ selectedStyles }) => ({
    ...selectedStyles
}));
