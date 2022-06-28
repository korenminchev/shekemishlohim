export class User {
    phone_number: string;
    name: string;
    token_count: number;
    office_number?: string;

    constructor(
        phone_number: string,
        name: string,
        token_count: number,
        office_number: string,
    ) {
        this.phone_number = phone_number;
        this.name = name;
        this.token_count = token_count;
        this.office_number = office_number;
    }

}
