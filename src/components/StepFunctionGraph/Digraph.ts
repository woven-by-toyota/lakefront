interface Vertex {
    vertex: number;
    data: any;
}

interface OutDegree {
    count: number;
    outVertices: number[];
}

class Digraph {
    V: number;
    E: number;
    adjacencyMatrix: number[][];
    vertexDataMap: Map<number, any>;
    indegree: number[][];

    constructor(vertices?: number) {
        if (vertices && vertices < 0) throw new Error('Number of vertices in a Digraph must be non-negative');

        // Vertex and Edge counters
        this.V = 0;
        this.E = 0;

        // This is the heart of the Digraph, storing outdegree vertices at an index which is the vertex that points to it
        this.adjacencyMatrix = [];
        this.vertexDataMap = new Map<number, any>();

        // Indegree represents the vertices that point to a vertex where the index is the vertex for which we want values
        this.indegree = Array.from({ length: vertices || 0 }, (_) => Array(0));

        // Populate the adjacency matrix if a value is provided in the constructor
        if (vertices) {
            this.V = vertices;

            for (let v = 0; v < vertices; v++) {
                this.adjacencyMatrix[v] = [];
            }
        }
    }

    // Returns number of Vertices
    getVerticesCount(): number {
        return this.V;
    }

    // Returns number of Edges
    getEdgeCount(): number {
        return this.E;
    }

    validateVertex(v: number): void {
        if (v < 0 || v >= this.V) {
            throw new Error(`vertex ${v} is not between 0 and ${this.V - 1}`);
        }
    }

    addEdge(v: number, w: number): void {
        this.validateVertex(v);
        this.validateVertex(w);

        if (!this.adjacencyMatrix[v].includes(w)) {
            this.adjacencyMatrix[v].push(w);
        }

        if (!this.indegree[w].includes(v)) {
            this.indegree[w].push(v);
        }

        this.E++;
    }

    addVertex(vertex: Vertex): number {
        this.indegree.push([]);
        this.adjacencyMatrix[this.V++] = [];
        this.vertexDataMap.set(vertex.vertex, vertex.data);
        return this.V;
    }

    setVertexData(vertex: Vertex): void {
        this.vertexDataMap.set(vertex.vertex, vertex.data);
    }

    // Utility method to return a vertex with a provided key
    getVertexByKey(vertexKey: string): number | undefined {
        for (const [key, value] of this.vertexDataMap.entries()) {
            const [name] = Object.keys(value);
            if (name === vertexKey) {
                return key;
            }
        }
    }

    // Utility method to return a vertex with a provided find function that searches data stored for a given vertex
    getVertexByData(findFn: (any: any) => boolean): number | undefined {
        for (const [key, value] of this.vertexDataMap.entries()) {
            if (findFn(value)) {
                return key;
            }
        }
    }

    getDataByVertex(vertex: number): any {
        return this.vertexDataMap.get(vertex);
    }

    // Returns either an index of the adjacency matrix or the whole matrix
    getAdjacencyMatrix(v?: number): any {
        if (typeof v === 'number') {
            return this.adjacencyMatrix[v];
        } else {
            return this.adjacencyMatrix;
        }
    }

    // Returns all vertices a vertex points to
    getOutdegree(v: number): OutDegree {
        this.validateVertex(v);
        return { count: this.adjacencyMatrix[v].length, outVertices: this.adjacencyMatrix[v] };
    }

    // Returns all vertices pointing to a vertex
    getIndegree(v: number): number[] {
        this.validateVertex(v);
        return this.indegree[v] ?? [];
    }
}

export default Digraph;
