import { AddressType } from "./address-type";

export class PostalAddress {
    public name: string;
    public position: string;
    public addressLine1: string;
    public addressLine2: string;
    public city: string;
    public state: string;
    public country: string;
    public zipcode: string;
    public email: string;
    public phoneNo: string;
    public addressType: string;
    constructor(obj?: any) {
        if (obj) {
            this.name = obj.name;
            this.position = obj.position;
            this.addressLine1 = obj.addressLine1;
            this.addressLine2 = obj.addressLine2;
            this.city = obj.city;
            this.state = obj.state;
            this.zipcode = obj.zipcode;
            this.email = obj.email;
            this.phoneNo = obj.phoneNo;
            this.addressType = obj.addressType;
            this.country = 'US';
        }
    }
}
export class RetailerBusinessAddress extends PostalAddress {
    constructor(obj?: any) {
        super(obj);
        if (obj) {
        } else {
            this.addressType = AddressType.business;
        }   
    }
}