import * as React from "react";

import './LanderGame.css';
import Model from '../../model/Model';
import { GameStatus } from '../../model/GameController';
import Log from '../../utils/Log';

import Checkbox from '../Checkbox/Checkbox';
import LanderGameCanvas from './LanderGameCanvas';

export interface LanderGameProps {
  model: Model;
}

export interface LanderGameState {
  shipCoords: any;
  shipVelocity: any;
  shipThrust: any;
  shipFuel: number;
  gameStatus: GameStatus;
  gravity: any;
  world: any;
  landingPadRect: any;
  autoPilotRunning: boolean;
  totalTime: number;
  fuelBonus: number;
  timeBonus: number;
  score: number;
}

export default class LanderGame extends React.Component<LanderGameProps, LanderGameState> {

  public log: Log;

  private _mainLoopInterval: NodeJS.Timeout;

  constructor(props: LanderGameProps) {
    super(props);
    const gameState = this.props.model.gameState;
    if (gameState) {
      this.state = this.props.model.gameState;
    } else {
      this.state = {
        shipCoords: { x: 0, y: 0 },
        shipVelocity: { x: 0, y: 0 },
        shipThrust: { x: 0, y: 0 },
        shipFuel: 0,
        gameStatus: GameStatus.INVALID,
        gravity: 0,
        world: {
          width: 800,
          height: 600,
        },
        landingPadRect: { x: 0, y: 0, width: 0, height: 0 },
        autoPilotRunning: false,
        totalTime: 0,
        fuelBonus: 0,
        timeBonus: 0,
        score: 0,
      }
    }
    console.log(this.state);
  }

  componentWillMount() {
    // this.props.model.resetGame('LanderGame');
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
        this.props.model.resetGame('LanderGame');
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
    if (gameState) {
      this.setState(gameState);
    }
  }

  render() {
    const gameStateData = {
      keyStatus: this.props.model.keyStatus,
      world: this.state.world,
      gameStatus: GameStatus[this.state.gameStatus],
      shipFuel: this.state.shipFuel,
      shipVelocity: this.state.shipVelocity,
      totalTime: this.state.totalTime,
      fuelBonus: this.state.fuelBonus,
      timeBonus: this.state.timeBonus,
      score: this.state.score,
    }
    const gameStateText = JSON.stringify(gameStateData, null, 2);
    return (
      <div className='LanderGame' >
        <LanderGameCanvas shipCoords={this.state.shipCoords} shipThrust={this.state.shipThrust} gameStatus={this.state.gameStatus} world={this.state.world} landingPadRect={this.state.landingPadRect} shipFuel={this.state.shipFuel} />
        <div id='LanderGameControls'>
          <textarea className="KeyStatus" value={gameStateText} readOnly rows={30} />
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
