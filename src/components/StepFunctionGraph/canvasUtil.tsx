import { NodeDimensions } from './GraphUtil';
import { Y_OFFSET } from './GraphRenderer';

export const NODE_HEIGHT = 38;
const TEXT_WIDTH_MULTIPLIER = 12;
const DEBUG_RED_COLOR = '#ff0000';
const CATCH_RED_COLOR = '#cc0000';
const HIGHLIGHT_BACKGROUND = '#d9e9fd';
const HIGHLIGHT_COLOR = '#378fee';
const HIGHLIGHTED_WIDTH = 2;
const NORMAL_WIDTH = 1;

// Helper functions to get theme-aware colors
const getOutlineStrokeColor = (theme: any) => theme?.foregrounds?.primary || '#16191f';
const getWhiteColor = (theme: any) => theme?.backgrounds?.primary || '#ffffff';
const getTerminalColor = (theme: any) => theme?.backgrounds?.warning || '#ffda75';

interface BaseDrawArgs {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
}

interface DimensionDrawArgs extends BaseDrawArgs {
    width: number;
    height: number;
}

interface FunctionalDrawArgs extends BaseDrawArgs {
    text: string;
    highlight?: boolean;
    theme?: any;
}

type Point = { x: number, y: number };

export const getErrorEqualsText = (key: string, node: any) => {
    const { ErrorEquals } = node[key];
    const errorEquals = ErrorEquals.toString().replace(/,/g, ', ');

    return errorEquals ? `Catch: ErrorEquals: ${errorEquals}` : '';
};

export const getNodeDimensions = (text: string, ctx?: CanvasRenderingContext2D, node?: any, isCatch = false): { height: number; width: number } => {
    const textWidth = text.length * TEXT_WIDTH_MULTIPLIER;
    const catchTextWidth = isCatch ? Math.max(ctx?.measureText(getErrorEqualsText(text, node)).width ?? 0, textWidth) : -1;
    const width = isCatch ? catchTextWidth : textWidth;

    return { height: NODE_HEIGHT, width };
};

export const drawStepNode = (
    { ctx, x, y, text, highlight = false, theme }: FunctionalDrawArgs
) => {
    const TEXT_Y_OFFSET = 22;

    // set the dimensions of the rectangle
    const rectWidth = text.length * TEXT_WIDTH_MULTIPLIER;
    const rectXPos = x - (rectWidth / 2);
    const rectYPos = y - TEXT_Y_OFFSET;

    // draw the white or blue rectangle
    ctx.fillStyle = highlight ? HIGHLIGHT_BACKGROUND : getWhiteColor(theme);
    ctx.fillRect(rectXPos, rectYPos, rectWidth, NODE_HEIGHT - 4);

    // draw the outline of the white rectangle
    ctx.setLineDash([5, 2]);
    ctx.strokeStyle = highlight ? HIGHLIGHT_COLOR : getOutlineStrokeColor(theme);
    ctx.lineWidth = highlight ? HIGHLIGHTED_WIDTH : NORMAL_WIDTH;
    ctx.strokeRect(rectXPos, rectYPos, rectWidth, NODE_HEIGHT - 4);

    // draw the text
    ctx.fillStyle = highlight ? HIGHLIGHT_COLOR : getOutlineStrokeColor(theme);
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
};

