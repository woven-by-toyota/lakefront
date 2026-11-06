import { ThemeProvider } from '@emotion/react';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import BoundingBoxes from 'src/components/BoundingBoxes';
import Loading from 'src/components/Loading/Loading';
import resizeObserver from 'src/lib/hooks/resizeObserver.js';
import theme from 'src/styles/theme';
import {
    CheckOutlinedIconStyle,
    DisplayImage,
    HighlightedImageStyle,
    LoadingSpinner,
    MaskableImageContainer,
    MaskedImage
} from './maskableImageStyles';

export interface ImageTagProps {
    id: number;
    name: string;
    model: string;
    display_name: string;
    detector: string;
    bounding_box: {
        top_left_x: number;
        top_left_y: number;
        bottom_right_x: number;
        bottom_right_y: number;
        confidence: number;
    };
    items: {
        confidence: number;
        bbox: number[][];
    }[];
    color: string;
}

export interface MaskableImageProps {
    /**
     * The url to set the image source.
     */
    url: string;
    /**
     * This is to set the full size dimension of the image.
     */
    fullSizeDimensions: { height: number; width: number };
    /**
     * This is to set the alternate text of the image.
     */
    alt?: string;
    /**
     * This will enable or disable the selection of the image when check icon is clicked.
     */
    selectable?: boolean;
    /**
     * This will set the selection of the image by default.
     */
    selected?: boolean;
    /**
     * This is an event that would be called when the image is selected.
     */
    onSelect?(selected: boolean): void;
    /**
     * This is to set the default property that would highlight the image.
     */
    highlighted?: boolean;
    /**
     * This is to set the bounding box tags.
     */
    boundingBoxTags?: ImageTagProps[];
    /**
     * This will set the show spinner property bey default.
     */
    showSpinner?: boolean;
    /**
     * If set to true,This will show spinner when the image is still loading.
     */
    showSpinnerOnLoad?: boolean;
    /**
     * This will add the class to the image component.
     */
    className?: string;
    /**
     * This will specify the heightToWidthRatio of the image.
     */
    heightToWidthRatio?: number;
    /**
     * This is to set the inner width of the image.
     */
    innerWidth?: number;
}

// This is the base64 for a 1x1 transparent pixel
const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

/**
 * Maskable Image Component
 *
 * This Component is used to render an image. The image can be selected and highlighted. The showSpinnerOnLoad when set
 * to true will show the loading spinner until the image is loaded.
 */
const MaskableImage: FC<MaskableImageProps> = ({
    className,
    url,
    fullSizeDimensions,
    alt = '',
    selectable = false,
    selected = false,
    onSelect,
    highlighted = false,
    boundingBoxTags,
    showSpinner = false,
    showSpinnerOnLoad = false,
    heightToWidthRatio = 10 / 16,
    innerWidth
}) => {
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const [boundingBoxDimensions, setBoundingBoxDimensions] = useState<{ [key: string]: number }>({});
    const [hovered, setHovered] = useState<boolean>(false);
    const [individuallySelected, setIndividuallySelected] = useState<boolean>(false);
    const [allLoading, setAllLoading] = useState<boolean>(false);
    const [observedElement, setObservedElement] = useState(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const handleMouseEnter = () => {
        if (selectable) {
            setHovered(true);
        }
    };

    const handleMouseLeave = () => {
        if (selectable) {
            setHovered(false);
        }
    };

    const handleIndividualSelection = (event: any) => {
        event.stopPropagation();
        const selectedState = !individuallySelected;

        setIndividuallySelected(selectedState);
        onSelect && onSelect(selectedState);
    };

    const containerRef = useCallback(
        (node: { getBoundingClientRect: () => { height: number; width: number } }) => {
            if (node && boundingBoxTags) {
                const { height, width } = node.getBoundingClientRect();
                setBoundingBoxDimensions({ height, width });
            }

            setAllLoading(showSpinner || (showSpinnerOnLoad && !imageLoaded));
        },
        [imageLoaded, innerWidth, fullSizeDimensions, observedElement]
    );

    useEffect(() => {
        const resizeCallback = (entries: any) => {
            setObservedElement(entries);
        };
        const graphResizeObserver = resizeObserver(resizeCallback);
        graphResizeObserver.observe(imageRef.current as HTMLImageElement);

        return () => {
            graphResizeObserver.disconnect();
        };
    }, []);

    // Show a transparent pixel when loading so the image doesn't appear stale when loading new ones
    useEffect(() => {
        setImageLoaded(false);
        setAllLoading(showSpinner || (showSpinnerOnLoad && !imageLoaded));
    }, [url]);

    useEffect(() => {
        setIndividuallySelected(false);
    }, [selected]);

    // Swap the transparent pixel image for the real one once loaded
    const handleImageLoaded = () => {
        setImageLoaded(true);
    };

    return (
        <ThemeProvider theme={theme}>
            <MaskableImageContainer
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={containerRef}
                className={className}
                heightToWidthRatio={heightToWidthRatio * 100 + '%'}
            >
                {boundingBoxTags && imageLoaded && !allLoading && (
                    <BoundingBoxes
                        activeBBox=''
                        boundingBoxItems={boundingBoxTags}
                        imageWidth={fullSizeDimensions.width}
                        imageHeight={fullSizeDimensions.height}
                        outputWidth={boundingBoxDimensions.width}
                        outputHeight={boundingBoxDimensions.height}
                    />
                )}

                {allLoading && (
                    <LoadingSpinner>
                        <Loading
                            animated
                            height={24}
                            label='Loading'
                            labelPosition='RIGHT'
                            width={24}
                        />
                    </LoadingSpinner>
                )}
                <DisplayImage
                    imageLoaded={imageLoaded}
                    allLoading={allLoading}
                    showSpinnerOnLoad={showSpinnerOnLoad}
                    src={transparentPixel}
                    alt='Loading'
                />
                <MaskedImage
                    imageLoaded={imageLoaded}
                    allLoading={allLoading}
                    showSpinnerOnLoad={showSpinnerOnLoad}
                    onLoad={handleImageLoaded}
                    src={url}
                    alt={alt}
                    ref={imageRef}
                />

                <HighlightedImageStyle highlighted={highlighted} />
                <CheckOutlinedIconStyle
                    onClick={handleIndividualSelection}
                    selectable={selectable}
                    selected={selected}
                    hovered={hovered}
                    individuallySelected={individuallySelected}
                />
            </MaskableImageContainer>
        </ThemeProvider>
    );
};

export default MaskableImage;
