"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const test_origin_1 = require("./test-origin");
const cloudfront = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-policies');
const cachePolicy = new cloudfront.CachePolicy(stack, 'CachePolicy', {
    cachePolicyName: 'ACustomCachePolicy',
});
const originRequestPolicy = new cloudfront.OriginRequestPolicy(stack, 'OriginRequestPolicy', {
    originRequestPolicyName: 'ACustomOriginRequestPolicy',
    headerBehavior: cloudfront.OriginRequestHeaderBehavior.all('CloudFront-Forwarded-Proto'),
});
const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(stack, 'ResponseHeadersPolicy', {
    responseHeadersPolicyName: 'ACustomResponseHeadersPolicy',
    corsBehavior: {
        accessControlAllowCredentials: false,
        accessControlAllowHeaders: ['X-Custom-Header-1', 'X-Custom-Header-2'],
        accessControlAllowMethods: ['GET', 'POST'],
        accessControlAllowOrigins: ['*'],
        accessControlExposeHeaders: ['X-Custom-Header-1', 'X-Custom-Header-2'],
        accessControlMaxAge: cdk.Duration.seconds(600),
        originOverride: true,
    },
    removeHeaders: ['Server'],
    serverTimingSamplingRate: 50,
});
new cloudfront.Distribution(stack, 'Dist', {
    defaultBehavior: {
        origin: new test_origin_1.TestOrigin('www.example.com'),
        cachePolicy,
        originRequestPolicy,
        responseHeadersPolicy,
    },
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZGlzdHJpYnV0aW9uLXBvbGljaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZGlzdHJpYnV0aW9uLXBvbGljaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXFDO0FBQ3JDLCtDQUEyQztBQUMzQyxxQ0FBcUM7QUFFckMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0FBRWhFLE1BQU0sV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO0lBQ25FLGVBQWUsRUFBRSxvQkFBb0I7Q0FDdEMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUscUJBQXFCLEVBQUU7SUFDM0YsdUJBQXVCLEVBQUUsNEJBQTRCO0lBQ3JELGNBQWMsRUFBRSxVQUFVLENBQUMsMkJBQTJCLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDO0NBQ3pGLENBQUMsQ0FBQztBQUVILE1BQU0scUJBQXFCLEdBQUcsSUFBSSxVQUFVLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLHVCQUF1QixFQUFFO0lBQ2pHLHlCQUF5QixFQUFFLDhCQUE4QjtJQUN6RCxZQUFZLEVBQUU7UUFDWiw2QkFBNkIsRUFBRSxLQUFLO1FBQ3BDLHlCQUF5QixFQUFFLENBQUMsbUJBQW1CLEVBQUUsbUJBQW1CLENBQUM7UUFDckUseUJBQXlCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDO1FBQzFDLHlCQUF5QixFQUFFLENBQUMsR0FBRyxDQUFDO1FBQ2hDLDBCQUEwQixFQUFFLENBQUMsbUJBQW1CLEVBQUUsbUJBQW1CLENBQUM7UUFDdEUsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQzlDLGNBQWMsRUFBRSxJQUFJO0tBQ3JCO0lBQ0QsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDO0lBQ3pCLHdCQUF3QixFQUFFLEVBQUU7Q0FDN0IsQ0FBQyxDQUFDO0FBRUgsSUFBSSxVQUFVLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7SUFDekMsZUFBZSxFQUFFO1FBQ2YsTUFBTSxFQUFFLElBQUksd0JBQVUsQ0FBQyxpQkFBaUIsQ0FBQztRQUN6QyxXQUFXO1FBQ1gsbUJBQW1CO1FBQ25CLHFCQUFxQjtLQUN0QjtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFRlc3RPcmlnaW4gfSBmcm9tICcuL3Rlc3Qtb3JpZ2luJztcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdpbnRlZy1kaXN0cmlidXRpb24tcG9saWNpZXMnKTtcblxuY29uc3QgY2FjaGVQb2xpY3kgPSBuZXcgY2xvdWRmcm9udC5DYWNoZVBvbGljeShzdGFjaywgJ0NhY2hlUG9saWN5Jywge1xuICBjYWNoZVBvbGljeU5hbWU6ICdBQ3VzdG9tQ2FjaGVQb2xpY3knLFxufSk7XG5cbmNvbnN0IG9yaWdpblJlcXVlc3RQb2xpY3kgPSBuZXcgY2xvdWRmcm9udC5PcmlnaW5SZXF1ZXN0UG9saWN5KHN0YWNrLCAnT3JpZ2luUmVxdWVzdFBvbGljeScsIHtcbiAgb3JpZ2luUmVxdWVzdFBvbGljeU5hbWU6ICdBQ3VzdG9tT3JpZ2luUmVxdWVzdFBvbGljeScsXG4gIGhlYWRlckJlaGF2aW9yOiBjbG91ZGZyb250Lk9yaWdpblJlcXVlc3RIZWFkZXJCZWhhdmlvci5hbGwoJ0Nsb3VkRnJvbnQtRm9yd2FyZGVkLVByb3RvJyksXG59KTtcblxuY29uc3QgcmVzcG9uc2VIZWFkZXJzUG9saWN5ID0gbmV3IGNsb3VkZnJvbnQuUmVzcG9uc2VIZWFkZXJzUG9saWN5KHN0YWNrLCAnUmVzcG9uc2VIZWFkZXJzUG9saWN5Jywge1xuICByZXNwb25zZUhlYWRlcnNQb2xpY3lOYW1lOiAnQUN1c3RvbVJlc3BvbnNlSGVhZGVyc1BvbGljeScsXG4gIGNvcnNCZWhhdmlvcjoge1xuICAgIGFjY2Vzc0NvbnRyb2xBbGxvd0NyZWRlbnRpYWxzOiBmYWxzZSxcbiAgICBhY2Nlc3NDb250cm9sQWxsb3dIZWFkZXJzOiBbJ1gtQ3VzdG9tLUhlYWRlci0xJywgJ1gtQ3VzdG9tLUhlYWRlci0yJ10sXG4gICAgYWNjZXNzQ29udHJvbEFsbG93TWV0aG9kczogWydHRVQnLCAnUE9TVCddLFxuICAgIGFjY2Vzc0NvbnRyb2xBbGxvd09yaWdpbnM6IFsnKiddLFxuICAgIGFjY2Vzc0NvbnRyb2xFeHBvc2VIZWFkZXJzOiBbJ1gtQ3VzdG9tLUhlYWRlci0xJywgJ1gtQ3VzdG9tLUhlYWRlci0yJ10sXG4gICAgYWNjZXNzQ29udHJvbE1heEFnZTogY2RrLkR1cmF0aW9uLnNlY29uZHMoNjAwKSxcbiAgICBvcmlnaW5PdmVycmlkZTogdHJ1ZSxcbiAgfSxcbiAgcmVtb3ZlSGVhZGVyczogWydTZXJ2ZXInXSxcbiAgc2VydmVyVGltaW5nU2FtcGxpbmdSYXRlOiA1MCxcbn0pO1xuXG5uZXcgY2xvdWRmcm9udC5EaXN0cmlidXRpb24oc3RhY2ssICdEaXN0Jywge1xuICBkZWZhdWx0QmVoYXZpb3I6IHtcbiAgICBvcmlnaW46IG5ldyBUZXN0T3JpZ2luKCd3d3cuZXhhbXBsZS5jb20nKSxcbiAgICBjYWNoZVBvbGljeSxcbiAgICBvcmlnaW5SZXF1ZXN0UG9saWN5LFxuICAgIHJlc3BvbnNlSGVhZGVyc1BvbGljeSxcbiAgfSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==