export const drawCatchNode = (
    { ctx, x, y, text, highlight = false, node, theme }: FunctionalDrawArgs & { node: any }
) => {
    const TEXT_Y_OFFSET = 33;
    const SUBTEXT_Y_OFFSET = 17;

    const errorEqualText = getErrorEqualsText(text, node);

    const textWidth = text.length * (TEXT_WIDTH_MULTIPLIER);
    const errorTextWidth = ctx.measureText(errorEqualText).width;

    // set the dimensions of the rectangle
    const rectWidth = Math.max(textWidth, errorTextWidth);
    const rectXPos = x - (rectWidth / 2);
    const rectYPos = y - TEXT_Y_OFFSET;

    // draw the white or blue rectangle
    ctx.fillStyle = highlight ? HIGHLIGHT_BACKGROUND : getWhiteColor(theme);
    ctx.fillRect(rectXPos, rectYPos, rectWidth, NODE_HEIGHT * 1.5);

    // draw the outline of the white rectangle
    ctx.setLineDash([5, 2]);
    ctx.strokeStyle = CATCH_RED_COLOR;
    ctx.lineWidth = highlight ? HIGHLIGHTED_WIDTH : NORMAL_WIDTH;
    ctx.strokeRect(rectXPos, rectYPos, rectWidth, NODE_HEIGHT * 1.5);

    // draw the text
    ctx.fillStyle = highlight ? HIGHLIGHT_COLOR : getOutlineStrokeColor(theme);
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);

    // draw error text
    const textXPos = x + (rectWidth / 2) - 10;

    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(errorEqualText, textXPos, y - SUBTEXT_Y_OFFSET);
};

export const drawParallel = (
    { ctx, x, y, width, height, highlight = false, theme }: Omit<FunctionalDrawArgs & DimensionDrawArgs, 'text'>
) => {
    const LINE_WIDTH = 2;
    // set the dimensions of the rectangle
    const rectWidth = width;
    const rectXPos = x;
    const rectYPos = y;

    // draw the outline of the white rectangle
    ctx.setLineDash([5, LINE_WIDTH]);
    ctx.strokeStyle = highlight ? HIGHLIGHT_COLOR : getOutlineStrokeColor(theme);
    ctx.lineWidth = highlight ? HIGHLIGHTED_WIDTH : NORMAL_WIDTH;
    ctx.strokeRect(rectXPos, rectYPos, rectWidth, height);
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = highlight ? HIGHLIGHT_BACKGROUND : getWhiteColor(theme);
    ctx.fillRect(rectXPos + LINE_WIDTH, rectYPos, rectWidth - (LINE_WIDTH * 2), height);
    ctx.globalCompositeOperation = 'source-over';
};

export const drawMap = (
    { ctx, x, y, width, height, highlight = false, theme }: Omit<FunctionalDrawArgs & DimensionDrawArgs, 'text'>
) => {
    // set the dimensions of the rectangle
    const rectWidth = width;
    const rectXPos = x - (rectWidth / 2);
    const rectYPos = y;
    const offset = 5;

    // draw the outline of the white rectangle
    ctx.setLineDash([5, 2]);
    ctx.strokeStyle = highlight ? HIGHLIGHT_COLOR : getOutlineStrokeColor(theme);
    ctx.fillStyle = highlight ? HIGHLIGHT_BACKGROUND : getWhiteColor(theme);
    ctx.lineWidth = highlight ? HIGHLIGHTED_WIDTH : NORMAL_WIDTH;

    ctx.strokeRect(rectXPos - (offset * 2), rectYPos - (offset * 2), rectWidth, height);
    ctx.fillRect(rectXPos - (offset * 2), rectYPos - (offset * 2), rectWidth, height);
    ctx.strokeRect(rectXPos - offset, rectYPos - offset, rectWidth, height);
    ctx.fillRect(rectXPos - offset, rectYPos - offset, rectWidth, height);

    ctx.strokeRect(rectXPos, rectYPos, rectWidth, height);
    ctx.fillRect(rectXPos, rectYPos, rectWidth, height);
};

export const drawTerminalNode = (
    { ctx, x, y, text, theme }: FunctionalDrawArgs
) => {
    const RADIUS = 26;
    const TEXT_Y_OFFSET = 4;

    // draw the circle
    ctx.fillStyle = getTerminalColor(theme);
    ctx.beginPath();
    ctx.arc(x, y, RADIUS, 0, 360, false);
    ctx.fill();

    // draw the text
    const yPos = y + TEXT_Y_OFFSET;
    ctx.fillStyle = getOutlineStrokeColor(theme);
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, yPos);
};

