import { RetailerBuinessAddress } from './retailer-business-adress';
import { RetailerContact } from './retailer-contact';

export class RetailerProfileInfo {
    public retailerId: number;
    // public retailerProfile: ProfileInfo;
    public businessLogoPath: string;
    public businessName: string;
    public tin: string;
    public businessSummary: string;
    public websiteUrl: string;
    public websiteUserName: string;
    public websitePassword: string;
    public sellerTypeId: number;

    public businessAddress: RetailerBuinessAddress;
    public contactPerson: RetailerContact[];
    constructor() {
        this.businessAddress = new RetailerBuinessAddress();
        this.contactPerson = new Array<RetailerContact>();
    }
}