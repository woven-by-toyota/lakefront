import 'jest-canvas-mock';
import { drawSingleBox, getImageOffsetRatio } from '../boundingBoxesUtil';
import { boundingBoxesData } from './boundingBoxes.data';

describe('drawSingleBox', () => {
    const ctx = document.createElement('canvas').getContext('2d');

    it('draws box correctly', () => {
        const [firstDuckBox] = boundingBoxesData;

        drawSingleBox(ctx, firstDuckBox);

        const calls = ctx.__getDrawCalls();

        expect(calls).toHaveLength(2);

        expect(calls[0].props).toMatchObject({
            x: firstDuckBox.items[0].bbox[0][0],
            y: firstDuckBox.items[0].bbox[0][1],
            height: firstDuckBox.items[0].bbox[1][1] - firstDuckBox.items[0].bbox[0][1]
        });

        expect(calls[1].props).toMatchObject({
            text: firstDuckBox.name,
            x: firstDuckBox.items[0].bbox[0][0],
            y: firstDuckBox.items[0].bbox[0][1] - 10
        });
    });
});

describe('getImageOffsetRatio', () => {
    const dimensions = { width: 1210, height: 418 };

    it('returns offset for a regular image', () => {
        const imgDimensions = { width: 1280, height: 768 };

        const offsetRatio = getImageOffsetRatio(
            imgDimensions.width,
            imgDimensions.height,
            dimensions.width,
            dimensions.height
        );

        // output sizes should not exceed container dimensions
        expect(offsetRatio.ratio * imgDimensions.width).not.toBeGreaterThan(dimensions.width);
        expect(offsetRatio.ratio * imgDimensions.height).not.toBeGreaterThan(dimensions.height);
    });

    it('returns offset for a wide image', () => {
        const imgDimensions = { width: 1920, height: 640 };

        const offsetRatio = getImageOffsetRatio(
            imgDimensions.width,
            imgDimensions.height,
            dimensions.width,
            dimensions.height
        );

        // output sizes should not exceed container dimensions
        expect(offsetRatio.ratio * imgDimensions.width).not.toBeGreaterThan(dimensions.width);
        expect(offsetRatio.ratio * imgDimensions.height).not.toBeGreaterThan(dimensions.height);
    });

    it('returns (non-adjusted) offset when image is the same size as container', () => {
        const imgDimensions = { width: 1210, height: 418 };

        const offsetRatio = getImageOffsetRatio(
            imgDimensions.width,
            imgDimensions.height,
            dimensions.width,
            dimensions.height
        );

        // test for default return
        expect(offsetRatio.ratio).toBe(1);
        expect(offsetRatio.left).toBe(0);
        expect(offsetRatio.top).toBe(0);
    });

    it('returns default values when dimensions are not set', () => {
        const imgDimensions = { width: 1210, height: 418 };

        const offsetRatio = getImageOffsetRatio(imgDimensions.width, imgDimensions.height, 0, 0);

        // test for default return
        expect(offsetRatio.ratio).toBe(1);
        expect(offsetRatio.left).toBe(0);
        expect(offsetRatio.top).toBe(0);
    });
});
