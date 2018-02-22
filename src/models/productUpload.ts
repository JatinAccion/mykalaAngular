import { Pagination } from './pagination';
import { environment } from '../admin-app/environments/environment';


export class ProductUpload {
    public productSummaryId: string;
    public updatedRecordsCount: string;
    public addedRecordsCount: string;
    public errorCount: string;
    public updatedFileLink: string;
    public errorFileLink: string;
    public totalRecordsCount: string;
    public createdDate: string;
    public fileName: string;
    constructor(obj?: any) {
        if (obj) {
            this.productSummaryId = obj.productSummaryId;
            this.updatedRecordsCount = obj.updatedRecordsCount;
            this.addedRecordsCount = obj.addedRecordsCount;
            this.errorCount = obj.errorCount;
            this.updatedFileLink = environment.s3 + 'mykala-dev-images/products/' +  obj.updatedFileLink;
            this.errorFileLink = environment.s3 + 'mykala-dev-images/products/' + obj.errorFileLink;
            this.totalRecordsCount = obj.totalRecordsCount;
            this.createdDate = obj.createdDate;
            this.fileName = obj.fileName;
        }
    }
}
export class ProductUploads extends Pagination {
    constructor(obj?: any) {
        if (obj) {
            super(obj);
            this.content = obj.content.map(p => new ProductUpload(p));
        }
    }
    public content: ProductUpload[];
}

