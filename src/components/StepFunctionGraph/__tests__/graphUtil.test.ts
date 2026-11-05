import 'jest-canvas-mock';
import * as CanvasUtilModule from '../canvasUtil';
import { getNodeDimensions } from '../canvasUtil';
import { X_OFFSET } from '../GraphRenderer';
import {
    adjustDepthMatrix,
    adjustMatrixForArrows,
    findNearestArrowNode,
    generateMountingPoints,
    getCatchVertices,
    getDrawnRange,
    getDrawnRangeMiddleX,
    getGroupIndex,
    getGroupsAtDepth,
    getNearestDrawn,
    getNextVertex,
    getRange,
    isInParallel,
    isSameLevelType,
    type MountingPoints,
    type NodeDimensions,
    redrawNode
} from '../GraphUtil';
import { WorkFlowType } from '../StepFunctionUtil';
import { JSONBuilderUtil } from '../util/JSONBuilder.util';
import { graphContext } from './util/graphTestUtils.util';

describe('graphUtil', () => {
    let ctx: CanvasRenderingContext2D | null;

    beforeEach(() => {
        ctx = document.createElement('canvas').getContext('2d');
    });

    describe('adjustDepthMatrix', () => {
        it('should shift a Parallel node up one depth level', () => {
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'ParallelNode')
                .addParallel(
                    'ParallelNode',
                    [new JSONBuilderUtil().addTask('P1').getJson(), new JSONBuilderUtil().addTask('P2').getJson()],
                    'EndNode'
                )
                .addTask('EndNode', undefined, true)
                .getJson();

            const { graph, verticesAtDepth } = graphContext(json);
            const adjusted = adjustDepthMatrix(verticesAtDepth, graph);
            const expected: number[][] = [
                [0], // Start
                [1], // StartNode
                [3, 4, 2], // P1, P2, ParallelNode
                [5], // EndNode
                [6] // End
            ];

            expect(adjusted).toStrictEqual(expected);
        });

        it('should shift a Map node up one depth level', () => {
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'MapNode')
                .addMap('MapNode', new JSONBuilderUtil().addTask('M1').getJson(), 'EndNode')
                .addTask('EndNode', undefined, true)
                .getJson();

            const { graph, verticesAtDepth } = graphContext(json);
            const adjusted = adjustDepthMatrix(verticesAtDepth, graph);
            const expected: number[][] = [
                [0], // Start
                [1], // StartNode
                [3, 2], // M1, MapNode
                [4], // EndNode
                [5] // End
            ];

            expect(adjusted).toStrictEqual(expected);
        });

        it('should adjust Catch vertices after a Parallel', () => {
            const catchArray = [
                {
                    ErrorEquals: ['States.ALL'],
                    Next: 'EndNode'
                }
            ];

            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'ParallelNode')
                .addParallel(
                    'ParallelNode',
                    [new JSONBuilderUtil().addTask('P1').getJson(), new JSONBuilderUtil().addTask('P2').getJson()],
                    'EndNode'
                )
                .editNode('ParallelNode', { Catch: catchArray })
                .addTask('EndNode', undefined, true)
                .getJson();

            const { graph, verticesAtDepth } = graphContext(json);
            const adjusted = adjustDepthMatrix(verticesAtDepth, graph);
            const expected: number[][] = [
                [0], // Start
                [1], // StartNode
                [3, 4, 2], // P1, P2, ParallelNode
                [5], // EndNode
                [6] // End
            ];

            expect(adjusted).toStrictEqual(expected);
        });

        it('should swap out of order vertices after a Map node', () => {
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'MapNode')
                .addMap('MapNode', new JSONBuilderUtil().addTask('M1', 'M2').addTask('M2').getJson(), 'EndNode')
                .addTask('EndNode', undefined, true)
                .getJson();

            const { graph, verticesAtDepth } = graphContext(json);
            const adjusted = adjustDepthMatrix(verticesAtDepth, graph);
            const expected: number[][] = [
                [0], // Start
                [1], // StartNode
                [3, 2], // M1, MapNode
                [4], // M2
                [5], // EndNode
                [6] // End
            ];

            expect(adjusted).toStrictEqual(expected);
        });
    });

    describe('adjustMatrixForArrows', () => {
        const json = new JSONBuilderUtil()
            .addTask('StartNode', 'ParallelNode')
            .addParallel(
                'ParallelNode',
                [new JSONBuilderUtil().addTask('P1').getJson(), new JSONBuilderUtil().addTask('P2').getJson()],
                'MapNode'
            )
            .addMap('MapNode', new JSONBuilderUtil().addTask('M1').getJson(), 'ChoiceNode')
            .addChoice('ChoiceNode', [JSONBuilderUtil.getChoiceForAdd('EndNode')])
            .addSuccess('EndNode', undefined, true)
            .getJson();

        it('should return an empty matrix when given an empty matrix', () => {
            const { drawn, graph } = graphContext(json);

            const matrix: number[][] = [];
            const expected: number[][] = [];

            expect(adjustMatrixForArrows(matrix, graph, drawn)).toStrictEqual(expected);
        });

        it('should remove Parallel and Map nodes from the matrix', () => {
            const { drawn, graph } = graphContext(json);
            drawn.set(2, { nodeType: WorkFlowType.PARALLEL } as NodeDimensions);
            drawn.set(5, { nodeType: WorkFlowType.MAP } as NodeDimensions);

            const matrix: number[][] = [[2], [5]];
            const expected: number[][] = [[], []];

            expect(adjustMatrixForArrows(matrix, graph, drawn)).toStrictEqual(expected);
        });

        it('should not remove Task, Choice, Start, End, or Succeed nodes from the matrix', () => {
            const { drawn, graph } = graphContext(json);
            drawn.set(0, { nodeType: WorkFlowType.START } as NodeDimensions);
            drawn.set(1, { nodeType: WorkFlowType.TASK } as NodeDimensions);
            drawn.set(3, { nodeType: WorkFlowType.TASK } as NodeDimensions);
            drawn.set(4, { nodeType: WorkFlowType.TASK } as NodeDimensions);
            drawn.set(6, { nodeType: WorkFlowType.TASK } as NodeDimensions);
            drawn.set(7, { nodeType: WorkFlowType.CHOICE } as NodeDimensions);
            drawn.set(8, { nodeType: WorkFlowType.SUCCEED } as NodeDimensions);
            drawn.set(9, { nodeType: WorkFlowType.TASK } as NodeDimensions);

            const matrix: number[][] = [[0], [1], [3, 4], [6], [7, 8], [9]];
            const expected: number[][] = [[0], [1], [3, 4], [6], [7, 8], [9]];

            expect(adjustMatrixForArrows(matrix, graph, drawn)).toStrictEqual(expected);
        });
    });

    describe('findNearestArrowNode', () => {
        // Traversals: [[0,1,2,3],[0,1,2,4],[0,1,2,5,6],[0,1,2,5,7,8]]
        const json = new JSONBuilderUtil()
            .addTask('StartNode', 'ParallelNode')
            .addParallel(
                'ParallelNode',
                [new JSONBuilderUtil().addTask('P1').getJson(), new JSONBuilderUtil().addTask('P2').getJson()],
                'MapNode'
            )
            .addMap('MapNode', new JSONBuilderUtil().addTask('M1').getJson(), undefined, true)
            .getJson();

        it('should return the node and next node data for the first index of the first path from the start node', () => {
            const { drawn, traversals } = graphContext(json);
            const [firstPath] = traversals;

            const nodeStart = { nodeType: WorkFlowType.START } as NodeDimensions;
            const nodeTask = { nodeType: WorkFlowType.TASK } as NodeDimensions;

            drawn.set(0, nodeStart);
            drawn.set(1, nodeTask);

            const node = findNearestArrowNode(firstPath, 0, 0, drawn, true);
            const nextNode = findNearestArrowNode(firstPath, 0, 0, drawn, false);
            expect(node).toStrictEqual(nodeStart);
            expect(nextNode).toStrictEqual(nodeTask);
        });

        it('should return undefined when either node is not drawn', () => {
            const { drawn, traversals } = graphContext(json);
            const [firstPath] = traversals;

            const nodeStart = { nodeType: WorkFlowType.START } as NodeDimensions;
            const nodeTask = { nodeType: WorkFlowType.TASK } as NodeDimensions;

            drawn.set(0, nodeStart);

            const node = findNearestArrowNode(firstPath, 0, 0, drawn, true);

            expect(node).toStrictEqual(undefined);

            drawn.set(1, nodeTask);
            drawn.delete(0);

            const nextNode = findNearestArrowNode(firstPath, 0, 0, drawn, true);

            expect(nextNode).toStrictEqual(undefined);
        });

        it('should return the node and next node data for a Parallel Node', () => {
            const { drawn, traversals } = graphContext(json);
            const [firstPath] = traversals;

            const nodeStart = { nodeType: WorkFlowType.PARALLEL } as NodeDimensions;
            const nodeTask = { nodeType: WorkFlowType.TASK } as NodeDimensions;

            drawn.set(2, nodeStart);
            drawn.set(3, nodeTask);

            const node = findNearestArrowNode(firstPath, 2, 2, drawn, true);
            const nextNode = findNearestArrowNode(firstPath, 2, 2, drawn, false);

            expect(node).toStrictEqual(nodeStart);
            expect(nextNode).toStrictEqual(nodeTask);
        });

        it('should return node and next node data for Map nodes when the next node is a Map', () => {
            // Traversals: [[0,1,2,3],[0,1,4]]
            const json = new JSONBuilderUtil()
                .addMap(
                    'MapNode',
                    new JSONBuilderUtil()
                        .addMap('InnerMap', new JSONBuilderUtil().addTask('M1').getJson(), 'T1')
                        .addTask('T1')
                        .getJson(),
                    undefined,
                    true
                )
                .getJson();

            const { drawn, traversals } = graphContext(json);
            const [firstPath] = traversals;

            const nodeStart = { nodeType: WorkFlowType.MAP } as NodeDimensions;
            const nodeTask = { nodeType: WorkFlowType.MAP } as NodeDimensions;

            drawn.set(1, nodeStart);
            drawn.set(2, nodeTask);

            const node = findNearestArrowNode(firstPath, 1, 1, drawn, true);
            const nextNode = findNearestArrowNode(firstPath, 1, 1, drawn, false);

            expect(node).toStrictEqual(nodeStart);
        });

        it('should return node and next node data for Map nodes when the next node is not a Map', () => {
            const { drawn, traversals } = graphContext(json);
            const [, , thirdPath] = traversals;

            const nodeStart = { nodeType: WorkFlowType.MAP } as NodeDimensions;
            const nodeTask = { nodeType: WorkFlowType.TASK } as NodeDimensions;

            drawn.set(5, nodeStart);
            drawn.set(6, nodeTask);

            const node = findNearestArrowNode(thirdPath, 5, 3, drawn, true);
            const nextNode = findNearestArrowNode(thirdPath, 5, 3, drawn, false);

            expect(node).toStrictEqual(nodeStart);
            expect(nextNode).toStrictEqual(nodeTask);
        });

        it('should return node and next node data for Map nodes when the next node is an End node', () => {
            const { drawn, traversals } = graphContext(json);
            const [, , , fourthPath] = traversals;

            const nodeStart = { nodeType: WorkFlowType.MAP } as NodeDimensions;
            const nodeEnd = { nodeType: WorkFlowType.END } as NodeDimensions;

            drawn.set(5, nodeStart);
            drawn.set(7, nodeEnd);

            const node = findNearestArrowNode(fourthPath, 5, 3, drawn, true);
            const nextNode = findNearestArrowNode(fourthPath, 5, 3, drawn, false);

            expect(node).toStrictEqual(nodeStart);
            expect(nextNode).toStrictEqual(nodeEnd);
        });
    });

    describe('generateMountingPoints', () => {
        it('should generate all mounting points for a non-parallel node', () => {
            const node = {
                x: 100,
                y: 200,
                height: 50,
                width: 150
            } as NodeDimensions;
            const mountingPoints = generateMountingPoints(node, 0, 0, 0, 0);
            const expected: MountingPoints = {
                bottom: {
                    x: 100,
                    y: 225
                },
                top: {
                    x: 100,
                    y: 175
                },
                left: {
                    x: 25,
                    y: 200
                },
                right: {
                    x: 175,
                    y: 200
                }
            };

            expect(mountingPoints).toStrictEqual(expected);
        });

        it('should default leftOffset and rightOffset to 0', () => {
            const node = {
                x: 100,
                y: 200,
                height: 50,
                width: 150
            } as NodeDimensions;
            const mountingPoints = generateMountingPoints(node, 0, 0);
            const expected: MountingPoints = {
                bottom: {
                    x: 100,
                    y: 225
                },
                top: {
                    x: 100,
                    y: 175
                },
                left: {
                    x: 25,
                    y: 200
                },
                right: {
                    x: 175,
                    y: 200
                }
            };

            expect(mountingPoints).toStrictEqual(expected);
        });

        it('should factor in offsets properly into calculations', () => {
            const node = {
                x: 100,
                y: 200,
                height: 50,
                width: 150
            } as NodeDimensions;
            const mountingPoints = generateMountingPoints(node, 10, 20, 30, 40);
            const expected: MountingPoints = {
                bottom: {
                    x: 100,
                    y: 235
                },
                top: {
                    x: 100,
                    y: 170
                },
                left: {
                    x: -5,
                    y: 200
                },
                right: {
                    x: 215,
                    y: 200
                }
            };

            expect(mountingPoints).toStrictEqual(expected);
        });

        it('should generate all mounting points for a parallel node', () => {
            const node = {
                nodeType: WorkFlowType.PARALLEL,
                x: 100,
                y: 200,
                height: 50,
                width: 150
            } as NodeDimensions;
            const mountingPoints = generateMountingPoints(node, 10, 20, 30, 40);
            const expected: MountingPoints = {
                bottom: {
                    x: 175,
                    y: 260
                },
                top: {
                    x: 175,
                    y: 200
                },
                left: {
                    x: 70,
                    y: 225
                },
                right: {
                    x: 290,
                    y: 225
                }
            };

            expect(mountingPoints).toStrictEqual(expected);
        });
    });

    describe('getCatchVertices', () => {
        const catchArray = [
            {
                ErrorEquals: ['States.ALL'],
                Next: 'FailNode'
            }
        ];

        const invalidNextCatchArray = [
            {
                ErrorEquals: ['States.ALL'],
                Next: 'NonExistingNode'
            }
        ];

        const json = new JSONBuilderUtil()
            .addTask('StartNode', 'FailNode')
            .editNode('StartNode', { Catch: catchArray })
            .addTask('FailNode', 'EndNode')
            .addTask('EndNode', undefined, true)
            .getJson();

        it('should return an array of vertices given a valid Catch array', () => {
            const { graph } = graphContext(json);

            const catchVertices = getCatchVertices(catchArray, graph);
            expect(catchVertices).toStrictEqual([2]);
        });

        it('should return an empty array given a Catch array that points to an Next node that does not exist', () => {
            const { graph } = graphContext(json);

            const catchVertices = getCatchVertices(invalidNextCatchArray, graph);
            expect(catchVertices).toStrictEqual([]);
        });
    });

    describe('getDrawnRange', () => {
        const json = new JSONBuilderUtil()
            .addTask('StartNode', 'ParallelNode')
            .addParallel(
                'ParallelNode',
                [
                    new JSONBuilderUtil().addTask('P1').getJson(),
                    new JSONBuilderUtil().addTask('P2').getJson(),
                    new JSONBuilderUtil().addTask('P3').getJson()
                ],
                'EndNode'
            )
            .addTask('EndNode', undefined, true)
            .getJson();

        it('should return 0 with a range of one node', () => {
            const { drawn, graph } = graphContext(json);

            expect(getDrawnRange([1], graph, drawn)).toBe(0);
        });

        it('should calculate using the leftMostX when a first is not drawn', () => {
            const { drawn, graph } = graphContext(json);
            const nodeDimensions = { mountingPoints: { right: { x: 0 } } } as NodeDimensions;
            drawn.set(1, nodeDimensions);

            expect(getDrawnRange([0, 1], graph, drawn, -100)).toBe(100);
        });

        it('should return the drawn range between two nodes', () => {
            const { drawn, graph } = graphContext(json);
            const nodeDimensionsLeft = { mountingPoints: { left: { x: 100 } } } as NodeDimensions;
            const nodeDimensionsRight = { mountingPoints: { right: { x: 250 } } } as NodeDimensions;

            drawn.set(3, nodeDimensionsLeft);
            drawn.set(4, nodeDimensionsRight);

            expect(getDrawnRange([3, 4], graph, drawn)).toBe(150);
        });

        it('should return the drawn range between leftMostX and another node even when the first node is drawn', () => {
            const { drawn, graph } = graphContext(json);
            const nodeDimensionsLeft = { mountingPoints: { left: { x: -100 } } } as NodeDimensions;
            const nodeDimensionsMiddle = { mountingPoints: { left: { x: 125 }, right: { x: 175 } } } as NodeDimensions;
            const nodeDimensionsRight = { mountingPoints: { right: { x: 250 } } } as NodeDimensions;

            drawn.set(3, nodeDimensionsLeft);
            drawn.set(4, nodeDimensionsMiddle);
            drawn.set(5, nodeDimensionsRight);

            expect(getDrawnRange([3, 4, 5], graph, drawn)).toBe(350);
        });

        it('should return the drawn range between three nodes', () => {
            const { drawn, graph } = graphContext(json);
            const nodeDimensionsLeft = { mountingPoints: { left: { x: 100 } } } as NodeDimensions;
            const nodeDimensionsRight = { mountingPoints: { right: { x: 250 } } } as NodeDimensions;

            drawn.set(3, nodeDimensionsLeft);
            drawn.set(4, nodeDimensionsRight);

            expect(getDrawnRange([3, 4], graph, drawn, 0)).toBe(250);
        });
    });

    describe('getDrawnRangeMiddleX', () => {
        const json = new JSONBuilderUtil()
            .addTask('StartNode', 'ParallelNode')
            .addParallel(
                'ParallelNode',
                [
                    new JSONBuilderUtil().addTask('P1').getJson(),
                    new JSONBuilderUtil().addTask('P2').getJson(),
                    new JSONBuilderUtil().addTask('P3').getJson()
                ],
                'EndNode'
            )
            .addTask('EndNode', undefined, true)
            .getJson();

        it('should return the x value of one node', () => {
            const { drawn, graph } = graphContext(json);
            const nodeDimensionsLeft = { x: 100 } as NodeDimensions;

            drawn.set(3, nodeDimensionsLeft);

            expect(getDrawnRangeMiddleX([3], graph, drawn)).toBe(100);
        });

        it('should return the middle x value between two vertices', () => {
            const { drawn, graph } = graphContext(json);
            const nodeDimensionsLeft = { x: 0 } as NodeDimensions;
            const nodeDimensionsRight = { x: 100 } as NodeDimensions;

            drawn.set(3, nodeDimensionsLeft);
            drawn.set(4, nodeDimensionsRight);

            expect(getDrawnRangeMiddleX([3, 4], graph, drawn)).toBe(50);
        });

        it('should not consider nodes that have not been drawn', () => {
            const { drawn, graph } = graphContext(json);
            const nodeDimensionsLeft = { x: 100 } as NodeDimensions;

            drawn.set(3, nodeDimensionsLeft);

            expect(getDrawnRangeMiddleX([3, 4], graph, drawn)).toBe(100);
        });
    });

    describe('getNextVertex', () => {
        it('should return the next vertex by Next field given a valid vertex', () => {
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'EndNode')
                .addTask('EndNode', undefined, true)
                .getJson();

            const { graph } = graphContext(json);

            expect(getNextVertex(1, graph)).toBe(2);
        });

        it('should return -1 for the start, and a non-existent vertex', () => {
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'EndNode')
                .addTask('EndNode', undefined, true)
                .getJson();

            const { graph } = graphContext(json);

            expect(getNextVertex(0, graph)).toBe(-1);
            expect(getNextVertex(10, graph)).toBe(-1);
        });

        it('should return the end vertex', () => {
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'EndNode')
                .addTask('EndNode', undefined, true)
                .getJson();

            const { graph } = graphContext(json);

            expect(getNextVertex(2, graph)).toBe(3);
        });

        it('should return -1 when vertex is not provided', () => {
            const json = new JSONBuilderUtil().getJson();

            const { graph } = graphContext(json);
            expect(getNextVertex(undefined, graph)).toBe(-1);
        });
    });

    describe('getNearestDrawn', () => {
        it('should return the next node when evaluating two tasks with both drawn', () => {
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'EndNode')
                .addTask('EndNode', undefined, true)
                .getJson();

            const { drawn, graph } = graphContext(json);

            drawn.set(2, {} as NodeDimensions);

            const nearestDrawn = getNearestDrawn(1, graph, drawn);

            expect(nearestDrawn).toBe(2);
        });

        it('should return the vertex it was called with if it has been drawn', () => {
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'EndNode')
                .addTask('EndNode', undefined, true)
                .getJson();

            const { drawn, graph } = graphContext(json);

            drawn.set(1, {} as NodeDimensions);

            const nearestDrawn = getNearestDrawn(1, graph, drawn);

            expect(nearestDrawn).toBe(1);
        });

        it('should return -1 when a drawn node cannot be found', () => {
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'EndNode')
                .addTask('EndNode', undefined, true)
                .getJson();

            const { drawn, graph } = graphContext(json);
            const nearestDrawn = getNearestDrawn(1, graph, drawn);

            // drawn is empty
            expect(nearestDrawn).toBe(-1);
        });
    });

    describe('getGroupIndex', () => {
        it('should return the index from the groups matrix when a vertex is present', () => {
            const groups = [[1], [2, 3]];

            expect(getGroupIndex(groups, 1)).toBe(0);
            expect(getGroupIndex(groups, 2)).toBe(1);
        });

        it('should return -1 when a vertex is not present', () => {
            const groups = [[1], [2, 3]];

            expect(getGroupIndex(groups, 5)).toBe(-1);
        });
    });

    describe('getGroupsAtDepth', () => {
        it('should return a matrix with a single group when given no Parallel nodes', () => {
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'ParallelNode')
                .addTask('EndNode', undefined, true)
                .getJson();

            const { graph, verticesAtDepth } = graphContext(json);
            // verticesAtDepth[0] contains the start node, not StartNode
            const groupsAtDepth = getGroupsAtDepth(verticesAtDepth[1], graph);
            const expected = [[1]];

            expect(groupsAtDepth).toStrictEqual(expected);
        });

        it('should return a matrix with one group when given a Parallel node and a task', () => {
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'ParallelNode')
                .addParallel('ParallelNode', [new JSONBuilderUtil().addTask('P1').getJson()], 'EndNode')
                .addTask('EndNode', undefined, true)
                .getJson();

            const { graph, verticesAtDepth } = graphContext(json);
            const groupsAtDepth = getGroupsAtDepth(verticesAtDepth[2], graph);

            // Parallel nodes aren't included in the groups, but instead a group is made when
            // a Parallel node is encountered
            const expected = [[3]];

            expect(groupsAtDepth).toStrictEqual(expected);
        });
    });

    describe('getRange', () => {
        const json = new JSONBuilderUtil()
            .addTask('StartNode', 'ChoiceNode')
            .addChoice('ChoiceNode', [JSONBuilderUtil.getChoiceForAdd('ParallelNode')])
            .addParallel('ParallelNode', [new JSONBuilderUtil().addTask('P1').addTask('P2').getJson()], 'MapNode')
            .addMap('MapNode', new JSONBuilderUtil().addTask('M1').getJson(), 'EndNode')
            .addSuccess('EndNode', undefined, true)
            .getJson();

        const { graph } = graphContext(json);

        it('should return the node width when only one node is in a row', () => {
            const expected = getNodeDimensions('StartNode').width;

            expect(getRange([1], 0, graph, ctx as CanvasRenderingContext2D)).toBe(expected);
        });

        it('should add two nodes that are next to each other with two X_OFFSETs', () => {
            const expected = getNodeDimensions('P1').width + getNodeDimensions('P2').width + X_OFFSET + X_OFFSET;
            expect(getRange([4, 5], X_OFFSET, graph, ctx as CanvasRenderingContext2D)).toBe(expected);
        });

        it('should return 0 if no vertices are in the array', () => {
            expect(getRange([], 0, graph, ctx as CanvasRenderingContext2D)).toBe(0);
        });

        it('should not add a Parallel node in the range calculation', () => {
            expect(getRange([3], 0, graph, ctx as CanvasRenderingContext2D)).toBe(0);
        });
    });

    describe('isSameLevelType', () => {
        it('should return true if the workflow is a PARALLEL or MAP', () => {
            expect(isSameLevelType(WorkFlowType.PARALLEL)).toBe(true);
            expect(isSameLevelType(WorkFlowType.MAP)).toBe(true);
        });

        it('should return false if the workflow is not a PARALLEL or MAP', () => {
            expect(isSameLevelType(WorkFlowType.START)).toBe(false);
            expect(isSameLevelType(WorkFlowType.CHOICE)).toBe(false);
            expect(isSameLevelType(WorkFlowType.SUCCEED)).toBe(false);
            expect(isSameLevelType(WorkFlowType.TASK)).toBe(false);
            expect(isSameLevelType(WorkFlowType.END)).toBe(false);
        });
    });

    describe('redrawNode', () => {
        it('should draw a choice, task, or succeed (default case) node', () => {
            const drawStepNodeSpy = jest.spyOn(CanvasUtilModule, 'drawStepNode');
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'Choice')
                .addChoice('ChoiceNode', [JSONBuilderUtil.getChoiceForAdd('EndNode')])
                .addSuccess('EndNode', undefined, true)
                .getJson();

            const { drawn, graph } = graphContext(json);

            // StartNode (Task)
            redrawNode(1, ctx as CanvasRenderingContext2D, drawn, graph, []);
            expect(drawStepNodeSpy).toHaveBeenCalledTimes(1);

            // ChoiceNode (Choice)
            redrawNode(2, ctx as CanvasRenderingContext2D, drawn, graph, []);
            expect(drawStepNodeSpy).toHaveBeenCalledTimes(2);

            //EndNode (Success)
            redrawNode(3, ctx as CanvasRenderingContext2D, drawn, graph, []);
            expect(drawStepNodeSpy).toHaveBeenCalledTimes(3);
        });

        it('should draw a Catch node', () => {
            const catchArray = [
                {
                    ErrorEquals: ['States.ALL'],
                    Next: 'FailNode'
                }
            ];

            const drawCatchNodeSpy = jest.spyOn(CanvasUtilModule, 'drawCatchNode');

            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'FailNode')
                .editNode('StartNode', { Catch: catchArray })
                .addTask('FailNode', 'EndNode')
                .addTask('EndNode', undefined, true)
                .getJson();

            const { drawn, graph } = graphContext(json);

            // FailNode (Catch)
            redrawNode(2, ctx as CanvasRenderingContext2D, drawn, graph, []);
            expect(drawCatchNodeSpy).toHaveBeenCalledTimes(1);
        });

        it('should not draw a Parallel, Map, Start, or End node', () => {
            const drawStepNodeSpy = jest.spyOn(CanvasUtilModule, 'drawStepNode');
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'ParallelNode')
                .addParallel(
                    'ParallelNode',
                    [new JSONBuilderUtil().addTask('P1').getJson(), new JSONBuilderUtil().addTask('P2').getJson()],
                    'MapNode'
                )
                .addMap('MapNode', new JSONBuilderUtil().addTask('M1').getJson(), 'EndNode')
                .addSuccess('EndNode', undefined, true)
                .getJson();

            const { drawn, graph } = graphContext(json);

            // Start
            redrawNode(0, ctx as CanvasRenderingContext2D, drawn, graph, []);
            expect(drawStepNodeSpy).not.toHaveBeenCalled();

            // ParallelNode (Parallel)
            redrawNode(2, ctx as CanvasRenderingContext2D, drawn, graph, []);
            expect(drawStepNodeSpy).not.toHaveBeenCalled();

            // MapNode (Map)
            redrawNode(5, ctx as CanvasRenderingContext2D, drawn, graph, []);
            expect(drawStepNodeSpy).not.toHaveBeenCalled();

            // End
            redrawNode(8, ctx as CanvasRenderingContext2D, drawn, graph, []);
            expect(drawStepNodeSpy).not.toHaveBeenCalled();
        });

        it('should not draw when a node cannot be found in the graph', () => {
            const drawStepNodeSpy = jest.spyOn(CanvasUtilModule, 'drawStepNode');
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'Choice')
                .addChoice('ChoiceNode', [JSONBuilderUtil.getChoiceForAdd('EndNode')])
                .addSuccess('EndNode', undefined, true)
                .getJson();

            const { drawn, graph } = graphContext(json);
            graph.addVertex({ vertex: 5, data: null });

            // StartNode (Task)
            redrawNode(5, ctx as CanvasRenderingContext2D, drawn, graph, []);
            expect(drawStepNodeSpy).toHaveBeenCalledTimes(0);
        });
    });

    describe('isInParallel', () => {
        it('should return true if a vertex is inside a Parallel node (direct parent)', () => {
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'ParallelNode')
                .addParallel('ParallelNode', [new JSONBuilderUtil().addTask('P1').addTask('P2').getJson()], 'MapNode')
                .getJson();

            const { graph } = graphContext(json);

            // P1
            expect(isInParallel(3, graph)).toBe(true);
            // P2
            expect(isInParallel(4, graph)).toBe(true);
        });

        it('should return false if a vertex is not inside a Parallel node (direct parent)', () => {
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'ChoiceNode')
                .addChoice('ChoiceNode', [JSONBuilderUtil.getChoiceForAdd('ParallelNode')])
                .addParallel('ParallelNode', [new JSONBuilderUtil().addTask('P1').addTask('P2').getJson()], 'MapNode')
                .addMap('MapNode', new JSONBuilderUtil().addTask('M1').getJson(), 'EndNode')
                .addSuccess('EndNode', undefined, true)
                .getJson();

            const { graph } = graphContext(json);

            // Start
            expect(isInParallel(0, graph)).toBe(false);
            // StartNode
            expect(isInParallel(1, graph)).toBe(false);
            // ChoiceNode
            expect(isInParallel(2, graph)).toBe(false);
            // ParallelNode
            expect(isInParallel(3, graph)).toBe(false);
            // MapNode
            expect(isInParallel(6, graph)).toBe(false);
            // EndNode
            expect(isInParallel(7, graph)).toBe(false);
            // End
            expect(isInParallel(8, graph)).toBe(false);
        });
    });
});
