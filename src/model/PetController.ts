import Timer, { TimerMode, TimerOptions } from '../utils/Timer';
import GameController, { GameStatus, GameState } from './GameController';
import Model from './Model';

export enum Emotion {
    CONTENT,
    LONELY,
    NEGLECTED,
    SCORNED,
    EARNEST,
    EXCITED,
}

export enum IntentType {
    SAY_HI,
    SHARE_CONTENT,
    ASK_QUESTION,
    IGNORE
}

export enum ActionType {
    SAY
}

export interface ActionData {
    message: string;
}

export class Action {
    public type: ActionType;
    public data: ActionData;
    public needType: NeedType;
    public needUrgency: NeedUrgency;

    constructor(type: ActionType, data: ActionData, needType: NeedType, needUrgency: NeedUrgency) {
        this.type = type;
        this.data = data;
        this.needType = needType;
        this.needUrgency = needUrgency;
    }
}

export enum RelationshipLevel {
    NONE,
    BFF,
    FRIENDLY,
    FORMAL,
    ALOOF,
    AMBIVALENT,
    UNFRIENDLY,
}

export interface Personality {
    extraversion: number;
    agreeableness: number;
    openness: number;
    conscientiousness: number;
    neuroticism: number;
}

export interface VisualizerData {
    timers: any[];
}

export interface PetState {
    gameStatus: GameStatus;
    userId: string;
    userName: string;
    userRelationshipLevel: RelationshipLevel;
    emotionalState: Emotion;
    personality: Personality;
    needs: any[];
    visualizerData?: VisualizerData;
}

// export enum TimerType {
//     // LAST_DETECTION,
//     // LAST_RECOGNITION,
//     // LAST_INTERACTION_ATTEMPT,
//     // LAST_REJECTION,
// }

export enum NeedControllerEventType {
    NONE,
    DETECTED,
    RECOGNIZED,
    ENTER,
    LEAVE,
    SAY_HI,
    SAY_YES,
    SAY_NO,
    SAY_THANKS,
    ASK_QUESTION,
    GIVE_COMPLIMENT,
    RECHARGE,
    COMPLETE_QUEST,
    EARN_ACHIEVEMENT,
}

export class NeedControllerEvent {
    public type: NeedControllerEventType;
    public message: string;
    public data: any | undefined;

    private _handledBy: NeedType[];

    constructor(type: NeedControllerEventType, message: string, data?: any) {
        this.type = type;
        this.message = message;
        this.data = data;
        this._handledBy = [];
    }

    get handledBy(): NeedType[] {
        return this._handledBy;
    }

    addHandledBy(needType: NeedType) {
        if (this._handledBy.indexOf(needType) === -1) {
            this._handledBy.push(needType);
        }
    }

    checkHandledBy(needType: NeedType): boolean {
        let handledByNeedType: boolean = false;
        if (this._handledBy.indexOf(needType) >= 0) {
            handledByNeedType = true;
        }
        return handledByNeedType;
    }
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

// TODO find a better way to share timer state with the visualizer
// TODO trigger more actions based on need events
// i.e. DETECTED -> "Is that you?"
// moderated by Personality & RelationshipLevel

// Mazlo'shierarchy of needs: 
// - physiological (food and clothing)
// - safety (job security)
// - love and belonging needs (friendship)
// - esteem
// - self-actualization
export enum NeedType {
    PHYSIOLOGY,
    SAFETY,
    LOVE,               // companionship, interaction
    ESTEEM,             // being useful, making a contribution, being respected
    SELF_ACTUALIZATION, // to learn, grow, get better
}

export enum NeedUrgency {
    NONE,
    LOW,
    MEDIUM,
    HIGH,
    EMERGENCY
}
export interface NeedMessage {
    type: NeedType;
    mode: 'INCREMENTAL' | 'ABSOLUTE',
    value: number;
    message: string;
}

export abstract class NeedController {

    protected _type: NeedType;
    protected _value: number;
    protected _urgency: NeedUrgency;
    protected _actionQueue: Action[];
    protected _relationship: Relationship;
    protected _personality: Personality;
    protected _actionCooldown: Timer;
    protected _actionCooldownThresholds: any;