export const drawDebug = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string
) => {
    const TEXT_Y_OFFSET = 4;

    // set the dimensions of the rectangle
    const rectWidth = text.length * TEXT_WIDTH_MULTIPLIER;
    const rectXPos = x + (rectWidth / 2);

    // draw the outline of the white rectangle
    ctx.lineWidth = 1;
    ctx.strokeStyle = DEBUG_RED_COLOR;
    ctx.strokeRect(x, y, width, height);

    // draw the text
    const yPos = (y + TEXT_Y_OFFSET) + (height / 2);
    ctx.fillStyle = DEBUG_RED_COLOR;
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, rectXPos, yPos);
};

// Returns the lowest node between a node and another node if any exist
const getLowestBarrierPoint = (from: Point, to: Point, drawn: Map<number, NodeDimensions>): NodeDimensions | null => {
    let lowest: NodeDimensions | null = null;
    const invert = to.x > from.x;

    drawn.forEach(nodeDimensions => {
        const { collisionBox } = nodeDimensions;
        const { top, right, left, bottom } = collisionBox;

        // Check if a point is inside a rectangle given the surrounding to and from points
        // for both left of the target and right of the target
        if (
            (invert && right.x < to.x && right.x > from.x && right.y < to.y && right.y > from.y) ||
            (invert && top.x < to.x && top.x > from.x && top.y < to.y && top.y > from.y) ||
            (invert && left.x < to.x && left.x > from.x && left.y < to.y && left.y > from.y) ||
            (!invert && right.x > to.x && right.x < from.x && right.y < to.y && right.y > from.y) ||
            (!invert && top.x > to.x && top.x < from.x && top.y < to.y && top.y > from.y) ||
            (!invert && left.x > to.x && left.x < from.x && left.y < to.y && left.y > from.y)
        ) {
            if (!lowest || bottom.y > lowest?.collisionBox?.bottom?.y) {
                lowest = nodeDimensions;
            }
        }
    });

    return lowest;
};

// Gives a single number representing the distance from one point to another
const calculateDistance = (from: Point, to: Point): number => {
    return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
};

