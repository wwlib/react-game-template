import * as React from "react";
import './PetGame.css';
import Log from '../../utils/Log';

import { getEnumLabels } from '../../utils/Utils';
import { PetState, NeedControllerEventType, Emotion, IntentType, RelationshipLevel } from '../../model/PetController';
import PieTimerDisplay from './PieTimerDisplay';
import BarValueDisplay from './BarValueDisplay';

export interface PetCanvasProps {
  petState: PetState;
  clicked: any;
}

export interface PetCanvasState {
  petState: PetState;
}

export default class PetCanvas extends React.Component<PetCanvasProps, PetCanvasState> {

  public log: Log;

  constructor(props: PetCanvasProps) {
    super(props);
    this.state = {
      petState: this.props.petState,
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
        petState: nextProps.petState,
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
    // console.log(`onButtonClicked: ${group} --> ${action}`);
    event.preventDefault();
    if (this.props.clicked) {
      this.props.clicked(group, action);
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

  getNeedValues(clickGroup: string, state: PetState): any {
    const valueDisplays: any[] = [];
    state.needs.forEach(need => {
      const needBar = <BarValueDisplay key={need.name} name={`${need.name} - ${need.urgency}`} percent={need.percent} urgency={need.urgency} clicked={(name, percent) => console.log(name, percent)}/>
      let cooldownBar = null;
      if (need.cooldown) {
        const cooldown = need.cooldown;
        cooldownBar = <BarValueDisplay key={cooldown.name} name={`${cooldown.name}`} percent={cooldown.percent} urgency={need.urgency} clicked={(name, percent) => console.log(name, percent)}/>
      }
      const display = <div className='ValueBarGroup'>
        {needBar}
        {cooldownBar}
      </div>
      valueDisplays.push(display);
    });
    let result: any = <div className='ValueContainer'>
      <div className='ValueContainerHeader'>{clickGroup}</div>
      {valueDisplays}
    </div>
    return result;
  }

  getTimers(clickGroup: string, state: PetState): any {
    const valueDisplays: any[] = [];
    state.timers.forEach(timer => {
      const display = <PieTimerDisplay key={timer.name} name={timer.name} percent={timer.percent} clicked={(name, percent) => console.log(name, percent)}/>
      valueDisplays.push(display);
    });
    let result: any = <div className='TimerContainer'>
      <div className='TimerContainerHeader'>{clickGroup}</div>
      {valueDisplays}
    </div>
    return result;
  }

  getEnumButtons<Type>(arg: Type, clickGroup: string): any {
    const buttons: any[] = [];
    const labels: string[] = getEnumLabels(arg);
    labels.forEach(label => {
      const button = <button key={label} id={label} type='button' className={`btn btn-primary App-button`}
        onClick={(event) => this.onButtonClicked(clickGroup, label, event)}>
        {label}
      </button>
      buttons.push(button);
    });
    let result: any = <div className='ButtonContainer'>
      <div className='ButtonContainerHeader'>{clickGroup}</div>
      {buttons}
    </div>
    return result;
  }

  render() {
    return (
      <div className='PetGameCanvas'>
        <div className='PetGameCanvasCol1'>
          {this.getTimers('timers', this.state.petState)}
        </div>
        <div className='PetGameCanvasCol2'>
          {this.getNeedValues('needs', this.state.petState)}
        </div>
        <div className='PetGameCanvasCol3'>
          {this.getEnumButtons(NeedControllerEventType, 'needControllerEventType')}
          {this.getEnumButtons(Emotion, 'petEmotion')}
          {this.getEnumButtons(IntentType, 'petIntent')}
          {this.getEnumButtons(RelationshipLevel, 'relationshipLevel')}
        </div>
      </div>
    );
  }
}
