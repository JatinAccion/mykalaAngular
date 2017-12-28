export class PostalAddress {
    public addressLine1: string;
    public addressLine2: string;
    public city: string;
    public state: string;
    public zipcode: string;
}

export class ContactDetails {
    public email: string;
    public phoneNo: string;
}
export class PostalAddressWithContact extends PostalAddress {
    public email: string;
    public phoneNo: string;
}
export class RetailerBuinessAddress extends PostalAddressWithContact {

}