    constructor(type: NeedType, value: number, personality: Personality, relationship: Relationship) {
        this._value = value;
        this._type = type;
        this._personality = personality;
        this._relationship = relationship;
        this._urgency = NeedUrgency.NONE;
        this._actionQueue = [];

        let cooldownName: string = `${NeedType[this.type]}_ACTION_COOLDOWN`
        this._actionCooldown = new Timer(cooldownName).start();
        // re: conscientousness: a measure of self-restraint. If < 0, cooldown times are shorter - more demanding
        this._actionCooldownThresholds = {
            0: 600000 * this._personality.conscientiousness, // NONE
            1: 60000 * this._personality.conscientiousness,  // LOW
            2: 30000 * this._personality.conscientiousness,  // MEDIUM
            3: 15000 * this._personality.conscientiousness,  // HIGH
            4: 5000 * this._personality.conscientiousness,   // EMERGENCY
        }
    }

    get value(): number {
        return this._value;
    }

    abstract initWithData(data: any): void;

    abstract get json(): any;

    abstract getVisualizerData(): VisualizerData;

    get urgency(): number {
        return this._urgency;
    }

    get percent(): number {
        return this._value;
    }

    get type(): NeedType {
        return this._type;
    }

    abstract onMessage(message: NeedMessage): void;

    abstract onNeedControllerEvent(needControllerEvent: NeedControllerEvent): boolean;

    abstract getAction(): Action | undefined;

    queueAction(action: Action) {
        this._actionQueue.push(action);
    }

    get name(): string {
        return NeedType[this.type];
    }
}

export class NeedPhysiologyController extends NeedController {

    private _energyRemaining: Timer;

    constructor(value: number, personality: Personality, relationship: Relationship) {
        super(NeedType.PHYSIOLOGY, value, personality, relationship);
        const options: TimerOptions = {
            maxTime: 180000,
            mode: TimerMode.COUNT_DOWN,
        }
        this._energyRemaining = new Timer('ENERGY_REMAINING', options).start();
    }

    get value(): number {
        // console.log(this._energyRemaining.json);
        this._value = 1 - this._energyRemaining.percent;
        this._urgency = NeedUrgency.NONE;
        if (this._value > 0.1) this._urgency = NeedUrgency.LOW;
        if (this._value > 0.3) this._urgency = NeedUrgency.MEDIUM;
        if (this._value > 0.6) this._urgency = NeedUrgency.HIGH;
        if (this._value > 0.9) this._urgency = NeedUrgency.EMERGENCY;
        return this._value;
    }

    initWithData(data: any) {
        // console.log(`NeedPhysiologyController: initWithData:`, data);
        this._value = data.value;
        this._type = data.type;
        this._urgency = data.urgency;
        this._actionCooldown.maxTime = data.actionCooldown.max;
        this._actionCooldown.startTime = data.actionCooldown.start;
        this._energyRemaining.maxTime = data.energyRemaining.max;
        this._energyRemaining.startTime = data.energyRemaining.start;
    }

    get json(): any {
        this._actionCooldown.maxTime = this._actionCooldownThresholds[this.urgency];
        return {
            type: this.type, name: this.name, value: this.value, percent: this.percent, urgency: this._urgency,
            energyRemaining: this._energyRemaining.json,
            actionCooldown: this._actionCooldown.json,
        }
    }

    getVisualizerData(): VisualizerData {
        return {
            timers: [this._energyRemaining.json],
        }
    }

    onMessage(message: NeedMessage): void {

    }

    onNeedControllerEvent(needControllerEvent: NeedControllerEvent): boolean {
        let handled: boolean = false;
        // console.log(`NeedPhysiologyController: onNeedControllerEvent: ${NeedControllerEventType[needControllerEvent.type]}, message: ${needControllerEvent.message}`);
        switch (needControllerEvent.type) {
            case NeedControllerEventType.RECHARGE:
                this._energyRemaining.restart();
                const action = new Action(ActionType.SAY, { message: `Thanks for the recharge, ${this._relationship.user.name}!` }, this.type, this.urgency);
                this.queueAction(action);
                handled = true;
                break;
        }
        return handled;
    }

