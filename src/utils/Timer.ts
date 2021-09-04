export enum TimerState {
    INVALID,
    RUNNING,
    STOPPED,
    EXPIRED
}

export interface TimerOptions {
    startTime?: number;
    maxTime?: number;
}

export default class Timer {
    public name: String;
    public startTime: number = 0;
    public maxTime: number = 0;

    private _state: TimerState = TimerState.INVALID;
    public _elapsedTime: number = 0;

    constructor(name: String, options?: TimerOptions) {
        this.name = name;
        this.reset(options);
    }

    get state(): TimerState {
        return this._state;
    }

    get percent() {
        this.update();
        if (this.maxTime === 0) {
            return 0;
        } else {
            return Math.min(this._elapsedTime, this.maxTime) / this.maxTime;
        }
    }

    start() {
        this._state = TimerState.RUNNING;
        return this;
    }

    stop(frameTime?: number) {
        this.update(frameTime);
        if (this._state === TimerState.RUNNING) {
            this._state = TimerState.STOPPED;
        }
        return this;
    }

    incrementTime(frameTime: number) {
        this.update(frameTime);
    }

    update(frameTime?: number) {
        if (this._state === TimerState.RUNNING) {
            frameTime = frameTime || Date.now();
            this._elapsedTime = Math.min(frameTime - this.startTime, this.maxTime);
        }
        if (this._elapsedTime >= this.maxTime) {
            this._state = TimerState.EXPIRED;
        }
    }

    isExpired(frameTime?: number) {
        let result = false;
        this.update(frameTime);
        if (this._state === TimerState.EXPIRED) {
            result = true;
        }
        return result;
    }

    get elapsedTime() {
        this.update();
        return this._elapsedTime;
    }

    reset(options?: TimerOptions) {
        options = options || {}
        this.startTime = options.startTime || Date.now();
        this.maxTime = options.maxTime || this.maxTime;
        this._elapsedTime = 0;
        this._state = TimerState.INVALID;
        return this;
    }

    restart(options?: TimerOptions) {
        this.reset(options);
        this.start();
    }

    toString() {
        return `${this.name} timer: ${TimerState[this._state]}: elapsed: ${this.elapsedTime}`;
    }
}