import axios from "axios";
import { DeliveryRequest, Destination } from "../models/delivery_request";

export class Backend {
    static ip: String;
    static port: number;

    static init(ip: String, port: number) {
        this.ip = ip;
        this.port = port;
    }

    static async createDelivery(delivery_request: DeliveryRequest): Promise<number> {
        console.log(delivery_request);
        try {
            const { data, status } = await axios.post(`http://${this.ip}:${this.port}/delivery`, delivery_request);
            console.log(status);
            if (status != 200) {
                return -1;
            }

            return 1;
        } catch (error) {
            return -1;
        }
    }

    static async closeDelivery(delivery_id: number): Promise<boolean> {
        try {
            const { data, status } = await axios.delete(`http://${this.ip}:${this.port}/delivery/${delivery_id}`);
            console.log(status);
            if (status != 200) {
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    static async getDeliveries(destination: Destination): Promise<DeliveryRequest[]> {
        try {
            const { data, status } = await axios.get<DeliveryRequest[]>(`http://${this.ip}:${this.port}/delivery?destination=${destination}`);
            console.log(status);
            if (status != 200) {
                return null;
            }

            console.log(data);
            return data;
        } catch (error) {
            return null;
        }
    }
}