    getAction(): Action | undefined {
        let action: Action | undefined = undefined;
        let cooldownThreshold = this._actionCooldownThresholds[this.urgency];
        let elapsedTime = this._actionCooldown.elapsedTime;
        if (elapsedTime >= cooldownThreshold) {
            // console.log(`NeedPhysiologyController: getAction: checking...`, NeedUrgency[this.urgency], elapsedTime, cooldownThreshold);
            switch (this.urgency) {
                case NeedUrgency.NONE:
                    break;
                case NeedUrgency.LOW:
                    action = new Action(ActionType.SAY, { message: 'Some more energy would be nice.' }, this.type, this.urgency);
                    break;
                case NeedUrgency.MEDIUM:
                    action = new Action(ActionType.SAY, { message: 'I am starting to feel low on energy.' }, this.type, this.urgency);
                    break;
                case NeedUrgency.HIGH:
                    action = new Action(ActionType.SAY, { message: 'I could realy use some energy now.' }, this.type, this.urgency);
                    break;
                case NeedUrgency.EMERGENCY:
                    action = new Action(ActionType.SAY, { message: 'Emergency! Recharge me, now, please!!' }, this.type, this.urgency);
                    break;
            }
            this._actionCooldown.restart();
        } else {
            // console.log(`NeedPhysiologyController: getAction: waiting for cooldown.`, NeedUrgency[this.urgency], cooldownThreshold);
        }
        if (!action && this._actionQueue.length) {
            action = this._actionQueue.shift();
            this._actionCooldown.restart();
        }
        return action;
    }
}

export class NeedSafetyController extends NeedController {

    constructor(value: number, personality: Personality, relationship: Relationship) {
        super(NeedType.SAFETY, value, personality, relationship);
    }

    initWithData(data: any) {
        this._value = data.value;
        this._type = data.type;
        this._urgency = data.urgency;
        this._actionCooldown.maxTime = data.actionCooldown.max;
        this._actionCooldown.startTime = data.actionCooldown.start;
    }

    get json(): any {
        this._actionCooldown.maxTime = this._actionCooldownThresholds[this.urgency];
        return {
            type: this.type, name: this.name, value: this.value, percent: this.percent, urgency: this._urgency,
            actionCooldown: this._actionCooldown.json,
        }
    }

    getVisualizerData(): VisualizerData {
        return {
            timers: [],
        }
    }

    onMessage(message: NeedMessage): void {

    }

    onNeedControllerEvent(needControllerEvent: NeedControllerEvent): boolean {
        // console.log(`NeedSafetyController: onNeedControllerEvent: ${NeedControllerEventType[needControllerEvent.type]}, message: ${needControllerEvent.message}`);
        return false;
    }

    getAction(): Action | undefined {
        let action: Action | undefined = undefined;

        if (!action && this._actionQueue.length) {
            action = this._actionQueue.shift();
            this._actionCooldown.restart();
        }
        return action;
    }
}

export class NeedLoveController extends NeedController {

    private _lastInteraction: Timer;

    constructor(value: number, personality: Personality, relationship: Relationship) {
        super(NeedType.LOVE, value, personality, relationship);
        const options: TimerOptions = {
            maxTime: 60000,
            mode: TimerMode.COUNT_UP,
        }
        this._lastInteraction = new Timer('LAST_INTERACTION', options).start();
    }

    get value(): number {
        this._value = this._lastInteraction.percent;
        this._urgency = NeedUrgency.NONE;
        if (this._value > 0.1) this._urgency = NeedUrgency.LOW;
        if (this._value > 0.3) this._urgency = NeedUrgency.MEDIUM;
        if (this._value > 0.6) this._urgency = NeedUrgency.HIGH;
        if (this._value > 0.9) this._urgency = NeedUrgency.EMERGENCY;
        return this._value;
    }

    initWithData(data: any) {
        this._value = data.value;
        this._type = data.type;
        this._urgency = data.urgency;
        this._actionCooldown.maxTime = data.actionCooldown.max;
        this._actionCooldown.startTime = data.actionCooldown.start;
        this._lastInteraction.maxTime = data.lastInteraction.max;
        this._lastInteraction.startTime = data.lastInteraction.start;
    }

