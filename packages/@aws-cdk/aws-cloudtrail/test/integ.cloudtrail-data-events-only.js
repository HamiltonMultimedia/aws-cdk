"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("@aws-cdk/aws-lambda");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const cloudtrail = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudtrail-data-events');
const bucket = new s3.Bucket(stack, 'Bucket', { removalPolicy: cdk.RemovalPolicy.DESTROY });
const lambdaFunction = new lambda.Function(stack, 'LambdaFunction', {
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'hello.handler',
    code: lambda.Code.fromInline('exports.handler = {}'),
});
const trail = new cloudtrail.Trail(stack, 'Trail', {
    managementEvents: cloudtrail.ReadWriteType.NONE,
});
trail.addLambdaEventSelector([lambdaFunction]);
trail.addS3EventSelector([{ bucket }]);
new integ.IntegTest(app, 'CloudTrailDataEventsOnlyTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2xvdWR0cmFpbC1kYXRhLWV2ZW50cy1vbmx5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY2xvdWR0cmFpbC1kYXRhLWV2ZW50cy1vbmx5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsOENBQThDO0FBQzlDLHNDQUFzQztBQUN0QyxxQ0FBcUM7QUFDckMsOENBQThDO0FBQzlDLHFDQUFxQztBQUVyQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLDhCQUE4QixDQUFDLENBQUM7QUFFakUsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQzVGLE1BQU0sY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7SUFDbEUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztJQUNuQyxPQUFPLEVBQUUsZUFBZTtJQUN4QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsc0JBQXNCLENBQUM7Q0FDckQsQ0FBQyxDQUFDO0FBRUgsTUFBTSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7SUFDakQsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJO0NBQ2hELENBQUMsQ0FBQztBQUNILEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDL0MsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFFdkMsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsRUFBRTtJQUN2RCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCAqIGFzIGNsb3VkdHJhaWwgZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdpbnRlZy1jbG91ZHRyYWlsLWRhdGEtZXZlbnRzJyk7XG5cbmNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnLCB7IHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1kgfSk7XG5jb25zdCBsYW1iZGFGdW5jdGlvbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdMYW1iZGFGdW5jdGlvbicsIHtcbiAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE4X1gsXG4gIGhhbmRsZXI6ICdoZWxsby5oYW5kbGVyJyxcbiAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZXhwb3J0cy5oYW5kbGVyID0ge30nKSxcbn0pO1xuXG5jb25zdCB0cmFpbCA9IG5ldyBjbG91ZHRyYWlsLlRyYWlsKHN0YWNrLCAnVHJhaWwnLCB7XG4gIG1hbmFnZW1lbnRFdmVudHM6IGNsb3VkdHJhaWwuUmVhZFdyaXRlVHlwZS5OT05FLFxufSk7XG50cmFpbC5hZGRMYW1iZGFFdmVudFNlbGVjdG9yKFtsYW1iZGFGdW5jdGlvbl0pO1xudHJhaWwuYWRkUzNFdmVudFNlbGVjdG9yKFt7IGJ1Y2tldCB9XSk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnQ2xvdWRUcmFpbERhdGFFdmVudHNPbmx5VGVzdCcsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG5cbmFwcC5zeW50aCgpOyJdfQ==