export class ProductInfo {
}
export class ProductPlace {
    public PlaceId: string;
    public PlaceName: string;
    constructor(obj?: any) {
        if (obj) {
            this.PlaceId = obj.placeId;
            this.PlaceName = obj.placeName;
        }
    }
}
export class ProductCategory extends ProductPlace {
    public CategoryId: string;
    public CategoryName: string;
    constructor(obj?: any) {
        if (obj) {
            super(obj);
            this.CategoryId = obj.categoryId;
            this.CategoryName = obj.categoryName;
        }
    }
}
export class ProductSubCategory extends ProductCategory {
    public SubCategoryId: string;
    public SubCategoryName: string;
    public taxCode: string;
    public nextLevelProductTypeStatus: boolean;

    constructor(obj?: any) {
        if (obj) {
            super(obj);
            this.SubCategoryId = obj.subCategoryId;
            this.SubCategoryName = obj.subCategoryName;
            this.taxCode = obj.taxCode;
            this.nextLevelProductTypeStatus = obj.nextLevelProductTypeStatus;
        }
    }
}
export class ProductType {
    public parentId: string;
    public parentName: string;
    public productTypeId: string;
    public productTypeName: string;
    public taxCode: string;
    public nextLevelProductTypeStatus: boolean;
    constructor(obj?: any) {
        if (obj) {
            this.productTypeId = obj.productTypeId;
            this.productTypeName = obj.productTypeName;
            this.parentId = obj.parentId;
            this.parentName = obj.parentName;
            this.taxCode = obj.taxCode || '';
            this.nextLevelProductTypeStatus = obj.nextLevelProductTypeStatus === undefined ? true : obj.nextLevelProductTypeStatus;
        }
    }
}
export class ProductLevel {
    public levelName: string;
    public levelId: string;
    public levelCount: number;
    constructor(obj?: any) {
        if (obj) {
            this.levelName = obj.levelName;
            this.levelId = obj.levelId;
            this.levelCount = obj.levelCount;
        }
    }
}

export class ProductTypeLevel {
    public level: ProductType;
    public levelOptions: Array<ProductType>;
    public levelName: string;
    constructor(obj?: any) {
        this.level = new ProductType();
        if (obj.levelOptions) {
            this.levelOptions = obj.levelOptions;
        }
        this.levelName = obj.levelName;
        this.level = obj.level;
    }
}
export class ProductTypeLevels {
    public levels: Array<ProductTypeLevel>;
    constructor() {
        this.levels = new Array<ProductTypeLevel>();
    }
}

export class ProductMeta {
    public order: string;
    public page: string;
    public multiSelect: string;
    public isNumeric: string;
    public range: string;
    public min: string;
    public max: string;
    public additionalValues: string;
    public process: string;
    public importance: string;
    public options: Array<string>;
}
export class ProductMetas {
    public productMetas: Array<ProductMeta>;
    constructor(obj?: any) {
        if (obj) {

        }

    }
}
