import { User } from '../models/user';

export interface DB {
    getUser(phone_number: string): Promise<User>;
    createUser(user: User): Promise<User>;
    updateUser(user: User): Promise<User>;
    userCount(): Promise<number>;
}

export class RecordNotFound extends Error {
    constructor(message?: string) {
        super(message);
    }
}
