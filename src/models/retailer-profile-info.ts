import { RetailerBuinessAddress } from './retailer-business-adress';
import { RetailerContact } from './retailer-contact';

export class RetailerProfileInfo {
    public retailerId: number;
    public businessName: string;
    public businessLogoPath: string;
    public websiteUrl: string;
    public websiteUserName: string;
    public websitePassword: string;
    public tin: string;
    public businessSummary: string;
    public sellerTypeId: number;
    public createdDate: Date | null;
    public modifiedDate: Date | null;
    public status: boolean | null = true;

    public businessAddress: RetailerBuinessAddress;
    public contactPerson: RetailerContact[];
    constructor(obj?: any) {
        if (obj) {
            this.retailerId = obj.retailerId;
            this.businessName = obj.businessName;
            this.businessLogoPath = 'https://s3.us-east-2.amazonaws.com\\' + obj.businessLogoPath;
            this.websiteUrl = obj.websiteUrl;
            this.websiteUserName = obj.websiteUserName;
            this.websitePassword = obj.websitePassword;
            this.tin = obj.tin;
            this.businessSummary = obj.businessSummary;
            this.sellerTypeId = obj.sellerTypeId;
            this.createdDate = obj.createdDate;
            this.modifiedDate = obj.modifiedDate;
            this.status = obj.status;
            this.businessAddress = new RetailerBuinessAddress(obj.businessAddress);
            this.contactPerson = obj.contactPerson.map(p => new RetailerContact(p));
        } else {
            this.businessAddress = new RetailerBuinessAddress();
            this.contactPerson = new Array<RetailerContact>();
        }
    }
}