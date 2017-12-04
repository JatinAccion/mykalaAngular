import { RetailerBuinessAddress } from './retailer-business-adress';
import { RetailerPrimaryContact } from './retailer-contact';

export class RetailerProfileInfo {
    public retailerId: number;
    public retailerProfile: ProfileInfo;

    public businessAddress: RetailerBuinessAddress;


    public primaryContact: RetailerPrimaryContact;
}
export class ProfileInfo {
    public businessLogoPath: string;
    public businessName: string;
    public tin: string;
    public businessSummary: string;
    public sellerTypeId: number;
    public websiteUrl: string;
    public websiteUserName: string;
    public websitePassword: string;

}