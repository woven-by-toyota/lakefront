import Digraph from './Digraph';
import { drawCatchNode, drawStepNode, getNodeDimensions } from './canvasUtil';
import { WorkFlowType } from './StepFunctionUtil';

export interface NodeDimensions {
    x: number;
    y: number;
    height: number;
    width: number;
    nodeType: WorkFlowType;
    mountingPoints: MountingPoints;
    collisionBox: MountingPoints;
    vertex: number;
    end: boolean;
}

export interface Point {
    x: number;
    y: number;
}

export interface MountingPoints {
    bottom: Point;
    top: Point;
    left: Point;
    right: Point;
}

export const getCatchVertices = (catchArray: any[], graph: Digraph): number[] => {
    const catchNodes = catchArray?.map((e: any) => e.Next) ?? [];

    return catchNodes.map((catchNext: string) => {
        const catchFindFn = (datum: any) => {
            const [dataKey] = Object.keys(datum);
            return dataKey === catchNext;
        };

        return graph.getVertexByData(catchFindFn) ?? -1;
    }).filter((v: number) => v !== -1);
};

// Returns the total pixel width of all vertices in an array, meant for a graph depth
export const getRange = (vertices: number[], xOffset: number, graph: Digraph, ctx: CanvasRenderingContext2D): number => {
    return vertices.reduce((accum, current) => {
        const nodeData = graph.getDataByVertex(current);
        const [rangeKey] = Object.keys(nodeData);
        const { Type } = nodeData[rangeKey];

        const { width: currentWidth } = getNodeDimensions(rangeKey, ctx, nodeData, Type === WorkFlowType.CATCH);

        return accum +
            (Type === WorkFlowType.PARALLEL ? 0 : currentWidth) +
            xOffset;
    }, 0);
};

// Returns the total pixel width of all vertices in an array, but accurately for drawn nodes
export const getDrawnRange = (
    vertices: number[],
    graph: Digraph,
    drawn: Map<number, NodeDimensions>,
    leftMostX?: number
): number => {
    const sorted = vertices.sort((a, b) => a - b);
    const first = drawn.get(sorted[0]);
    const last = drawn.get(vertices[sorted.length - 1]);
    const firstLeft = leftMostX ?? (first ? first.mountingPoints.left.x : 0);
    const lastRight = last ? last.mountingPoints.right.x : 0;

    // If we don't have both, the math will be wrong so we won't count it as a valid range
    return (first || firstLeft) && last ? lastRight - firstLeft : 0;
};

export const getDrawnRangeMiddleX = (
    vertices: number[],
    graph: Digraph,
    drawn: Map<number, NodeDimensions>
): number => {
    const xValues: number[] = vertices.reduce((accum: number[], vertex) => {
        const xVal = drawn.get(vertex)?.x;
        if (typeof(xVal) === 'number') {
            accum.push(xVal);
        }

        return accum;
    }, []);

    const left = Math.min(...xValues);
    const right = Math.max(...xValues);

    return (left + right) / 2;
};

export const generateMountingPoints = (
    node: NodeDimensions,
    topOffset: number,
    bottomOffset: number,
    leftOffset = 0,
    rightOffset = 0
): MountingPoints => {
    const bottom: Point = {
        x: node.x,
        y: node.y + (node.height / 2) + (bottomOffset / 2)
    };
    const top: Point = {
        x: node.x,
        y: node.y - (node.height / 2) - (topOffset / 2)
    };
    const left: Point = {
        x: node.x - (node.width / 2) - leftOffset,
        y: node.y
    };
    const right: Point = {
        x: node.x + (node.width / 2) + rightOffset,
        y: node.y
    };

    if (node.nodeType === WorkFlowType.PARALLEL) {
        bottom.x += node.width / 2;
        bottom.y += node.height / 2;
        top.x += node.width / 2;
        top.y += (node.height / 2) + (topOffset / 2);
        left.x += node.width / 2;
        left.y += node.height / 2;
        right.x += node.width / 2;
        right.y += node.height / 2;
    }

    return {
        bottom,
        top,
        left,
        right
    };
};

export const adjustMatrixForArrows = (matrix: number[][], graph: Digraph, drawn: Map<number, NodeDimensions>) => {
    // Remove parallel and map nodes from paths
    const adjustedMatrix: number[][] = [];
    matrix.forEach((path: number[]) => {
        const adjustedPath = path.filter((vertex: number) => {
            const drawnVertex = drawn.get(vertex);
            return drawnVertex &&
                drawnVertex.nodeType !== WorkFlowType.PARALLEL &&
                drawnVertex.nodeType !== WorkFlowType.MAP;
        });
        adjustedMatrix.push(adjustedPath);
    });

    return adjustedMatrix;
};

