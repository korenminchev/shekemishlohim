import { User } from "../../models/user";
import { DB, RecordNotFound } from "../db";
import fs from "fs";


export class JsonDB implements DB {
    private db: { [key: number]: User};
    private json_path: string;

    constructor(json_path: string) {
        this.db = {};
        this.json_path = json_path;
    }

    public async init(): Promise<void> {
        const json_data = fs.readFileSync(this.json_path, 'utf-8');
        this.db = JSON.parse(json_data);
    }

    // No need to read json everytime because data is cached on write
    public async getUser(phone_number: number): Promise<User> {
        return new Promise((resolve, reject) => {
            if (this.db[phone_number]) {
                resolve(this.db[phone_number]);
            } else {
                reject(new RecordNotFound("User not found"));
            }
        });
    }

    public async updateUser(user: User): Promise<User> {
        return new Promise((resolve, reject) => {
            this.db[user.phone_number] = user;
            fs.writeFileSync(this.json_path, JSON.stringify(this.db, null, 2));
            resolve(user);
        });
    }
}
