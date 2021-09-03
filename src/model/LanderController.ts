import Model from "./Model";
import GameController, { GameStatus } from "./GameController";

export default class LanderController extends GameController {

    public shipCoords: any;
    public shipVelocity: any;
    public shipThrust: any;
    public shipFuel: number;
    public gravity: any;
    public landingPadRect: any;
    
    private _world: any;
    private _previousTime: number;
    private _totalTime: number;
    private _fuelBonus: number;
    private _timeBonus: number;
    private _score: number;

    constructor(model: Model) {
        super(model);
        this._world = {
            width: 800,
            height: 600
        }
        if (model.config.LanderGame.world) {
            this._world = {
                width: model.config.LanderGame.world.width || this._world.width,
                height: model.config.LanderGame.world.height || this._world.height,
            }
        }
        this.shipCoords = { x: 10 + Math.random() * (this._world.width - 20), y: 100 };
        this.shipVelocity = { x: 0, y: 0 };
        this.shipThrust = { x: 0, y: 0 };
        this.shipFuel = this.world.height * 2;
        this._gameStatus = GameStatus.FALLING;
        this.gravity = { x: 0, y: -10 };
        this.landingPadRect = { x: (this._world.width / 2) - 50, y: this._world.height - 10, width: 100, height: 10 };

        this._previousTime = Date.now();
        this._totalTime = 0;
        this._fuelBonus = 0;
        this._timeBonus = 0;
        this._score = 0;
    }

    get state() {
        return {
            shipCoords: this.shipCoords,
            shipThrust: this.shipThrust,
            shipFuel: this.shipFuel,
            shipVelocity: this.shipVelocity,
            gameStatus: this._gameStatus,
            gravity: this.gravity,
            world: this._world,
            landingPadRect: this.landingPadRect,
            totalTime: this._totalTime,
            fuelBonus: this._fuelBonus,
            timeBonus: this._timeBonus,
            score: this._score,
        }
    }

    get world() {
        return this._world;
    }

    get score() {
        return this._score;
    }

    update() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - this._previousTime;
        this._previousTime = currentTime;
        this.mainLoop(elapsedTime);
    }

    mainLoop = (elapsedTime: number) => {
        let velocity = this.shipVelocity;
        let shipCoords = this.shipCoords;
        const newThrust = { x: 0, y: 0 };
        let shipFuel = this.shipFuel;
        let newState: GameStatus = this._gameStatus;
        const pad = this.landingPadRect;

        if (this._gameStatus === GameStatus.FALLING || this._gameStatus === GameStatus.THRUSTING) {

            this._totalTime += elapsedTime;

            if (this._model?.keyStatus.ArrowUp === 'down' || this._model?.keyStatus.KeyW === 'down') {
                if (shipFuel > 20) {
                    newThrust.y = 20;
                    shipFuel -= 20;
                }
            }
            if (this._model?.keyStatus.ArrowLeft === 'down' || this._model?.keyStatus.KeyA === 'down') {
                if (shipFuel > 10) {
                    newThrust.x = -10;
                    shipFuel -= 10;
                }
            }
            if (this._model?.keyStatus.ArrowRight === 'down' || this._model?.keyStatus.KeyD === 'down') {
                if (shipFuel > 10) {
                    newThrust.x = 10;
                    shipFuel -= 10;
                }
            }
            if (this._model?.keyStatus.Space === 'down') {
                newThrust.y = 0;
                newThrust.x = 0;
            }

            const seconds = elapsedTime / 1000;

            velocity.x += this.gravity.x * seconds;
            velocity.y += this.gravity.y * seconds;;
            velocity.x += newThrust.x * seconds;;
            velocity.y += newThrust.y * seconds;;

            shipCoords.x += velocity.x;
            shipCoords.y -= velocity.y;

            newState = GameStatus.FALLING;
            if (newThrust.x || newThrust.y) {
                newState = GameStatus.THRUSTING;
            }

            if ((shipCoords.x + 20) >= pad.x && (shipCoords.x + 20) < (pad.x + pad.width)) {
                if ((shipCoords.y + 40) >= pad.y && (shipCoords.y + 40) <= (pad.y + pad.height)) {
                    console.log(velocity);
                    if (velocity.y < -5) {
                        newState = GameStatus.CRASHED;
                        this._score = 0;
                    } else {
                        newState = GameStatus.LANDED;
                        const secondsOverTen: number = (this._totalTime - 10000) / 1000;
                        console.log(secondsOverTen);
                        this._timeBonus =  Math.round(Math.max((10 - secondsOverTen) * 100, 0));
                        this._fuelBonus = this.shipFuel;
                        this._score = this._fuelBonus + this._timeBonus;
                    }
                    // velocity = { x: 0, y: 0 };
                }
            } else if (shipCoords.y >= (this._world.height - 40)) {
                shipCoords.y = (this._world.height - 40);
                newState = GameStatus.CRASHED;
                // velocity = { x: 0, y: 0 };
            }

            this.shipCoords = shipCoords;
            this.shipThrust = newThrust;
            this.shipFuel = shipFuel;
            this.shipVelocity = velocity;
            this._gameStatus = newState;
        }
    }

    dispose() {
        super.dispose();
    }
}