import styled from '@emotion/styled';
import { lightenDarkenColor } from 'src/styles/stylesUtil';
import Button from 'src/components/Button/Button';

interface DrawerContainerProps {
    width: string | number;
    open: boolean;
}

export const DrawerContainer = styled.div<DrawerContainerProps>(({ theme, width, open }) => ({
    backgroundColor: theme.backgrounds.widget.secondaryDark,
    height: 'auto',
    transition: 'all .3s ease-in-out',
    overflow: 'auto',
    width,
    marginRight: open ? 0 : `-${width}`,
    color: theme.foregrounds.widget.secondaryDark,
    'div.innerDrawerContainer': {
        padding: '20px 18px 0 16px',
        position: 'relative',
        height: 'calc(100% - 32px)'
    }
}));

export const DrawerCloseButton = styled(Button)(({ theme }) => ({
  svg: {
    fill: theme.foregrounds.widget.secondaryDark
  },
  '&:hover': {
    backgroundColor: lightenDarkenColor(theme.backgrounds.widget.secondaryDark, 20),
    svg: {
      fill: theme.foregrounds.widget.secondaryDark
    }
  }
}));
