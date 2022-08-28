import { isNumericLiteral } from "typescript";

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

export enum Source {
    lotem = 'lotem',
    shakmaz = 'shakmaz'
}

export function destinationToHebrewString(destination: Destination): string {
    switch (destination) {
        case Destination.building:
            return 'בניין';
        case Destination.segel:
            return 'סגל';
        case Destination.samech:
            return 'ס׳';
        case Destination.topaz:
            return 'טופז, ס׳ וג׳נסיס';
    }
}

export function floorToDestination(floor: any): Destination {
    if (parseInt(floor) == floor) {
        return Destination.building;
    }

    switch (floor) {
        case "s":
            return Destination.topaz;

        case "t":
            return Destination.topaz;

        case "g":
            return Destination.topaz;

        case "b":
            return Destination.segel;
    }
}

export class DeliveryRequest {
    constructor(recepient_id: string) {
        this.receiver_id = recepient_id;
    }

    receiver_id: string;
    destination: Destination;
    source: Source;
    expiration: Expiration;
    content: string;
}
