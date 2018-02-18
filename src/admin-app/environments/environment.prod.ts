import { apiNames, commonMessages } from './common';
import { regexPatterns } from '../../common/regexPatterns';
export const environment = {
  production: true,
  s3: 'https://s3.us-east-2.amazonaws.com\\',
  Api: 'http://qa-user-service.us-west-1.elasticbeanstalk.com',
  AdminApi: 'http://qa-retailer-service.us-west-1.elasticbeanstalk.com/retailer/v1',
  productApi: 'http://qa-product-service.us-west-1.elasticbeanstalk.com/api',
  userApi: 'http://qa-signup-service.us-west-1.elasticbeanstalk.com/user/v1',
  stripePK: 'pk_test_9th9u2YsJ2y1ms60AgtpXoMS',
  apis: apiNames,
  regex: regexPatterns,
  commonMsg: commonMessages
};
