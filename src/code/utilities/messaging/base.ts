import { MessagingBaseValidator } from "../validators/utilities/messaging/base.js";
import {
    IMessaging,
    Unsubscribe,
    ChannelListeners,
    Channel,
    ChannelListener,
    ChannelData
} from "./types.js";

export abstract class MessagingBase implements IMessaging {
    // #region fields

    private _started: boolean;
    private readonly validator: MessagingBaseValidator;
    private readonly channels: Map<Channel, ChannelListeners>;

    // #endregion

    constructor(public name: string) {
        this._started = false;
        this.validator = new MessagingBaseValidator(name);
        this.channels = new Map<Channel, ChannelListeners>;
    }

    // #region interface

    public get started(): boolean {
        return this._started;
    }

    public start(): void {
        if (this._started) {
            return;
        }
        this._started = true;
    }

    public stop(): void {
        if (!this._started) {
            return;
        }
        this.channels.clear();
        this._started = false;
    }

    // #endregion

    // #region events

    protected on(channel: Channel, listener: ChannelListener): Unsubscribe<ChannelListener> {
        this.validator.validateOn(channel, listener);

        if (!this.start) {
            throw new Error(`${this.name} messaging is not started.`);
        }

        if (!this.channels.has(channel)) {
            throw new Error(`channel ${channel} does not exist or has been destroyed.`);
        }

        const listeners = this.channels.get(channel)!;
        listeners.push(listener);

        return () => this.unsubscribe(channel, listener);
    }

    // #endregion

    // #region methods

    protected create(channel: Channel): void {
        this.validator.validateCreate(channel);

        const hasChannel = this.channels.has(channel);
        if (!hasChannel) {
            this.channels.set(channel, []);
        }
    }

    protected send(channel: Channel, data: ChannelData): void {
        this.validator.validateSend(channel, data);

        if (!this.start) {
            throw new Error(`${this.name} messaging is not started.`);
        }

        if (!this.channels.has(channel)) {
            throw new Error(`channel ${channel} does not exist or has been destroyed.`);
        }

        const listeners = this.channels.get(channel);
        listeners?.forEach((l) => this.sendCore(l, data));
    }

    private sendCore(listener: ChannelListener, data: ChannelData): void {
        try {
            listener(data);
        } catch (error) {
            // TODO: handle: log!!!
        }
    }

    private unsubscribe(channel: Channel, listener: ChannelListener): ChannelListener | undefined {
        const hasChannel = this.channels.has(channel);
        if (hasChannel) {
            const listeners = this.channels.get(channel)!;
            const index = listeners.findIndex((l) => l === listener);
            if (index > -1) {
                const l = listeners.splice(index, 1);
                return l[0];
            }
        }
    }

    // #endregion
}