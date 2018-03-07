import { RetailerBusinessAddress, PostalAddress } from './retailer-business-adress';
import { RetailerContact } from './retailer-contact';
import { environment } from '../admin-app/environments/environment';

export class RetailerProfileInfo {
    public retailerId: string;
    public businessName: string;
    public businessLogoPath: string;
    public websiteUrl: string;
    public websiteUserName: string;
    public websitePassword: string;
    public tin: string;
    public businessSummary: string;
    public sellerTypeId: string;
    public createdDate: Date | null;
    public modifiedDate: Date | null;
    public status: boolean | null = true;

    public businessAddress: RetailerBusinessAddress;
    public contactPerson: RetailerContact[];
    public addresses: PostalAddress[];
    constructor(obj?: any) {
        this.addresses = new Array<PostalAddress>();
        this.businessAddress = new RetailerBusinessAddress();
        this.contactPerson = new Array<RetailerContact>();
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
            if (obj.addresses && obj.addresses.length > 0) {
                this.addresses = obj.addresses.map(p => new PostalAddress(p));
                if (this.addresses.filter(p => p.addressType === new RetailerBusinessAddress().addressType).length > 0) {
                    this.businessAddress = new RetailerBusinessAddress(this.addresses.filter(p => p.addressType === new RetailerBusinessAddress().addressType)[0]);
                }
                if (this.addresses.filter(p => p.addressType !== new RetailerBusinessAddress().addressType).length > 0) {
                    this.contactPerson = this.addresses.filter(p => p.addressType !== new RetailerBusinessAddress().addressType).map(p => new RetailerContact(p));
                }
            }

        }
    }
}