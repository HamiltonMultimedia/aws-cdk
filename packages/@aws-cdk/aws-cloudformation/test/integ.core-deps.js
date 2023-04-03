"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Real replaceDependency use case to test
 *
 * TestStack verification steps:
 * - Deploy with `--no-clean`
 * - Verify that the CloudFormation stack LogRetention CfnResource dependencies list CustomPolicy, not DefaultPolicy
 *
 * TestNestedStack verification steps:
 * - Deploy with `--no-clean`
 * - Verify that Stack2 lists Stack1 in DependsOn
 */
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const aws_logs_1 = require("@aws-cdk/aws-logs");
const core_1 = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
class TestStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        new lambda.Function(this, 'MyLambda', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
            logRetention: aws_logs_1.RetentionDays.ONE_DAY,
        });
        const logRetentionFunction = this.node.tryFindChild('LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a');
        const serviceRole = logRetentionFunction.node.tryFindChild('ServiceRole');
        const defaultPolicy = serviceRole.node.tryFindChild('DefaultPolicy').node.defaultChild;
        const customPolicy = new iam.CfnManagedPolicy(this, 'CustomPolicy', {
            policyDocument: defaultPolicy.policyDocument,
            roles: defaultPolicy.roles,
        });
        const logRetentionResource = logRetentionFunction.node.tryFindChild('Resource');
        // Without replacing the dependency, Cfn will reject the template because it references this non-existent logical id
        logRetentionResource.replaceDependency(defaultPolicy, customPolicy);
        serviceRole.node.tryRemoveChild('DefaultPolicy');
    }
}
class TestNestedStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const stack1 = new core_1.NestedStack(this, 'Stack1');
        const stack2 = new core_1.NestedStack(this, 'Stack2');
        const resource1 = new lambda.Function(stack1, 'Lambda1', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        }).node.defaultChild;
        const resource2 = new lambda.Function(stack2, 'Lambda2', {
            code: new lambda.InlineCode('foo'),
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_14_X,
        }).node.defaultChild;
        // The following two statements should cancel each other out
        resource1.addDependency(resource2);
        resource1.removeDependency(resource2);
        resource2.addDependency(resource1);
    }
}
const app = new core_1.App();
const stack = new TestStack(app, 'replace-depends-on-test');
const nestedStack = new TestNestedStack(app, 'nested-stack-depends-test');
new integ.IntegTest(app, 'DependsOnTest', {
    testCases: [stack, nestedStack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY29yZS1kZXBzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY29yZS1kZXBzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7R0FVRztBQUNILHdDQUF3QztBQUN4Qyw4Q0FBOEM7QUFDOUMsZ0RBQWtEO0FBQ2xELHdDQUFxRTtBQUNyRSw4Q0FBOEM7QUFHOUMsTUFBTSxTQUFVLFNBQVEsWUFBSztJQUMzQixZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pCLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BDLElBQUksRUFBRSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1lBQ2xDLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsWUFBWSxFQUFFLHdCQUFhLENBQUMsT0FBTztTQUNwQyxDQUFDLENBQUM7UUFDSCxNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLDhDQUE4QyxDQUFFLENBQUM7UUFDckcsTUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQWEsQ0FBQztRQUN0RixNQUFNLGFBQWEsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUUsQ0FBQyxJQUFJLENBQUMsWUFBOEIsQ0FBQztRQUMxRyxNQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ2xFLGNBQWMsRUFBRSxhQUFhLENBQUMsY0FBYztZQUM1QyxLQUFLLEVBQUUsYUFBYSxDQUFDLEtBQUs7U0FDM0IsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBZ0IsQ0FBQztRQUMvRixvSEFBb0g7UUFDcEgsb0JBQW9CLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3BFLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ2xEO0NBQ0Y7QUFFRCxNQUFNLGVBQWdCLFNBQVEsWUFBSztJQUNqQyxZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sTUFBTSxHQUFHLElBQUksa0JBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDL0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxrQkFBVyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMvQyxNQUFNLFNBQVMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRTtZQUN2RCxJQUFJLEVBQUUsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztZQUNsQyxPQUFPLEVBQUUsZUFBZTtZQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1NBQ3BDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBNEIsQ0FBQztRQUNyQyxNQUFNLFNBQVMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRTtZQUN2RCxJQUFJLEVBQUUsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztZQUNsQyxPQUFPLEVBQUUsZUFBZTtZQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1NBQ3BDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBNEIsQ0FBQztRQUVyQyw0REFBNEQ7UUFDNUQsU0FBUyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFdEMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNwQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUseUJBQXlCLENBQUMsQ0FBQztBQUM1RCxNQUFNLFdBQVcsR0FBRyxJQUFJLGVBQWUsQ0FBQyxHQUFHLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztBQUUxRSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLGVBQWUsRUFBRTtJQUN4QyxTQUFTLEVBQUUsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDO0NBQ2hDLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBSZWFsIHJlcGxhY2VEZXBlbmRlbmN5IHVzZSBjYXNlIHRvIHRlc3RcbiAqXG4gKiBUZXN0U3RhY2sgdmVyaWZpY2F0aW9uIHN0ZXBzOlxuICogLSBEZXBsb3kgd2l0aCBgLS1uby1jbGVhbmBcbiAqIC0gVmVyaWZ5IHRoYXQgdGhlIENsb3VkRm9ybWF0aW9uIHN0YWNrIExvZ1JldGVudGlvbiBDZm5SZXNvdXJjZSBkZXBlbmRlbmNpZXMgbGlzdCBDdXN0b21Qb2xpY3ksIG5vdCBEZWZhdWx0UG9saWN5XG4gKlxuICogVGVzdE5lc3RlZFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqIC0gRGVwbG95IHdpdGggYC0tbm8tY2xlYW5gXG4gKiAtIFZlcmlmeSB0aGF0IFN0YWNrMiBsaXN0cyBTdGFjazEgaW4gRGVwZW5kc09uXG4gKi9cbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCB7IFJldGVudGlvbkRheXMgfSBmcm9tICdAYXdzLWNkay9hd3MtbG9ncyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBDZm5SZXNvdXJjZSwgTmVzdGVkU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgIG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdmb28nKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgbG9nUmV0ZW50aW9uOiBSZXRlbnRpb25EYXlzLk9ORV9EQVksXG4gICAgfSk7XG4gICAgY29uc3QgbG9nUmV0ZW50aW9uRnVuY3Rpb24gPSB0aGlzLm5vZGUudHJ5RmluZENoaWxkKCdMb2dSZXRlbnRpb25hYWUwYWEzYzViNGQ0Zjg3YjAyZDg1YjIwMWVmZGQ4YScpITtcbiAgICBjb25zdCBzZXJ2aWNlUm9sZSA9IGxvZ1JldGVudGlvbkZ1bmN0aW9uLm5vZGUudHJ5RmluZENoaWxkKCdTZXJ2aWNlUm9sZScpIGFzIGlhbS5Sb2xlO1xuICAgIGNvbnN0IGRlZmF1bHRQb2xpY3kgPSBzZXJ2aWNlUm9sZS5ub2RlLnRyeUZpbmRDaGlsZCgnRGVmYXVsdFBvbGljeScpIS5ub2RlLmRlZmF1bHRDaGlsZCEgYXMgaWFtLkNmblBvbGljeTtcbiAgICBjb25zdCBjdXN0b21Qb2xpY3kgPSBuZXcgaWFtLkNmbk1hbmFnZWRQb2xpY3kodGhpcywgJ0N1c3RvbVBvbGljeScsIHtcbiAgICAgIHBvbGljeURvY3VtZW50OiBkZWZhdWx0UG9saWN5LnBvbGljeURvY3VtZW50LFxuICAgICAgcm9sZXM6IGRlZmF1bHRQb2xpY3kucm9sZXMsXG4gICAgfSk7XG4gICAgY29uc3QgbG9nUmV0ZW50aW9uUmVzb3VyY2UgPSBsb2dSZXRlbnRpb25GdW5jdGlvbi5ub2RlLnRyeUZpbmRDaGlsZCgnUmVzb3VyY2UnKSBhcyBDZm5SZXNvdXJjZTtcbiAgICAvLyBXaXRob3V0IHJlcGxhY2luZyB0aGUgZGVwZW5kZW5jeSwgQ2ZuIHdpbGwgcmVqZWN0IHRoZSB0ZW1wbGF0ZSBiZWNhdXNlIGl0IHJlZmVyZW5jZXMgdGhpcyBub24tZXhpc3RlbnQgbG9naWNhbCBpZFxuICAgIGxvZ1JldGVudGlvblJlc291cmNlLnJlcGxhY2VEZXBlbmRlbmN5KGRlZmF1bHRQb2xpY3ksIGN1c3RvbVBvbGljeSk7XG4gICAgc2VydmljZVJvbGUubm9kZS50cnlSZW1vdmVDaGlsZCgnRGVmYXVsdFBvbGljeScpO1xuICB9XG59XG5cbmNsYXNzIFRlc3ROZXN0ZWRTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IE5lc3RlZFN0YWNrKHRoaXMsICdTdGFjazEnKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgTmVzdGVkU3RhY2sodGhpcywgJ1N0YWNrMicpO1xuICAgIGNvbnN0IHJlc291cmNlMSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2sxLCAnTGFtYmRhMScsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuSW5saW5lQ29kZSgnZm9vJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KS5ub2RlLmRlZmF1bHRDaGlsZCEgYXMgQ2ZuUmVzb3VyY2U7XG4gICAgY29uc3QgcmVzb3VyY2UyID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjazIsICdMYW1iZGEyJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdmb28nKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pLm5vZGUuZGVmYXVsdENoaWxkISBhcyBDZm5SZXNvdXJjZTtcblxuICAgIC8vIFRoZSBmb2xsb3dpbmcgdHdvIHN0YXRlbWVudHMgc2hvdWxkIGNhbmNlbCBlYWNoIG90aGVyIG91dFxuICAgIHJlc291cmNlMS5hZGREZXBlbmRlbmN5KHJlc291cmNlMik7XG4gICAgcmVzb3VyY2UxLnJlbW92ZURlcGVuZGVuY3kocmVzb3VyY2UyKTtcblxuICAgIHJlc291cmNlMi5hZGREZXBlbmRlbmN5KHJlc291cmNlMSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgVGVzdFN0YWNrKGFwcCwgJ3JlcGxhY2UtZGVwZW5kcy1vbi10ZXN0Jyk7XG5jb25zdCBuZXN0ZWRTdGFjayA9IG5ldyBUZXN0TmVzdGVkU3RhY2soYXBwLCAnbmVzdGVkLXN0YWNrLWRlcGVuZHMtdGVzdCcpO1xuXG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ0RlcGVuZHNPblRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrLCBuZXN0ZWRTdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=