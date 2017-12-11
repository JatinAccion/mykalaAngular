export class PostalAddress {
    public addressLine1: string;
    public addressLine2: string;
    public city: string;
    public state: string;
    public zipcode: string;
}
export class RetailerBuinessAddress extends PostalAddress {
    public email: string;
    public phoneNo: string;
}