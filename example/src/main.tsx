import * as React from 'react';
import { Layer, Grid } from '../../';
import KeyHandler, { KEYPRESS, KEYUP, KEYDOWN } from 'react-key-handler';
const YouTube = require('react-youtube').default;

const getContainerStyle = (isEditMode) => ({
  backgroundColor: isEditMode ? '#2c3e50' : 'black',
  height: '100vh',
  width: '100vw'
});

const instruction = {
  color: 'white',
  bottom: 20,
  position: 'absolute' as 'absolute',
  textAlign: 'center'  as  'center',
  left: 0,
  opacity: 0.4,
  right: 0
};

const opts = {
  height: 195,
  width: 320
};

export interface State {
  isEditMode: boolean;
  save: boolean;
  reset: boolean;
  time: string;
}

class Main extends React.Component<{}, State> {
  state: State = {
    isEditMode: false,
    save: false,
    reset: false,
    time: (new Date).toLocaleTimeString()
  };

  toggleEdit = () => {
    this.setState({
      isEditMode: !this.state.isEditMode
    });
  };
  onSave = (t) => this.setState({save: (t && this.state.isEditMode)});
  onReset = (t) => this.setState({reset: (t && this.state.isEditMode)});

  counter = () => {
    setTimeout(() => {
      this.setState({time: (new Date).toLocaleTimeString()})
      this.counter();
    }, 1000);
  };

  componentDidMount() {
    this.counter();
  }

  render() {
    const { isEditMode, save, reset, time } = this.state;
    return (
    <div style={getContainerStyle(isEditMode)}>
      <KeyHandler keyEventName={KEYPRESS} keyValue="t" onKeyHandle={this.toggleEdit} />
      <KeyHandler keyEventName={KEYDOWN} keyValue="s" onKeyHandle={() => this.onSave(true)} />
      <KeyHandler keyEventName={KEYUP} keyValue="s" onKeyHandle={() => this.onSave(false)} />
      <KeyHandler keyEventName={KEYDOWN} keyValue="r" onKeyHandle={() => this.onReset(true)} />
      <KeyHandler keyEventName={KEYUP} keyValue="r" onKeyHandle={() => this.onReset(false)} />

      {isEditMode && <Grid/>}
      <Layer
        label="layer-1"
        style={opts}
        x={100}
        y={40}
        isEditMode={isEditMode}
        save={save}
        reload={reset}>
        <YouTube videoId="M6khNkdbt1w" opts={opts}/>
      </Layer>
      <Layer
        label="layer-2"
        x={400}
        y={100}
        isEditMode={isEditMode}
        save={save}
        reload={reset}
        style={{
          width: 200,
          height: 200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          border: '1px solid white'
        }}>
        {time}
      </Layer>
      <div style={instruction}>Press "t" to switch between edit / view mode</div>
    </div>
    );
  }
}

export default Main;
