"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const codedeploy = require("../../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codedeploy-ecs-config');
new codedeploy.EcsDeploymentConfig(stack, 'LinearConfig', {
    trafficRouting: codedeploy.TrafficRouting.timeBasedLinear({
        interval: cdk.Duration.minutes(1),
        percentage: 5,
    }),
});
new integ.IntegTest(app, 'EcsDeploymentConfigTest', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZGVwbG95bWVudC1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5kZXBsb3ltZW50LWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxQztBQUNyQyw4Q0FBOEM7QUFDOUMsd0NBQXdDO0FBRXhDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsK0JBQStCLENBQUMsQ0FBQztBQUVsRSxJQUFJLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFO0lBQ3hELGNBQWMsRUFBRSxVQUFVLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQztRQUN4RCxRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLFVBQVUsRUFBRSxDQUFDO0tBQ2QsQ0FBQztDQUNILENBQUMsQ0FBQztBQUVILElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUseUJBQXlCLEVBQUU7SUFDbEQsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCAqIGFzIGNvZGVkZXBsb3kgZnJvbSAnLi4vLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWNvZGVkZXBsb3ktZWNzLWNvbmZpZycpO1xuXG5uZXcgY29kZWRlcGxveS5FY3NEZXBsb3ltZW50Q29uZmlnKHN0YWNrLCAnTGluZWFyQ29uZmlnJywge1xuICB0cmFmZmljUm91dGluZzogY29kZWRlcGxveS5UcmFmZmljUm91dGluZy50aW1lQmFzZWRMaW5lYXIoe1xuICAgIGludGVydmFsOiBjZGsuRHVyYXRpb24ubWludXRlcygxKSxcbiAgICBwZXJjZW50YWdlOiA1LFxuICB9KSxcbn0pO1xuXG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ0Vjc0RlcGxveW1lbnRDb25maWdUZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=