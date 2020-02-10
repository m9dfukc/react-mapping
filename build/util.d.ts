export declare const round: (num: number, precision: number) => number;
export declare const range: (num: number) => any;
export declare const transformPointsToMatrix: (sourcePoints: [[number, number], [number, number], [number, number], [number, number]], targetPoints: [[number, number], [number, number], [number, number], [number, number]]) => [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
export declare const matrixToTransform: (matrix: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]) => string;
export declare const vectorToTransform: (vector: [number, number]) => string;
