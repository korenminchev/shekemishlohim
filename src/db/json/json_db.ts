import { User } from "../../models/user";
import { DB, RecordNotFound } from "../db";
const fs = require("fs");


export class JsonDB implements DB {
    private db: { [key: string]: User};
    private json_path: string;

    constructor(json_path: string) {
        this.db = {};
        this.json_path = json_path;
    }

    public async init(): Promise<void> {
        if (!fs.existsSync(this.json_path)) {
            fs.writeFileSync(this.json_path, JSON.stringify({}, null, 2));
            this.db = {};
            return;
        }
        
        const json_data = fs.readFileSync(this.json_path, 'utf-8');
        this.db = JSON.parse(json_data);
    }

    // No need to read json everytime because data is cached on write
    public async getUser(phone_number: string): Promise<User> {
        return new Promise((resolve, reject) => {
            if (this.db[phone_number]) {
                resolve(this.db[phone_number]);
            } else {
                reject(new RecordNotFound());
            }
        });
    }

    public async updateUser(user: User): Promise<User> {
        return new Promise((resolve) => {
            this.db[user.phone_number] = user;
            fs.writeFileSync(this.json_path, JSON.stringify(this.db, null, 2));
            resolve(user);
        });
    }

    public async recordCount(): Promise<number> {
        return new Promise((resolve) => {
            resolve(Object.keys(this.db).length);
        });
    }
}

export { RecordNotFound };