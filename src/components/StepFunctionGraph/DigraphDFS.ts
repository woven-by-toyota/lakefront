import type Digraph from './Digraph';

class DigraphDFS {
    marked: boolean[];
    count: number;
    dfsTraversal: any[];

    constructor(G: Digraph, s: number) {
        this.marked = new Array(G.getVerticesCount()).fill(false);
        this.count = 0;
        this.validateVertex(s);
        this.dfsTraversal = this.dfs(G, s);
    }

    // Generic DFS search for a given graph
    dfs(G: Digraph, v: number): number[] {
        this.count++;
        this.marked[v] = true;
        const traversal: number[] = [];

        for (const w of G.getAdjacencyMatrix(v)) {
            if (!this.marked[w]) this.dfs(G, w);
        }

        for (let v = 0; v < G.getVerticesCount(); v++) {
            if (this.getMarked(v)) {
                traversal.push(v);
            }
        }

        return traversal;
    }

    // Returns all possible paths from a given adjacency matrix and starting node
    static getAllDfsPaths(data: any[], path = [0], paths: any[] = [], endVertex = -1, endReached = false) {
        const datum = path[path.length - 1];
        let lastPathReached = false;

        if (data[datum].length > 0 && !endReached && !lastPathReached) {
            data[datum].forEach((val: number) => {
                if (!lastPathReached && val !== endVertex) {
                    const newPath = [...path, val];

                    paths = this.getAllDfsPaths(data, newPath, paths, endVertex);
                } else if (!lastPathReached) {
                    const newPath = [...path, val];
                    paths = this.getAllDfsPaths(data, newPath, paths, endVertex, true);
                    paths.push(path);
                    lastPathReached = true;
                }
            });
        } else {
            paths.push(path);
        }

        return paths;
    }

    getMarked(v: number): boolean {
        this.validateVertex(v);
        return this.marked[v];
    }

    getCount(): number {
        return this.count;
    }

    validateVertex(v: number): void {
        const V: number = this.marked.length;
        if (v < 0 || v >= V) {
            throw new Error(`vertex ${v} is not between 0 and ${(V - 1)}`);
        }
    }

    // Returns a matrix of vertices at each "depth" or top-down view of vertices in order
    static getVerticesAtDepthFromPaths(
        paths: number[][],
        exclusionArray: number[] = [],
        hasEndVertex = false
    ): number[][] {
        const endVertex: number = paths.reduce((accum: number, path) => (
            Math.max(...path) > accum ? Math.max(...path) : accum
        ), 0);
        const maxDepth: number = paths.reduce((accum: number, path) => (
            path.filter(v => v !== endVertex).length > accum ? path.length : accum
        ), 0);
        const verticesAtDepth: number[][] = new Array(maxDepth).fill([]);

        for (let depth = 0; depth <= maxDepth; depth++) {
            const uniqueVertices: number[] = [];
            for (let path = 0; path < paths.length; path++) {
                const vertex = paths[path][depth];

                if (typeof vertex !== 'undefined' && !(hasEndVertex && vertex === endVertex) && !uniqueVertices.includes(vertex)) {
                    uniqueVertices.push(vertex);
                }
            }

            verticesAtDepth[depth] = uniqueVertices;
        }

        // The end vertex should be at its own depth
        hasEndVertex && verticesAtDepth.push([endVertex]);

        return verticesAtDepth.map((depth: number[]) => {
            return depth.filter(v => !exclusionArray.includes(v));
        }).filter(depth => depth.length > 0);
    }
}

export default DigraphDFS;
