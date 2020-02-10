import * as React from 'react';
export interface Props {
    rows?: number;
    columns?: number;
}
export declare class Grid extends React.Component<Props> {
    static defaultProps: {
        rows: number;
        columns: number;
    };
    render(): JSX.Element;
}
