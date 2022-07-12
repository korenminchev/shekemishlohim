import { Chat, MessageContent } from "whatsapp-web.js";

export class MessageResponse {
    sender_response: MessageContent;
    additional_receivers?: [{chat: Chat, response: MessageContent}];

    constructor(message: MessageContent, additional_receivers?: [{chat: Chat, response: MessageContent}]) {
        this.sender_response = message;
        this.additional_receivers = additional_receivers;
    }
}
