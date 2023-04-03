"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-ipam-vpc');
/**
 * ### MANUAL CLEAN UP REQUIRED ###
 *
 * When IPAM is created running this integ-test it is not currently removed after the test run is complete.
 *
 */
const ipam = new lib_1.CfnIPAM(stack, 'IPAM', {
    operatingRegions: [
        { regionName: stack.region },
    ],
    tags: [{
            key: 'stack',
            value: stack.stackId,
        }],
});
ipam.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
const pool = new lib_1.CfnIPAMPool(stack, 'Pool', {
    description: 'Testing pool',
    addressFamily: 'ipv4',
    autoImport: false,
    locale: stack.region,
    ipamScopeId: ipam.attrPrivateDefaultScopeId,
    provisionedCidrs: [{
            cidr: '100.100.0.0/16',
        }],
});
pool.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
const awsIpamVpc = new lib_1.Vpc(stack, 'AwsIpamVpc', {
    ipAddresses: lib_1.IpAddresses.awsIpamAllocation({
        ipv4IpamPoolId: pool.ref,
        ipv4NetmaskLength: 18,
        defaultSubnetIpv4NetmaskLength: 24,
    }),
    maxAzs: 2,
    subnetConfiguration: [{
            name: 'private',
            subnetType: lib_1.SubnetType.PRIVATE_ISOLATED,
            cidrMask: 24,
        }],
});
// needs AwsApiCall Support for installLatestAwsSdk first, or another way to clean the Ipam
// new AwsApiCall(stack, 'cleanUpIpam', {
//   service: 'EC2',
//   api: 'deleteIpam',
//   installLatestAwsSdk: true,
//   parameters: {
//     IpamId: ipam.attrIpamId,
//     Cascade: true,
//   },
// });
/**
 * Testing That the Vpc is Deployed with the correct Cidrs.
**/
const integ = new integ_tests_1.IntegTest(app, 'Vpc-Ipam', {
    testCases: [stack],
    allowDestroy: ['EC2::IPAM'],
});
integ.assertions.awsApiCall('EC2', 'describeVpcs', {
    VpcIds: [awsIpamVpc.node.defaultChild.getAtt('VpcId').toString()],
}).expect(integ_tests_1.ExpectedResult.objectLike({
    Vpcs: [
        {
            CidrBlock: '100.100.0.0/18',
        },
    ],
}));
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudnBjLWlwYW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy52cGMtaXBhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxQztBQUNyQyxzREFBaUU7QUFDakUsZ0NBQW9GO0FBRXBGLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztBQUV6RDs7Ozs7R0FLRztBQUVILE1BQU0sSUFBSSxHQUFHLElBQUksYUFBTyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7SUFDdEMsZ0JBQWdCLEVBQUU7UUFDaEIsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtLQUM3QjtJQUNELElBQUksRUFBRSxDQUFDO1lBQ0wsR0FBRyxFQUFFLE9BQU87WUFDWixLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU87U0FDckIsQ0FBQztDQUNILENBQUMsQ0FBQztBQUNILElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRWxELE1BQU0sSUFBSSxHQUFHLElBQUksaUJBQVcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO0lBQzFDLFdBQVcsRUFBRSxjQUFjO0lBQzNCLGFBQWEsRUFBRSxNQUFNO0lBQ3JCLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtJQUNwQixXQUFXLEVBQUUsSUFBSSxDQUFDLHlCQUF5QjtJQUMzQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ2pCLElBQUksRUFBRSxnQkFBZ0I7U0FDdkIsQ0FBQztDQUNILENBQUMsQ0FBQztBQUNILElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRWxELE1BQU0sVUFBVSxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7SUFDOUMsV0FBVyxFQUFFLGlCQUFXLENBQUMsaUJBQWlCLENBQUM7UUFDekMsY0FBYyxFQUFFLElBQUksQ0FBQyxHQUFHO1FBQ3hCLGlCQUFpQixFQUFFLEVBQUU7UUFDckIsOEJBQThCLEVBQUUsRUFBRTtLQUNuQyxDQUFDO0lBQ0YsTUFBTSxFQUFFLENBQUM7SUFDVCxtQkFBbUIsRUFBRSxDQUFDO1lBQ3BCLElBQUksRUFBRSxTQUFTO1lBQ2YsVUFBVSxFQUFFLGdCQUFVLENBQUMsZ0JBQWdCO1lBQ3ZDLFFBQVEsRUFBRSxFQUFFO1NBQ2IsQ0FBQztDQUNILENBQUMsQ0FBQztBQUVILDJGQUEyRjtBQUMzRix5Q0FBeUM7QUFDekMsb0JBQW9CO0FBQ3BCLHVCQUF1QjtBQUN2QiwrQkFBK0I7QUFDL0Isa0JBQWtCO0FBQ2xCLCtCQUErQjtBQUMvQixxQkFBcUI7QUFDckIsT0FBTztBQUNQLE1BQU07QUFFTjs7R0FFRztBQUNILE1BQU0sS0FBSyxHQUFHLElBQUksdUJBQVMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFO0lBQzNDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNsQixZQUFZLEVBQUUsQ0FBQyxXQUFXLENBQUM7Q0FDNUIsQ0FBQyxDQUFDO0FBRUgsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtJQUNqRCxNQUFNLEVBQUUsQ0FBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQXVCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0NBQzlFLENBQUMsQ0FBQyxNQUFNLENBQUMsNEJBQWMsQ0FBQyxVQUFVLENBQUM7SUFDbEMsSUFBSSxFQUFFO1FBQ0o7WUFDRSxTQUFTLEVBQUUsZ0JBQWdCO1NBQzVCO0tBQ0Y7Q0FDRixDQUFDLENBQUMsQ0FBQztBQUVKLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEV4cGVjdGVkUmVzdWx0LCBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgeyBJcEFkZHJlc3NlcywgQ2ZuSVBBTSwgQ2ZuSVBBTVBvb2wsIENmblZQQywgU3VibmV0VHlwZSwgVnBjIH0gZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWVjMi1pcGFtLXZwYycpO1xuXG4vKipcbiAqICMjIyBNQU5VQUwgQ0xFQU4gVVAgUkVRVUlSRUQgIyMjXG4gKlxuICogV2hlbiBJUEFNIGlzIGNyZWF0ZWQgcnVubmluZyB0aGlzIGludGVnLXRlc3QgaXQgaXMgbm90IGN1cnJlbnRseSByZW1vdmVkIGFmdGVyIHRoZSB0ZXN0IHJ1biBpcyBjb21wbGV0ZS5cbiAqXG4gKi9cblxuY29uc3QgaXBhbSA9IG5ldyBDZm5JUEFNKHN0YWNrLCAnSVBBTScsIHtcbiAgb3BlcmF0aW5nUmVnaW9uczogW1xuICAgIHsgcmVnaW9uTmFtZTogc3RhY2sucmVnaW9uIH0sXG4gIF0sXG4gIHRhZ3M6IFt7XG4gICAga2V5OiAnc3RhY2snLFxuICAgIHZhbHVlOiBzdGFjay5zdGFja0lkLFxuICB9XSxcbn0pO1xuaXBhbS5hcHBseVJlbW92YWxQb2xpY3koY2RrLlJlbW92YWxQb2xpY3kuUkVUQUlOKTtcblxuY29uc3QgcG9vbCA9IG5ldyBDZm5JUEFNUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gIGRlc2NyaXB0aW9uOiAnVGVzdGluZyBwb29sJyxcbiAgYWRkcmVzc0ZhbWlseTogJ2lwdjQnLFxuICBhdXRvSW1wb3J0OiBmYWxzZSxcbiAgbG9jYWxlOiBzdGFjay5yZWdpb24sXG4gIGlwYW1TY29wZUlkOiBpcGFtLmF0dHJQcml2YXRlRGVmYXVsdFNjb3BlSWQsXG4gIHByb3Zpc2lvbmVkQ2lkcnM6IFt7XG4gICAgY2lkcjogJzEwMC4xMDAuMC4wLzE2JyxcbiAgfV0sXG59KTtcbnBvb2wuYXBwbHlSZW1vdmFsUG9saWN5KGNkay5SZW1vdmFsUG9saWN5LlJFVEFJTik7XG5cbmNvbnN0IGF3c0lwYW1WcGMgPSBuZXcgVnBjKHN0YWNrLCAnQXdzSXBhbVZwYycsIHtcbiAgaXBBZGRyZXNzZXM6IElwQWRkcmVzc2VzLmF3c0lwYW1BbGxvY2F0aW9uKHtcbiAgICBpcHY0SXBhbVBvb2xJZDogcG9vbC5yZWYsXG4gICAgaXB2NE5ldG1hc2tMZW5ndGg6IDE4LFxuICAgIGRlZmF1bHRTdWJuZXRJcHY0TmV0bWFza0xlbmd0aDogMjQsXG4gIH0pLFxuICBtYXhBenM6IDIsXG4gIHN1Ym5ldENvbmZpZ3VyYXRpb246IFt7XG4gICAgbmFtZTogJ3ByaXZhdGUnLFxuICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCxcbiAgICBjaWRyTWFzazogMjQsXG4gIH1dLFxufSk7XG5cbi8vIG5lZWRzIEF3c0FwaUNhbGwgU3VwcG9ydCBmb3IgaW5zdGFsbExhdGVzdEF3c1NkayBmaXJzdCwgb3IgYW5vdGhlciB3YXkgdG8gY2xlYW4gdGhlIElwYW1cbi8vIG5ldyBBd3NBcGlDYWxsKHN0YWNrLCAnY2xlYW5VcElwYW0nLCB7XG4vLyAgIHNlcnZpY2U6ICdFQzInLFxuLy8gICBhcGk6ICdkZWxldGVJcGFtJyxcbi8vICAgaW5zdGFsbExhdGVzdEF3c1NkazogdHJ1ZSxcbi8vICAgcGFyYW1ldGVyczoge1xuLy8gICAgIElwYW1JZDogaXBhbS5hdHRySXBhbUlkLFxuLy8gICAgIENhc2NhZGU6IHRydWUsXG4vLyAgIH0sXG4vLyB9KTtcblxuLyoqXG4gKiBUZXN0aW5nIFRoYXQgdGhlIFZwYyBpcyBEZXBsb3llZCB3aXRoIHRoZSBjb3JyZWN0IENpZHJzLlxuKiovXG5jb25zdCBpbnRlZyA9IG5ldyBJbnRlZ1Rlc3QoYXBwLCAnVnBjLUlwYW0nLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbiAgYWxsb3dEZXN0cm95OiBbJ0VDMjo6SVBBTSddLFxufSk7XG5cbmludGVnLmFzc2VydGlvbnMuYXdzQXBpQ2FsbCgnRUMyJywgJ2Rlc2NyaWJlVnBjcycsIHtcbiAgVnBjSWRzOiBbKGF3c0lwYW1WcGMubm9kZS5kZWZhdWx0Q2hpbGQgYXMgQ2ZuVlBDKS5nZXRBdHQoJ1ZwY0lkJykudG9TdHJpbmcoKV0sXG59KS5leHBlY3QoRXhwZWN0ZWRSZXN1bHQub2JqZWN0TGlrZSh7XG4gIFZwY3M6IFtcbiAgICB7XG4gICAgICBDaWRyQmxvY2s6ICcxMDAuMTAwLjAuMC8xOCcsXG4gICAgfSxcbiAgXSxcbn0pKTtcblxuYXBwLnN5bnRoKCk7XG5cblxuIl19