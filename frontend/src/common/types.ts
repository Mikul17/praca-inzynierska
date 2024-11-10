
export interface Task {
    id: number;
    r: number;
    p: number;
    q: number;
    actualStart?: number;
    actualEnd?: number;
    recentlyChanged?: boolean;
}

export interface TaskRequest {
    id: number;
    r: number;
    p: number;
    q: number;
}

export interface TabuMove {
    firstTaskId: number;
    secondTaskId: number;
    moveCmax: number;
}

export interface Solution {
    order: Array<number>;
    cmax: number;
}

export interface SolutionNode {
    parent?: SolutionNode;
    children: SolutionNode[];
    permutation: Solution;
    ub: number;
    lb: number;
    pruned: boolean;
}

export interface SimulatedAnnealingResponse {
    propabilities: Array<number>;
    temperatures: Array<number>;
    permutations: Array<Solution>;
    bestSolution: Solution;
}

export interface TabuSearchResponse {
    tabuList: Array<TabuMove>;
    permutations: Array<Solution>;
    bestSolution: Solution;
}

export interface SchrageResponse {
    readyQueue: Array<number>;
    notReadyQueue: Array<number>;
    permutations: Array<Solution>;
    bestSolution: Solution;
}

export interface CarlierResponse {
    permutations: Array<Solution>;
    bestSolution: Solution;
    ub: number;
    node: SolutionNode;
}