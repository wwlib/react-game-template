import {
    // Status,
    Behavior,
    BehaviorTree,
    BehaviorClasses,
    DecoratorClasses,
    BehaviorEmitter
} from 'interaction-flow-engine';
import GameController from './GameController';

export default class AutoPilot {


    public blackboard: any;
    public notepad: any;
    public result: any;
    public behaviorEmitter: BehaviorEmitter | undefined;
    public btRoot: Behavior | undefined;
    public bt: BehaviorTree | undefined;

    private _gameController: GameController | undefined;
    private _keys: any;
    private _btInterval: NodeJS.Timeout | undefined;
    private _started: boolean;
    private _running: boolean;

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
        this.behaviorEmitter = new BehaviorEmitter();
        this.btRoot = this.getBtRoot();
        this.bt = new BehaviorTree(this.btRoot, this.blackboard, this.notepad, this.result, this.behaviorEmitter, {});
        // console.log(BehaviorTree.getNodeMap(this.bt));
        console.log(JSON.stringify(this.bt.json, null, 2));
        // jsonfile.writeFileSync('./lander.bt', this.bt.json)
    }

    getBtRoot = () => {

        const Root = new BehaviorClasses.Sequence({
            name: 'Root',
            id: '5c663278-10f2-4257-ae2b-27c85bb1a80b',
            layout: { "x": 410, "y": 70 },
        });

        const Init = new BehaviorClasses.ExecuteScript({
            name: 'Init',
            exec: () => {
                this.notepad.vCooldownTime = 100;
                this.notepad.hCooldownTime = 100;
                console.log('Init.', this.blackboard, this.notepad, this.result);
            },
            id: 'a21b7208-c19d-4db6-87df-f2a3e6a36087',
            layout: { "x": 318, "y": 218 },
        });

        const Flight = new BehaviorClasses.Parallel({
            name: 'Flight',
            succeedOnOne: false,
            id: 'd3b2ccc1-bd6f-450b-a8fe-d62b5de8a368',
            layout: { "x": 510, "y": 219 },
        });

        const Vertical = new BehaviorClasses.Sequence({
            name: 'Vertical',
            id: 'ff0bfe70-05f2-4d39-966a-e6bc07b2f16c',
            layout: { "x": 312, "y": 384 },
        });

        const VCooldown = new BehaviorClasses.TimeoutJs({
            name: 'VCooldown',
            getTime: () => this.notepad.vCooldownTime,
            id: '99d8fe74-b456-4ef0-9054-cfc9c88e3be3',
            layout: { "x": 88, "y": 549 },
        });

        const VThrustOn = new BehaviorClasses.ExecuteScript({
            name: 'VThrustOn',
            exec: () => {
                // console.log(`VThrustOn`, this.blackboard);
                this.blackboard.keys.ArrowUp = 'down';
            },
            id: 'ac0168f1-a455-4377-8d79-ef42b45e02cc',
            layout: { "x": 254, "y": 551 },
        });

        const VThrustOff = new BehaviorClasses.ExecuteScript({
            name: 'VThrustOff',
            exec: () => {
                // console.log(`VThrustOff`, this.blackboard);
                this.blackboard.keys.ArrowUp = 'up';
            },
            id: '4dbd2b2a-21ee-47d6-93c6-3b457e8d5337',
            layout: { "x": 421, "y": 551 },
        });

        const Horizontal = new BehaviorClasses.Sequence({
            name: 'Horizontal',
            id: 'db6ebc20-f277-4f62-8ea5-5bf7340ac756',
            layout: { "x": 560, "y": 380 },
        });

        const HCooldown = new BehaviorClasses.TimeoutJs({
            name: 'HCooldown',
            getTime: () => this.notepad.hCooldownTime,
            id: '6927b270-3494-4808-816a-f20a8f8ee11a',
            layout: { "x": 606, "y": 702 },
        });

        const HThrustOn = new BehaviorClasses.ExecuteScript({
            name: 'HThrustOn',
            exec: () => {
                // console.log(`HThrustOn`, this.blackboard);
                const shipL = this.blackboard.controller.shipCoords.x;
                const shipR = this.blackboard.controller.shipCoords.x + 40;
                const padL = this.blackboard.controller.landingPadRect.x;
                const padR = this.blackboard.controller.landingPadRect.x + this.blackboard.controller.landingPadRect.width;

                if (shipL < padL) {
                    this.blackboard.keys.ArrowRight = 'down';
                } else if (shipR > padR) {
                    this.blackboard.keys.ArrowLeft = 'down';
                }
            },
            id: 'a006cc01-a249-47b4-a9a9-51554b66ec07',
            layout: { "x": 770, "y": 700 },
        });

        const HThrustOff = new BehaviorClasses.ExecuteScript({
            name: 'HThrustOff',
            exec: () => {
                // console.log(`HThrustOff`, this.blackboard);
                this.blackboard.keys.ArrowLeft = 'up';
                this.blackboard.keys.ArrowRight = 'up';
            },
            id: '1f813ac3-f2e5-4ed7-a13c-8a58206340dd',
            layout: { "x": 939, "y": 698 },
        });

        const FlightLoop = new DecoratorClasses.WhileCondition({
            name: 'FlightLoop',
            init: () => { },
            conditional: () => {
                return true;
            },
            id: '1eb4d866-2672-4806-9b8d-d0e34ccd0833',
            layout: undefined,
        });

        const VThrustHold = new DecoratorClasses.WhileCondition({
            name: 'VThrustHold',
            init: () => { },
            conditional: () => {
                let hold = false;

                if (this.blackboard.controller.shipVelocity.y < -3) {
                    console.log(`velocity too high: ${this.blackboard.controller.shipVelocity.y} holding.`);
                    hold = true;
                }

                return hold;
            },
            id: '7d9c2ef7-cbbe-423c-b6a8-b329ec48db20',
            layout: undefined,
        });

        const HThrustHold = new DecoratorClasses.WhileCondition({
            name: 'HThrustHold',
            init: () => {
                this.notepad.HThrustStart = Date.now();
            },
            conditional: () => {
                let hold = false;
                const elapsed = Date.now() - this.notepad.HThrustStart;

                if (elapsed < 50) {
                    hold = true;
                }

                return hold;
            },
            id: '36da6b7c-3de9-4e81-af59-e932ed7d4cbd',
            layout: undefined,
        });

        Root.children = [Init, Flight];
        Flight.children = [Vertical, Horizontal];
        Vertical.children = [VCooldown, VThrustOn, VThrustOff];
        Horizontal.children = [HCooldown, HThrustOn, HThrustOff];


        Flight.decorators = [FlightLoop];
        VThrustOn.decorators = [VThrustHold];
        HThrustOn.decorators = [HThrustHold];

        return Root;
    }

    update = () => {
        if (this.bt && this._running) {
            const result = this.bt.update();
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
        this.behaviorEmitter = undefined;
        this.btRoot = undefined;
        this.bt = undefined;
        this._gameController = undefined;
        this._keys = undefined;
        this._btInterval = undefined;
    }
}