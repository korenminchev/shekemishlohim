import { User } from '../models/user';

export interface DB {
    getUser(phone_number: number): Promise<User>;
    updateUser(user: User): Promise<User>;
}

export class RecordNotFound extends Error {
    constructor(message: string) {
        super(message);
    }
}