export const findNearestArrowNode = (
    path: number[],
    vertex: number,
    index: number,
    drawn: Map<number, NodeDimensions>,
    isStart: boolean
): NodeDimensions | undefined => {
    const node = drawn.get(vertex);
    const nextNode = drawn.get(path[index + 1]);

    if (node && nextNode) {
        return isStart ? node : nextNode;
    }
};

// Returns a matrix with all Parallel children shifted up a level so when used in drawing
// the depth of the Parallel nodes are correctly portrayed since the Parallel node itself
// is just a box around what it points to
export const adjustDepthMatrix = (matrix: number[][], graph: Digraph): number[][] => {
    const workingMatrix = [...matrix];
    const endIndex = workingMatrix.length - 1;
    const [endVertex] = workingMatrix[endIndex];
    const mapEnds: number[] = [];
    let adjustedMatrix: number[][] = [];
    let removalArray: number[] = [];

    for (let i = 0; i < workingMatrix.length; i++) {
        const vertices: number[] = workingMatrix[i];

        const adjusted = vertices.reduce((accum: number[], vertex: number) => {
            const node = graph.getDataByVertex(vertex);
            const [key] = Object.keys(node);
            const { Catch, Next, Type } = node[key];

            if (Type === WorkFlowType.PARALLEL || Type === WorkFlowType.MAP) {
                const nextVertexFindFn = (datum: any) => {
                    const [dataKey] = Object.keys(datum);
                    return dataKey === Next;
                };
                const nextVertex: number | undefined = graph.getVertexByData(nextVertexFindFn);

                // Keep track of any Map "Next" vertices to swap if they're out of order later
                if (Type === WorkFlowType.MAP) {
                    mapEnds.push(nextVertex ?? -1);
                }

                const outDegree = graph.getOutdegree(vertex).outVertices.filter(
                    v => v !== endVertex
                );

                const catchVertices = getCatchVertices(Catch, graph);

                // Add any "Catch" vertices after this depth so they don't appear inside any boxes
                if (catchVertices.length > 0 && typeof(nextVertex) === 'number') {
                    const nextDepthIndex = workingMatrix.findIndex(depth => depth.includes(nextVertex));
                    workingMatrix[nextDepthIndex].push(...catchVertices);
                }

                // Remove any "Catch" vertices that were moved to the next depth as well as the "Next" vertex
                accum = accum.concat(outDegree).filter(v => v !== nextVertex && !catchVertices.includes(v));

                // When this row doesn't have any overlap with the outdegrees, add them to the removalArray
                if (!vertices.some(v => outDegree.includes(v))) {
                    removalArray = removalArray.concat(outDegree).filter(v => v !== nextVertex);
                }
            }

            // Add any vertices not in the removalArray to the accumulator
            if (!removalArray.includes(vertex)) {
                return accum.concat(vertex);
            } else {
                return accum;
            }
        }, []);

        // Add this row to the new Matrix with only unique vertices
        adjustedMatrix.push(Array.from(new Set(adjusted)));
    }

    // We don't want any rows without values after moving vertices around
    adjustedMatrix = adjustedMatrix.filter(depth => depth.length > 0);

    // This function is called recursively when there have been Parallel and Map nodes to make sure
    // there aren't nested nodes of the same type to also shift up
    if (removalArray.length > 0) {
        removalArray = [];
        adjustedMatrix = adjustDepthMatrix(adjustedMatrix, graph);
    }

    const flatMatrix = adjustedMatrix.flat();

    // Map nodes can sometimes have their depth wrong for the Next node and need to be swapped so a node isn't drawn over
    flatMatrix.forEach((v, index) => {
        const next = flatMatrix[index + 1];

        if (mapEnds.includes(v) && v > next) {
            const largerDepth = adjustedMatrix.findIndex(depth => depth.includes(v));
            const largerIndex = adjustedMatrix[largerDepth].indexOf(v);
            const smallerDepth = adjustedMatrix.findIndex(depth => depth.includes(next));
            const smallerIndex = adjustedMatrix[smallerDepth].indexOf(next);

            adjustedMatrix[largerDepth][largerIndex] = next;
            adjustedMatrix[smallerDepth][smallerIndex] = v;
        }
    });

    return adjustedMatrix;
};