    get json(): any {
        this._actionCooldown.maxTime = this._actionCooldownThresholds[this.urgency];
        return {
            type: this.type, name: this.name, value: this.value, percent: this.percent, urgency: this._urgency,
            lastInteraction: this._lastInteraction.json,
            actionCooldown: this._actionCooldown.json,
        }
    }

    getVisualizerData(): VisualizerData {
        return {
            timers: [this._lastInteraction.json],
        }
    }

    onMessage(message: NeedMessage): void {

    }

    onNeedControllerEvent(needControllerEvent: NeedControllerEvent): boolean {
        let handled: boolean = false;
        console.log(`NeedLoveController: onNeedControllerEvent: ${NeedControllerEventType[needControllerEvent.type]}, message: ${needControllerEvent.message}`);
        switch (needControllerEvent.type) {
            case NeedControllerEventType.ASK_QUESTION:
            case NeedControllerEventType.RECHARGE:
                this._lastInteraction.restart();
                this.queueAction(new Action(ActionType.SAY, { message: `<smile>` }, this.type, this.urgency));
                handled = true;
                break;
            case NeedControllerEventType.SAY_HI:
                this._lastInteraction.restart();
                this.queueAction(new Action(ActionType.SAY, { message: `Hi, ${this._relationship.user.name}!` }, this.type, this.urgency));
                handled = true;
                break;
            case NeedControllerEventType.DETECTED:
            case NeedControllerEventType.RECOGNIZED:
                console.log(` DETECTED || RECOGNIZED`, NeedUrgency[this.urgency]);
                if (this.urgency >= NeedUrgency.MEDIUM) {
                    let cooldownThreshold = this._actionCooldownThresholds[this.urgency];
                    let elapsedTime = this._actionCooldown.elapsedTime;
                    console.log(`   cooldownThreshold: ${cooldownThreshold}, elapsedTime: ${elapsedTime}`);
                    if (elapsedTime >= cooldownThreshold) {
                        if (needControllerEvent.type === NeedControllerEventType.RECOGNIZED) {
                            this.queueAction(new Action(ActionType.SAY, { message: `Hey ${this._relationship.user.name}. It's nice to see you.` }, this.type, this.urgency));
                        } else {
                            this.queueAction(new Action(ActionType.SAY, { message: `Hey there.` }, this.type, this.urgency));
                        }
                        handled = true;
                    }
                }
                break;
        }
        return handled;
    }

    getAction(): Action | undefined {
        let action: Action | undefined = undefined;

        if (!action && this._actionQueue.length) {
            action = this._actionQueue.shift();
            this._actionCooldown.restart();
        }
        return action;
    }
}

export class NeedEsteemController extends NeedController {

    private _lastEsteem: Timer;

    constructor(value: number, personality: Personality, relationship: Relationship) {
        super(NeedType.ESTEEM, value, personality, relationship);
        const options: TimerOptions = {
            maxTime: 60000,
            mode: TimerMode.COUNT_UP,
        }
        this._lastEsteem = new Timer('LAST_ESTEEM', options).start();
    }

    get value(): number {
        this._value = this._lastEsteem.percent;
        this._urgency = NeedUrgency.NONE;
        if (this._value > 0.1) this._urgency = NeedUrgency.LOW;
        if (this._value > 0.3) this._urgency = NeedUrgency.MEDIUM;
        if (this._value > 0.6) this._urgency = NeedUrgency.HIGH;
        if (this._value > 0.9) this._urgency = NeedUrgency.EMERGENCY;
        return this._value;
    }

    initWithData(data: any) {
        this._value = data.value;
        this._type = data.type;
        this._urgency = data.urgency;
        this._actionCooldown.maxTime = data.actionCooldown.max;
        this._actionCooldown.startTime = data.actionCooldown.start;
        this._lastEsteem.maxTime = data.lastEsteem.max;
        this._lastEsteem.startTime = data.lastEsteem.start;
    }

    get json(): any {
        this._actionCooldown.maxTime = this._actionCooldownThresholds[this.urgency];
        return {
            type: this.type, name: this.name, value: this.value, percent: this.percent, urgency: this._urgency,
            lastEsteem: this._lastEsteem.json,
            actionCooldown: this._actionCooldown.json,
        }
    }

