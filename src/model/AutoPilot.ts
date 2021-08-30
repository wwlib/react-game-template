import {
    BehaviorTree,
} from 'interaction-flow-engine';
import GameController from './GameController';
import BehaviorTreeFactory from './BehaviorTreeFactory';

export default class AutoPilot {


    public bt: BehaviorTree | undefined;
    public blackboard: any;
    public notepad: any;
    public result: any;    

    private _gameController: GameController | undefined;
    private _keys: any;
    private _btInterval: NodeJS.Timeout | undefined;
    private _started: boolean;
    private _running: boolean;
    private _behaviorTreeFactory: BehaviorTreeFactory | undefined;

    constructor(gameController: GameController, keys: any) {
        this._gameController = gameController;
        this._keys = keys;
        this._started = false;
        this._running = false;

        this.reset();
    }

    get running(): boolean {
        return this._running;
    }

    set running(value: boolean) {
        if (value && !this._started) {
            this.start();
        } else {
            this._running = value;
        }
    }

    start() {
        if (this.bt) {
            if (!this._started) {
                console.log(`AutoPilot: start: starting`);
                this.bt.start();
                this._btInterval = setInterval(this.update, 100);
                this._started = true;
            }
            this._running = true;
        } else {
            console.log(`AutoPilot: start: bt is undefined`)
        }
        
    }

    stop() {
        this._running = false;
    }

    reset() {
        if (this._btInterval) {
            clearInterval(this._btInterval);
        }
        this._btInterval = undefined;
        this._started = false;
        this._running = false;
        
        this.blackboard = { bb: true, controller: this._gameController, keys: this._keys };
        this.notepad = { np: true };
        this.result = { rs: true };
        this._behaviorTreeFactory = new BehaviorTreeFactory(this.blackboard, this.notepad, this.result);
        this.bt = this._behaviorTreeFactory.getBehaviorTree();
    }

    update = () => {
        if (this.bt && this._running) {
            this.bt.update();
            // const result = this.bt.update();
            // console.log(`AutoPilot: update:`, Status[result]);
        }
    }

    dispose() {
        if (this._btInterval) {
            clearInterval(this._btInterval);
        }
        this._btInterval = undefined;
        this._started = false;
        this._running = false;
        this.blackboard = undefined;
        this.notepad = undefined;
        this.result = undefined;
        this.bt = undefined;
        this._gameController = undefined;
        this._keys = undefined;
        this._btInterval = undefined;
    }
}