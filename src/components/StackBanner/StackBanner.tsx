import { ThemeProvider } from '@emotion/react';
import type { ComponentPropsWithoutRef, FC } from 'react';
import theme from 'src/styles/theme';
import StackBannerRow, { type StackBannerRowProps } from './StackBannerRow';
import { StackBannerListDiv } from './stackBannerStyles';

export interface StackBannerProps {
    /**
     * The rows to display in the stack banner.
     */
    rows: StackBannerRowProps[];
    /**
     * The classes to pass to the stack banner.
     */
    className?: string;
}

/**
 * StackBanner Component
 *
 * The StackBanner component is the container for StackBannerRows. As such,
 * rows are required to display any content.
 *
 */
const StackBanner: FC<StackBannerProps & ComponentPropsWithoutRef<'div'>> = ({ rows = [], ...props }) => {
    return (
        <ThemeProvider theme={theme}>
            <StackBannerListDiv {...props}>
                {/* key is set after the spread: React 19 does not take a key arriving through one */}
                {rows.map((stackBannerRowProps: StackBannerRowProps) => {
                    return (
                        <StackBannerRow
                            {...stackBannerRowProps}
                            key={stackBannerRowProps.key}
                        />
                    );
                })}
            </StackBannerListDiv>
        </ThemeProvider>
    );
};

export default StackBanner;
