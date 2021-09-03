import Timer, { TimerState } from "../utils/Timer";
import GameController, { GameStatus } from "./GameController";
import Model from "./Model";

export enum PetStatus {
    IDLE,
}

export enum Emotion {
    CONTENT,
    LONELY,
    NEGLECTED,
    SCORNED,
    EARNEST,
    EXCITED,
}

export enum Intent {
    IDLE,
    SAY_HI,
    SHARE_CONTENT,
    ASK_QUESTION
}

export enum RelationshipLevel {
    NONE,
    BFF,
    FRIENDLY,
    FORMAL,
    ALOOF,
    UNFRIENDLY,
    AMBIVALENT
}

export enum UserEvent {
    USER_DETECTED,
    USER_RECOGNIZED,
}

export enum UserAction {
    NONE,
    ENTER,
    LEAVE,
    SAY_HI,
    SAY_YES,
    SAY_NO,
    SAY_THANKS,
    ASK_QUESTION,
    GIVE_COMPLIMENT
}

export interface Personality {
    extraversion: number;
    agreeableness: number;
    openness: number;
    conscientiousness: number;
    neuroticism: number;
}

export interface PetState {
    userName: string;
    userRelationshipLevel: RelationshipLevel;
    emotionalState: Emotion;
    loneliness: number;
    timers: any;
    gameStatus: GameStatus;
}

export interface RangeProperties {
    loneliness: number;
}

export interface PetStateRanges {
    min: RangeProperties;
    max: RangeProperties;
}

export enum TimerType {
    LAST_DETECTION,
    LAST_RECOGNITION,
    LAST_INTERACTION_ATTEMPT,
    LAST_INTERACTION,
    LAST_REJECTION,
}

export class User {

    public id: string;
    public name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

export class Relationship {

    public user: User;
    public relationshipLevel: RelationshipLevel;

    constructor(user: User, relationshipLevel: RelationshipLevel) {
        this.user = user;
        this.relationshipLevel  = relationshipLevel;
    }
}

export default class PetController extends GameController {

    private _emotionalState: Emotion;
    private _personality: Personality;
    private _previousTime: number;
    private _totalTime: number;
    private _score: number;
    private _rejectionHistory: number[];

    private _petId: string;
    private _pet: any;
    private _intentQueue: any[];
    private _relationships: Relationship[];

    // timers

    private _timerMap: Map<TimerType, Timer>;

    // state

    private _state: PetState;
    private _stateRanges: PetStateRanges;

    constructor(model: Model, petId: string) {
        super(model);
        this._emotionalState = Emotion.CONTENT;
        this._personality = {
            extraversion: 3,
            agreeableness: 5,
            openness: 5,
            conscientiousness: 5,
            neuroticism: 1,
        }
        this._petId = petId;

        this._previousTime = Date.now();
        this._totalTime = 0;
        this._score = 0;
        this._rejectionHistory = [];

        this._pet = {
            emotion: Emotion.CONTENT,
            intent: Intent.IDLE,
        };

        this._intentQueue = [];
        this._relationships = [];
        this.addRelationship(new User('001', 'Abigail'), RelationshipLevel.NONE);

        this._timerMap = new Map<TimerType, Timer>();
        // this._timerMap.set(TimerType.LAST_DETECTION, new Timer(TimerType[TimerType.LAST_DETECTION]));

        for (const timerType of Object.values(TimerType)) {
            const timerTypeNum = Number(timerType);
            if (!isNaN(timerTypeNum)) {
                this._timerMap.set(timerTypeNum, new Timer(TimerType[timerTypeNum], { maxTime: 60000}));
            }
        }

        console.log(Array.from(this._timerMap));

        this._timerMap.get(TimerType.LAST_INTERACTION)?.start();

        this._stateRanges = {
            min: {
                loneliness: 0,
            },
            max: {
                loneliness: 100,
            },
        }

        this._state = {
            userName: this._relationships[0].user.name,
            userRelationshipLevel: this._relationships[0].relationshipLevel,
            emotionalState: this._emotionalState,
            loneliness: 0,
            timers: {},
            gameStatus: GameStatus.RUNNING,
        }
        this.update();
    }

    get state(): any {
        return this._state;
    }

    get stateRanges(): PetStateRanges {
        return this._stateRanges
    }

    addRelationship(user: User, relationshipLevel: RelationshipLevel) {
        this._relationships.push(new Relationship(user, relationshipLevel));
    }

    addIntent() {

    }


    prioritizeIntents() {

    }

    update() {
        if (this._state.loneliness < this._stateRanges.max.loneliness) {
            this._state.loneliness += 1;
        }
        this._state.timers = {};
        Array.from(this._timerMap).forEach(element => {
            const timerType: TimerType = element[0];
            const name: string = TimerType[timerType];
            const timer: Timer = element[1];
            this._state.timers[timerType] = { name: name, state: TimerState[timer.state], elapsed: timer.elapsedTime, percent: timer.getPercent() }
        });
    }

    dispose() {
        super.dispose();
    }
}