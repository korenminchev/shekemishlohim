import { Message } from "whatsapp-web.js";
import { DB } from "../db/db";
import { MessageResponse } from "./message_response";
import { StateResponse } from "./state_response";

export interface State {
    state_id: number;
    supported_messages: string[];
    db: DB;

    onEnter(): Promise<MessageResponse>;

    handle(message: Message, user_id: string) : Promise<StateResponse>;
}
