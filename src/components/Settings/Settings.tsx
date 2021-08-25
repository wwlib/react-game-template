import * as React from "react";
import GameConfig from '../../model/GameConfig';

import './Settings.css';
import Model from '../../model/Model';
import Log from '../../utils/Log';
import parentLog from '../../log';
import FileDrop from '../FileDrop/FileDrop';

export interface SettingsProps { model: Model, settings: GameConfig, changed: any, fileHandler: any }
export interface SettingsState {
  GameSettings: string;
}

export default class Settings extends React.Component<SettingsProps, SettingsState> {

  public log: Log;

  private _onChangeHandler: any = (event: any) => this.onChangeHandler(event);
  private _onBlurHandler: any = (event: any) => this.onBlurHandler(event);
  private _onCheckboxHandler: any = (event: any) => this.onCheckboxHandler(event);
  private _onOptionHandler: any = (event: any) => this.onOptionHandler(event);

  constructor(props: SettingsProps) {
    super(props);
    this.log = parentLog.createChild('App');
    console.log(`this.props.settings:`, this.props.settings);
    this.state = {
      GameSettings: GameConfig.SettingsToString(this.props.settings.Game) || "{}",
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps: SettingsProps) {
    // console.log(nextProps);
    if (true) {
      this.setState({
        GameSettings: GameConfig.SettingsToString(nextProps.settings.Game) || this.state.GameSettings,
      });
    }
  }

  onKeyPress(event: any) {
    event.preventDefault();
    let nativeEvent: any = event.nativeEvent;
    if (nativeEvent.key === 'Enter') {
      // TBD
    }
  }

  onChangeHandler(event: any) {
    const nativeEvent: any = event.nativeEvent;
    // this.log.debug(nativeEvent);
    let updateObj: any = undefined;
    switch (nativeEvent.target.id) {
      case 'GameSettings':
        updateObj = { GameSettings: nativeEvent.target.value };
        break;
    }

    if (updateObj) {
      this.setState(updateObj);
    }
  }

  onBlurHandler(event: any) {
    this.props.changed({
      Game: GameConfig.SettingsToJson(this.state.GameSettings) || this.props.settings.Game,
    });
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

  handleFileDrop(fileList: any, event: any): void {
    this.props.fileHandler(fileList, null);
  }

  handleDragOver(event: any) {
  }

  render() {
    return (
      <div className='Settings'>
        <FileDrop className='FileDrop' targetClassName='FileDropTarget'
          onDrop={(fileList: any, event: any) => this.handleFileDrop(fileList, event)}
          onDragOver={(event: any) => this.handleDragOver(event)}>


          <div className='SettingsGroup'>
            <div className='Row'>
              <div className="GameSettingsItem">
                <label htmlFor="GameSettings" className="col-form-label">GameSettings</label>
                <textarea id="GameSettings" rows={20} placeholder="" value={this.state.GameSettings} onChange={this._onChangeHandler} onBlur={this._onBlurHandler} />
              </div>
            </div>
          </div>
        </FileDrop>
      </div>
    );
  }
}
