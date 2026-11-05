import type Digraph from './Digraph';
import DigraphDFS from './DigraphDFS';
import type { JSONStateObject } from './util/JSONBuilder.util';

export enum WorkFlowType {
    TASK = 'Task',
    CATCH = 'Catch',
    CHOICE = 'Choice',
    PARALLEL = 'Parallel',
    MAP = 'Map',
    SUCCEED = 'Succeed',
    START = 'Start',
    END = 'End'
}

const isTopLevel = (json: any, key: string) => {
    const { States } = json;
    const keys = Object.keys(States);
    return keys.includes(key);
};

// The start node needs to be added separately since it isn't captured in the paths
const addStart = (graph: Digraph) => {
    const startNode = {
        Start: {
            Type: WorkFlowType.START
        }
    };

    const vertex = {
        vertex: graph.V,
        data: startNode
    };

    graph.addVertex(vertex);
};

// The end node needs to be added separately since it isn't captured in the paths
const addEnd = (graph: Digraph): number => {
    const endNode = {
        End: {
            Type: WorkFlowType.END
        }
    };

    const vertex = {
        vertex: graph.V,
        data: endNode
    };

    return graph.addVertex(vertex);
};

// Connects vertices that need to connect to the End vertex together
const connectEnds = (graph: Digraph, endVertex: number, lastTopLevelVertex: number, json: any) => {
    const adjacencyMatrix = graph.getAdjacencyMatrix();
    const paths: number[][] = DigraphDFS.getAllDfsPaths(adjacencyMatrix, [0]);
    paths.forEach((path: number[]) => {
        path.forEach((vertex: number) => {
            const node = graph.getDataByVertex(vertex);
            const [key] = Object.keys(node);
            const { Type, Next } = node[key];
            const isTerminal = isTopLevel(json, key) && !Next && Type !== WorkFlowType.CHOICE;

            if (isTerminal) {
                graph.addEdge(vertex, endVertex);
            }
        });
    });
};

// Parallel nodes just feed all branch objects back into the parser
const handleParallel = (node: any, graph: Digraph, addedVertex: number, lastStateKey: string): Digraph => {
    const [key] = Object.keys(node);
    const { Branches } = node[key];

    Branches.forEach((branch: any) => {
        generateStepFunctionGraph(branch, graph, addedVertex, lastStateKey, false);
    });

    return graph;
};

const handleMap = (node: any, graph: Digraph, addedVertex: number, lastStateKey: string): Digraph => {
    const [key] = Object.keys(node);
    const { Iterator } = node[key];

    generateStepFunctionGraph(Iterator, graph, addedVertex, lastStateKey, false);

    return graph;
};

/**
 * The addMetadata function mutates the original provided state by
 * adding metadata required for StepFunctionAuthoring operations.
 */
export const addMetadata = (parentPath: string, currentKey: string | number, state: JSONStateObject) => {
    const { Type } = state;
    const nodePath = `${parentPath}${parentPath ? '.' : ''}${currentKey}`;

    // Iterate over nested nodes
    switch (Type) {
        case 'Choice': {
            if (state?.Choices) {
                state.Choices.forEach((choiceState, choiceStateIdx) => {
                    addMetadata(`${nodePath}.Choices`, choiceStateIdx, choiceState);
                });
            }
            break;
        }
        case 'Parallel': {
            if (state?.Branches) {
                state.Branches.forEach((parallelBranch, parallelBranchIdx) => {
                    const pbBranchStatekeys = Object.keys(parallelBranch.States);

                    pbBranchStatekeys.forEach((key) => {
                        const branchState = parallelBranch.States[key];
                        addMetadata(`${nodePath}.Branches.${parallelBranchIdx}.States`, key, branchState);
                    });
                });
            }
            break;
        }
        case 'Map': {
            if (state?.Iterator?.States) {
                const mapIteratorStates = state.Iterator.States;
                const mapIteratorStateKeys = Object.keys(state.Iterator.States);

                mapIteratorStateKeys.forEach((key) => {
                    const iteratorState = mapIteratorStates[key];
                    addMetadata(`${nodePath}.Iterator.States`, key, iteratorState);
                });
            }
            break;
        }
        default:
            break;
    }

    // Add/Update node path
    if (state?.Metadata) {
        state.Metadata.NodePath = nodePath;
        return;
    }

    state.Metadata = {
        NodePath: nodePath
    };
};

const RESERVED_KEYS = ['StartAt', 'End'];

/**
 * Returns `true` if the name provided is a Reserved
 * key name.
 */
export const isReservedKeyName = (name: string) => {
    return RESERVED_KEYS.includes(name);
};

