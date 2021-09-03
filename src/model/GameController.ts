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

export default abstract class GameController {

    protected _model: Model | undefined;
    protected _gameStatus: GameStatus;

    constructor(model: Model) {
        this._model = model;
        this._gameStatus = GameStatus.INVALID;
    }

    public get gameStatus(): GameStatus {
        return this._gameStatus;
    }

    public abstract get state(): any;

    public abstract update(): void;

    public  dispose(): void {
        this._model = undefined;
    };

}