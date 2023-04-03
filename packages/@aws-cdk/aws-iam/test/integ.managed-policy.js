"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
const app = new core_1.App();
const stack = new core_1.Stack(app, 'aws-cdk-iam-managed-policy');
const user = new lib_1.User(stack, 'MyUser');
const policy = new lib_1.ManagedPolicy(stack, 'OneManagedPolicy', {
    managedPolicyName: 'Default',
    description: 'My Policy',
    path: '/some/path/',
});
policy.addStatements(new lib_1.PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));
policy.attachToUser(user);
const policy2 = new lib_1.ManagedPolicy(stack, 'TwoManagedPolicy');
policy2.addStatements(new lib_1.PolicyStatement({ resources: ['*'], actions: ['lambda:InvokeFunction'] }));
user.addManagedPolicy(policy2);
const policy3 = lib_1.ManagedPolicy.fromAwsManagedPolicyName('SecurityAudit');
user.addManagedPolicy(policy3);
const role = new lib_1.Role(stack, 'Role', { assumedBy: new lib_1.AccountRootPrincipal() });
role.grantAssumeRole(policy.grantPrincipal);
lib_1.Grant.addToPrincipal({ actions: ['iam:*'], resourceArns: [role.roleArn], grantee: policy2 });
new integ_tests_1.IntegTest(app, 'ManagedPolicyInteg', {
    testCases: [stack],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubWFuYWdlZC1wb2xpY3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5tYW5hZ2VkLXBvbGljeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUEyQztBQUMzQyxzREFBaUQ7QUFDakQsZ0NBQWlHO0FBRWpHLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFFdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLDRCQUE0QixDQUFDLENBQUM7QUFFM0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxVQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBRXZDLE1BQU0sTUFBTSxHQUFHLElBQUksbUJBQWEsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUU7SUFDMUQsaUJBQWlCLEVBQUUsU0FBUztJQUM1QixXQUFXLEVBQUUsV0FBVztJQUN4QixJQUFJLEVBQUUsYUFBYTtDQUNwQixDQUFDLENBQUM7QUFDSCxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUkscUJBQWUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUYsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUUxQixNQUFNLE9BQU8sR0FBRyxJQUFJLG1CQUFhLENBQUMsS0FBSyxFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDN0QsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLHFCQUFlLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3JHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUUvQixNQUFNLE9BQU8sR0FBRyxtQkFBYSxDQUFDLHdCQUF3QixDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3hFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUUvQixNQUFNLElBQUksR0FBRyxJQUFJLFVBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksMEJBQW9CLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDaEYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDNUMsV0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUU3RixJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLG9CQUFvQixFQUFFO0lBQ3ZDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgeyBBY2NvdW50Um9vdFByaW5jaXBhbCwgR3JhbnQsIE1hbmFnZWRQb2xpY3ksIFBvbGljeVN0YXRlbWVudCwgUm9sZSwgVXNlciB9IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnYXdzLWNkay1pYW0tbWFuYWdlZC1wb2xpY3knKTtcblxuY29uc3QgdXNlciA9IG5ldyBVc2VyKHN0YWNrLCAnTXlVc2VyJyk7XG5cbmNvbnN0IHBvbGljeSA9IG5ldyBNYW5hZ2VkUG9saWN5KHN0YWNrLCAnT25lTWFuYWdlZFBvbGljeScsIHtcbiAgbWFuYWdlZFBvbGljeU5hbWU6ICdEZWZhdWx0JyxcbiAgZGVzY3JpcHRpb246ICdNeSBQb2xpY3knLFxuICBwYXRoOiAnL3NvbWUvcGF0aC8nLFxufSk7XG5wb2xpY3kuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHsgcmVzb3VyY2VzOiBbJyonXSwgYWN0aW9uczogWydzcXM6U2VuZE1lc3NhZ2UnXSB9KSk7XG5wb2xpY3kuYXR0YWNoVG9Vc2VyKHVzZXIpO1xuXG5jb25zdCBwb2xpY3kyID0gbmV3IE1hbmFnZWRQb2xpY3koc3RhY2ssICdUd29NYW5hZ2VkUG9saWN5Jyk7XG5wb2xpY3kyLmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7IHJlc291cmNlczogWycqJ10sIGFjdGlvbnM6IFsnbGFtYmRhOkludm9rZUZ1bmN0aW9uJ10gfSkpO1xudXNlci5hZGRNYW5hZ2VkUG9saWN5KHBvbGljeTIpO1xuXG5jb25zdCBwb2xpY3kzID0gTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ1NlY3VyaXR5QXVkaXQnKTtcbnVzZXIuYWRkTWFuYWdlZFBvbGljeShwb2xpY3kzKTtcblxuY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgQWNjb3VudFJvb3RQcmluY2lwYWwoKSB9KTtcbnJvbGUuZ3JhbnRBc3N1bWVSb2xlKHBvbGljeS5ncmFudFByaW5jaXBhbCk7XG5HcmFudC5hZGRUb1ByaW5jaXBhbCh7IGFjdGlvbnM6IFsnaWFtOionXSwgcmVzb3VyY2VBcm5zOiBbcm9sZS5yb2xlQXJuXSwgZ3JhbnRlZTogcG9saWN5MiB9KTtcblxubmV3IEludGVnVGVzdChhcHAsICdNYW5hZ2VkUG9saWN5SW50ZWcnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuIl19