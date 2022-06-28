import { Chat, Message } from "whatsapp-web.js";

export class MessageResponse {
    sender_response: Message;
    additional_receivers?: [{chat: Chat, response: Message}];

    constructor(message: Message, additional_receivers?: [{chat: Chat, response: Message}]) {
        this.sender_response = message;
        this.additional_receivers = additional_receivers;
    }
}
