"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const test_origin_1 = require("./test-origin");
const cloudfront = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-origin-id');
const origin = new test_origin_1.TestOrigin('www.example.com', { originId: 'my-custom-origin-id' });
const distribution = new cloudfront.Distribution(stack, 'TestDistribution', {
    defaultBehavior: { origin },
});
distribution.addBehavior('/second', origin);
distribution.addBehavior('/third', origin);
new integ_tests_1.IntegTest(app, 'DistributionOriginId', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZGlzdHJpYnV0aW9uLW9yaWdpbi1pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmRpc3RyaWJ1dGlvbi1vcmlnaW4taWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBcUM7QUFDckMsc0RBQWlEO0FBQ2pELCtDQUEyQztBQUMzQyxxQ0FBcUM7QUFFckMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0FBRWpFLE1BQU0sTUFBTSxHQUFHLElBQUksd0JBQVUsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLFFBQVEsRUFBRSxxQkFBcUIsRUFBRSxDQUFDLENBQUM7QUFFdEYsTUFBTSxZQUFZLEdBQUcsSUFBSSxVQUFVLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtJQUMxRSxlQUFlLEVBQUUsRUFBRSxNQUFNLEVBQUU7Q0FDNUIsQ0FBQyxDQUFDO0FBQ0gsWUFBWSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDNUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFFM0MsSUFBSSx1QkFBUyxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsRUFBRTtJQUN6QyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0IHsgVGVzdE9yaWdpbiB9IGZyb20gJy4vdGVzdC1vcmlnaW4nO1xuaW1wb3J0ICogYXMgY2xvdWRmcm9udCBmcm9tICcuLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2ludGVnLWRpc3RyaWJ1dGlvbi1vcmlnaW4taWQnKTtcblxuY29uc3Qgb3JpZ2luID0gbmV3IFRlc3RPcmlnaW4oJ3d3dy5leGFtcGxlLmNvbScsIHsgb3JpZ2luSWQ6ICdteS1jdXN0b20tb3JpZ2luLWlkJyB9KTtcblxuY29uc3QgZGlzdHJpYnV0aW9uID0gbmV3IGNsb3VkZnJvbnQuRGlzdHJpYnV0aW9uKHN0YWNrLCAnVGVzdERpc3RyaWJ1dGlvbicsIHtcbiAgZGVmYXVsdEJlaGF2aW9yOiB7IG9yaWdpbiB9LFxufSk7XG5kaXN0cmlidXRpb24uYWRkQmVoYXZpb3IoJy9zZWNvbmQnLCBvcmlnaW4pO1xuZGlzdHJpYnV0aW9uLmFkZEJlaGF2aW9yKCcvdGhpcmQnLCBvcmlnaW4pO1xuXG5uZXcgSW50ZWdUZXN0KGFwcCwgJ0Rpc3RyaWJ1dGlvbk9yaWdpbklkJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=