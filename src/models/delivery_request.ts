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
    recipient_id: string;
    destination: Destination;
    expiration: Expiration;
    content: string;
}   
