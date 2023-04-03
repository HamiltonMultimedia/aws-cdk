"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const test_origin_1 = require("./test-origin");
const cloudfront = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-lambda', { env: { region: 'us-east-1' } });
const lambdaFunction = new lambda.Function(stack, 'Lambda', {
    code: lambda.Code.fromInline('foo'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_14_X,
});
new cloudfront.Distribution(stack, 'Dist', {
    defaultBehavior: {
        origin: new test_origin_1.TestOrigin('www.example.com'),
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        edgeLambdas: [{
                functionVersion: lambdaFunction.currentVersion,
                eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
            }],
    },
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZGlzdHJpYnV0aW9uLWxhbWJkYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmRpc3RyaWJ1dGlvbi1sYW1iZGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4Q0FBOEM7QUFDOUMscUNBQXFDO0FBQ3JDLCtDQUEyQztBQUMzQyxxQ0FBcUM7QUFFckMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSwyQkFBMkIsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFFaEcsTUFBTSxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7SUFDMUQsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztJQUNuQyxPQUFPLEVBQUUsZUFBZTtJQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO0NBQ3BDLENBQUMsQ0FBQztBQUVILElBQUksVUFBVSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO0lBQ3pDLGVBQWUsRUFBRTtRQUNmLE1BQU0sRUFBRSxJQUFJLHdCQUFVLENBQUMsaUJBQWlCLENBQUM7UUFDekMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCO1FBQ3BELFdBQVcsRUFBRSxDQUFDO2dCQUNaLGVBQWUsRUFBRSxjQUFjLENBQUMsY0FBYztnQkFDOUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjO2FBQ3pELENBQUM7S0FDSDtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFRlc3RPcmlnaW4gfSBmcm9tICcuL3Rlc3Qtb3JpZ2luJztcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdpbnRlZy1kaXN0cmlidXRpb24tbGFtYmRhJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0xJyB9IH0pO1xuXG5jb25zdCBsYW1iZGFGdW5jdGlvbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdMYW1iZGEnLCB7XG4gIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxufSk7XG5cbm5ldyBjbG91ZGZyb250LkRpc3RyaWJ1dGlvbihzdGFjaywgJ0Rpc3QnLCB7XG4gIGRlZmF1bHRCZWhhdmlvcjoge1xuICAgIG9yaWdpbjogbmV3IFRlc3RPcmlnaW4oJ3d3dy5leGFtcGxlLmNvbScpLFxuICAgIGNhY2hlUG9saWN5OiBjbG91ZGZyb250LkNhY2hlUG9saWN5LkNBQ0hJTkdfRElTQUJMRUQsXG4gICAgZWRnZUxhbWJkYXM6IFt7XG4gICAgICBmdW5jdGlvblZlcnNpb246IGxhbWJkYUZ1bmN0aW9uLmN1cnJlbnRWZXJzaW9uLFxuICAgICAgZXZlbnRUeXBlOiBjbG91ZGZyb250LkxhbWJkYUVkZ2VFdmVudFR5cGUuT1JJR0lOX1JFUVVFU1QsXG4gICAgfV0sXG4gIH0sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=