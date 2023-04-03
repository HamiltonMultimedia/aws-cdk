"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const apigw = require("../lib");
class MultiStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const hello = new apigw.LambdaIntegration(new lambda.Function(this, 'Hello', {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline(`exports.handler = ${helloCode}`),
        }));
        const api = new apigw.RestApi(this, 'hello-api', { cloudWatchRole: true });
        api.root.resourceForPath('/hello').addMethod('GET', hello);
        const api2 = new apigw.RestApi(this, 'second-api', { cloudWatchRole: true });
        api2.root.resourceForPath('/hello').addMethod('GET', hello);
    }
}
const app = new cdk.App();
const testCase = new MultiStack(app, 'restapi-multiuse-example');
new integ_tests_1.IntegTest(app, 'restapi-multiuse', {
    testCases: [testCase],
});
function helloCode(_event, _context, callback) {
    return callback(undefined, {
        statusCode: 200,
        body: 'hello, world!',
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucmVzdGFwaS5tdWx0aXVzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnJlc3RhcGkubXVsdGl1c2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4Q0FBOEM7QUFDOUMscUNBQXFDO0FBQ3JDLHNEQUFpRDtBQUNqRCxnQ0FBZ0M7QUFFaEMsTUFBTSxVQUFXLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDaEMsWUFBWSxLQUFjLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQzNFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLGVBQWU7WUFDeEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixTQUFTLEVBQUUsQ0FBQztTQUMvRCxDQUFDLENBQUMsQ0FBQztRQUVKLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDM0UsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUzRCxNQUFNLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDN0Q7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sUUFBUSxHQUFHLElBQUksVUFBVSxDQUFDLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0FBRWpFLElBQUksdUJBQVMsQ0FBQyxHQUFHLEVBQUUsa0JBQWtCLEVBQUU7SUFDckMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0NBQ3RCLENBQUMsQ0FBQztBQUVILFNBQVMsU0FBUyxDQUFDLE1BQVcsRUFBRSxRQUFhLEVBQUUsUUFBYTtJQUMxRCxPQUFPLFFBQVEsQ0FBQyxTQUFTLEVBQUU7UUFDekIsVUFBVSxFQUFFLEdBQUc7UUFDZixJQUFJLEVBQUUsZUFBZTtLQUN0QixDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0ICogYXMgYXBpZ3cgZnJvbSAnLi4vbGliJztcblxuY2xhc3MgTXVsdGlTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGhlbGxvID0gbmV3IGFwaWd3LkxhbWJkYUludGVncmF0aW9uKG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0hlbGxvJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKGBleHBvcnRzLmhhbmRsZXIgPSAke2hlbGxvQ29kZX1gKSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaSh0aGlzLCAnaGVsbG8tYXBpJywgeyBjbG91ZFdhdGNoUm9sZTogdHJ1ZSB9KTtcbiAgICBhcGkucm9vdC5yZXNvdXJjZUZvclBhdGgoJy9oZWxsbycpLmFkZE1ldGhvZCgnR0VUJywgaGVsbG8pO1xuXG4gICAgY29uc3QgYXBpMiA9IG5ldyBhcGlndy5SZXN0QXBpKHRoaXMsICdzZWNvbmQtYXBpJywgeyBjbG91ZFdhdGNoUm9sZTogdHJ1ZSB9KTtcbiAgICBhcGkyLnJvb3QucmVzb3VyY2VGb3JQYXRoKCcvaGVsbG8nKS5hZGRNZXRob2QoJ0dFVCcsIGhlbGxvKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3QgdGVzdENhc2UgPSBuZXcgTXVsdGlTdGFjayhhcHAsICdyZXN0YXBpLW11bHRpdXNlLWV4YW1wbGUnKTtcblxubmV3IEludGVnVGVzdChhcHAsICdyZXN0YXBpLW11bHRpdXNlJywge1xuICB0ZXN0Q2FzZXM6IFt0ZXN0Q2FzZV0sXG59KTtcblxuZnVuY3Rpb24gaGVsbG9Db2RlKF9ldmVudDogYW55LCBfY29udGV4dDogYW55LCBjYWxsYmFjazogYW55KSB7XG4gIHJldHVybiBjYWxsYmFjayh1bmRlZmluZWQsIHtcbiAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgYm9keTogJ2hlbGxvLCB3b3JsZCEnLFxuICB9KTtcbn1cblxuIl19