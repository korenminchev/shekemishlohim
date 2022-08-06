export enum Destination {
    building = 'building',
    segel = 'segel',
    samech = 'samech',
    topaz = 'topaz'
}

export enum Expiration {
    day = 'day',
    week = 'week',
    month = 'month'
}

export class DeliveryRequest {
    constructor(recepient_id: number) {
        this.receiver_id = recepient_id;
    }

    receiver_id: number;
    destination: Destination;
    expiration: Expiration;
    content: string;
}   
