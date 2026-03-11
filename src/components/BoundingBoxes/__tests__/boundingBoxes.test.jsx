import 'jest-canvas-mock';
import { renderWithTheme as render } from 'src/lib/testing';
import { boundingBoxesData } from './boundingBoxes.data';
import BoundingBoxes from '../BoundingBoxes';

const BOUNDING_BOXES_PROPS = {
    activeBBox: '',
    boundingBoxItems: boundingBoxesData,
    imageHeight: 1920,
    imageWidth: 1280,
    outputHeight: 1920,
    outputWidth: 1280
};

describe('BoundingBoxes', () => {
    it('draws the correct amount of bounding boxes', () => {
        const { container } = render(<BoundingBoxes {...BOUNDING_BOXES_PROPS} />);

        const ctx = container.querySelector('canvas').getContext('2d');

        const calls = ctx.__getDrawCalls();

        expect(calls.filter(({ type }) => type === 'strokeRect')).toHaveLength(4);
    });

    it('draws a single box when valid activeBBox is specified', () => {
        const { container } = render(
            <BoundingBoxes {...BOUNDING_BOXES_PROPS} activeBBox={boundingBoxesData[0].name} />
        );

        const ctx = container.querySelector('canvas').getContext('2d');

        const calls = ctx.__getDrawCalls();

        expect(calls.filter(({ type }) => type === 'strokeRect')).toHaveLength(1);
    });
});