    getVisualizerData(): VisualizerData {
        return {
            timers: [this._lastEsteem.json],
        }
    }

    onMessage(message: NeedMessage): void {

    }

    onNeedControllerEvent(needControllerEvent: NeedControllerEvent): boolean {
        let handled: boolean = false;
        // console.log(`NeedEsteemController: onNeedControllerEvent: ${NeedControllerEventType[needControllerEvent.type]}, message: ${needControllerEvent.message}`);
        switch (needControllerEvent.type) {
            case NeedControllerEventType.ASK_QUESTION:
                this._lastEsteem.restart();
                this.queueAction(new Action(ActionType.SAY, { message: `Good question, ${this._relationship.user.name}. Here's your answer...` }, this.type, this.urgency));
                handled = true;
                break;
        }
        return handled;
    }

    getAction(): Action | undefined {
        let action: Action | undefined = undefined;

        if (!action && this._actionQueue.length) {
            action = this._actionQueue.shift();
            this._actionCooldown.restart();
        }
        return action;
    }
}

export class NeedSelfActualizationController extends NeedController {

    private _lastSelfActualization: Timer;

    constructor(value: number, personality: Personality, relationship: Relationship) {
        super(NeedType.SELF_ACTUALIZATION, value, personality, relationship);
        const options: TimerOptions = {
            maxTime: 60000,
            mode: TimerMode.COUNT_UP,
        }
        this._lastSelfActualization = new Timer('LAST_SELF_ACTUALIZATION', options).start();
    }

    get value(): number {
        this._value = this._lastSelfActualization.percent;
        this._urgency = NeedUrgency.NONE;
        if (this._value > 0.1) this._urgency = NeedUrgency.LOW;
        if (this._value > 0.3) this._urgency = NeedUrgency.MEDIUM;
        if (this._value > 0.6) this._urgency = NeedUrgency.HIGH;
        if (this._value > 0.9) this._urgency = NeedUrgency.EMERGENCY;
        return this._value;
    }

    initWithData(data: any) {
        this._value = data.value;
        this._type = data.type;
        this._urgency = data.urgency;
        this._actionCooldown.maxTime = data.actionCooldown.max;
        this._actionCooldown.startTime = data.actionCooldown.start;
        this._lastSelfActualization.maxTime = data.lastSelfActualization.max;
        this._lastSelfActualization.startTime = data.lastSelfActualization.start;
    }

    get json(): any {
        this._actionCooldown.maxTime = this._actionCooldownThresholds[this.urgency];
        return {
            type: this.type, name: this.name, value: this.value, percent: this.percent, urgency: this._urgency,
            lastSelfActualization: this._lastSelfActualization.json,
            actionCooldown: this._actionCooldown.json,
        }
    }

    getVisualizerData(): VisualizerData {
        return {
            timers: [this._lastSelfActualization.json],
        }
    }

    onMessage(message: NeedMessage): void {

    }

    onNeedControllerEvent(needControllerEvent: NeedControllerEvent): boolean {
        // console.log(`NeedSelfActualizationController: onNeedControllerEvent: onNeedControllerEvent: ${NeedControllerEventType[needControllerEvent.type]}, message: ${needControllerEvent.message}`);
        let handled: boolean = false;
        switch (needControllerEvent.type) {
            case NeedControllerEventType.EARN_ACHIEVEMENT:
            case NeedControllerEventType.COMPLETE_QUEST:
                this._lastSelfActualization.restart();
                const action = new Action(ActionType.SAY, { message: `Congratulaitons to me!` }, this.type, this.urgency);
                this.queueAction(action);
                handled = true;
                break;
        }
        return handled;
    }

    getAction(): Action | undefined {
        let action: Action | undefined = undefined;

        if (!action && this._actionQueue.length) {
            action = this._actionQueue.shift();
            this._actionCooldown.restart();
        }
        return action;
    }
}

export default class PetController extends GameController {

    private _emotionalState: Emotion;
    private _personality: Personality;

    private _id: string;
    private _relationships: Relationship[];

    // needs
    private _needMap: Map<NeedType, NeedController>;

    // state
    private _state: PetState;

