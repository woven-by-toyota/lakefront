import { cleanup } from '@testing-library/react';
import Digraph from '../Digraph';
import DigraphDFS from '../DigraphDFS';

afterAll(cleanup);

describe('DigraphDFS Class', () => {
    beforeEach(cleanup);

    it('should provide paths from a vertex given a simple adjacency matrix', () => {
        const graph = new Digraph(3);
        graph.addEdge(0, 1);
        graph.addEdge(1, 2);
        const paths = DigraphDFS.getAllDfsPaths(graph.getAdjacencyMatrix());
        expect(paths).toStrictEqual([[0, 1, 2]]);
    });

    it('should provide paths from a vertex given a complex adjacency matrix', () => {
        const graph = new Digraph(6);
        graph.addEdge(0, 1);
        graph.addEdge(1, 2);
        graph.addEdge(1, 3);
        graph.addEdge(3, 4);
        graph.addEdge(4, 5);

        const paths = DigraphDFS.getAllDfsPaths(graph.getAdjacencyMatrix(), [0]);
        expect(paths).toStrictEqual([
            [0, 1, 2],
            [0, 1, 3, 4, 5]
        ]);
    });

    it('should provide paths from a vertex given an adjacency matrix and an end', () => {
        const graph = new Digraph(6);
        graph.addEdge(0, 1);
        graph.addEdge(1, 2);
        graph.addEdge(1, 3);
        graph.addEdge(3, 4);
        graph.addEdge(4, 5);

        const paths = DigraphDFS.getAllDfsPaths(graph.getAdjacencyMatrix(), [1], undefined, 3);
        expect(paths).toStrictEqual([[1, 2], [1, 3], [1]]);
    });
});
