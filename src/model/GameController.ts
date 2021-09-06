import EventEmitter from "events";
import Model from "./Model";

export enum GameStatus {
    INVALID,
    RUNNING,
    FALLING,
    THRUSTING,
    LANDED,
    CRASHED,
    OVER
}

export default abstract class GameController extends EventEmitter {

    protected _model: Model | undefined;
    protected _gameStatus: GameStatus;

    constructor(model: Model) {
        super();
        this._model = model;
        this._gameStatus = GameStatus.INVALID;
    }

    public get gameStatus(): GameStatus {
        return this._gameStatus;
    }

    public abstract get state(): any;

    public abstract update(): void;

    public  dispose(): void {
        this.removeAllListeners();
        this._model = undefined;
    };

}