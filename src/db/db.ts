import { User } from '../models/user';

export interface DB {
    getUser(phone_number: string): Promise<User>;
    updateUser(user: User): Promise<User>;
    recordCount(): Promise<number>;
}

export class RecordNotFound extends Error {
    constructor(message?: string) {
        super(message);
    }
}
