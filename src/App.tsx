import React, { Component } from 'react';
import GameConfig, { GameConfigOptions } from './model/GameConfig';
import './App.css';

import Logo from './components/Logo/Logo';
import Model from './model/Model';
// import Log from './utils/Log';

import LanderGame from './components/LanderGame/LanderGame';
import PetGame from './components/PetGame/PetGame';

//panel components
import Settings from './components/Settings/Settings';

// let fs: any;
// let path: any;
// let app: any;
// if (process.env.REACT_APP_MODE === 'electron') {
//     fs = require('fs-extra');
//     path = require('path');
//     app = require('electron').remote.app;
// }

export interface AppProps {
    model: Model
}

export interface AppState {
    settings: GameConfig;
    activeTab: string;
}

export default class App extends Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);

        this.state = {
            activeTab: 'Settings',
            settings: this.props.model.config.json,
        };
    }

    // componentDidMount() {}

    onTabButtonClicked(action: string, event: any) {
        event.preventDefault();
        switch (action) {
            case 'tabSettings':
                this.setState({ activeTab: 'Settings' });
                break;
            case 'tabLanderGame':
                this.props.model.resetGame('LanderGame');
                this.setState({ activeTab: 'LanderGame' });
                break;
            case 'tabPetGame':
                this.props.model.resetGame('PetGame');
                this.setState({ activeTab: 'PetGame' });
                break;
        }
    }

    onSettingsChanged(settings: GameConfigOptions) {
        this.props.model.setAppParams(settings);
        this.setState({
            settings: this.props.model.config.json
        })
    }

    // File Drop

    handleUploadFileList(fileList: any[]): void {
        console.log(`handleUploadFileList: `, fileList);
        let fileListLength: number = fileList.length;
        for (var i = 0; i < fileListLength; i++) {
            var file = fileList[i];
            this.handleUploadBlob(file);
        }
    }

    getFileExtension(filename: string) {
        var idx = filename.lastIndexOf('.');
        return (idx < 1) ? "" : filename.substr(idx + 1);
    }

    handleUploadBlob(file: any): void {
        console.log(`handleUploadBlob: `, file);
        let fileExtension: string = this.getFileExtension(file.name);
        switch (fileExtension) {
            case 'json':
                const jsonReader = new FileReader();
                jsonReader.onload = (event: any) => {
                    const jsonText = event.target.result;
                    console.log(jsonText);
                    try {
                        const jsonObject = JSON.parse(jsonText);
                        console.log(jsonObject);
                        if (jsonObject.RomClient) {
                            console.log(`handleUploadBlob: settings:`, jsonObject);
                            this.onSettingsChanged(jsonObject);
                        }
                    } catch (error) {
                        console.log(`upload json error: `, error);
                    }
                }
                jsonReader.readAsText(file);
                break;
        }
    }

    gameChanged = (action => {
        switch (action) {
            case 'btnReset':
                this.setState({
                    settings: this.props.model.config.json,
                });
                break;
            case 'btnSave':
                this.setState({
                    settings: this.props.model.config.json,
                });
                break;
        }

    });

    getActiveTab(): any {
        let activeTab: any = null;
        switch (this.state.activeTab) {
            case 'Settings':
                activeTab =
                    <Settings
                        model={this.props.model}
                        settings={this.state.settings}
                        changed={(settings: GameConfigOptions) => { this.onSettingsChanged(settings) }}
                        fileHandler={(fileList: any[]) => this.handleUploadFileList(fileList)}
                    />
                break;
            case 'LanderGame':
                activeTab =
                    <LanderGame model={this.props.model}
                    />
                break;
            case 'PetGame':
                activeTab =
                    <PetGame model={this.props.model} changed={this.gameChanged}
                    />
                break;
        }
        return activeTab;
    }

    getButtonStyle(buttonName: string): string {
        let style: string = 'btn btn-primary';
        if (buttonName === this.state.activeTab) {
            style = 'btn btn-info';
        }
        return style;
    }

    render() {
        return (
            <div className={"App"}>
                <header className={"App_header"}>
                    <Logo />
                    <div className={"App_nav_tabs"}>
                        <button id='btn_settings' type='button' className={this.getButtonStyle('Settings')}
                            onClick={(event) => this.onTabButtonClicked(`tabSettings`, event)}>
                            Settings
                        </button>
                        <button id='btn_game' type='button' className={this.getButtonStyle('LanderGame')}
                            onClick={(event) => this.onTabButtonClicked(`tabLanderGame`, event)}>
                            LanderGame
                        </button>
                        <button id='btn_pet' type='button' className={this.getButtonStyle('PetGame')}
                            onClick={(event) => this.onTabButtonClicked(`tabPetGame`, event)}>
                            PetGame
                        </button>
                    </div>
                </header>
                <div className={"Tabs"}>
                    {this.getActiveTab()}
                </div>
            </div>
        );
    }
}
