import { Listener, VoidListener, VoidUnsubscribe } from "../types.js";
import { Messaging } from "./base.js";
import {
    PublicChannelName,
    IMessaging0,
    IMessaging1,
    IMessaging2,
    IMessaging3,
    IMessaging4,
    IMessaging5,
    IMessaging6,
} from "./types.js";

export class Messaging0 extends Messaging implements IMessaging0 {
    private readonly channel0 = PublicChannelName.Channel0;

    constructor(name: string) {
        super(name);
        super.create(this.channel0);
    }

    public listenOnChannel0(listener: VoidListener): VoidUnsubscribe {
        return super.on(this.channel0, listener);
    }

    public sendToChannel0(): void {
        super.send(this.channel0, {});
    }
}

export class Messaging1<Data1> extends Messaging0 implements IMessaging1<Data1> {
    private readonly channel1 = PublicChannelName.Channel1;

    constructor(name: string) {
        super(name);
        super.create(this.channel1);
    }

    public listenOnChannel1(listener: Listener<Data1>): VoidUnsubscribe {
        return super.on(this.channel1, listener);
    }

    public sendToChannel1(data: Data1): void {
        super.send(this.channel1, data);
    }
}

export class Messaging2<Data1, Data2> extends Messaging1<Data1> implements IMessaging2<Data1, Data2> {
    private readonly channel2 = PublicChannelName.Channel2;

    constructor(name: string) {
        super(name);
        super.create(this.channel2);
    }

    public listenOnChannel2(listener: Listener<Data2>): VoidUnsubscribe {
        return super.on(this.channel2, listener);
    }

    public sendToChannel2(data: Data2): void {
        super.send(this.channel2, data);
    }
}

export class Messaging3<Data1, Data2, Data3> extends Messaging2<Data1, Data2> implements IMessaging3<Data1, Data2, Data3> {
    private readonly channel3 = PublicChannelName.Channel3;

    constructor(name: string) {
        super(name);
        super.create(this.channel3);
    }

    public listenOnChannel3(listener: Listener<Data3>): VoidUnsubscribe {
        return super.on(this.channel3, listener);
    }

    public sendToChannel3(data: Data3): void {
        super.send(this.channel3, data);
    }
}

export class Messaging4<Data1, Data2, Data3, Data4> extends Messaging3<Data1, Data2, Data3> implements IMessaging4<Data1, Data2, Data3, Data4> {
    private readonly channel4 = PublicChannelName.Channel4;

    constructor(name: string) {
        super(name);
        super.create(this.channel4);
    }

    public listenOnChannel4(listener: Listener<Data4>): VoidUnsubscribe {
        return super.on(this.channel4, listener);
    }

    public sendToChannel4(data: Data4): void {
        super.send(this.channel4, data);
    }
}

export class Messaging5<Data1, Data2, Data3, Data4, Data5> extends Messaging4<Data1, Data2, Data3, Data4> implements IMessaging5<Data1, Data2, Data3, Data4, Data5> {
    private readonly channel5 = PublicChannelName.Channel5;

    constructor(name: string) {
        super(name);
        super.create(this.channel5);
    }

    public listenOnChannel5(listener: Listener<Data5>): VoidUnsubscribe {
        return super.on(this.channel5, listener);
    }

    public sendToChannel5(data: Data5): void {
        super.send(this.channel5, data);
    }
}

export class Messaging6<Data1, Data2, Data3, Data4, Data5, Data6> extends Messaging5<Data1, Data2, Data3, Data4, Data5> implements IMessaging6<Data1, Data2, Data3, Data4, Data5, Data6> {
    private readonly channel6 = PublicChannelName.Channel6;

    constructor( name: string) {
        super(name);
        super.create(this.channel6);
    }

    public listenOnChannel6(listener: Listener<Data6>): VoidUnsubscribe {
        return super.on(this.channel6, listener);
    }

    public sendToChannel6(data: Data6): void {
        super.send(this.channel6, data);
    }
}