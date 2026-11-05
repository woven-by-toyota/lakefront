import type { FC, ReactNode } from 'react';
import { css, Global } from '@emotion/react';

const styles = css({
    '*': {
        fontFamily: '"Source Sans Pro", sans-serif'
    }
});

interface GlobalStyleProps {
    children?: ReactNode;
}

const GlobalStyles: FC<GlobalStyleProps> = ({ children }) => {
    return (
        <>
            <Global styles={styles} />
            {children}
        </>
    );
};

export default GlobalStyles;
