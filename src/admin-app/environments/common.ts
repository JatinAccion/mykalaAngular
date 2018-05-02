export const apiNames = {
    Auth: {
        login: 'login',
        register: 'register',
        status: 'status',
        token: 'oauth/token',
        userInfo: 'loginUser'
    },
    users: {
        forgetPassword: 'forgotPassword',
        resetPassword: 'resetPassword',
        getAdmin: 'role/ROLE_ADMIN',
        get: '{userId}',
        save: 'admin',
        delete: '{userId}',
    },
    retailers: {
        get: '',
        sellerTypes: 'sellerTypes',
        getShippingProfileNames: '{retailerId}/shippingMethods',
        changeStatus: 'changeStatus',
        getRetailerNames: 'sellerNames',
        getStates: 'states/name',
        duplicateSellerName: '{sellerName}/sellerName'
    },
    retailerProfileInfo: {
        get: '{retailerId}',
        save: 'retailerProfiles',
        delete: 'delete',
    },
    retailerPaymentInfo: {
        get: '{retailerId}/bankDetails',
        save: 'bankDetails',
        addSellerAccount: 'addSellerAccount',
        delete: 'delete',
    },
    retailerShippingInfo: {
        get: '{retailerId}/shippingProfiles',
        save: 'shippingProfiles',
        delete: 'delete',
    },
    retailerShippingNotification: {
        get: '{retailerId}/shippingNotifications',
        save: 'shippingNotifications',
        delete: 'delete',
    },
    retailerShippingReturnPolicy: {
        get: '{retailerId}/shippingReturns',
        save: 'shippingReturns',
        delete: 'delete',
    },
    retailerTax: {
        get: '{retailerId}/taxNexus',
        save: 'taxNexus',
        delete: 'delete',
    },
    retailerProduct: {
        get: '{retailerId}/productPreferences',
        save: 'productPreferences',
        delete: 'delete',
    },
    product: {
        get: 'products/filterBy',
        save: 'products/save',
        delete: 'products/{productId}',
        changeStatus: 'products/changeStatus',
        saveImage: 'products/images',
        markasMainImage: 'products/{productId}/images/{imageId}',
        deleteImage: 'products/{productId}/images/{imageId}',
        changeMainImage: 'products/changeMainImage',
        places: 'products/places',
        categories: 'products/categoriesList',
        subCategories: 'products/subCategoriesList',
        types: 'products/typesList',
        upload: 'products/bulkProducts',
        bulkUpload: 'products/upload',
        uploadSummary: 'products/summary',
        viewUploadedProducts: 'products/dump',
        deleteSummary: 'products/summary/{summaryId}',
        getProducts: 'products/all',
        getProductReview: 'consumer/v1/productReviewCount',
        getProductMeta: 'products/partial'
    },
    orders: {
        // get: 'reports/orderItemsList',
        get: 'orderItemsList',
        paymentCounts: 'paymentCounts/{paymentType}/{year}/{month}',
        paymentReports: 'paymentReports/{paymentType}/summary/{summary}/{year}/{month}',
        consumerPayment: 'consumerPayment/{paymentType}/{year}/{month}',
        getOrders: 'orders/{paymentType}/{year}/{month}',
        consumerYearlyReport: 'consumer/v1/customerYearlyReport/{memberType}/{year}/{month}',
        consumerCount: 'consumer/v1/customerCount/{memberType}/{year}/{month}',
        orderReviewCount: 'consumer/v1/report/completeReview/{year}/{month}',
        avgReviewCount: 'consumer/v1/report/avgReview/{year}/{month}',
        avgResponseTime: 'consumer/v1/report/avgResponseTime/{year}/{month}',
        sellerPayment: 'sellerPayment',
        sellerPaymentStatus: '{orderId}/{retailerId}/sellerPaymentStatus',
        getRetailerReviews: 'reports/review',
        getRetailerReviewRatings: 'consumer/v1/report/retailerReviewRatings/{retailerId}',
        getPaymentDetails: 'paymentDetails',
    },
    consumer: {
        get: 'consumer/v1/userId',
        orderOfferNumber: 'orderOfferNumber'
    },
    inquiry: {
        get: 'support/inquiriesList',
        getInquiryDetails: 'support/{supportId}/inquiryDetails',
        save: 'support/saveInquiryRequest',
        update: 'support/updateInquiryRequest ',
        delete: 'support/{supportId}/deleteInquiry',
        getIssueCount: 'support/issueCount/{retailerId}/{consumerId}',
        inquiriesReport: 'reports/inquiries/{type}/{year}/{month}',
        inquiriesCategoryReport: 'reports/inquiriesCategory/{type}/{year}/{month}',
        retailerInquiries: 'reports/retailerInquiries/{type}/{category}',
        inquiriesSummaryReport: 'reports/inquiriesTypeAndCategory?inquiriesType={type}&year={year}&month={month}&inquiriesCategory={category}'

    }
};
export const commonMessages = {
    error404: 'Server is not available',
};
