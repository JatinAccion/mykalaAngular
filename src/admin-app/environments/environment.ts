import { apiNames, commonMessages } from './common';
import { regexPatterns } from '../../common/regexPatterns';
export const environment = {
  production: true,
  s3: 'https://s3.us-east-2.amazonaws.com\\',
  Api: 'http://dev-user-service.us-east-2.elasticbeanstalk.com',
  AdminApi: 'http://dev-retailer-service-mongo.us-east-1.elasticbeanstalk.com/retailer/v1',
  TaxApi: 'http://dev-retailer-service-mongo.us-east-1.elasticbeanstalk.com/tax/v1',
  productApi: 'http://192.168.168.162:9089/api',
  // productApi: 'http://dev-product-service.us-east-2.elasticbeanstalk.com/api',
  userApi: 'http://dev-user-signup.us-east-2.elasticbeanstalk.com/user/v1',  
  ordersReportApi: 'http://dev-orderservice.us-east-1.elasticbeanstalk.com/order/v1/reports',
  ordersApi: 'http://dev-orderservice.us-east-1.elasticbeanstalk.com/order/v1',
  paymentApi: 'http://qa-order-service.us-east-1.elasticbeanstalk.com/payment/v1',
  // consumerApi: 'http://dev-consumer-profile.us-east-2.elasticbeanstalk.com',
  consumerApi: 'http://qa-consumer-service.us-west-1.elasticbeanstalk.com',
  InquiryApi: 'http://dev-retailer-service-mongo.us-east-1.elasticbeanstalk.com/retailer/v1',
  stripePK: 'pk_test_9th9u2YsJ2y1ms60AgtpXoMS',
  apis: apiNames,
  regex: regexPatterns,
  commonMsg: commonMessages
};
