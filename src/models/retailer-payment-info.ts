export class RetailerPaymentInfo {
    public retailerId: number;
    public bankDetails: BankDetails;
    public name: string;
    public addressLine1: string;
    public addressLine2: string;
    public city: string;
    public state: string;
    public zipcode: string;
    public email: string;
    public phoneNo: string;
}
export class BankDetails {
    public retailerId: number;
    public paymentMethod: string;
    public paymentVehicle: string;
    public bankName: string;
    public accountName: string;
    public accountNumber: string;
    public routingNumber: string;
    public swiftCode: string;
    public addressLine1: string;
    public addressLine2: string;
    public city: string;
    public state: string;
    public zipcode: string;
}
