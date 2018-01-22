import { RetailerBuinessAddress } from './retailer-business-adress';
import { RetailerContact } from './retailer-contact';
import { environment } from '../admin-app/environments/environment';

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
            if (obj.businessLogoPath) {
                this.businessLogoPath = environment.s3 + obj.businessLogoPath;
            } else {
                delete this.businessLogoPath;
            }
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
            if (obj.contactPerson) {
                this.contactPerson = obj.contactPerson.map(p => new RetailerContact(p));
            } else {
                this.contactPerson = new Array<RetailerContact>();
            }
        } else {
            this.businessAddress = new RetailerBuinessAddress();
            this.contactPerson = new Array<RetailerContact>();
        }
    }
}