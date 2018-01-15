import { apiNames, commonMessages } from './common';
import { regexPatterns } from '../../common/regexPatterns';
export const environment = {
  production: true,
  s3: 'https://s3.us-east-2.amazonaws.com\\',
  Api: 'http://dev-user-service.us-east-2.elasticbeanstalk.com',
  AdminApi: 'http://dev-retailer-api.us-east-2.elasticbeanstalk.com',
  apis: apiNames,
  regex: regexPatterns,
  commonMsg: commonMessages
};
