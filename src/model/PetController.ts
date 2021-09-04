import Timer, { TimerState } from '../utils/Timer';
import GameController, { GameStatus } from './GameController';
import Model from './Model';
import { getEnumIndices } from '../utils/Utils';

export enum Emotion {
    CONTENT,
    LONELY,
    NEGLECTED,
    SCORNED,
    EARNEST,
    EXCITED,
}

export enum Intent {
    SAY_HI,
    SHARE_CONTENT,
    ASK_QUESTION,
    IGNORE
}

// Mazlo'shierarchy of needs: 
// - physiological (food and clothing)
// - safety (job security)
// - love and belonging needs (friendship)
// - esteem
// - self-actualization
export enum PetNeed {
    LOVE,               // companionship, interaction
    ESTEEM,             // being useful, making a contribution, being respected
    SELF_ACTUALIZATION, // to learn, grow, get better
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
    gameStatus: GameStatus;
    userId: string;
    userName: string;
    userRelationshipLevel: RelationshipLevel;
    emotionalState: Emotion;
    needs: any;
    timers: any;
    intentQueue: Intent[];
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
        this.relationshipLevel = relationshipLevel;
    }
}

export interface PetValueRange {
    min: number;
    max: number;
}

export class PetValue {
    public name: string;
    public value: number;
    public range: PetValueRange;

    constructor(name: string, value: number, min: number, max: number) {
        this.name = name;
        this.value = value;
        this.range = {
            min: min,
            max: max,
        }
    }

    get percent(): number {
        return this.value / this.range.max;
    }

    increment(value: number) {
        if (this.value + value <= this.range.max) {
            this.value += value;
        }
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
    private _intentQueue: Intent[];
    private _relationships: Relationship[];

    // needs
    private _needMap: Map<PetNeed, PetValue>;

    // timers
    private _timerMap: Map<TimerType, Timer>;

    // state
    private _state: PetState;

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

        this._intentQueue = [];
        this._relationships = [];
        this.addRelationship(new User('001', 'Abigail'), RelationshipLevel.NONE);

        this._needMap = new Map<PetNeed, PetValue>();
        getEnumIndices(PetNeed).forEach(index => {
            this._needMap.set(index, new PetValue(PetNeed[index], 0, 0, 1));
        });

        this._timerMap = new Map<TimerType, Timer>();
        getEnumIndices(TimerType).forEach(index => {
            const timer = new Timer(TimerType[index], { maxTime: 60000 });
            timer.start();
            this._timerMap.set(index, timer);
        });

        this._timerMap.get(TimerType.LAST_INTERACTION)?.start();

        this._state = {
            gameStatus: GameStatus.RUNNING,
            userId: this._relationships[0].user.id,
            userName: this._relationships[0].user.name,
            userRelationshipLevel: this._relationships[0].relationshipLevel,
            emotionalState: this._emotionalState,
            needs: {},
            timers: {},
            intentQueue: this._intentQueue,
        }
        this.update();
    }

    get state(): any {
        return this._state;
    }

    addRelationship(user: User, relationshipLevel: RelationshipLevel) {
        this._relationships.push(new Relationship(user, relationshipLevel));
    }

    addIntent() {

    }

    prioritizeIntents() {

    }

    updateNeeds() {
        const needLove = this._needMap.get(PetNeed.LOVE);
        const timerLastInteraction = this._timerMap.get(TimerType.LAST_INTERACTION);
        if (needLove && timerLastInteraction) {
            needLove.value = 1 * timerLastInteraction.percent;
        }
    }

    update() {
        this.updateNeeds();
        this._state.needs = {};
        Array.from(this._needMap).forEach(element => {
            const elementType: PetNeed = element[0];
            const name: string = PetNeed[elementType];
            const value: PetValue = element[1];
            this._state.needs[elementType] = { name: name, value: value.value, min: value.range.min, max: value.range.max, percent: value.percent }
        });

        this._state.timers = {};
        Array.from(this._timerMap).forEach(element => {
            const elementType: TimerType = element[0];
            const name: string = TimerType[elementType];
            const timer: Timer = element[1];
            this._state.timers[elementType] = { name: name, state: TimerState[timer.state], start: timer.startTime, elapsed: timer.elapsedTime, max: timer.maxTime, percent: timer.percent }
        });
    }

    // action handlers

    userActionSayHi() {
        const timerLastInteraction = this._timerMap.get(TimerType.LAST_INTERACTION);
        if (timerLastInteraction) {
            timerLastInteraction.restart();
        }
    }

    // game controls

    onGameCanvasClick(group: string, action: string) {
        console.log(`PetController: onGameCanvasClick:`, group, action);
        switch (group) {
            case 'userAction':
                switch (action) {
                    case 'SAY_HI':
                        this.userActionSayHi();
                        break;
                }
                break;
        }
    }

    dispose() {
        super.dispose();
    }
}