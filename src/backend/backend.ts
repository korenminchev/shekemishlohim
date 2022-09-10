import axios from "axios";
import { DeliveryRequest, Destination, Source } from "../models/delivery_request";
import { UserStatus } from "../models/user";

export class Backend {
    static ip: String;
    static port: number;

    static init(ip: String, port: number) {
        this.ip = ip;
        this.port = port;
    }


    private static validateStatus(status: number): boolean {
        return status == 200;
    }

    static async createDelivery(delivery_request: DeliveryRequest): Promise<boolean> {
        console.log(delivery_request);
        try {
            const { data, status } = await axios.post(`http://${this.ip}:${this.port}/delivery`, delivery_request);
            if (status != 200) {
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    static async closeDelivery(receiver_id: string): Promise<boolean> {
        try {
            const { data, status } = await axios.delete(`http://${this.ip}:${this.port}/delivery/${receiver_id}`);
            if (status != 200) {
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    static async getDeliveries(user_id: string, destination: Destination, source: Source): Promise<DeliveryRequest[]> {
        try {
            const { data, status } = await axios.get<DeliveryRequest[]>(`http://${this.ip}:${this.port}/delivery?destination=${destination}&user_id=${user_id}&source=${source}`);
            if (status != 200) {
                return null;
            }

            console.log(data);
            return data;
        } catch (error) {
            return null;
        }
    }

    static async acceptDelivery(receiver_id: string, jester_id: string | null): Promise<boolean> {
        try {
            var queryParam = "";
            if (jester_id != null) {
                queryParam = `?deliveryman_id=${jester_id}`;
            }
            const { data, status } = await axios.put(`http://${this.ip}:${this.port}/delivery/${receiver_id}${queryParam}`);
            if (status != 200) {
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    static async getUserStatus(user_id: string): Promise<UserStatus> {
        try {
            const { data, status } = await axios.get<UserStatus>(`http://${this.ip}:${this.port}/delivery/${user_id}`);
            if (status != 200) {
                return null;
            }

            return data;
        } catch (error) {
            return null;
        }
    }
}
