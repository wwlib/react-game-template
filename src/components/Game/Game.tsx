import * as React from "react";

import './Game.css';
import Model from '../../model/Model';
import Log from '../../utils/Log';

import Checkbox from '../Checkbox/Checkbox';
import GameCanvas from './GameCanvas';

export enum ShipState {
  FALLING,
  THRUSTING,
  LANDED,
  CRASHED
}

export interface GameProps {
  model: Model;
}

export interface GameState {
  shipCoords: any;
  shipVelocity: any;
  shipThrust: any;
  shipFuel: number;
  shipState: ShipState;
  gravity: any;
  landingPadRect: any;
  autoPilotRunning: boolean;
}

export default class Game extends React.Component<GameProps, GameState> {

  public log: Log;

  private _mainLoopInterval: NodeJS.Timeout;

  constructor(props: GameProps) {
    super(props);
    this.state = this.props.model.gameState;
  }

  componentWillMount() {
    this.props.model.resetGame();
    this._mainLoopInterval = setInterval(this.mainLoop, 100);
  }

  componentWillUnmount() {
    clearInterval(this._mainLoopInterval);
  }

  // componentDidMount() {}

  // componentWillReceiveProps(nextProps: GameProps) {
  //   // console.log(nextProps);
  //   if (true) {
  //     this.setState({
  //     });
  //   }
  // }

  onKeyPress = (event: any) => {
    // event.preventDefault();
    let nativeEvent: any = event.nativeEvent;
    console.log(nativeEvent.key);
    if (nativeEvent.key === 'Enter') {
    }
  }

  onButtonClicked = (action: string, event: any) => {
    // console.log(`onButtonClicked: ${action}`);
    event.preventDefault();

    switch (action) {
      case 'btnReset':
        console.log(`onButtonClicked: btnReset`);
        this.props.model.resetGame();
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

  onCheckboxHandler = (id: string, isChecked: boolean) => {
    console.log(id, isChecked);
    switch (id) {
      case 'AutoPilot':
        if (!isChecked) {
          this.props.model.resetKeyStatus();
        }
        this.props.model.autoPilot.running = isChecked;
        break;
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

  mainLoop = () => {
    const gameState = this.props.model.update();
    this.setState(gameState);
  }

  render() {
    const gameStatusData = {
      keyStatus: this.props.model.keyStatus,
      shipState: ShipState[this.state.shipState],
      shipFuel: this.state.shipFuel,
      shipVelocity: this.state.shipVelocity,
    }
    const gameStatus = JSON.stringify(gameStatusData, null, 2);
    return (
      <div className='Game' >
        <GameCanvas shipCoords={this.state.shipCoords} shipThrust={this.state.shipThrust} shipState={this.state.shipState} landingPadRect={this.state.landingPadRect} shipFuel={this.state.shipFuel} />
        <div id='GameControls'>
          <textarea className="KeyStatus" value={gameStatus} readOnly rows={20} />
          <Checkbox label={'AutoPilot'} isChecked={this.state.autoPilotRunning} changed={(isChecked) => this.onCheckboxHandler('AutoPilot', isChecked)} />
          <button id='btnReset' type='button' className={`btn btn-primary App-button`}
            onClick={(event) => this.onButtonClicked(`btnReset`, event)}>
            Reset
          </button>
        </div>
      </div>
    );
  }
}
