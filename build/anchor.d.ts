import * as React from 'react';
import { Anchor, Vector } from './layer';
export interface Props {
    position: Anchor;
    onMouseEnter?: (position: Anchor) => void;
    onMouseDown: (evt: any, position: Anchor) => void;
    onMouseUp: (position: Anchor) => void;
    translation: Vector;
    style?: React.CSSProperties;
    className?: string;
    highlight?: boolean;
}
export declare const AnchorComponent: React.StatelessComponent<Props>;
