import Log from '../utils/Log';
import parentLog from './log';
import GameConfig from './GameConfig';

import GameController, { GameStatus } from './GameController';
import LanderController from './LanderController';
import PetController from './PetController';
import AutoPilot from './AutoPilot';

export default class Model {

  public log: Log;
  public config: GameConfig;

  public keyStatus: any;

  public gameController: GameController | undefined;
  public autoPilot: AutoPilot | undefined;

  constructor() {
    this.log = parentLog.createChild('Model');
    this.config = new GameConfig();

    this.keyStatus = {
      Meta: 'up',
      Shift: 'up',
      ArrowUp: 'up',
      ArrowDown: 'up',
      ArrowLeft: 'up',
      ArrowRight: 'up',
      Space: 'up',
    }

    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('focus', this.onFocus);
  }

  onKeyDown = (e: KeyboardEvent) => {
    // console.log(e);
    const key: string = e.code;
    switch (key) {
      case 'Meta':
        this.keyStatus.Meta = 'down';
        break;
      case 'Shift':
        this.keyStatus.Shift = 'down';
        break;
      case 'ArrowUp':
        this.keyStatus.ArrowUp = 'down';
        break;
      case 'ArrowDown':
        this.keyStatus.ArrowDown = 'down';
        break;
      case 'ArrowLeft':
        this.keyStatus.ArrowLeft = 'down';
        break;
      case 'ArrowRight':
        this.keyStatus.ArrowRight = 'down';
        break;
      case 'KeyW':
        this.keyStatus.KeyW = 'down';
        break;
      case 'KeyS':
        this.keyStatus.KeyS = 'down';
        break;
      case 'KeyA':
        this.keyStatus.KeyA = 'down';
        break;
      case 'KeyD':
        this.keyStatus.KeyD = 'down';
        break;
      case 'Space':
        this.keyStatus.Space = 'down';
        break;
    }
  }

  onKeyUp = (e: KeyboardEvent) => {
    // console.log(e);
    const key: string = e.code;
    switch (key) {
      case 'Meta':
        this.keyStatus.Meta = 'up';
        break;
      case 'Shift':
        this.keyStatus.Shift = 'up';
        break;
      case 'ArrowUp':
        this.keyStatus.ArrowUp = 'up';
        break;
      case 'ArrowDown':
        this.keyStatus.ArrowDown = 'up';
        break;
      case 'ArrowLeft':
        this.keyStatus.ArrowLeft = 'up';
        break;
      case 'ArrowRight':
        this.keyStatus.ArrowRight = 'up';
        break;
      case 'KeyW':
        this.keyStatus.KeyW = 'up';
        break;
      case 'KeyS':
        this.keyStatus.KeyS = 'up';
        break;
      case 'KeyA':
        this.keyStatus.KeyA = 'up';
        break;
      case 'KeyD':
        this.keyStatus.KeyD = 'up';
        break;
      case 'Space':
        this.keyStatus.Space = 'up';
        break;
    }
  }

  onFocus = () => {
    this.resetKeyStatus();
  }

  resetKeyStatus() {
    this.keyStatus.Meta = 'up';
    this.keyStatus.Shift = 'up';
    this.keyStatus.ArrowUp = 'up';
    this.keyStatus.ArrowDown = 'up';
    this.keyStatus.ArrowLeft = 'up';
    this.keyStatus.ArrowRight = 'up';
    this.keyStatus.KeyW = 'up';
    this.keyStatus.KeyS = 'up';
    this.keyStatus.KeyA = 'up';
    this.keyStatus.KeyD = 'up';

    this.keyStatus.Space = 'up';
  }

  setAppParams(params: any): void {
    this.log.debug(`setAppParams:`, params);
    this.config.init(params);
    this.config.saveToLocalStorage();
  }

  resetGame(type: string) {
    console.log(`Model: resetGame: ${type}`, this.config);
    this.resetKeyStatus();
    this.quitGame();
    if (type === 'LanderGame') {
      this.gameController = new LanderController(this);
      this.autoPilot = new AutoPilot(this.gameController, this.keyStatus);
      if (this.config.LanderGame.autoPilot) {
        this.autoPilot.start();
      }
    } else if (type === 'PetGame') {
      const stateData = this.config.PetGame;
      this.gameController = new PetController(this, 'pet-1', stateData);
    }
  }

  quitGame() {
    if (this.gameController) {
      this.gameController.dispose();
    }
    if (this.autoPilot) {
      this.autoPilot.dispose();
    }
  }

  copyGameState(state: any) {
    let stateCopy: any = undefined;
    if (state) {
      stateCopy = {};
      Object.assign(stateCopy, state);
    }
    return stateCopy;
  }

  getGameState(copy: boolean = false): any | undefined {
    let state: any = undefined;
    if (this.gameController) {
      if (copy) {
        state = this.copyGameState(this.gameController.state);
      } else {
        state = this.gameController.state
      }
    }
    return state;
  }

  update(options?: any): any {
    let state: any = undefined;
    if (this.gameController) {
      state = this.gameController.update(options);
      if (this.gameController.gameStatus === GameStatus.CRASHED || this.gameController.gameStatus === GameStatus.LANDED) {
        if (this.autoPilot) {
          this.autoPilot.running = false;
        }
      }
    }
    return state;
  }

  dispose() {
    this.gameController?.dispose();
    this.autoPilot?.dispose();
    this.gameController = undefined;
    this.autoPilot = undefined;
  }
}