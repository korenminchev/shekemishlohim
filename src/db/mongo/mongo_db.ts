import { User } from "../../models/user";
import { DB } from "../db";
import * as mongoDB from "mongodb";


export class MongoDB implements DB {
    db: mongoDB.Db;

    async init() {
        const client = new mongoDB.MongoClient("mongodb://mongodb:27017")
        await client.connect();
        this.db = client.db("shekemishlohim");
    }

    async getUser(phone_number: string): Promise<User> {
        const doc = await this.db.collection("users").findOne({ phone_number: phone_number });
        return new User(doc.phone_number, doc.name, doc.token_count, doc.floor, doc.office_number, doc.delivery_id);
    }

    async updateUser(user: User): Promise<User> {
        console.log(`Updating user ${user.phone_number}`);
        console.log(user);
        await this.db.collection("users").updateOne({ phone_number: user.phone_number }, {
            $set: {
                name: user.name,
                token_count: user.token_count,
                floor: user.floor,
                office_number: user.office_number,
                delivery_id: user.delivery_id
            }
        });
        return user;
    }

    async createUser(user: User): Promise<User> {
        await this.db.collection("users").insertOne(user);
        return user;
    }

    userCount(): Promise<number> {
        return this.db.collection("users").countDocuments();
    }

    increaseUniqueMessagesCount(): Promise<void> {
        this.db.collection("data").updateOne({}, { $inc: { unique_messages_count: 1 } });
        return Promise.resolve();
    }

    saveFeedback(user_id: string, feedback: string): Promise<void> {
        this.db.collection("feedback").insertOne({user_id: user_id, feedback: feedback });
        return Promise.resolve();
    }
}