    constructor(model: Model, id: string, stateData?: PetState) {
        super(model);
        this._emotionalState = Emotion.CONTENT;
        this._personality = {
            extraversion: 0.6,
            agreeableness: 1.0,
            openness: 1.0,
            conscientiousness: 1.0,
            neuroticism: 0.2,
        }
        this._id = id;

        this._relationships = [];
        this.addRelationship(new User('001', 'Abigail'), RelationshipLevel.NONE);

        this._needMap = new Map<NeedType, NeedController>();
        this._needMap.set(NeedType.PHYSIOLOGY, new NeedPhysiologyController(0, this._personality, this._relationships[0]));
        this._needMap.set(NeedType.SAFETY, new NeedSafetyController(0, this._personality, this._relationships[0]));
        this._needMap.set(NeedType.LOVE, new NeedLoveController(0, this._personality, this._relationships[0]));
        this._needMap.set(NeedType.ESTEEM, new NeedEsteemController(0, this._personality, this._relationships[0]));
        this._needMap.set(NeedType.SELF_ACTUALIZATION, new NeedSelfActualizationController(0, this._personality, this._relationships[0]));

        this._state = {
            gameStatus: GameStatus.RUNNING,
            userId: this._relationships[0].user.id,
            userName: this._relationships[0].user.name,
            userRelationshipLevel: this._relationships[0].relationshipLevel,
            emotionalState: this._emotionalState,
            personality: this._personality,
            needs: [],
            visualizerData: {
                timers: [],
            },
        }

        if (stateData) {
            this.initWithData(stateData);
        }

        this.update();
    }

    initWithData(state: PetState) {
        // console.log(`initWithData:`);
        this._gameStatus = state.gameStatus || this._gameStatus;
        if (state.userId && state.userName) {
            const user = new User(state.userId, state.userName);
            this._relationships = [new Relationship(user, state.userRelationshipLevel)];
        }
        this._emotionalState = state.emotionalState || this._emotionalState;
        this._personality = state.personality || this._personality;
        if (state.needs) {
            state.needs.forEach(needData => {
                let needController: NeedController | undefined;
                switch (needData.type) {
                    case NeedType.PHYSIOLOGY:
                        needController = this._needMap.get(NeedType.PHYSIOLOGY);// as NeedPhysiologyController;
                        needController?.initWithData(needData);
                        break;
                    case NeedType.SAFETY:
                        needController = this._needMap.get(NeedType.SAFETY);// as NeedPhysiologyController;
                        needController?.initWithData(needData);
                        break;
                    case NeedType.LOVE:
                        needController = this._needMap.get(NeedType.LOVE);// as NeedPhysiologyController;
                        needController?.initWithData(needData);
                        break;
                    case NeedType.ESTEEM:
                        needController = this._needMap.get(NeedType.ESTEEM);// as NeedPhysiologyController;
                        needController?.initWithData(needData);
                        break;
                    case NeedType.SELF_ACTUALIZATION:
                        needController = this._needMap.get(NeedType.SELF_ACTUALIZATION);// as NeedPhysiologyController;
                        needController?.initWithData(needData);
                        break;
                }
            });
        }
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

    onNeedControllerEvent(needControllerEvent: NeedControllerEvent) {
        Array.from(this._needMap).forEach(element => {
            const need: NeedController = element[1];
            const handled: boolean = need.onNeedControllerEvent(needControllerEvent);
            if (handled) {
                needControllerEvent.addHandledBy(need.type);
            }
        });
        console.log(JSON.stringify(this._state, null, 2));
    }

    update(options?: any): GameState {
        // update state and check for Actions
        // optional: include extra visualizer data
        options = options || {};
        const includeVisualizerData = options.includeVisualizerData || false;
        this._state.needs = [];
        if (includeVisualizerData) {
            this._state.visualizerData = { timers: [] };
        }
        Array.from(this._needMap).forEach(element => {
            const need: NeedController = element[1];
            this._state.needs.push(need.json);
            if (includeVisualizerData && this._state.visualizerData) {
                this._state.visualizerData.timers = this._state.visualizerData?.timers.concat(need.getVisualizerData().timers);
            }
            const action: Action | undefined = need.getAction();
            if (action) {
                this.emit('action', action);
            }
        });
        return this._state;
    }

    dispose() {
        super.dispose();
    }
}