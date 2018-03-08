import { PostalAddress } from './retailer-business-adress';
import { RetailerProfileInfo } from './retailer-profile-info';
import { AddressType } from './address-type';
import { RetailerPaymentInfo } from './retailer-payment-info';
import { IfObservable } from 'rxjs/observable/IfObservable';

export class StripePayment {
    public businessLogoPath: string;
    public businessName: string;
    public businessSummary: string;
    public websiteUrl: string;
    public tin: string;
    public type: 'company';
    public addressOrContact: PostalAddress[];
    public dob: CustomDate;
    public tosAcceptance: TosAcceptance;
    public token: string;//: btok_1C1DWsFYNDZqR6Poj00xPqsn,
    public commissionRate: string;//: 0.0,
    public fixedRate: string;//: 0.0

    /** retailerProfile instanceof RetailerProfileInfo, retailerPayment instanceof RetailerPaymentInfo, tosAcceptance instanceof TosAcceptance, dob instanceof Date */
    constructor(obj?: any) {
        if (obj) {
            if (obj.retailerProfile instanceof RetailerProfileInfo) {
                this.businessLogoPath = obj.retailerProfile.businessLogoPath;
                this.businessName = obj.retailerProfile.businessName;
                this.businessSummary = obj.retailerProfile.businessSummary;
                this.websiteUrl = obj.retailerProfile.websiteUrl;
                this.tin = obj.retailerProfile.tin;
                if (obj.retailerProfile.addresses && obj.retailerProfile.addresses.length > 0) {
                    const businessAddress = obj.retailerProfile.addresses.filter(p => (p.addressType === AddressType.business))[0];
                    const generalAddress = obj.retailerProfile.addresses.filter(p => (p.addressType === AddressType.primary))[0];
                    generalAddress.addressType = AddressType.generalStripe;
                    this.addressOrContact = [businessAddress, generalAddress];
                }
            }
            if (obj.retailerPayment instanceof RetailerPaymentInfo) {
                this.commissionRate = obj.retailerPayment.commissionRate;
                this.fixedRate = obj.retailerPayment.fixRate;
                this.token = obj.retailerPayment.stripeToken;
            }
            if (obj.tosAcceptance instanceof TosAcceptance) {
                this.tosAcceptance = obj.tosAcceptance;
            }
            if (obj.dob) {
                if (obj.dob instanceof Date) {
                    this.dob = new CustomDate(obj.dob);
                } else if (obj.dov instanceof CustomDate) {
                    this.dob = obj.dob;
                }
            }
        }
    }
}
export class CustomDate {
    public day: number;
    public month: number;
    public year: number;
    constructor(date?: Date) {
        if (date) {
            this.day = date.getDate();
            this.month = date.getMonth();
            this.year = date.getFullYear();
        }
    }
}
export class TosAcceptance {
    public date: number;
    public ip: string;
    constructor(obj?: any) {
        if (obj) {
            this.date = obj.created;
            this.ip = obj.client_ip;
        }
    }
}
