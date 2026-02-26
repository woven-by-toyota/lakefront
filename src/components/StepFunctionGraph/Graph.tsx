import { FC, MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '@emotion/react';

import { generateStepFunctionGraph, WorkFlowType } from './StepFunctionUtil';
import Digraph from './Digraph';
import DigraphDFS from './DigraphDFS';
import { drawGraph } from './GraphRenderer';
import resizeObserver from 'src/lib/hooks/resizeObserver.js';
import throttled from 'src/lib/hooks/throttle.js';
import { NodeDimensions } from './GraphUtil';
import { collides } from './canvasUtil';
import { GraphControls, GraphContainer, StyledCanvas, StyledGpsFixedIcon, StyledAddIcon, StyledRemoveIcon } from './graphStyles';

export interface GraphProps {
    /**
     * Sends data stored with each node from the parsing step on click inside of any drawn node. Use this data to
     * store the node key for the highlightedKey prop if node highlighting is desired.
     */
    handleSelectedNode(node: any | null, vertex?: number): void;
    /**
     * Handle a right-click on any drawn node. This can be used to configure a context menu.
     */
    handleContextClickNode?(key: string, vertex: number, e: MouseEvent<HTMLCanvasElement>, ctx: CanvasRenderingContext2D): void;
    /**
     * Action to run when a node context menu is closed.
     */
    handleCloseContextMenu?(): void;
    /**
     * This should be the node key from the AWS JSON and if supplied, will highlight that node in the graph.
     */
    highlightedKey: string | null;
    /**
     * This is AWS Step Function JSON contained in an object. See the Storybook Canvas for detailed examples of what
     * should be provided.
     */
    json: any;
    /**
     * The classes to pass to the step function graph container.
     */
    className?: string;
}
const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
const DEFAULT_ZOOM = 2;
const MIN_ZOOM = 3;
const MAX_ZOOM = 1.2;
const ZOOM_INCREMENT = 0.2;
const REDRAW_THROTTLE_MS = 50;

/**
 * Step Function Graph Component
 *
 * The Step Function Graph takes AWS Step Function JSON and renders an interactive 2D canvas of how its states connect
 * together. It can be panned by clicking in empty space and moving the mouse. It also takes a function "handleSelectedNode" that sends back which node has been clicked, so the
 * the consuming application can use the "highlightedKey" prop to let it know to highlight a node.
 * This component does not allow cycles, or nodes that connect such that a circular path is formed.
 */
export const StepFunctionGraph: FC<GraphProps> = ({
    handleCloseContextMenu,
    handleContextClickNode,
    handleSelectedNode,
    highlightedKey,
    json,
    className
}) => {
    const theme = useTheme();
    const globalOffset = useMemo(
        () => ({
            scale: 1,
            offset: {
                x: 0,
                y: 0
            },
            defaultOffset: {
                x: 0,
                y: 0
            }
        }),
        []
    );

    const pan = useMemo(
        () => ({
            start: {
                x: null,
                y: null
            },
            offset: {
                x: 0,
                y: 0
            }
        }),
        []
    );

    const canvasContainer = useRef<HTMLCanvasElement>(null);
    const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);
    const [observedElement, setObservedElement] = useState<any>(null);
    const [clickedNode, setClickedNode] = useState<NodeDimensions | null>(null);
    const [jsonHighlightedNode, setJsonHighlightedNode] = useState<NodeDimensions | null>(null);
    const clickHandler = useRef<any | null>(null);
    const contextMenuHandler = useRef<(any | null)>(null);

    const graphRef = useRef<HTMLDivElement | null>(null);
    const initialDraw = useRef<boolean>(true);
    const redraw = useRef<boolean>(false);
    const setupDone = useRef<boolean>(false);
    const initialWidth = useRef<number>(0);

    const handleNodeClick = (node: NodeDimensions | null) => {
        setClickedNode(node);

        if (node === null) {
            setJsonHighlightedNode(null);
            handleCloseContextMenu && handleCloseContextMenu();
        }
    };

    const handleContextMenuClick = (node: NodeDimensions | null, e: MouseEvent<HTMLCanvasElement>, ctx: CanvasRenderingContext2D) => {
        if (node) {
            const nodeData = graph.getDataByVertex(node.vertex);
            const [key] = Object.keys(nodeData);

            typeof(handleContextClickNode) !== 'undefined' && handleContextClickNode(key, node.vertex, e, ctx);
        }
    };

    const handleZoomIn = () => {
        if (Math.abs(zoom) < MIN_ZOOM) {
            setZoom(zoom + ZOOM_INCREMENT);
        }
    };

    const handleZoomOut = () => {
        if (Math.abs(zoom) > MAX_ZOOM) {
            setZoom(zoom - ZOOM_INCREMENT);
        }
    };

    const handleRecenter = () => {
        initialDraw.current = true;

        pan.start = {
            x: null,
            y: null
        };
        pan.offset = {
            x: globalOffset.defaultOffset.x,
            y: globalOffset.defaultOffset.y
        };

        globalOffset.offset = {
            x: globalOffset.defaultOffset.x,
            y: globalOffset.defaultOffset.y
        };

        // The pan won't reset unless there's an actual change to redraw the page
        if (zoom === devicePixelRatio) {
            setZoom(DEFAULT_ZOOM - 0.0001);
            setZoom(DEFAULT_ZOOM + 0.0001);
        } else {
            setZoom(DEFAULT_ZOOM);
        }
    };

    // Gets better coordinates for the mouse inside the canvas
    const getMousePos = (canvas: any, evt: any) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
            y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
        };
    };

    const getClickHandler = (drawn: Map<number, NodeDimensions>, ctx: CanvasRenderingContext2D, canvasRef: any, menuHandler = false) => {
        // This function checks for any clicks inside the bounds of any drawn rectangles
        return function nodeClickHandler(e: any) {
            e.preventDefault();
            e.stopPropagation();

            const { x: offsetX, y: offsetY } = getMousePos(canvasRef, e);
            const rects = Array.from(drawn.values()).filter(
                (node) => node.nodeType !== WorkFlowType.START && node.nodeType !== WorkFlowType.END
            );
            const collision: NodeDimensions | null = collides(rects, offsetX, offsetY, ctx);

            menuHandler && e.button === 2 ? handleContextMenuClick(collision, e, ctx) : handleNodeClick(collision);
        };
    };

    // Recalculate the center of the graph based on zoom and current canvas dimensions
    const calculateCenter = (): void => {
        const ctx = canvasContainer?.current?.getContext('2d');

        if (ctx) {
            const center = {
                x: (-(zoom - 1) * ctx.canvas.width) / 2,
                y: -(zoom - 1) * (ctx.canvas.height / 2)
            };

            globalOffset.offset.x = -center.x / 2;
            globalOffset.offset.y = -center.y / 2;

            globalOffset.defaultOffset.x = -center.x / 2;
            globalOffset.defaultOffset.y = -center.y / 2;

            pan.offset.x = -center.x / 2;
            pan.offset.y = -center.y / 2;
        }
    };

    // Pans the canvas to a given node. Parallel nodes are calculated from the side and not center.
    const panToNode = (node: NodeDimensions | null): void => {
        const ctx = canvasContainer?.current?.getContext('2d');
        if (ctx && node?.x) {
            const isParallel = node.nodeType === WorkFlowType.PARALLEL;
            const xOffset = isParallel ? node.x + node.width / 2 : node.x;

            pan.offset.x = globalOffset.defaultOffset.x * 2 - xOffset;
            pan.offset.y = globalOffset.defaultOffset.y * 2 - node.y;
            globalOffset.offset.x = globalOffset.defaultOffset.x * 2 - xOffset;
            globalOffset.offset.y = globalOffset.defaultOffset.y * 2 - node.y;
        }
    };

    // Construct a Digraph to store a representation of the graph to draw
    const graph: Digraph = useMemo(() => new Digraph(), [json]);

    // Parse the JSON and return a complete graph
    const stepGraph: Digraph = useMemo(() => json.States && generateStepFunctionGraph(json, graph), [graph]);

    // Store all possible traversals of the graph starting at the Start node, which is always 0
    const paths: number[][] = useMemo(
        () => stepGraph && DigraphDFS.getAllDfsPaths(stepGraph.getAdjacencyMatrix(), [0]),
        [stepGraph]
    );

    const calculateAndDraw = () => {
        
        if (canvasContainer.current && json && json.States) {
            const { height, width } = canvasContainer.current.getBoundingClientRect();
            const ctx = canvasContainer.current.getContext('2d');

            canvasContainer.current.style.width = `${width}`;
            canvasContainer.current.style.height = `${height}`;

            // The scale sizes the canvas resolution so it isn't blurry
            const scale = devicePixelRatio;
            canvasContainer.current.width = width * scale;
            canvasContainer.current.height = height * scale;

            if (ctx) {
                ctx.scale(scale, scale);

                const draw = () => {
                    if (canvasContainer.current) {
                        const { height, width } = canvasContainer.current;
                        const highlightFindFn = (datum: any) => {
                            const [dataKey] = Object.keys(datum);
                            return dataKey === highlightedKey;
                        };

                        const highlightedVertex = graph.getVertexByData(highlightFindFn);
                        const highlightedArray = highlightedVertex && jsonHighlightedNode ? [highlightedVertex] : [];

                        // Since canvas just draws, we need to keep track of the vertices and locational data ourselves
                        // This also helps us go back and draw Parallel nodes after we're done with the rest of the graph
                        const drawn: Map<number, NodeDimensions> = new Map();

                        // Remove any existing click handlers since this gets called a lot
                        if (clickHandler.current) {
                            canvasContainer.current.removeEventListener('click', clickHandler.current, false);
                            canvasContainer.current.removeEventListener('contextmenu', contextMenuHandler.current, false);
                        }

                        clickHandler.current = getClickHandler(drawn, ctx, canvasContainer.current);
                        contextMenuHandler.current = getClickHandler(drawn, ctx, canvasContainer.current, true);
                        canvasContainer.current.addEventListener('click', clickHandler.current, false);
                        canvasContainer.current.addEventListener('contextmenu', contextMenuHandler.current, false);

                        drawGraph(
                            canvasContainer.current,
                            drawn,
                            paths,
                            graph,
                            ctx,
                            pan,
                            zoom,
                            height,
                            width,
                            highlightedArray,
                            theme
                        );

                        // Set the node data in the state since we don't have access to the drawn map from outside this function
                        if (highlightedVertex && !redraw.current) {
                            const drawnVertex = drawn.get(highlightedVertex) ?? null;
                            setJsonHighlightedNode(drawnVertex);
                        }
                    }
                };

                const trackMouse = (e: any) => {
                    const offsetX = e.clientX - (pan.start.x || 0);
                    const offsetY = e.clientY - (pan.start.y || 0);
                    pan.offset.x = globalOffset.offset.x + offsetX;
                    pan.offset.y = globalOffset.offset.y + offsetY;
                };

                const startPan = (e: any) => {
                    if (canvasContainer.current) {
                        canvasContainer.current.addEventListener('mousemove', trackMouse);
                        canvasContainer.current.addEventListener('mousemove', draw);
                    }

                    handleCloseContextMenu && handleCloseContextMenu();

                    pan.start.x = e.clientX;
                    pan.start.y = e.clientY;
                };

                const endPan = () => {
                    if (canvasContainer.current) {
                        canvasContainer.current.removeEventListener('mousemove', trackMouse);
                        canvasContainer.current.removeEventListener('mousemove', draw);
                    }

                    pan.start.x = null;
                    pan.start.y = null;
                    globalOffset.offset.x = pan.offset.x;
                    globalOffset.offset.y = pan.offset.y;
                };

                if (!setupDone.current) {
                    canvasContainer.current.addEventListener('mousedown', startPan);
                    canvasContainer.current.addEventListener('mouseleave', endPan);
                    canvasContainer.current.addEventListener('mouseup', endPan);
                    setupDone.current = true;
                } else {
                    // Some performance improvements to make sure we clean up listeners each draw
                    canvasContainer.current.removeEventListener('mousedown', startPan);
                    canvasContainer.current.removeEventListener('mouseleave', endPan);
                    canvasContainer.current.removeEventListener('mouseup', endPan);

                    canvasContainer.current.addEventListener('mousedown', startPan);
                    canvasContainer.current.addEventListener('mouseleave', endPan);
                    canvasContainer.current.addEventListener('mouseup', endPan);
                }

                if (initialDraw.current) {
                    calculateCenter();
                }

                // Initial draw since all other draws are done in response to movement
                draw();

                initialDraw.current = false;
            }
        }
    };

    // When the page loads we need to set up the observer to see when the slider changes, which is really looking
    // at the graph itself to see if its width or properties change.
    useEffect(() => {
        const resizeCallback = (entries: any[]) => {
            setObservedElement(entries);
        };
        const throttledResizeCallback = throttled(REDRAW_THROTTLE_MS, resizeCallback);
        const graphResizeObserver = resizeObserver(throttledResizeCallback);
        graphResizeObserver.observe(graphRef.current as HTMLDivElement);

        return () => {
            graphResizeObserver.disconnect();
        };
    }, []);

    // This is a general effect for redrawing under most circumstances where we need to see the graph change
    useEffect(() => {
        calculateAndDraw();
    }, [highlightedKey, clickedNode, json, observedElement, zoom]);

    // This effect is for when a new JSON node has been set and should pan or draw
    useEffect(() => {
        if (jsonHighlightedNode) {
            panToNode(jsonHighlightedNode);
            redraw.current = true;
            calculateAndDraw();
        } else {
            calculateAndDraw();
        }
    }, [jsonHighlightedNode]);

    // This effect is for any drawn node click handler as well as clicking blank space
    useEffect(() => {
        if (clickedNode) {
            const node = graph.getDataByVertex(clickedNode.vertex);

            if (canvasContainer.current && !initialDraw.current) {
                panToNode(node);
            }

            handleSelectedNode(node, clickedNode.vertex);
        } else {
            // When clicking blank space we should allow a node to unselect
            handleSelectedNode(null);
        }
    }, [clickedNode]);

    // This effect is for kicking off the initial draw after a new highlightedKey comes in from the parent component
    useEffect(() => {
        if (highlightedKey) {
            // When the highlightedKey changes, we need to let the draw function know it can set a new node in the state
            redraw.current = false;
            calculateAndDraw();
        }
    }, [highlightedKey]);

    // This effect is for calculating the offset when the slider changes
    useEffect(() => {
        const ctx = canvasContainer?.current?.getContext('2d');

        // When the slider changes, we want to adjust the pan and default offset so centering on a node works.
        // This also lets the slider cover the graph when sliding instead of panning the graph.
        if (ctx && graphRef.current && initialWidth.current) {
            pan.offset.x += (ctx.canvas.width - (initialWidth.current || ctx.canvas.width)) / 4 ?? 0;
            globalOffset.defaultOffset.x += (ctx.canvas.width - (initialWidth.current || ctx.canvas.width)) / 4 ?? 0;
            initialWidth.current = ctx.canvas.width;
        }
    }, [observedElement]);

    // When the component mounts, we need to set the width and recenter the graph since it will initially render off
    // since the height and width changes as things fill the screen
    useEffect(() => {
        const ctx = canvasContainer?.current?.getContext('2d');

        if (ctx) {
            initialWidth.current = ctx.canvas.width;
        }

        // This is needed to ensure that the graph centers on initial load
        handleRecenter();
    }, []);

    return (
        <GraphContainer ref={graphRef} className={className}>
            <StyledCanvas ref={canvasContainer} />
            <GraphControls>
                <div onClick={handleRecenter}>
                    <StyledGpsFixedIcon />
                </div>
                <div onClick={handleZoomIn}>
                    <StyledAddIcon />
                </div>
                <div onClick={handleZoomOut}>
                    <StyledRemoveIcon />
                </div>
            </GraphControls>
        </GraphContainer>
    );
};

export default StepFunctionGraph;
