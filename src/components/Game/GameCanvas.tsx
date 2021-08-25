import * as React from "react";
import './Game.css';
import Log from '../../utils/Log';

import { ShipState } from './Game';

export interface GameCanvasProps {
  shipCoords: any;
  shipThrust: any;
  shipFuel: number;
  shipState: ShipState;
  landingPadRect: any;
}

export interface GameCanvasState {
  shipCoords: any;
  shipThrust: any;
  shipFuel: number;
  shipState: ShipState;
}

export default class GameCanvas extends React.Component<GameCanvasProps, GameCanvasState> {

  public log: Log;

  constructor(props: GameCanvasProps) {
    super(props);
    this.state = {
      shipCoords: this.props.shipCoords,
      shipThrust: this.props.shipThrust,
      shipFuel: this.props.shipFuel,
      shipState: this.props.shipState,
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps: GameCanvasProps) {
    // console.log(nextProps);
    if (nextProps.shipCoords !== this.state.shipCoords || nextProps.shipThrust !== this.state.shipThrust || nextProps.shipState !== this.state.shipState || nextProps.shipFuel !== this.state.shipFuel) {
      this.setState({
        shipCoords: nextProps.shipCoords,
        shipThrust: nextProps.shipThrust,
        shipState: nextProps.shipState,
        shipFuel: nextProps.shipFuel,
      });
    }
  }

  componentWillUnmount() {
  }

  onKeyPress = (event: any) => {
    // event.preventDefault();
    let nativeEvent: any = event.nativeEvent;
    console.log(nativeEvent.key);
    if (nativeEvent.key === 'Enter') {
    }
  }

  onButtonClicked(action: string, event: any) {
    // console.log(`onButtonClicked: ${action}`);
    event.preventDefault();

    switch (action) {
      case 'TBD':
        break;
    }
  }

  onChangeHandler = (event: any) => {
    // console.log(`onChangeHandler`, event);
    let nativeEvent: any = event.nativeEvent;
    const stateObject: any = {
    };
    const propertyName: string = nativeEvent.target.name;
    stateObject[propertyName] = nativeEvent.target.value;
    this.setState(stateObject)
  }

  onBlurHandler = (event: any) => {
    // console.log(`onBlurHandler`, event);
    let nativeEvent: any = event.nativeEvent;
    nativeEvent.target.select();
  }

  onFocus = (event: any) => {
    let nativeEvent: any = event.nativeEvent;
    nativeEvent.target.select();
  }

  onCheckboxHandler(event: any) {
    const nativeEvent: any = event.nativeEvent;
    // this.log.debug(`onCheckboxHandler:`, nativeEvent);
    let updateObj: any = undefined;
    switch (nativeEvent.target.id) {
      case 'tbd':
        updateObj = { tbd: nativeEvent.target.checked };
        break;
    }
    if (updateObj) {
      this.setState(updateObj);
    }
  }

  onOptionHandler(event: any) {
    const nativeEvent: any = event.nativeEvent;
    this.log.debug(`onOptionHandler:`, nativeEvent);
    let updateObj: any = undefined;
    switch (nativeEvent.target.id) {
      case 'tbd':
        updateObj = { appName: nativeEvent.target.value };
        break;
    }

    if (updateObj) {
      this.setState(updateObj);
    }
  }

  handleDragOver(event: any) {
  }

  render() {
    const width = 800;
    const height = 600;
    const coords: any = this.state.shipCoords;
    const rectCoords: [number, number, number, number] = [coords.x, coords.y, 40, 40];
    const pad = this.props.landingPadRect;
    const fuel = { x: 10, y: 10, width: this.props.shipFuel * 3, height: 10 };
    let fill = "#C7F2E4";
    if (this.state.shipThrust.y !== 0) {
      fill = "#FF756E";
    }
    const stroke = '#FFFFFF';

    switch (this.state.shipState) {
      case ShipState.FALLING:
        fill = 'none'; //'#FAE148';
        break;
      case ShipState.THRUSTING:
        fill = '#AAAAAA'; //'#F0B67F';
        break;
      case ShipState.LANDED:
        fill = '#C7F2E4';
        break;
      case ShipState.CRASHED:
        fill = '#FF756E';
        break;
    }
    const padFill = 'none'; //'#086375';
    const fuelFill = 'none'; //'#cdb2df';

    return (
      <div className='GameCanvas'>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ border: '1px solid black' }}>
          <rect stroke={stroke} fill={fuelFill} x={fuel.x} y={fuel.y} width={fuel.width} height={fuel.height} />
          <rect stroke={stroke} fill={fill} x={rectCoords[0]} y={rectCoords[1]} width={rectCoords[2]} height={rectCoords[3]} />
          <rect stroke={stroke} fill={padFill} x={pad.x} y={pad.y} width={pad.width} height={pad.height} />
        </svg>
      </div>
    );
  }
}
