export interface GameConfigOptions {
    Game: any;
}

export default class GameConfig {

    static LOCAL_STORAGE_ITEM_NAME: string = 'game-config';

    public Game: any = {};

    constructor(options?: any) {
        this.init(options);
    }

    init(options?: any): void {
        console.log(`GameConfig: init`, options);
        if (options) {
            this.initWithData(options);
        } else if (this.loadFromLocalStorage()) {
            console.log(`loaded settings from local storage.`);
        } else {
            console.log(`could not load settings from local storage.`)
            this.initWithData({
                Game: {
                    "autoPilot": true,
                    "world": {
                      "width": 800,
                      "height": 600
                    }
                  }
            });
        }
    }

    initWithData(options: any | any = {}): void {
        console.log(`GameConfig: initWithData`, options);
        // super.initWithData(options);
        if (options.Game) {
            this.Game = options.Game;
        } else {
            this.Game = {} as any;
        }
    }

    saveToLocalStorage(): boolean {
        console.log(`GameConfig: saveToLocalStorage`);
        const localStorage = window.localStorage;
        try {
            const dataText = JSON.stringify(this.json);
            const localStorageItemName: string = GameConfig.LOCAL_STORAGE_ITEM_NAME;
            console.log(localStorageItemName, dataText);
            localStorage.setItem(localStorageItemName, dataText);
            return true;
        } catch (error) {
            console.log(`saveToLocalStorage:`, error);
            return false;
        }
    }

    loadFromLocalStorage(): boolean {
        let result = false;
        const localStorage = window ? window.localStorage : undefined;

        if (localStorage) {
            const settingsText: string | null = localStorage.getItem(GameConfig.LOCAL_STORAGE_ITEM_NAME);
            console.log(`loadFromLocalStorage: `, settingsText);
            if (settingsText) {
                try {
                    const settings = JSON.parse(settingsText);
                    this.initWithData(settings);
                    result = true
                } catch (error) {
                    console.log(`loadFromLocalStorage`, error);
                }
            }
        }
        return result;
    }

    get json(): any {
        let json: any = {
            Game: this.Game,
        };
        return json;
    }

    static SettingsToJson(settingsText: string): any {
        let result: any;
        try {
            result = JSON.parse(settingsText);
        } catch (error) {
            console.log(error);
        }
        return result;
    }

    static SettingsToString(settings: any): string | undefined {
        let result: string | undefined;
        try {
            result = JSON.stringify(settings, null, 2);
        } catch (error) {
            console.log(error);
        }
        return result;
    }
}