import type { StepFunctionJSON } from '../../util/JSONBuilder.util';
import Digraph from '../../Digraph';
import { generateStepFunctionGraph } from '../../StepFunctionUtil';
import { adjustDepthMatrix, getGroupsAtDepth, type NodeDimensions } from '../../GraphUtil';
import DigraphDFS from '../../DigraphDFS';

export const CANVAS_DEFAULTS = {
    pan: {
        offset: {
            x: 0,
            y: 0
        }
    },
    scale: 2,
    height: 1000,
    width: 1000
};

interface GraphContext {
    drawn: Map<number, NodeDimensions>;
    graph: Digraph;
    groups: number[][];
    traversals: any[];
    verticesAtDepth: number[][];
}

export const graphContext = (json: StepFunctionJSON, groupDepth = 0): GraphContext => {
    const digraph = new Digraph();
    const graph = generateStepFunctionGraph(json, digraph);
    const drawn = new Map<number, NodeDimensions>();
    const traversals = DigraphDFS.getAllDfsPaths(graph.getAdjacencyMatrix(), [0]);

    let verticesAtDepth: number[][] = DigraphDFS.getVerticesAtDepthFromPaths(traversals, [], true);
    verticesAtDepth = adjustDepthMatrix(verticesAtDepth, graph);

    const groups: number[][] = getGroupsAtDepth(verticesAtDepth[groupDepth], graph);

    return {
        drawn,
        graph,
        groups,
        traversals,
        verticesAtDepth
    };
};
