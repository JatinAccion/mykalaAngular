import { PostalAddress } from './retailer-business-adress';

export class RetailerPaymentInfo extends PostalAddress {
    public retailerId: number;
    public paymentMethod: string;
    public paymentVehicle: string;
    public bankName: string;
    public accountName: string;
    public accountNumber: string;
    public routingNumber: string;
    public swiftCode: string;
    public bankAddress: BankAddress;
    constructor() {
        super();
        this.bankAddress = new BankAddress();
    }
}
export class BankAddress extends PostalAddress {
    public name: string;

}
