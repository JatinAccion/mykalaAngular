import { apiNames, commonMessages } from './common';
import { regexPatterns } from '../../common/regexPatterns';
export const environment = {
  production: true,
  s3: 'https://s3.us-east-2.amazonaws.com\\',
  Api: 'http://qa-user-service.us-west-1.elasticbeanstalk.com',
  AdminApi: 'http://qa-retailer-service.us-west-1.elasticbeanstalk.com/retailer/v1',
  TaxApi: 'http://qa-retailer-service.us-west-1.elasticbeanstalk.com/tax/v1',
  productApi: 'http://qa-product-service.us-west-1.elasticbeanstalk.com/api',
  // productApi: 'http://dev-product-service.us-east-2.elasticbeanstalk.com/api',
  userApi: 'http://qa-signup-service.us-west-1.elasticbeanstalk.com/user/v1',
  ordersReportApi: 'http://qa-order-service.us-east-1.elasticbeanstalk.com/order/v1/reports',
  // ordersApi: 'http://qa-order-service.us-east-1.elasticbeanstalk.com/order/v1',
  ordersApi: 'http://qa-order-service.us-east-1.elasticbeanstalk.com/order/v1',
  paymentApi: 'http://qa-order-service.us-east-1.elasticbeanstalk.com/payment/v1',
  consumerApi: 'http://qa-consumer-service.us-west-1.elasticbeanstalk.com',
  InquiryApi: 'http://qa-retailer-service.us-west-1.elasticbeanstalk.com/retailer/v1',
  stripePK: 'pk_test_9th9u2YsJ2y1ms60AgtpXoMS',
  apis: apiNames,
  regex: regexPatterns,
  commonMsg: commonMessages
};
