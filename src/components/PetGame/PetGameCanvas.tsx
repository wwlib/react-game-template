import * as React from "react";
import './PetGame.css';
import Log from '../../utils/Log';

import { GameStatus } from '../../model/GameController';
import { PetState, PetStateRanges, TimerType, UserAction, UserEvent } from '../../model/PetController';
import PieMeter from './PieMeter';

export interface PetCanvasProps {
  petState: PetState;
  petStateRanges: PetStateRanges;
}

export interface PetCanvasState {
  loneliness: number;
  gameStatus: GameStatus;
}

export default class PetCanvas extends React.Component<PetCanvasProps, PetCanvasState> {

  public log: Log;

  constructor(props: PetCanvasProps) {
    super(props);
    this.state = {
      loneliness: this.props.petState.loneliness,
      gameStatus: this.props.petState.gameStatus,
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps: PetCanvasProps) {
    // console.log(nextProps);
    if (nextProps.petState !== this.props.petState) {
      this.setState({
        loneliness: nextProps.petState.loneliness,
        gameStatus: nextProps.petState.gameStatus,
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

  onButtonClicked(group: string, action: string, event: any) {
    console.log(`onButtonClicked: ${group} --> ${action}`);
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

  getUserEventButtons() {
    const result = [];
    for (const actionType of Object.values(UserEvent)) {
      const actionTypeNum = Number(actionType);
      if (!isNaN(actionTypeNum)) {
        const actionString = UserEvent[actionTypeNum];
        const id = actionString;
        const button = <button key={actionTypeNum} id={id} type='button' className={`btn btn-primary App-button`}
          onClick={(event) => this.onButtonClicked('userEvent', actionString, event)}>
          {actionString}
        </button>
        result.push(button);
      }
    }
    return result;
  }

  getUserActionButtons() {
    const result = [];
    for (const actionType of Object.values(UserAction)) {
      const actionTypeNum = Number(actionType);
      if (!isNaN(actionTypeNum)) {
        const actionString = UserAction[actionTypeNum];
        const id = actionString;
        const button = <button key={actionTypeNum} id={id} type='button' className={`btn btn-primary App-button`}
          onClick={(event) => this.onButtonClicked('userAction', actionString, event)}>
          {actionString}
        </button>
        result.push(button);
      }
    }
    return result;
  }

  render() {

    const width = 800;
    const height = 600;
    const maxLoneliness = this.props.petStateRanges.max.loneliness;
    const lonelinessRect = { x: 10, y: 10, width: 200 * (this.state.loneliness / maxLoneliness), height: 10 };
    const fillDefault: string = "#C7F2E4";
    // const fillNone = 'none';
    // let fill = fillDefault;
    const stroke = '#FFFFFF';
    // const fuelFill = 'none'; //'#cdb2df';
    const timer = this.props.petState.timers[TimerType.LAST_INTERACTION];
    const lastInteractionPercent = timer.percent;

    return (
      <div className='PetGameCanvas'>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ border: '1px solid black' }}>
          <rect stroke={stroke} fill={fillDefault} x={lonelinessRect.x} y={lonelinessRect.y} width={lonelinessRect.width} height={lonelinessRect.height} />
          <text x={100} y={220} style={{
            fontSize: '13px',
            fontFamily: 'helvetica',
            fill: '#FFFFFF'
          }} >LAST_INTERACTION</text>
          <PieMeter name={'LAST_INTERACTION'} x={100} y={100} width={100} height={100} fill={'#FFFFFF'} percent={lastInteractionPercent} clicked={(data) => console.log(data)} />
        </svg>
        <div>
          {this.getUserEventButtons()}
        </div>
        <div>
          {this.getUserActionButtons()}
        </div>

      </div>
    );
  }
}
