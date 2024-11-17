
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
    id: number;
    firstTaskId: number;
    secondTaskId: number;
    moveCmax: number;
    tenure: number;
}

export interface Solution {
    order: Array<number>;
    cmax: number;
}

export interface TreeNode {
    "@id": number;
    parent: TreeNode | number | null;
    children: Array<TreeNode>;
    permutation: Solution | null;
    ub: number;
    lb: number;
    pruned: boolean;
    active: boolean;
  }

export interface AlgorithmParameters {
    tasks: Array<Task>;
    algorithm: string;
    timeoutDuration: number;
    parameters: Record<string, any>;
}
