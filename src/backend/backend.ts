import axios from "axios";

export class Backend {
    ip: String;
    port: number;

    constructor(ip: String, port: number) {
        this.ip = ip;
        this.port = port;
    }

    async createDelivery() {
        axios.post(`http://${this.ip}:${this.port}/delivery`, {
            
        });
    }
}