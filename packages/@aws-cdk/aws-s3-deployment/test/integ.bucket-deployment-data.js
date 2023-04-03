"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_s3_1 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
const app = new core_1.App();
const stack = new core_1.Stack(app, 'TestBucketDeploymentContent');
const bucket = new aws_s3_1.Bucket(stack, 'Bucket');
const file1 = lib_1.Source.data('file1.txt', 'boom');
const file2 = lib_1.Source.data('path/to/file2.txt', `bam! ${bucket.bucketName}`);
const file3 = lib_1.Source.jsonData('my/config.json', { website_url: bucket.bucketWebsiteUrl });
const deployment = new lib_1.BucketDeployment(stack, 'DeployMeHere', {
    destinationBucket: bucket,
    sources: [file1, file2],
    destinationKeyPrefix: 'deploy/here/',
    retainOnDelete: false,
});
deployment.addSource(file3);
new core_1.CfnOutput(stack, 'BucketName', { value: bucket.bucketName });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnVja2V0LWRlcGxveW1lbnQtZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmJ1Y2tldC1kZXBsb3ltZW50LWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBeUM7QUFDekMsd0NBQXNEO0FBQ3RELGdDQUFrRDtBQUVsRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0FBQzVELE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztBQUUzQyxNQUFNLEtBQUssR0FBRyxZQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMvQyxNQUFNLEtBQUssR0FBRyxZQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLFFBQVEsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7QUFDNUUsTUFBTSxLQUFLLEdBQUcsWUFBTSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO0FBRTFGLE1BQU0sVUFBVSxHQUFHLElBQUksc0JBQWdCLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtJQUM3RCxpQkFBaUIsRUFBRSxNQUFNO0lBQ3pCLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7SUFDdkIsb0JBQW9CLEVBQUUsY0FBYztJQUNwQyxjQUFjLEVBQUUsS0FBSztDQUN0QixDQUFDLENBQUM7QUFDSCxVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRTVCLElBQUksZ0JBQVMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0FBRWpFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJ1Y2tldCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBBcHAsIENmbk91dHB1dCwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEJ1Y2tldERlcGxveW1lbnQsIFNvdXJjZSB9IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1Rlc3RCdWNrZXREZXBsb3ltZW50Q29udGVudCcpO1xuY29uc3QgYnVja2V0ID0gbmV3IEJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuXG5jb25zdCBmaWxlMSA9IFNvdXJjZS5kYXRhKCdmaWxlMS50eHQnLCAnYm9vbScpO1xuY29uc3QgZmlsZTIgPSBTb3VyY2UuZGF0YSgncGF0aC90by9maWxlMi50eHQnLCBgYmFtISAke2J1Y2tldC5idWNrZXROYW1lfWApO1xuY29uc3QgZmlsZTMgPSBTb3VyY2UuanNvbkRhdGEoJ215L2NvbmZpZy5qc29uJywgeyB3ZWJzaXRlX3VybDogYnVja2V0LmJ1Y2tldFdlYnNpdGVVcmwgfSk7XG5cbmNvbnN0IGRlcGxveW1lbnQgPSBuZXcgQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveU1lSGVyZScsIHtcbiAgZGVzdGluYXRpb25CdWNrZXQ6IGJ1Y2tldCxcbiAgc291cmNlczogW2ZpbGUxLCBmaWxlMl0sXG4gIGRlc3RpbmF0aW9uS2V5UHJlZml4OiAnZGVwbG95L2hlcmUvJyxcbiAgcmV0YWluT25EZWxldGU6IGZhbHNlLCAvLyBkZWZhdWx0IGlzIHRydWUsIHdoaWNoIHdpbGwgYmxvY2sgdGhlIGludGVncmF0aW9uIHRlc3QgY2xlYW51cFxufSk7XG5kZXBsb3ltZW50LmFkZFNvdXJjZShmaWxlMyk7XG5cbm5ldyBDZm5PdXRwdXQoc3RhY2ssICdCdWNrZXROYW1lJywgeyB2YWx1ZTogYnVja2V0LmJ1Y2tldE5hbWUgfSk7XG5cbmFwcC5zeW50aCgpO1xuIl19