import * as React from "react";

import './PetGame.css';
import Model from '../../model/Model';
import { GameStatus } from '../../model/GameController';
import PetController, { Emotion, PetState, RelationshipLevel } from '../../model/PetController';
import Log from '../../utils/Log';

import Checkbox from '../Checkbox/Checkbox';
import PetGameCanvas from './PetGameCanvas';

export interface PetGameProps {
  model: Model;
}

export interface PetGameState {
  petState: PetState;
}

export default class PetGame extends React.Component<PetGameProps, PetGameState> {

  public log: Log;

  private _mainLoopInterval: NodeJS.Timeout;

  constructor(props: PetGameProps) {
    super(props);
    const gameState = this.props.model.gameState;
    if (gameState) {
      this.state = {
        petState: gameState,
      }
    } else {
      this.state = {
        petState: {
          userId: '',
          userName: '',
          userRelationshipLevel: RelationshipLevel.NONE,
          emotionalState: Emotion.CONTENT,
          needs: {},
          timers: {},
          gameStatus: GameStatus.INVALID,
          intentQueue: [],
        }
      }
    }
  }

  componentWillMount() {
    // this.props.model.resetGame('PetGame');
    this._mainLoopInterval = setInterval(this.mainLoop, 100);
  }

  componentWillUnmount() {
    clearInterval(this._mainLoopInterval);
  }

  // componentDidMount() {}

  // componentWillReceiveProps(nextProps: PetGameProps) {
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
    // console.log(`PetGame: onButtonClicked:`, action);
    event.preventDefault();

    switch (action) {
      case 'btnReset':
        console.log(`onButtonClicked: btnReset`);
        this.props.model.resetGame('PetGame');
        break;
    }
  }

  onGameCanvasClick = (group: string, action: string) => {
    const petController: PetController =  this.props.model.gameController as PetController;
    petController.onGameCanvasClick(group, action);
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
      this.setState({ petState: gameState });
    }
  }

  render() {
    const gameStateData = {
      userId: this.state.petState.userId,
      userName: this.state.petState.userName,
      userRelationshipLevel: RelationshipLevel[this.state.petState.userRelationshipLevel],
      gameStatus: GameStatus[this.state.petState.gameStatus],
      emotionalState: Emotion[this.state.petState.emotionalState],
    }
    const gameStateText = JSON.stringify(gameStateData, null, 2);
    return (
      <div className='PetGame' >
        <PetGameCanvas petState={this.state.petState} clicked={this.onGameCanvasClick}/>
        <div id='PetGameControls'>
          <textarea className="KeyStatus" value={gameStateText} readOnly rows={30} />
          {/* <Checkbox label={'AutoPilot'} isChecked={this.state.autoPilotRunning} changed={(isChecked) => this.onCheckboxHandler('AutoPilot', isChecked)} /> */}
          <button id='btnReset' type='button' className={`btn btn-primary App-button`}
            onClick={(event) => this.onButtonClicked(`btnReset`, event)}>
            Reset
          </button>
        </div>
      </div>
    );
  }
}
