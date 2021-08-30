import * as React from "react";
import './Game.css';
import Log from '../../utils/Log';

import { ShipState } from './Game';

export interface GameCanvasProps {
  shipCoords: any;
  shipThrust: any;
  shipFuel: number;
  shipState: ShipState;
  world: any;
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
    const width = this.props.world.width;
    const height = this.props.world.height;
    const coords: any = this.state.shipCoords;
    const ship: any = { x: coords.x - 20, y: coords.y - 20};
    // const rectCoords: [number, number, number, number] = [coords.x, coords.y, 40, 40];
    const pad = this.props.landingPadRect;
    const maxFuel = this.props.world.height * 2;
    const fuel = { x: 10, y: 10, width: (this.props.world.width - 20) * this.props.shipFuel / maxFuel, height: 10 };
    const fillDefault: string = "#C7F2E4";
    const fillNone = 'none';
    let fill = fillDefault;
    if (this.state.shipThrust.y !== 0) {
      fill = "#FF756E";
    }
    const stroke = '#FFFFFF';
    
    const fillThrust: any = { l: fillNone, r: fillNone, d: fillNone };
    const fillThrustOn = "#FF756E";
    const strokeThrust = "#666666";

    switch (this.state.shipState) {
      case ShipState.FALLING:
        fill = 'none'; //'#FAE148';
        break;
      case ShipState.THRUSTING:
        fill = 'none'; //'#AAAAAA'; //'#F0B67F';
        if (this.state.shipThrust.y !== 0) { fillThrust.d = fillThrustOn };
        if (this.state.shipThrust.x < 0) { fillThrust.r = fillThrustOn };
        if (this.state.shipThrust.x > 0) { fillThrust.l = fillThrustOn };
        break;
      case ShipState.LANDED:
        fill = '#C7F2E4';
        break;
      case ShipState.CRASHED:
        fill = '#FF756E';
        break;
    }
    const padFill = '#AAAAAA'; //'#086375';
    const fuelFill = 'none'; //'#cdb2df';

    return (
      <div className='GameCanvas'>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ border: '1px solid black' }}>
          <rect stroke={stroke} fill={fuelFill} x={fuel.x} y={fuel.y} width={fuel.width} height={fuel.height} />
          {/* <rect stroke={stroke} fill={fill} x={rectCoords[0]} y={rectCoords[1]} width={rectCoords[2]} height={rectCoords[3]} /> */}
          <rect stroke={stroke} fill={padFill} x={pad.x} y={pad.y} width={pad.width} height={pad.height} />
          <svg viewBox={`0 0 80 80`} x={ship.x} y={ship.y} width={80} height={80}>
            <rect stroke={stroke} fill={fill} x={20} y={20} width={40} height={40} stroke-width="3%" />
            <rect stroke={strokeThrust} fill={fillThrust.l} x={5} y={50} width={10} height={10} />
            <rect stroke={strokeThrust} fill={fillThrust.r} x={65} y={50} width={10} height={10} />
            <rect stroke={strokeThrust} fill={fillThrust.d} x={35} y={65} width={10} height={10} />
          </svg>
        </svg>
      </div>
    );
  }
}
