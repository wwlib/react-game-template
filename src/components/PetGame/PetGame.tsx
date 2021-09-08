import * as React from "react";

import './PetGame.css';
import Model from '../../model/Model';
import { GameStatus } from '../../model/GameController';
import PetController, { Action, Emotion, PetState, RelationshipLevel, NeedControllerEvent, NeedControllerEventType } from '../../model/PetController';
import Log from '../../utils/Log';

// import Checkbox from '../Checkbox/Checkbox';
import PetGameCanvas from './PetGameCanvas';

export interface PetGameProps {
  model: Model;
  changed: any;
}

export interface PetGameState {
  petState: PetState;
  chatInput: string;
  chatOutput: string;
}

export default class PetGame extends React.Component<PetGameProps, PetGameState> {

  public log: Log;

  private _mainLoopInterval: NodeJS.Timeout;

  constructor(props: PetGameProps) {
    super(props);
    const gameState = this.props.model.getGameState();
    if (gameState) {
      this.state = {
        petState: gameState,
        chatInput: '',
        chatOutput: '',
      }
    } else {
      this.state = {
        petState: {
          userId: '',
          userName: '',
          userRelationshipLevel: RelationshipLevel.NONE,
          emotionalState: Emotion.CONTENT,
          personality: {
            extraversion: 1.0,
            agreeableness: 1.0,
            openness: 1.0,
            conscientiousness: 1.0,
            neuroticism: 1.0,
          },
          needs: [],
          visualizerData: {
            timers: [],
          },
          gameStatus: GameStatus.INVALID,
        },
        chatInput: '',
        chatOutput: '',
      }
    }
  }

  componentWillMount() {
    console.log(`PetGame: gameController:`, this.props.model.gameController);
    this._mainLoopInterval = setInterval(this.mainLoop, 100);
    this.props.model.gameController.addListener('action', this.onGameControllerAction);
  }

  componentWillUnmount() {
    clearInterval(this._mainLoopInterval);
    this.props.model.gameController.removeListener('action', this.onGameControllerAction);
  }

  // componentDidMount() {}

  // componentWillReceiveProps(nextProps: PetGameProps) {
  //   // console.log(nextProps);
  //   if (true) {
  //     this.setState({
  //     });
  //   }
  // }

  onGameControllerAction = (action: Action) => {
    // console.log(action);
    this.setState({
      chatOutput: this.state.chatOutput + action.data.message + '\n\n',
    });
  }

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
        this.props.model.setAppParams({ PetGame: {} }); // clear saved data
        this.props.model.resetGame('PetGame');
        this.props.changed('btnReset');
        break;
      case 'btnSave':
        this.props.model.setAppParams({
          PetGame: this.props.model.getGameState(true),
        });
        this.props.changed('btnSave');
        break;
    }
  }

  onGameCanvasClick = (group: string, action: string) => {
    const petController: PetController = this.props.model.gameController as PetController;
    switch (group) {
      case 'needControllerEventType':
        // console.log(`onGameCanvasClick: group: userEventType, action:`, action);
        const userEvent: NeedControllerEvent = new NeedControllerEvent(NeedControllerEventType[action], action);
        petController.onNeedControllerEvent(userEvent);
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
    const gameState = this.props.model.update({ includeVisualizerData: true });
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
      personality: this.state.petState.personality,
    }
    const gameStateText = JSON.stringify(gameStateData, null, 2);
    return (
      <div className='PetGame' >
        <PetGameCanvas petState={this.state.petState} clicked={this.onGameCanvasClick} />
        <div id='PetGameControls'>
          <textarea className="KeyStatus" value={gameStateText} readOnly rows={16} />
          {/* <Checkbox label={'AutoPilot'} isChecked={this.state.autoPilotRunning} changed={(isChecked) => this.onCheckboxHandler('AutoPilot', isChecked)} /> */}
          <button id='btnSave' type='button' className={`btn btn-primary App-button`}
            onClick={(event) => this.onButtonClicked(`btnSave`, event)}>
            Save
          </button>
          <button id='btnReset' type='button' className={`btn btn-primary App-button`}
            onClick={(event) => this.onButtonClicked(`btnReset`, event)}>
            Reset
          </button>
          <textarea className="ChatOutput" value={this.state.chatOutput} readOnly rows={20} />
        </div>
      </div>
    );
  }
}
