import { type FC, useEffect, useMemo, useRef } from 'react';

import { BoundingBoxesContainer } from './boundingBoxesStyles';
import { type BoundingBoxItemProp, drawSingleBox, getImageOffsetRatio } from './boundingBoxesUtil';

export interface BoundingBoxesProps {
    /**
     * The name of the currently active item. When specified, only
     * bounding boxes included in the first item with the matching name will be drawn.
     */
    activeBBox: string;
    /**
     * A list of bounding box items to draw including the name of the item,
     * the color of the boxes, and a list of bounding boxes to draw.
     */
    boundingBoxItems: BoundingBoxItemProp[];
    /**
     * The classes to pass to the bounding boxes container.
     */
    className?: string;
    /**
     * The width of the image.
     */
    imageWidth: number;
    /**
     * The height of the image.
     */
    imageHeight: number;
    /**
     * The desired width to display the image. This will likely be observed in the
     * parent component, changing often to allow the image to resize.
     */
    outputWidth: number;
    /**
     * The desired height to display the image. This will likely be observed in the
     * parent component, changing often to allow the image to resize.
     */
    outputHeight: number;
}

/**
 * BoundingBoxes Component
 *
 * The BoundingBoxes component is intended to draw boxes on top of specified areas
 * of an image. This can be used to direct attention to key aspects or items within an image
 * while also maintaining the proper aspect ratio and location offset(s) as the image is resized.
 */
const BoundingBoxes: FC<BoundingBoxesProps> = ({
    activeBBox,
    boundingBoxItems,
    className,
    imageWidth,
    imageHeight,
    outputWidth,
    outputHeight
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawBoundingBoxes = () => {
        const currentCanvas = canvasRef.current;
        if (!currentCanvas) {
            return;
        }

        const ctx = currentCanvas.getContext('2d');

        if (ctx) {
            // clear drawing canvas first
            ctx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);

            if (boundingBoxItems.length > 0) {
                if (activeBBox === '') {
                    // draw all bbox items
                    boundingBoxItems.forEach((bboxItem) => {
                        drawSingleBox(ctx, bboxItem);
                    });
                } else {
                    // just draw active bbox item
                    const activeItem = boundingBoxItems.find((item) => item.name === activeBBox);
                    if (activeItem) {
                        drawSingleBox(ctx, activeItem);
                    }
                }
            }
        }
    };

    useEffect(() => {
        drawBoundingBoxes();
    }, [activeBBox, boundingBoxItems]);

    const offsetRatio = useMemo(
        () => getImageOffsetRatio(imageWidth, imageHeight, outputWidth, outputHeight),
        [imageWidth, imageHeight, outputWidth, outputHeight]
    );

    return (
        <BoundingBoxesContainer
            style={{
                left: offsetRatio.left,
                top: offsetRatio.top,
                transform: `scale(${offsetRatio.ratio})`,
                WebkitTransformOrigin: 'top left'
            }}
            className={className}
            width={imageWidth}
            height={imageHeight}
            ref={canvasRef}
        />
    );
};

export default BoundingBoxes;
