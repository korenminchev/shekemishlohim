export class User {
    
    phone_number: string;
    name: string;
    token_count: number;
    floor: number | string;
    office_number?: string;
    delivery_id?: number;

    constructor(
        phone_number: string,
        name: string,
        token_count: number,
        floor: number | string,
        office_number?: string,
        delivery_id?: number
    ) {
        this.phone_number = phone_number;
        this.name = name;
        this.token_count = token_count;
        this.floor = floor;
        this.office_number = office_number;
        this.delivery_id = delivery_id;
    }

    hasDelivery(): boolean {
        return this.delivery_id != null && this.delivery_id != -1;
    }
}

export enum UserStatus {
    no_delivery = "no_delivery",
    not_assigned_delivery = "not_assigned_delivery",
    assigned_delivery = "assigned_delivery"
}
