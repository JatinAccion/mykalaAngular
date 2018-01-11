import { PostalAddress } from './retailer-business-adress';

export class RetailerPaymentInfo extends PostalAddress {
    public bankId: number;
    public retailerId: number;
    public paymentMethod: string;
    public paymentVehicle: string;
    public bankName: string;
    public accountName: string;
    public accountNumber: string;
    public routingNumber: string;
    public swiftCode: string;
    public bankAddress: BankAddress;
    public status: boolean;
    constructor(obj?: any) {
        super(obj);
        if (obj) {
            this.bankId = obj.bankId;
            this.retailerId = obj.retailerId;
            this.paymentMethod = obj.paymentMethod;
            this.paymentVehicle = obj.paymentVehicle;
            this.bankName = obj.bankName;
            this.accountName = obj.accountName;
            this.accountNumber = obj.accountNumber;
            this.routingNumber = obj.routingNumber;
            this.swiftCode = obj.swiftCode;
            this.status = obj.status;
            this.bankAddress = new BankAddress(obj.bankAddress);
        } else { this.bankAddress = new BankAddress(); }
    }
}
export class BankAddress extends PostalAddress {
    public name: string;
    constructor(obj?: any) {
        super(obj);
        if (obj) {
            this.name = obj.name;
        }
    }

}
