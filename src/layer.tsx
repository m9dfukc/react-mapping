import * as React from 'react';
import { AnchorComponent } from './anchor';
import { matrixToTransform, transformPointsToMatrix, vectorToTransform } from './util';

// Component interfaces
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
  onChange?: (State) => null;
}

export interface Context {
  isEditMode: boolean;
}

export interface State {
  matrix: Matrix3d;
  translateDelta: { [key: string]: Vector };
  sourcePoints?: RectPoints;
  transformOrigin: Vector;
  containerTranslate: Vector;
  hover: boolean;
}

const styles = {
  container: {
    position: 'relative' as 'relative'
  }
};

// Sorted
export type Anchor = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
const anchors: Anchor[] = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];

// 4x4 matrix
export type Matrix3d = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

// top-left, top-right, bottom-right, bottom-left
export type RectPoints = [Vector, Vector, Vector, Vector];

export type Vector = [number, number]; // [x, y]

const defaultMatrix: Matrix3d = [
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1 // second and third for x and y position of element
];

export class Layer extends React.Component<Props, State> {
  container: HTMLElement | null;

  layerTranslateDelta: Vector | undefined;
  anchorTranslateDelta: Vector | undefined;

  isAnchorDragging = false;

  targetPoints: RectPoints;
  anchorMoving: Anchor | undefined;

  namespace = 'react-mapping-';
  identifier = this.namespace + this.props.label;

  data = window.localStorage.getItem(this.identifier);
  getDefaultState = () => ({
    matrix: defaultMatrix,
    translateDelta: anchors.reduce((acc, key) => ((acc[key] = [0, 0]), acc), {}),
    sourcePoints: undefined,
    transformOrigin: [0, 0],
    containerTranslate: [this.props.x || 0, this.props.y || 0]
  });
  initialize = () => {
    if (this.container) {
      const { width, height } = this.container.getBoundingClientRect();
      const sourcePoints = [[0, 0], [width, 0], [width, height], [0, height]] as RectPoints;

      this.targetPoints = [...sourcePoints] as RectPoints;
      this.setState({ sourcePoints });
    } else {
      throw new Error("Couldn't get a reference of the container element");
    }
  };

  state: State = {
    ...(this.data ? JSON.parse(this.data) : this.getDefaultState()),
    hover: false
  };

  componentWillMount() {
    window.addEventListener('mousemove', this.onAnchorMouseMove);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  componentDidMount() {
    this.initialize();
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onAnchorMouseMove);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  componentDidUpdate(prevProps) {
    if (this.props.save && this.props.save !== prevProps.save) {
      const key = this.namespace + this.props.label;
      const data = JSON.stringify(this.state);
      window.localStorage.setItem(key, data);
    }
    if (this.props.reset && this.props.reset !== prevProps.reset) {
      const key = this.namespace + this.props.label;
      const state = this.getDefaultState() as State;
      window.localStorage.removeItem(key);
      this.setState(state);
      this.initialize();
    }
    if (this.props.reload && this.props.reload !== prevProps.reload && this.data) {
      const state = this.data ? JSON.parse(this.data) : this.getDefaultState();
      const { sourcePoints } = state;
      this.targetPoints = [...sourcePoints] as RectPoints;
      this.setState(state);
    }
  }

  onAnchorMouseDown = (evt, position) => {
    evt.stopPropagation();
    this.anchorTranslateDelta = [
      evt.pageX - this.state.translateDelta[position][0],
      evt.pageY - this.state.translateDelta[position][1]
    ];

    this.anchorMoving = position;
  };

  onAnchorMouseMove = evt => {
    if (!this.anchorTranslateDelta || !this.state.sourcePoints || !this.anchorMoving) {
      return;
    }

    evt.preventDefault();
    evt.stopPropagation();
    const vectorIndexToModify = anchors.indexOf(this.anchorMoving);

    const deltaX = evt.pageX - this.anchorTranslateDelta[0];
    const deltaY = evt.pageY - this.anchorTranslateDelta[1];

    this.targetPoints[vectorIndexToModify] = [
      this.state.sourcePoints[vectorIndexToModify][0] + deltaX,
      this.state.sourcePoints[vectorIndexToModify][1] + deltaY
    ];

    this.setState({
      matrix: transformPointsToMatrix(this.state.sourcePoints, this.targetPoints!),
      translateDelta: { ...this.state.translateDelta, [this.anchorMoving]: [deltaX, deltaY] }
    });
  };

  onAnchorMouseUp = position => {
    this.anchorTranslateDelta = undefined;
    this.anchorMoving = undefined;
  };

  onMouseUp = () => {
    this.layerTranslateDelta = undefined;
  };

  onMouseMove = evt => {
    if (!this.layerTranslateDelta || !this.props.isEditMode) {
      return;
    }

    const newVector: Vector = [
      evt.pageX - this.layerTranslateDelta[0],
      evt.pageY - this.layerTranslateDelta[1]
    ];

    this.setState({
      containerTranslate: newVector
    });
  };

  onMouseDown = evt => {
    const { containerTranslate } = this.state;
    this.layerTranslateDelta = [
      evt.pageX - containerTranslate[0],
      evt.pageY - containerTranslate[1]
    ];
  };

  onMouseEnter = () => {
    this.setState({
      hover: true
    });
  };
  onMouseLeave = () => {
    this.setState({
      hover: false
    });
  };

  render() {
    const { style, isEditMode, className, anchorStyle, anchorClassName } = this.props;
    const { translateDelta, matrix, containerTranslate, transformOrigin, hover } = this.state;

    return (
      <div
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        style={{
          cursor: isEditMode ? 'all-scroll' : 'inherit',
          position: 'relative',
          display: 'inline-block',
          transform: vectorToTransform(containerTranslate)
        }}
      >
        <div
          ref={ref => {
            this.container = ref;
          }}
          style={{
            ...styles.container,
            ...style,
            pointerEvents: isEditMode ? 'none' : 'all',
            transform: matrixToTransform(matrix),
            transformOrigin: `${transformOrigin[0]}px ${transformOrigin[1]}px 0px`
          }}
          className={className}
        >
          {this.props.children}
        </div>
        {isEditMode && (
          <div>
            {anchors.map((anchor, index) => (
              <AnchorComponent
                style={anchorStyle}
                className={anchorClassName}
                key={anchor}
                translation={translateDelta[anchor]}
                position={anchor}
                onMouseDown={this.onAnchorMouseDown}
                onMouseUp={this.onAnchorMouseUp}
                highlight={hover}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}
