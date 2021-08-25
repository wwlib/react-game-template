import * as React from "react";
import RomClientConfig from '../../model/RomClientConfig';

import './Connect.css';
import Model from '../../model/Model';
import Log from '../../utils/Log';
import parentLog from '../../log';

// import * as WebSocket from 'ws';

export interface ConnectProps { model: Model, settings: RomClientConfig }
export interface ConnectState {
  messages: string;
  ttsInput: string;
}

export default class Connect extends React.Component<ConnectProps, ConnectState> {

  public log: Log;

  // private _onChangeHandler: any = (event: any) => this.onChangeHandler(event);
  // private _onBlurHandler: any = (event: any) => this.onBlurHandler(event);
  // private _onCheckboxHandler: any = (event: any) => this.onCheckboxHandler(event);
  // private _onOptionHandler: any = (event: any) => this.onOptionHandler(event);

  private _webSocket: any; //WebSocket;

  constructor(props: ConnectProps) {
    super(props);
    this.log = parentLog.createChild('App');
    // console.log(`this.props.settings:`, this.props.settings);
    this.state = {
      messages: 'messages...',
      ttsInput: 'Hello',
    }
  }

  componentWillMount() {

    this._webSocket = new WebSocket(`${this.props.settings.RomClient.hubUrl}/?clientId=${this.props.settings.RomClient.clientId}&targetedRobotId=${this.props.settings.RomClient.targetedRobotId}`);

    this._webSocket.onopen = () => {
      console.log('WebSocket Client Connected');
      const handshake: any = {
        handshake: {
          clientId: this.props.settings.RomClient.clientId,
          targetedRobotId: this.props.settings.RomClient.targetedRobotId,
        }
      }
      this._webSocket.send(JSON.stringify(handshake));
    };

    this._webSocket.onmessage = (e) => {
      let messages = this.state.messages;
      messages += '\n' + e.data + '\n';
      this.setState({
        messages: messages,
      });
      // console.log("Received: '" + e.data + "'");
    };
  }

  componentDidMount() {
  }

  // componentWillReceiveProps(nextProps: ConnectProps) {
  //   // console.log(nextProps);
  //   if (true) {
  //     this.setState({
  //       messages: '',
  //     });
  //   }
  // }

  componentWillUnmount() {
    this._webSocket.close();
    this._webSocket = undefined;
  }

  onKeyPress = (event: any) => {
    // event.preventDefault();
    let nativeEvent: any = event.nativeEvent;
    if (nativeEvent.key === 'Enter') {
      this.ttsSend(this.state.ttsInput);
      nativeEvent.target.select();
    }
  }

  ttsSend(prompt: string) {
    const message = {
      targetedRobotId: this.props.settings.RomClient.targetedRobotId,
      type: "transaction",
      command: {
        id: "not-used",
        type: 'tts',
        data: {
          prompt: prompt,
        }
      }
    }
    this._webSocket.send(JSON.stringify(message));
  }

  onButtonClicked(action: string, event: any) {
    // console.log(`onButtonClicked: ${action}`);
    event.preventDefault();

    switch (action) {
      case 'btnTtsSend':
        this.ttsSend(this.state.ttsInput);
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
    return (
      <div className='Connect'>
        <div className='ConnectGroup'>
          <div className='Row'>
            <div className="MessagesItem">
              <label htmlFor="MessagesItem" className="col-form-label">RomClientMessages</label>
              <textarea id="MessagesItem" rows={20} placeholder="" value={this.state.messages} readOnly />
            </div>
          </div>
          <div className='Row'>
            <input id='ttsInput' type='text' name='ttsInput' value={this.state.ttsInput} onChange={this.onChangeHandler} onBlur={this.onBlurHandler} onKeyPress={this.onKeyPress} />
          </div>
          <div className='Row'>
            <button id='btnTtsStart' type='button' className={`btn btn-primary App-button`}
              onClick={(event) => this.onButtonClicked(`btnTtsSend`, event)}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}
