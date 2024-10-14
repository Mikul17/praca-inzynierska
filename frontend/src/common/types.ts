
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