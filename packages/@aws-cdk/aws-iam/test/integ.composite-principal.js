"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const iam = require("../lib");
class TestStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        new iam.Role(this, 'RoleWithCompositePrincipal', {
            assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal('ec2.amazonaws.com'), new iam.AnyPrincipal()),
        });
    }
}
const app = new cdk.App();
new integ_tests_1.IntegTest(app, 'iam-integ-composite-principal-test', {
    testCases: [new TestStack(app, 'iam-integ-composite-principal')],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY29tcG9zaXRlLXByaW5jaXBhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmNvbXBvc2l0ZS1wcmluY2lwYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBcUM7QUFDckMsc0RBQWlEO0FBQ2pELDhCQUE4QjtBQUU5QixNQUFNLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQixZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSw0QkFBNEIsRUFBRTtZQUMvQyxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQ25DLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLEVBQzdDLElBQUksR0FBRyxDQUFDLFlBQVksRUFBRSxDQUN2QjtTQUNGLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLG9DQUFvQyxFQUFFO0lBQ3ZELFNBQVMsRUFBRSxDQUFDLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO0NBQ2pFLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBuZXcgaWFtLlJvbGUodGhpcywgJ1JvbGVXaXRoQ29tcG9zaXRlUHJpbmNpcGFsJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkNvbXBvc2l0ZVByaW5jaXBhbChcbiAgICAgICAgbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlYzIuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICBuZXcgaWFtLkFueVByaW5jaXBhbCgpLFxuICAgICAgKSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5uZXcgSW50ZWdUZXN0KGFwcCwgJ2lhbS1pbnRlZy1jb21wb3NpdGUtcHJpbmNpcGFsLXRlc3QnLCB7XG4gIHRlc3RDYXNlczogW25ldyBUZXN0U3RhY2soYXBwLCAnaWFtLWludGVnLWNvbXBvc2l0ZS1wcmluY2lwYWwnKV0sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=