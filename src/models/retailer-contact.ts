import { PostalAddress } from './retailer-business-adress';

export class RetailerContact extends PostalAddress {
    public personName: string;
    public position: string;
    public email: string;
    public phoneNo: string;
    public contactType: string;
}
