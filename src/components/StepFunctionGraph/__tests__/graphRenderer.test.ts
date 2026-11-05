import 'jest-canvas-mock';
import { CANVAS_DEFAULTS, graphContext } from './util/graphTestUtils.util';
import { JSONBuilderUtil } from '../util/JSONBuilder.util';
import { getX, getY, renderVertex, X_OFFSET } from '../GraphRenderer';
import { WorkFlowType } from '../StepFunctionUtil';
import type { NodeDimensions } from '../GraphUtil';
import * as CanvasUtilModule from '../canvasUtil';

describe('graphRenderer', () => {
    const CENTER = CANVAS_DEFAULTS.width / 4;
    const NODE_WIDTH = 50;

    let ctx: CanvasRenderingContext2D | null;

    beforeEach(() => {
        ctx = document.createElement('canvas').getContext('2d');
    });

    describe('getX', () => {
        it('gives correct X for a single column of tasks', () => {
            const json = new JSONBuilderUtil()
                .addTask('StartNode', 'NodeTwo')
                .addTask('NodeTwo', 'EndNode')
                .addTask('EndNode', undefined, true)
                .getJson();

            const { drawn, graph, groups: x1Groups } = graphContext(json, 1);

            const x1 = getX(
                x1Groups,
                1,
                50,
                CANVAS_DEFAULTS.width,
                0,
                -1,
                0,
                graph,
                drawn,
                3,
                [],
                {}
            );

            const { groups: x2Groups } = graphContext(json, 2);

            const x2 = getX(
                x2Groups,
                2,
                50,
                CANVAS_DEFAULTS.width,
                0,
                -1,
                1,
                graph,
                drawn,
                3,
                [],
                {}
            );

            const { groups: x3Groups } = graphContext(json, 3);

            const x3 = getX(
                x3Groups,
                3,
                50,
                CANVAS_DEFAULTS.width,
                0,
                -1,
                2,
                graph,
                drawn,
                3,
                [],
                {}
            );

            expect(x1).toBe(CENTER);
            expect(x2).toBe(CENTER);
            expect(x3).toBe(CENTER);
        });

        it('should position a single Parallel in the center', () => {
            const json = new JSONBuilderUtil()
                .addParallel('ParallelNode', [
                    new JSONBuilderUtil().addTask('P1').getJson()
                ], undefined, true)
                .getJson();

            const { drawn, graph, groups } = graphContext(json, 1);

            drawn.set(1, {nodeType: WorkFlowType.PARALLEL} as NodeDimensions);

            const x = getX(
                groups,
                2,
                50,
                CANVAS_DEFAULTS.width,
                0,
                -1,
                2,
                graph,
                drawn,
                4,
                [],
                {}
            );

            expect(x).toBe(CENTER);
        });

        it('should position two choice nodes correctly', () => {
            const json = new JSONBuilderUtil()
                .addChoice('ChoiceNode', [
                    JSONBuilderUtil.getChoiceForAdd('Choice1'),
                    JSONBuilderUtil.getChoiceForAdd('Choice2')
                ])
                .addTask('Choice1', 'EndNode')
                .addTask('Choice2', 'EndNode')
                .addSuccess('EndNode', undefined, true)
                .getJson();

            const { drawn, graph, groups } = graphContext(json, 2);

            drawn.set(1, {nodeType: WorkFlowType.CHOICE, x: CENTER} as NodeDimensions);

            const x1 = getX(
                groups,
                2,
                50,
                CANVAS_DEFAULTS.width,
                0,
                -1,
                2,
                graph,
                drawn,
                4,
                [],
                {}
            );

            drawn.set(2, {nodeType: WorkFlowType.TASK, x: x1} as NodeDimensions);

            const previousEnd = x1 as number + 50;

            const x2 = getX(
                groups,
                3,
                50,
                CANVAS_DEFAULTS.width,
                0,
                previousEnd,
                2,
                graph,
                drawn,
                4,
                [],
                {}
            );

            const expectedX2 = previousEnd + (NODE_WIDTH / 2) + X_OFFSET;

            expect(x1).toBe(275); // calculated as the range position
            expect(x2).toBe(expectedX2); // calculated as the newPositionByPrevious
        });

        it('should offset the node if the previous parent is a Map node to account for the Map width', () => {
            const json = new JSONBuilderUtil()
                .addParallel('ParallelNode', [
                    new JSONBuilderUtil()
                        .addMap('MapNode', new JSONBuilderUtil().addTask('M1').getJson())
                        .getJson(),
                    new JSONBuilderUtil()
                        .addTask('AfterMap', 'EndNode')
                        .getJson()
                ], 'EndNode')
                .addTask('EndNode', undefined, true)
                .getJson();

            const { drawn, graph, groups } = graphContext(json, 1);

            const x = getX(
                groups,
                4,
                50,
                CANVAS_DEFAULTS.width,
                0,
                100,
                3,
                graph,
                drawn,
                6,
                [],
                {}
            );

            const expected = 100 + (NODE_WIDTH / 2) + X_OFFSET + (X_OFFSET / 2);

            expect(x).toBe(expected);
        });
    });

    describe('getY', () => {
        it('should return a y value given a depth and node height', () => {
            const y1 = getY(0, 50);
            const expectedY1 = 75;

            const y2 = getY(1, 50);
            const expectedY2 = 200;

            const y3 = getY(2, 50);
            const expectedY3 = 325;

            const y4 = getY(3, 100);
            const expectedY4 = 600;

            const y5 = getY(4, 0);
            const expectedY5 = 375;

            expect(y1).toBe(expectedY1);
            expect(y2).toBe(expectedY2);
            expect(y3).toBe(expectedY3);
            expect(y4).toBe(expectedY4);
            expect(y5).toBe(expectedY5);
        });
    });

    describe('renderVertex', () => {
        const json = new JSONBuilderUtil()
            .addTask('StartNode', 'ParallelNode')
            .addParallel('ParallelNode', [
                new JSONBuilderUtil().addTask('P1').getJson(),
                new JSONBuilderUtil().addTask('P2').getJson()
            ], 'MapNode')
            .addMap('MapNode', new JSONBuilderUtil().addTask('M1').getJson(), 'ChoiceNode')
            .addChoice('ChoiceNode', [
                JSONBuilderUtil.getChoiceForAdd('EndNode')
            ])
            .addSuccess('EndNode', undefined, true)
            .getJson();

        let drawTerminalNodeSpy: jest.SpyInstance;
        let drawStepNodeSpy: jest.SpyInstance;

        beforeEach(() => {
            drawTerminalNodeSpy = jest.spyOn(CanvasUtilModule, 'drawTerminalNode');
            drawStepNodeSpy = jest.spyOn(CanvasUtilModule, 'drawStepNode');
        });

        it('should call Start and End node draw functions', () => {
            const { drawn, graph, groups, verticesAtDepth } = graphContext(json);
            const startDepth = verticesAtDepth[0];
            const endDepth = [verticesAtDepth.length - 1];

            renderVertex(
                startDepth,
                0,
                drawn,
                graph,
                0,
                groups,
                NODE_WIDTH,
                9,
                0,
                [],
                ctx as CanvasRenderingContext2D,
                []
            );

            expect(drawTerminalNodeSpy).toHaveBeenCalledTimes(1);

            const { groups: endGroups } = graphContext(json, verticesAtDepth.length - 1);

            renderVertex(
                endDepth,
                0,
                drawn,
                graph,
                9,
                endGroups,
                NODE_WIDTH,
                9,
                6,
                [],
                ctx as CanvasRenderingContext2D,
                []
            );

            expect(drawTerminalNodeSpy).toHaveBeenCalledTimes(2);
            expect(drawStepNodeSpy).toHaveBeenCalledTimes(0);
        });

        it('should call the Task, Choice, and unknown node draw function', () => {
            // Task Node
            const { drawn, graph, groups, verticesAtDepth } = graphContext(json, 1);

            renderVertex(
                verticesAtDepth[1],
                0,
                drawn,
                graph,
                1,
                groups,
                NODE_WIDTH,
                9,
                1,
                [],
                ctx as CanvasRenderingContext2D,
                []
            );

            expect(drawStepNodeSpy).toHaveBeenCalledTimes(1);

            // Choice node
            const { groups: choiceGroups } = graphContext(json, 4);

            renderVertex(
                verticesAtDepth[4],
                0,
                drawn,
                graph,
                7,
                choiceGroups,
                NODE_WIDTH,
                9,
                4,
                [],
                ctx as CanvasRenderingContext2D,
                []
            );

            expect(drawStepNodeSpy).toHaveBeenCalledTimes(2);

            const unknownNodeJson = new JSONBuilderUtil()
                .addTask('UnknownNode', undefined, true)
                .editNode('UnknownNode', { Type: 'Unknown' })
                .getJson();

            const { drawn: unknownDrawn, graph: unknownGraph, groups: unknownGroups } = graphContext(unknownNodeJson, 1);

            renderVertex(
                verticesAtDepth[1],
                0,
                unknownDrawn,
                unknownGraph,
                1,
                unknownGroups,
                NODE_WIDTH,
                2,
                1,
                [],
                ctx as CanvasRenderingContext2D,
                []
            );

            expect(drawStepNodeSpy).toHaveBeenCalledTimes(3);
            expect(drawTerminalNodeSpy).toHaveBeenCalledTimes(0);
        });

        it('should not call any render functions when the node is Map or Parallel', () => {
            const { drawn, graph, groups: parallelGroups, verticesAtDepth } = graphContext(json, 2);

            renderVertex(
                verticesAtDepth[2],
                2,
                drawn,
                graph,
                2,
                parallelGroups,
                NODE_WIDTH,
                9,
                2,
                [],
                ctx as CanvasRenderingContext2D,
                []
            );

            const { groups: mapGroups } = graphContext(json, 3);

            renderVertex(
                verticesAtDepth[3],
                1,
                drawn,
                graph,
                5,
                mapGroups,
                NODE_WIDTH,
                9,
                3,
                [],
                ctx as CanvasRenderingContext2D,
                []
            );

            expect(drawStepNodeSpy).toHaveBeenCalledTimes(0);
            expect(drawTerminalNodeSpy).toHaveBeenCalledTimes(0);
        });
    });
});
