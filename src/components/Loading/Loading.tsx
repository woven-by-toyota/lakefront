import { ElementType, FC, ReactElement } from 'react';
import { StyledLoadingContainer } from './loadingStyles';
import { displayIcon, iconOptions } from './loadingUtil';

export interface LoadingProps {
    /**
     * Determines if the component should rotate.
     */
    animated?: boolean;
    /**
     * The direction of the default animation.
     */
    spinDirection?: 'LEFT' | 'RIGHT';
    /**
     * Label position in relation to the SVG.
     */
    labelPosition?: 'BOTTOM' | 'RIGHT';
    /**
     * The text or element that shows next to the svg.
     */
    label?: string | ReactElement;
    /**
     * The height of the loading image.
     */
    height?: number;
    /**
     * The width of the loading image.
     */
    width?: number;
    /**
     * The SVG image to be shown when loading.
     */
    svg?: ElementType;
    /**
     * The icon variant to display if svg isn't provided.
     */
    iconVariant?: string;
    /**
     * Additional styles.
     */
    className?: string;
}

const Loading: FC<LoadingProps> = (
    {
        animated = true,
        spinDirection = 'RIGHT',
        label,
        labelPosition = 'BOTTOM',
        height = 24,
        width = 24,
        svg,
        iconVariant = 'primary',
        className,
        ...logoProps
    }) => {
    const Svg = svg ? svg : displayIcon(iconVariant);
    const ariaDetails = iconVariant === 'secondary' ? iconOptions.secondary['aria-details'] : iconOptions.primary['aria-details'];

    return (
        <StyledLoadingContainer
            className={className}
            animated={animated}
            spinDirection={spinDirection}
            labelPosition={labelPosition}
        >
            <Svg height={height} aria-label='loading' aria-details={svg ? undefined : ariaDetails}
                 width={width} {...logoProps} />
            {
                label && <div>{label}</div>
            }
        </StyledLoadingContainer>
    );
};

export default Loading;
