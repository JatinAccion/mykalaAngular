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
        getProductReview: 'consumer/v1/productReviewCount'
    },
    orders: {
        get: '',
        paymentCounts: 'paymentCounts/{paymentType}/{year}/{month}',
        paymentReports: 'paymentReports/{paymentType}/{year}/{month}',
        consumerPayment: 'consumerPayment/{paymentType}/{year}/{month}',
        getOrders: 'orders/{paymentType}/{year}/{month}',
        consumerYearlyReport: 'customerYearlyReport/{memberType}/{year}/{month}',
        consumerCount: 'customerCount/{memberType}/{year}/{month}',
        orderReviewCount: 'consumer/v1/report/completeReview/{year}/{month}',
        avgReviewCount: 'consumer/v1/report/avgReview/{year}/{month}',
        avgResponseTime: 'consumer/v1/report/avgResponseTime/{year}/{month}',
        sellerPayment: 'sellerPayment',
        sellerPaymentStatus: '{orderId}/{retailerId}/sellerPaymentStatus',
        getRetailerReviews: 'reports/review',
        getRetailerReviewRatings: 'consumer/v1/report/retailerReviewRatings/{retailerId}'
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
        delete: 'support/{supportId}/deleteInquiry'
    }
};
export const commonMessages = {
    error404: 'Server is not available',
};
