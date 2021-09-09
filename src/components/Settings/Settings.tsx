import * as React from "react";
import GameConfig from '../../model/GameConfig';

import './Settings.css';
import Model from '../../model/Model';
import Log from '../../utils/Log';
import parentLog from '../../log';
import FileDrop from '../FileDrop/FileDrop';

export interface SettingsProps { model: Model, settings: GameConfig, changed: any, fileHandler: any }
export interface SettingsState {
  LanderGameSettings: string;
  PetGameSettings: string;
}

export default class Settings extends React.Component<SettingsProps, SettingsState> {

  public log: Log;

  private _onChangeHandler: any = (type: string, event: any) => this.onChangeHandler(type, event);
  private _onBlurHandler: any = (type: string, event: any) => this.onBlurHandler(type, event);
  private _onCheckboxHandler: any = (event: any) => this.onCheckboxHandler(event);
  private _onOptionHandler: any = (event: any) => this.onOptionHandler(event);

  constructor(props: SettingsProps) {
    super(props);
    this.log = parentLog.createChild('App');
    console.log(`this.props.settings:`, this.props.settings);
    this.state = {
      LanderGameSettings: GameConfig.SettingsToString(this.props.settings.LanderGame) || "{}",
      PetGameSettings: GameConfig.SettingsToString(this.props.settings.PetGame) || "{}",
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
        LanderGameSettings: GameConfig.SettingsToString(nextProps.settings.LanderGame) || this.state.LanderGameSettings,
        PetGameSettings: GameConfig.SettingsToString(nextProps.settings.PetGame) || this.state.PetGameSettings,
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

  onChangeHandler(type: string, event: any) {
    const nativeEvent: any = event.nativeEvent;
    // this.log.debug(nativeEvent);
    let updateObj: any = undefined;
    switch (type) {
      case 'LanderGame':
        updateObj = { LanderGameSettings: nativeEvent.target.value };
        break;
      case 'PetGame':
        updateObj = { PetGameSettings: nativeEvent.target.value };
        break;
    }

    if (updateObj) {
      this.setState(updateObj);
    }
  }

  onBlurHandler(type: string, event: any) {
    switch (type) {
      case 'LanderGame':
        this.props.changed({
          LanderGame: GameConfig.SettingsToJson(this.state.LanderGameSettings) || this.props.settings.LanderGame,
        });
        break;
      case 'PetGame':
        this.props.changed({
          PetGame: GameConfig.SettingsToJson(this.state.PetGameSettings) || this.props.settings.PetGame,
        });
    }
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
                <label htmlFor="LanderGameSettings" className="col-form-label">LanderGameSettings</label>
                <textarea id="LanderGameSettings" rows={10} placeholder="" value={this.state.LanderGameSettings} onChange={(event) => this._onChangeHandler('LanderGame', event)} onBlur={(event) => this._onBlurHandler('LanderGame', event)} />
              </div>
              <div className="GameSettingsItem">
                <label htmlFor="PetGameSettings" className="col-form-label">PetGameSettings</label>
                <textarea id="PetGameSettings" rows={10} placeholder="" value={this.state.PetGameSettings} onChange={(event) => this._onChangeHandler('PetGame', event)} onBlur={(event) => this._onBlurHandler('PetGame', event)} />
              </div>
            </div>
          </div>
        </FileDrop>
      </div>
    );
  }
}