// Finds the Vertex number of a vertex's Next field's node
export const getNextVertex = (vertex: number | undefined, graph: Digraph): number => {
    if (typeof vertex === 'number') {
        const mapData = graph.getDataByVertex(vertex) || {};
        const [node] = Object.keys(mapData);
        const { Next = null, End = false } = node ? mapData[node] : {};
        const defaultVertex = End ? graph.getVerticesCount() - 1 : -1;

        const nextVertexFindFn = (datum: any) => {
            const [dataKey] = Object.keys(datum);
            return dataKey === Next;
        };
        return graph.getVertexByData(nextVertexFindFn) ?? defaultVertex;
    }

    return -1;
};

// Recurses from a vertex through its outdegrees to find a drawn node
export const getNearestDrawn = (vertex: number, graph: Digraph, drawn: Map<number, NodeDimensions>): number => {
    const drawnNode = drawn.get(vertex);

    if (drawnNode) {
        return vertex;
    } else {
        const [outDegree] = graph.getOutdegree(vertex).outVertices;
        return typeof(outDegree) !== 'undefined' ? getNearestDrawn(outDegree, graph, drawn) : -1;
    }
};

export const getGroupIndex = (groups: number[][], vertex: number): number => {
    return groups.reduce((group: number, current: number[], index: number) => {
        return current.includes(vertex) ? index : group;
    }, -1);
};

// This function is meant to return a matrix of the drawable graph but with vertices
// at each depth grouped such that all related Parallel vertices are in an array together
export const getGroupsAtDepth = (depthArray: number[], graph: Digraph): number[][] => {
    const groups: number[][] = [];
    const toFilter: number[] = [];

    // Create group arrays for each Parallel type at this depth
    depthArray.forEach((vertex: number) => {
        const group: number[] = [];
        const node = graph.getDataByVertex(vertex);
        const [key] = Object.keys(node);
        const { Type } = node[key];

        if (Type === WorkFlowType.PARALLEL) {
            const nextVertex = getNextVertex(vertex, graph);
            const outDegree = graph.getOutdegree(vertex).outVertices
                .filter(v => v !== nextVertex);
            group.push(...outDegree);
            groups.push(group);
            toFilter.push(vertex);
        }
    });

    const flattenedGroups: number[] = ([] as number[]).concat(...groups);
    const notInGroups: number[] = depthArray.filter(v => !toFilter.includes(v) && !flattenedGroups.includes(v));

    if (notInGroups.length > 0) {
        groups.push(notInGroups);
    }

    return groups;
};

export const isSameLevelType = (workflowType: WorkFlowType) => {
    return workflowType === WorkFlowType.PARALLEL || workflowType === WorkFlowType.MAP;
};

// Sometimes a node needs to be redrawn so it is placed on top of things, such as a Map node's box
// since Map nodes draw after everything else is done and will cover things up
export const redrawNode = (
    vertex: number,
    ctx: CanvasRenderingContext2D,
    drawn: Map<number, NodeDimensions>,
    graph: Digraph,
    highlighted: number[],
    theme?: any
) => {
    const dimensions = drawn.get(vertex);
    const node = graph.getDataByVertex(vertex);

    if (node) {
        const [key] = Object.keys(node);
        const { Type } = node[key];
        const { x = 0, y = 0 } = dimensions || {};
        const highlight = highlighted.includes(vertex);

        switch (Type) {
            case WorkFlowType.CHOICE:
                drawStepNode({ ctx, x, y, text: key, highlight, theme });
                break;
            case WorkFlowType.TASK:
                drawStepNode({ ctx, x, y, text: key, highlight, theme });
                break;
            case WorkFlowType.CATCH:
                drawCatchNode({ ctx, x, y, text: key, highlight, node, theme });
                break;
            case WorkFlowType.PARALLEL:
                break;
            case WorkFlowType.MAP:
                break;
            case WorkFlowType.START:
                break;
            case WorkFlowType.END:
                break;
            default:
                drawStepNode({ ctx, x, y, text: key, highlight, theme });
                break;
        }
    }
};

// All nodes inside a Parallel are an outdegree from that node
export const isInParallel = (vertex: number, graph: Digraph): boolean => {
    const [node] = graph.getIndegree(vertex);

    if (node) {
        const parent = graph.getDataByVertex(node);
        const [key] = Object.keys(parent);
        const { Type } = parent[key];
        const parentVertexFindFn = (datum: any) => {
            const [dataKey] = Object.keys(datum);
            return dataKey === key;
        };
        const parentVertex = graph.getVertexByData(parentVertexFindFn);
        const nextVertex = getNextVertex(parentVertex, graph);

        return Type === WorkFlowType.PARALLEL && vertex !== nextVertex;
    } else {
        return false;
    }
};
