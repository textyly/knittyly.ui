import { Channel, ChannelData, ChannelListener } from "../../../messaging/types.js";
import { ClassValidator } from "../../class.js";

export class MessagingBaseValidator extends ClassValidator {
    constructor(name: string) {
        super(name);
    }

    public validateOn(channel: Channel, listener: ChannelListener): void {
        super.validateStr(channel, "channel");
        super.validateRef(listener, "listener");
    }

    public validateSend(channel: Channel, data: ChannelData): void {
        super.validateStr(channel, "channel");
        super.validateRef(data, "data");
    }

    public validateCreate(channel: Channel): void {
        super.validateStr(channel, "channel");
    }
}