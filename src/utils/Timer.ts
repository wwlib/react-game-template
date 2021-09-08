export enum TimerState {
    INVALID,
    RUNNING,
    STOPPED,
    EXPIRED
}

export enum TimerMode {
    COUNT_UP,
    COUNT_DOWN
}

export interface TimerOptions {
    startTime?: number;
    maxTime?: number;
    mode?: TimerMode;
}

export default class Timer {
    public name: String;
    public maxTime: number = 0;
    public mode: TimerMode = TimerMode.COUNT_UP;

    private _startTime: number = 0;
    private _state: TimerState = TimerState.INVALID;
    public _elapsedTime: number = 0;
    public _remainingTime: number = 0;

    constructor(name: String, options?: TimerOptions) {
        this.name = name;
        this.reset(options);
    }

    get startTime(): number {
        return this._startTime;
    }

    set startTime(value: number) {
        this._startTime = value;
    }

    get state(): TimerState {
        return this._state;
    }

    get percent() {
        this.update();
        if (this.mode === TimerMode.COUNT_UP) {
            if (this.maxTime === 0) {
                return 0;
            } else {
                return Math.min(this._elapsedTime, this.maxTime) / this.maxTime;
            }
        } else {
            return Math.min(this._remainingTime, this.maxTime) / this.maxTime;
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
            this._elapsedTime = frameTime - this._startTime;
            if (this.maxTime > 0) {
                this._elapsedTime = Math.min(this._elapsedTime, this.maxTime);
                this._remainingTime = Math.max(this.maxTime - this._elapsedTime, 0);
            }
        }
        if (this.mode === TimerMode.COUNT_UP) {
            if (this.maxTime > 0 && this._elapsedTime >= this.maxTime) {
                this._state = TimerState.EXPIRED;
            }
        } else {
            if (this._remainingTime <= 0) {
                this._state = TimerState.EXPIRED;
            }
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

    set elapsedTime(value: number) {
        this._startTime = Date.now() - value;
    }

    get remainingTime() {
        this.update();
        return this._remainingTime;
    }

    get json(): any {
        return { name: this.name, state: TimerState[this.state], mode: TimerMode[this.mode], start: this.startTime, elapsed: this.elapsedTime, max: this.maxTime, percent: this.percent }
    }

    reset(options?: TimerOptions) {
        options = options || {}
        this._startTime = options.startTime || Date.now();
        this.maxTime = options.maxTime || this.maxTime || 0;
        
        this._elapsedTime = 0;
        this._remainingTime = 0;
        this.mode = options.mode || this.mode || TimerMode.COUNT_UP;
        if (this.mode === TimerMode.COUNT_DOWN) {
            this._remainingTime = this.maxTime;
        }
        this._state = TimerState.INVALID;
        return this;
    }

    restart(options?: TimerOptions) {
        this.reset(options);
        this.start();
    }

    toString() {
        return `${this.name} timer: ${TimerState[this._state]}, mode: ${TimerMode[this.mode]}, elapsed: ${this.elapsedTime}`;
    }
}