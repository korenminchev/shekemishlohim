import { User } from "../../models/user";
import { DB, RecordNotFound } from "../db";
const fs = require("fs");


export class JsonDB implements DB {
    private static db: { [key: string]: User};
    private static json_path: string;
    private static instance: JsonDB;

    private constructor(json_path: string) {
        JsonDB.db = {};
        JsonDB.json_path = json_path;
    }

    public static async createInstance(json_path: string): Promise<void> {
        if (JsonDB.instance) {
            return;
        }
        JsonDB.instance = new JsonDB(json_path);
        if (!fs.existsSync(JsonDB.json_path)) {
            fs.writeFileSync(JsonDB.json_path, JSON.stringify({}, null, 2));
            JsonDB.db = {};
            return;
        }
        
        const json_data = fs.readFileSync(JsonDB.json_path, 'utf-8');
        JsonDB.db = JSON.parse(json_data);
    }

    public static getInstance(): JsonDB {
        return JsonDB.instance;
    }

    // No need to read json everytime because data is cached on write
    public async getUser(phone_number: string): Promise<User> {
        return new Promise((resolve, reject) => {
            if (JsonDB.db[phone_number]) {
                resolve(JsonDB.db[phone_number]);
            } else {
                reject(new RecordNotFound());
            }
        });
    }

    public async updateUser(user: User): Promise<User> {
        return new Promise((resolve) => {
            JsonDB.db[user.phone_number] = user;
            fs.writeFileSync(JsonDB.json_path, JSON.stringify(JsonDB.db, null, 2));
            resolve(user);
        });
    }

    public async recordCount(): Promise<number> {
        return new Promise((resolve) => {
            resolve(Object.keys(JsonDB.db).length);
        });
    }
}

export { RecordNotFound };