export const drawArrow = (
    ctx: CanvasRenderingContext2D,
    drawn: Map<number, NodeDimensions>,
    from: { x: any; y: any; },
    to: { y: any; x: any; },
    radius: number,
    skipArrowHead = false,
    offsetStart = false,
    endArrow = false,
    endOffset = 0,
    theme?: any
) => {
    to.y += endOffset;

    // This moves the control points in the bezier curve
    const bezierCurveControlOffset = 15;
    const xCenter = to.x;
    const yCenter = to.y - (radius / 2);
    const fromOffset = offsetStart ? radius : 0;

    let angle;
    let x;
    let y;

    ctx.lineWidth = 1;
    ctx.fillStyle = getOutlineStrokeColor(theme);
    ctx.strokeStyle = getOutlineStrokeColor(theme);

    // Sets line to be solid
    ctx.setLineDash([]);
    ctx.beginPath();

    // Starts the line at the position of the bottom mounting point of one node
    ctx.moveTo(from.x, from.y + fromOffset);

    const cYTo = from.x === to.x ? to.y : to.y + bezierCurveControlOffset + (to.y - from.y) / 3;

    const controlY1 = endArrow ?
        cYTo :
        from.y + (bezierCurveControlOffset * 2);
    const controlY2 = endArrow ? to.y - bezierCurveControlOffset : from.y + bezierCurveControlOffset;

    // Try finding any nodes between where the arrow needs to draw
    const barrierFrom: Point = { x: from.x, y: to.y - (NODE_HEIGHT + Y_OFFSET * 3) };
    const lowestBarrier = getLowestBarrierPoint(barrierFrom, to, drawn);
    const barrierConditions = (Math.abs(to.y - from.y) > (NODE_HEIGHT + Y_OFFSET) * 5);
    let toX = 0;

    // If there are any nodes in the way, the arrow needs to continue to the side of the barrier
    // so it can continue from a clear point
    if (lowestBarrier !== null && barrierConditions) {
        const { collisionBox } = lowestBarrier;
        const leftDistance = calculateDistance(collisionBox.left, from);
        const rightDistance = calculateDistance(collisionBox.right, from);
        const invert = leftDistance > rightDistance ? 1 : -1;
        const dX = invert * (to.x - from.x) / 10;
        const collisionX = leftDistance > rightDistance ? collisionBox.right.x : collisionBox.left.x;
        const collisionY = invert === 1 ? collisionBox.left.y : collisionBox.right.y;
        toX = invert === 1 && to.x < from.x ? collisionX - (dX / 2) : collisionX + (dX / 2);

        ctx.bezierCurveTo(
            from.x,
            from.y + (to.y - from.y) / 2,
            collisionX + dX,
            from.y + bezierCurveControlOffset,
            toX,
            collisionY);
    }

    // Ends the line at the top mounting point of the next node.
    // A bezier curve allows for two points with which to alter the curve,
    // seen in the first two sets of parameters. The last is the destination point.
    ctx.bezierCurveTo(
        lowestBarrier !== null && barrierConditions ? toX : from.x,
        lowestBarrier !== null && barrierConditions ? to.y : controlY1,
        to.x,
        controlY2,
        to.x,
        yCenter
    );

    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();

    if (!skipArrowHead) {
        // Angle of the arrows is basically 1, which is just 90 degrees to radians so they always point down.
        // The previous math here was for calculating the angle based on direction, which isn't applicable anymore
        // and looked like this: Math.atan2(to.y - from.y, to.x - from.x)
        angle = 90 * (Math.PI / 180);

        // We calculate the points around the center as if it were in a circle
        x = (radius * Math.cos(angle)) + xCenter;
        y = (radius * Math.sin(angle)) + yCenter;

        // Move to the first point in the arrow head
        ctx.moveTo(x, y);

        // The new angle is tau, or 360 degrees divided by the number of points
        angle += (2 * Math.PI) / 3;
        x = (radius * Math.cos(angle)) + xCenter;
        y = (radius * Math.sin(angle)) + yCenter;

        // Connect the first arrow head point to the second arrow head point
        ctx.lineTo(x, y);

        angle += (2 * Math.PI) / 3;
        x = (radius * Math.cos(angle)) + xCenter;
        y = (radius * Math.sin(angle)) + yCenter;

        // Connect the second arrow head point to the final arrow head point
        ctx.lineTo(x, y);
    }

    ctx.closePath();

    // Fill the arrow head points we placed
    ctx.fill();

    // Draw the arrow body
    ctx.stroke();
};

export const collides = (rects: NodeDimensions[], x: number, y: number, ctx: CanvasRenderingContext2D) => {
    const matrix = ctx.getTransform();
    const invertedMatrix = matrix.invertSelf();

    // Recalculate the points based on the current translation of the context's matrix
    const transformedX = x * invertedMatrix.a + y * invertedMatrix.c + invertedMatrix.e;
    const transformedY = x * invertedMatrix.b + y * invertedMatrix.d + invertedMatrix.f;

    const collisions: NodeDimensions[] = [];
    for (let i = 0, len = rects.length; i < len; i++) {
        const rect = rects[i];
        const { collisionBox } = rect;

        if (collisionBox) {
            const left = collisionBox.left.x;
            const right = collisionBox.right.x;
            const top = collisionBox.top.y;
            const bottom = collisionBox.bottom.y;

            if (
                right >= transformedX &&
                left <= transformedX &&
                bottom >= transformedY &&
                top <= transformedY
            ) {
                collisions.push(rects[i]);
            }
        }
    }

    const highestDrawOrder = collisions.reduce((accum: NodeDimensions | null, current) => {
        if (!accum || current.vertex > accum.vertex) {
            accum = current;
        }

        return accum;
    }, null);

    return collisions.length > 0 ? highestDrawOrder : null;
};
