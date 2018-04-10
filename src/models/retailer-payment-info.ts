import { PostalAddress } from './retailer-business-adress';
import { AddressType } from './address-type';

export class RetailerPaymentInfo {
    public retailerBankPaymentId: string;
    public retailerId: string;
    public retailerName: string;
    public paymentMethod: string;
    public paymentVehicle: string;
    public commissionRate: string;
    public fixRate: string;
    public bankName: string;
    public bankAccountName: string;
    public bankAccountNumber: string;
    public bankABARoutingNumber: string;
    public bankSwiftCode: string;
    public retailerBankAddress: RetailerBankAddress;
    public legalContact: LegalContact;
    public bankAddress: BankAddress;
    public addresses: Array<PostalAddress>;
    public status: boolean;
    public stripeToken: string;
    public stripeConnectAccountId: string;
    public stripeBankAccountNumber: string;
    public last4SSN: string;
    public dob: any;

    constructor(obj?: any) {
        this.retailerBankAddress = new RetailerBankAddress();
        this.bankAddress = new BankAddress();
        this.legalContact = new LegalContact();
        this.addresses = new Array<PostalAddress>();
        if (obj) {
            this.retailerBankPaymentId = obj.retailerBankPaymentId;
            this.retailerId = obj.retailerId;
            this.retailerName = obj.retailerName;
            this.paymentMethod = obj.paymentMethod;
            this.paymentVehicle = obj.paymentVehicle;
            this.commissionRate = obj.commissionRate;
            this.fixRate = obj.fixRate;
            this.bankName = obj.bankName;
            this.bankAccountName = obj.bankAccountName;
            this.bankAccountNumber = obj.bankAccountNumber;
            this.bankABARoutingNumber = obj.bankABARoutingNumber;
            this.bankSwiftCode = obj.bankSwiftCode;
            this.status = obj.status;
            if (obj.addresses && obj.addresses.length > 0) {
                this.addresses = obj.addresses.map(p => new PostalAddress(p));
                if (this.addresses.filter(p => p.addressType === AddressType.bankAccountAddress).length > 0) {
                    this.retailerBankAddress = new RetailerBankAddress(this.addresses.filter(p => p.addressType === AddressType.bankAccountAddress)[0]);
                }
                if (this.addresses.filter(p => p.addressType ===  AddressType.bankAddress).length > 0) {
                    this.bankAddress = new BankAddress(this.addresses.filter(p => p.addressType ===  AddressType.bankAddress)[0]);
                }
                if (this.addresses.filter(p => p.addressType === AddressType.legalContact).length > 0) {
                    this.legalContact = new LegalContact(this.addresses.filter(p => p.addressType === AddressType.legalContact)[0]);
                }
            }
            this.stripeToken = obj.stripeToken;
            this.stripeConnectAccountId = obj.stripeConnectAccountId;
            this.stripeBankAccountNumber = obj.stripeBankAccountNumber;
            this.last4SSN = obj.last4SSN;
            this.dob = obj.dob;
        }
    }
}
export class RetailerBankAddress extends PostalAddress {
    constructor(obj?: any) {
        super(obj);
        if (obj) { } else {
            this.addressType = AddressType.bankAccountAddress;
        }
    }
}
export class BankAddress extends PostalAddress {
    constructor(obj?: any) {
        super(obj);
        if (obj) { } else {
            this.addressType = AddressType.bankAddress;
        }
    }

}
export class LegalContact extends PostalAddress {
    constructor(obj?: any) {
        super(obj);
        if (obj) { } else {
            this.addressType = AddressType.legalContact;
        }
    }

}
