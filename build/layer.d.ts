import * as React from 'react';
export interface Props {
    label: string;
    style?: React.CSSProperties;
    className?: string;
    isEditMode?: boolean;
    save?: boolean;
    reload?: boolean;
    reset?: boolean;
    x?: number;
    y?: number;
    anchorStyle?: React.CSSProperties;
    anchorClassName?: string;
    onChange?: (State: any) => null;
}
export interface Context {
    isEditMode: boolean;
}
export interface State {
    matrix: Matrix3d;
    translateDelta: {
        [key: string]: Vector;
    };
    sourcePoints?: RectPoints;
    transformOrigin: Vector;
    containerTranslate: Vector;
    hover: boolean;
}
export declare type Anchor = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
export declare type Matrix3d = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
export declare type RectPoints = [Vector, Vector, Vector, Vector];
export declare type Vector = [number, number];
export declare class Layer extends React.Component<Props, State> {
    container: HTMLElement | null;
    layerTranslateDelta: Vector | undefined;
    anchorTranslateDelta: Vector | undefined;
    isAnchorDragging: boolean;
    targetPoints: RectPoints;
    anchorMoving: Anchor | undefined;
    namespace: string;
    identifier: string;
    data: string | null;
    getDefaultState: () => {
        matrix: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number];
        translateDelta: {};
        sourcePoints: undefined;
        transformOrigin: number[];
        containerTranslate: number[];
    };
    initialize: () => void;
    state: State;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: any): void;
    onAnchorMouseDown: (evt: any, position: any) => void;
    onAnchorMouseMove: (evt: any) => void;
    onAnchorMouseUp: (position: any) => void;
    onMouseUp: () => void;
    onMouseMove: (evt: any) => void;
    onMouseDown: (evt: any) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    render(): JSX.Element;
}
