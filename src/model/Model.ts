import Log from '../utils/Log';
import parentLog from './log';
import GameConfig from './GameConfig';

import GameController, { ShipState } from './GameController';
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

  get gameState(): any {
    const state: any = {
      shipCoords: { x: 140, y: 140 },
      shipVelocity: { x: 0, y: 0 },
      shipThrust: { x: 0, y: 0 },
      shipFuel: 200,
      shipState: ShipState.FALLING,
      gravity: { x: 0, y: -1 },
      landingPadRect: { x: 300, y: 590, width: 100, height: 10 },
      autoPilotRunning: false
    };
    if (this.gameController) {
      Object.assign(state, this.gameController.state);
    }
    if (this.autoPilot) {
      state.autoPilotRunning = this.autoPilot.running;
    }
    return state;
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

  resetGame() {
    console.log(`Model: resetGame:`, this.config);
    this.resetKeyStatus();
    this.quitGame();
    this.gameController = new GameController(this);
    this.autoPilot = new AutoPilot(this.gameController, this.keyStatus);
    if (this.config.Game.autoPilot) {
      this.autoPilot.start();
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

  update(): any {
    if (this.gameController) {
      this.gameController.update();
      if (this.gameController.shipState === ShipState.CRASHED || this.gameController.shipState === ShipState.LANDED) {
        if (this.autoPilot) {
          this.autoPilot.running = false;
        }
      }
    }
    // this.autoPilot?.update(); // autoPilot has its own update loop mechanism
    return this.gameState;
  }

  dispose() {
    this.gameController?.dispose();
    this.autoPilot?.dispose();
    this.gameController = undefined;
    this.autoPilot = undefined;
  }
}