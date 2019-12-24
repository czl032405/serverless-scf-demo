## serverless-demo

https://serverless.com/partners/cloud/tencent/chinese/
https://github.com/serverless-components
https://github.com/serverless-components/tencent-scf
https://github.com/serverless-components/tencent-website
https://github.com/tencentyun/scf-serverlessdb-sdk-nodejs
https://cloud.tencent.com/developer/tag/10356
https://cloud.tencent.com/document/product/583
https://serverless-stack.com/

### 问

1. How to ref between services
2. Can not run `serverless deploy` but `serverless`?
3. Access `.env` out of services
4. One command to deploy all services
5. Typescript handlers

### 坑

1. Dependent needed to be upload in Tencent

2. Only Create and Update are applied on each deployment, not Remove

3. It will create new ApiGateway if serviceId is empty on each deployment.

4. Note: While in Beta, you cannot currently use Serverless Components within an existing Serverless Framework project file (i.e. a project file that contains functions, events, resources and plugins).
