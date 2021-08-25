import Model from "./Model";

export enum ShipState {
    FALLING,
    THRUSTING,
    LANDED,
    CRASHED
}

export default class GameController {

    public shipCoords: any;
    public shipVelocity: any;
    public shipThrust: any;
    public shipFuel: number;
    public shipState: ShipState;
    public gravity: any;
    public landingPadRect: any;
    
    private _model: Model | undefined;
    private _previousTime: number;

    constructor(model: Model) {
        this._model = model;
        this.shipCoords = { x: 140, y: 140 };
        this.shipVelocity = { x: 0, y: 0 };
        this.shipThrust = { x: 0, y: 0 };
        this.shipFuel = 200;
        this.shipState = ShipState.FALLING;
        this.gravity = { x: 0, y: -1 };
        this.landingPadRect = { x: 300, y: 590, width: 100, height: 10 };

        this._previousTime = Date.now();
    }

    get state() {
        return {
            shipCoords: this.shipCoords,
            shipThrust: this.shipThrust,
            shipFuel: this.shipFuel,
            shipVelocity: this.shipVelocity,
            shipState: this.shipState,
            gravity: this.gravity,
            landingPadRect: this.landingPadRect,
        }
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
        let newState: ShipState = this.shipState;
        const pad = this.landingPadRect;

        if (this.shipState === ShipState.FALLING || this.shipState === ShipState.THRUSTING) {

            // const stateObject = { shipThrust: newThrust };

            if (this._model?.keyStatus.ArrowUp === 'down' || this._model?.keyStatus.KeyW === 'down') {
                if (shipFuel > 2) {
                    newThrust.y = 2;
                    shipFuel -= 2;
                }
            }
            if (this._model?.keyStatus.ArrowLeft === 'down' || this._model?.keyStatus.KeyA === 'down') {
                if (shipFuel > 1) {
                    newThrust.x = -1;
                    shipFuel -= 1;
                }
            }
            if (this._model?.keyStatus.ArrowRight === 'down' || this._model?.keyStatus.KeyD === 'down') {
                if (shipFuel > 1) {
                    newThrust.x = 1;
                    shipFuel -= 1;
                }
            }
            if (this._model?.keyStatus.Space === 'down') {
                newThrust.y = 0;
                newThrust.x = 0;
            }


            velocity.x += this.gravity.x;
            velocity.y += this.gravity.y;
            velocity.x += newThrust.x;
            velocity.y += newThrust.y;

            shipCoords.x += velocity.x;
            shipCoords.y -= velocity.y;

            newState = ShipState.FALLING;
            if (newThrust.x || newThrust.y) {
                newState = ShipState.THRUSTING;
            }

            if (shipCoords.x >= pad.x && shipCoords.x < (pad.x + pad.width)) {
                if ((shipCoords.y + 40) >= pad.y && (shipCoords.y + 40) <= (pad.y + pad.height)) {
                    console.log(velocity);
                    if (velocity.y < -5) {
                        newState = ShipState.CRASHED;
                    } else {
                        newState = ShipState.LANDED;
                    }
                    // velocity = { x: 0, y: 0 };
                }
            } else if (shipCoords.y >= 560) {
                shipCoords.y = 560;
                newState = ShipState.CRASHED;
                // velocity = { x: 0, y: 0 };
            }

            this.shipCoords = shipCoords;
            this.shipThrust = newThrust;
            this.shipFuel = shipFuel;
            this.shipVelocity = velocity;
            this.shipState = newState;
        }
    }

    dispose() {
        this._model = undefined;
    }
}