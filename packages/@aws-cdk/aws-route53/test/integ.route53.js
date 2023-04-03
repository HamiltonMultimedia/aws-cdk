"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-route53-integ');
const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 1 });
const privateZone = new lib_1.PrivateHostedZone(stack, 'PrivateZone', {
    zoneName: 'cdk.local', vpc,
});
const publicZone = new lib_1.PublicHostedZone(stack, 'PublicZone', {
    zoneName: 'cdk.test',
});
const publicSubZone = new lib_1.PublicHostedZone(stack, 'PublicSubZone', {
    zoneName: 'sub.cdk.test',
});
publicZone.addDelegation(publicSubZone);
new lib_1.TxtRecord(privateZone, 'TXT', {
    zone: privateZone,
    recordName: '_foo',
    values: [
        'Bar!',
        'Baz?',
    ],
    ttl: cdk.Duration.minutes(1),
});
new lib_1.CnameRecord(stack, 'CNAME', {
    zone: privateZone,
    recordName: 'www',
    domainName: 'server',
});
new lib_1.ARecord(stack, 'A', {
    zone: privateZone,
    recordName: 'test',
    target: lib_1.RecordTarget.fromIpAddresses('1.2.3.4', '5.6.7.8'),
});
new lib_1.CaaAmazonRecord(stack, 'CaaAmazon', {
    zone: publicZone,
});
new lib_1.TxtRecord(stack, 'TXT', {
    zone: publicZone,
    values: [
        'this is a very long string'.repeat(10),
    ],
});
new cdk.CfnOutput(stack, 'PrivateZoneId', { value: privateZone.hostedZoneId });
new cdk.CfnOutput(stack, 'PublicZoneId', { value: publicZone.hostedZoneId });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucm91dGU1My5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnJvdXRlNTMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLGdDQUE2SDtBQUU3SCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHVCQUF1QixDQUFDLENBQUM7QUFFMUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUVyRCxNQUFNLFdBQVcsR0FBRyxJQUFJLHVCQUFpQixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7SUFDOUQsUUFBUSxFQUFFLFdBQVcsRUFBRSxHQUFHO0NBQzNCLENBQUMsQ0FBQztBQUVILE1BQU0sVUFBVSxHQUFHLElBQUksc0JBQWdCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtJQUMzRCxRQUFRLEVBQUUsVUFBVTtDQUNyQixDQUFDLENBQUM7QUFDSCxNQUFNLGFBQWEsR0FBRyxJQUFJLHNCQUFnQixDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUU7SUFDakUsUUFBUSxFQUFFLGNBQWM7Q0FDekIsQ0FBQyxDQUFDO0FBQ0gsVUFBVSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUV4QyxJQUFJLGVBQVMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFO0lBQ2hDLElBQUksRUFBRSxXQUFXO0lBQ2pCLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE1BQU0sRUFBRTtRQUNOLE1BQU07UUFDTixNQUFNO0tBQ1A7SUFDRCxHQUFHLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0NBQzdCLENBQUMsQ0FBQztBQUVILElBQUksaUJBQVcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO0lBQzlCLElBQUksRUFBRSxXQUFXO0lBQ2pCLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFVBQVUsRUFBRSxRQUFRO0NBQ3JCLENBQUMsQ0FBQztBQUVILElBQUksYUFBTyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7SUFDdEIsSUFBSSxFQUFFLFdBQVc7SUFDakIsVUFBVSxFQUFFLE1BQU07SUFDbEIsTUFBTSxFQUFFLGtCQUFZLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUM7Q0FDM0QsQ0FBQyxDQUFDO0FBRUgsSUFBSSxxQkFBZSxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7SUFDdEMsSUFBSSxFQUFFLFVBQVU7Q0FDakIsQ0FBQyxDQUFDO0FBRUgsSUFBSSxlQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUMxQixJQUFJLEVBQUUsVUFBVTtJQUNoQixNQUFNLEVBQUU7UUFDTiw0QkFBNEIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO0tBQ3hDO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7QUFDL0UsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7QUFFN0UsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQVJlY29yZCwgQ2FhQW1hem9uUmVjb3JkLCBDbmFtZVJlY29yZCwgUHJpdmF0ZUhvc3RlZFpvbmUsIFB1YmxpY0hvc3RlZFpvbmUsIFJlY29yZFRhcmdldCwgVHh0UmVjb3JkIH0gZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstcm91dGU1My1pbnRlZycpO1xuXG5jb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycsIHsgbWF4QXpzOiAxIH0pO1xuXG5jb25zdCBwcml2YXRlWm9uZSA9IG5ldyBQcml2YXRlSG9zdGVkWm9uZShzdGFjaywgJ1ByaXZhdGVab25lJywge1xuICB6b25lTmFtZTogJ2Nkay5sb2NhbCcsIHZwYyxcbn0pO1xuXG5jb25zdCBwdWJsaWNab25lID0gbmV3IFB1YmxpY0hvc3RlZFpvbmUoc3RhY2ssICdQdWJsaWNab25lJywge1xuICB6b25lTmFtZTogJ2Nkay50ZXN0Jyxcbn0pO1xuY29uc3QgcHVibGljU3ViWm9uZSA9IG5ldyBQdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnUHVibGljU3ViWm9uZScsIHtcbiAgem9uZU5hbWU6ICdzdWIuY2RrLnRlc3QnLFxufSk7XG5wdWJsaWNab25lLmFkZERlbGVnYXRpb24ocHVibGljU3ViWm9uZSk7XG5cbm5ldyBUeHRSZWNvcmQocHJpdmF0ZVpvbmUsICdUWFQnLCB7XG4gIHpvbmU6IHByaXZhdGVab25lLFxuICByZWNvcmROYW1lOiAnX2ZvbycsXG4gIHZhbHVlczogW1xuICAgICdCYXIhJyxcbiAgICAnQmF6PycsXG4gIF0sXG4gIHR0bDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMSksXG59KTtcblxubmV3IENuYW1lUmVjb3JkKHN0YWNrLCAnQ05BTUUnLCB7XG4gIHpvbmU6IHByaXZhdGVab25lLFxuICByZWNvcmROYW1lOiAnd3d3JyxcbiAgZG9tYWluTmFtZTogJ3NlcnZlcicsXG59KTtcblxubmV3IEFSZWNvcmQoc3RhY2ssICdBJywge1xuICB6b25lOiBwcml2YXRlWm9uZSxcbiAgcmVjb3JkTmFtZTogJ3Rlc3QnLFxuICB0YXJnZXQ6IFJlY29yZFRhcmdldC5mcm9tSXBBZGRyZXNzZXMoJzEuMi4zLjQnLCAnNS42LjcuOCcpLFxufSk7XG5cbm5ldyBDYWFBbWF6b25SZWNvcmQoc3RhY2ssICdDYWFBbWF6b24nLCB7XG4gIHpvbmU6IHB1YmxpY1pvbmUsXG59KTtcblxubmV3IFR4dFJlY29yZChzdGFjaywgJ1RYVCcsIHtcbiAgem9uZTogcHVibGljWm9uZSxcbiAgdmFsdWVzOiBbXG4gICAgJ3RoaXMgaXMgYSB2ZXJ5IGxvbmcgc3RyaW5nJy5yZXBlYXQoMTApLFxuICBdLFxufSk7XG5cbm5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnUHJpdmF0ZVpvbmVJZCcsIHsgdmFsdWU6IHByaXZhdGVab25lLmhvc3RlZFpvbmVJZCB9KTtcbm5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnUHVibGljWm9uZUlkJywgeyB2YWx1ZTogcHVibGljWm9uZS5ob3N0ZWRab25lSWQgfSk7XG5cbmFwcC5zeW50aCgpO1xuIl19