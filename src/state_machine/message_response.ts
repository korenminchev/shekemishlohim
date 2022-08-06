import { Chat, MessageContent } from "whatsapp-web.js";

export class MessageResponse {
    sender_response?: MessageContent;
    additional_receivers?: [{chat: string, response: MessageContent}];
    enter_state: boolean;

    constructor(message: MessageContent, additional_receivers?: [{chat: string, response: MessageContent}], enter_state: boolean = true) {
        this.sender_response = message;
        this.additional_receivers = additional_receivers;
        this.enter_state = enter_state;
    }
}