// Main parsing function for populating a Digraph from a given step function JSON
export const generateStepFunctionGraph = (
    json: any,
    graph: Digraph,
    connectFrom?: number,
    lastStateKey?: string,
    updateMetaData: boolean = true
) => {
    let isLastNode = false;

    // Add the start node if we don't have any vertices yet. V is the vertex count in the graph
    if (graph.V === 0) {
        addStart(graph);
    }

    const nodeKeys = Object.keys(json.States);
    const nodes = nodeKeys
        .filter((key) => !isReservedKeyName(key))
        .map((key) => {
            if (updateMetaData) {
                addMetadata('', key, json.States[key]);
            }

            return {
                [key]: json.States[key]
            };
        })
        .sort((nodeA: JSONStateObject, nodeB: JSONStateObject) => {
            if (nodeA?.Metadata?.SortOrder && nodeB?.Metadata?.SortOrder) {
                return nodeA.Metadata.SortOrder - nodeB.Metadata.SortOrder;
            }

            return 0;
        });

    const lastNode = lastStateKey || nodeKeys[nodeKeys.length - 1];

    // Add vertices to graph and set the data for each
    nodes.forEach((node) => {
        const [key] = Object.keys(node);
        const vertex = {
            vertex: graph.V,
            data: node
        };

        const addedVertex = graph.addVertex(vertex);

        if (graph.V === 2) {
            graph.addEdge(0, 1);
        }

        // This is left open-ended as a switch to facilitate more types in the future that might need special handling

        switch (node[key]['Type']) {
            case WorkFlowType.PARALLEL:
                handleParallel(node, graph, addedVertex, lastNode);
                break;
            case WorkFlowType.MAP:
                handleMap(node, graph, addedVertex, lastNode);
                break;
            default:
                break;
        }

        // We need a special flag to determine the last node so we can properly add the end node
        if (key === lastNode) {
            isLastNode = true;
        }
    });

    // Handle Choice Type
    nodes.forEach((node) => {
        const [key] = Object.keys(node);
        const currentFindFn = (datum: any) => {
            const [dataKey] = Object.keys(datum);
            return dataKey === key;
        };

        const currentVertex = graph.getVertexByData(currentFindFn);

        if (node[key]['Type'] === WorkFlowType.CHOICE) {
            const { Choices, Default } = node[key];

            const choiceDefaultFindFn = (datum: any) => {
                const [dataKey] = Object.keys(datum);
                return dataKey === Default;
            };

            const choiceDefaultVertex = graph.getVertexByData(choiceDefaultFindFn);

            if (typeof currentVertex === 'number' && typeof choiceDefaultVertex === 'number') {
                graph.addEdge(currentVertex, choiceDefaultVertex);
            }

            Choices.forEach((choice: any) => {
                const { Next: choiceNext } = choice;

                const choiceNextFindFn = (datum: any) => {
                    const [dataKey] = Object.keys(datum);
                    return dataKey === choiceNext;
                };

                const choiceNextVertex = graph.getVertexByData(choiceNextFindFn);

                if (typeof currentVertex === 'number' && typeof choiceNextVertex === 'number') {
                    graph.addEdge(currentVertex, choiceNextVertex);
                }
            });
        }
    });

    const connectedFromNext = nodes.reduce((accum, node) => {
        const [key] = Object.keys(node);
        const d = node[key] || {};
        const { Next } = d;

        const nextVertexFindFn = (datum: any) => {
            const [dataKey] = Object.keys(datum);
            return dataKey === Next;
        };
        const nextVertex = graph.getVertexByData(nextVertexFindFn);
        return nextVertex ? accum.concat(nextVertex) : accum;
    }, []);

    // Connect the rest of the edges
    nodes.forEach((node) => {
        const [key] = Object.keys(node);
        const d = node[key] || {};
        const { Catch, Next } = d;

        const currentFindFn = (datum: any) => {
            const [dataKey] = Object.keys(datum);
            return dataKey === key;
        };

        const destinationFindFn = (datum: any) => {
            const [dataKey] = Object.keys(datum);
            return dataKey === Next;
        };

        const currentVertex = graph.getVertexByData(currentFindFn);
        const foundDestinationVertex = graph.getVertexByData(destinationFindFn);
        const destinationVertex = connectFrom ? currentVertex : foundDestinationVertex;

        Catch?.forEach((catchNode: any) => {
            const catchNext = catchNode.Next;
            const catchFindFn = (datum: any) => {
                const [dataKey] = Object.keys(datum);
                return dataKey === catchNext;
            };

            const foundCatchVertex = graph.getVertexByData(catchFindFn);

            if (foundCatchVertex && typeof currentVertex === 'number') {
                const catchData = graph.getDataByVertex(foundCatchVertex);
                graph.setVertexData({
                    vertex: foundCatchVertex,
                    data: {
                        ...{
                            [catchNext]: {
                                ...catchData[catchNext],
                                Type: WorkFlowType.CATCH,
                                ErrorEquals: catchNode.ErrorEquals
                            }
                        }
                    }
                });
                graph.addEdge(currentVertex, foundCatchVertex);
            }
        });

        if (typeof destinationVertex === 'number' && typeof currentVertex === 'number') {
            const isVertexConnectedFromNext = connectedFromNext.includes(currentVertex);

            // Connect current vertex to a "Next" vertex if a Next is present
            if (Next && foundDestinationVertex) {
                graph.addEdge(currentVertex, foundDestinationVertex);
            }

            // Connect all vertices not connected from a "Next" field either to a previously connected
            // vertex or the current vertex
            if (!isVertexConnectedFromNext) {
                graph.addEdge(connectFrom ? connectFrom - 1 : currentVertex, destinationVertex);
            }
        }
    });

    const lastTopLevel = nodeKeys[nodeKeys.length - 1];
    const lastTopLevelFindFn = (datum: any) => {
        const [dataKey] = Object.keys(datum);
        return dataKey === lastTopLevel;
    };

    if (isLastNode) {
        const endVertex = addEnd(graph);
        const lastTopLevelVertex = graph.getVertexByData(lastTopLevelFindFn) || endVertex;
        connectEnds(graph, endVertex - 1, lastTopLevelVertex, json);
    }

    return graph;
};
