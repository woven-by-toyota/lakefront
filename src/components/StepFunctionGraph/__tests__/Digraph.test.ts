import { cleanup } from '@testing-library/react';
import Digraph from '../Digraph';

afterAll(cleanup);

describe('Digraph Class', () => {
    beforeEach(cleanup);

    it('should create a Digraph with provided vertex count', () => {
        const graph = new Digraph(2);
        expect(graph.V).toBe(2);
        expect(graph.getVerticesCount()).toBe(2);
    });

    it('should create an empty Digraph with no vertex count provided to the constructor', () => {
        const graph = new Digraph();
        expect(graph.V).toBe(0);
        expect(graph.getVerticesCount()).toBe(0);
    });

    it('should connect two vertices together with an edge', () => {
        const graph = new Digraph(2);
        expect(graph.getEdgeCount()).toBe(0);
        expect(graph.getAdjacencyMatrix()).toStrictEqual([[], []]);
        graph.addEdge(0, 1);
        expect(graph.getEdgeCount()).toBe(1);
        expect(graph.getAdjacencyMatrix()).toStrictEqual([[1], []]);
    });

    it('should return the correct outdegree and indegree after connecting edges', () => {
        const graph = new Digraph(3);
        expect(graph.indegree).toStrictEqual([[], [], []]);
        graph.addEdge(0, 1);
        expect(graph.indegree).toStrictEqual([[], [0], []]);
        graph.addEdge(1, 2);
        expect(graph.getOutdegree(0)).toStrictEqual({ count: 1, outVertices: [1] });
        expect(graph.getOutdegree(1)).toStrictEqual({ count: 1, outVertices: [2] });
        expect(graph.getOutdegree(2)).toStrictEqual({ count: 0, outVertices: [] });
        expect(graph.getIndegree(0)).toStrictEqual([]);
        expect(graph.getIndegree(1)).toStrictEqual([0]);
    });
});
