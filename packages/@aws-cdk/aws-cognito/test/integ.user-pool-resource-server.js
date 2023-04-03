"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
const app = new core_1.App();
const stack = new core_1.Stack(app, 'integ-user-pool-resource-server');
/*
 * Stack verification steps:
 * Cognito will only allow you to add a custom scope on a user pool client that is defined by a resource server.
 * Checking the app client scopes will verify if the resource server is configured correctly.
 * The exports userPoolId and userPoolClientId are exported here to test
 *
 * * `aws cognito-idp describe-user-pool-client --user-pool-id $userPoolId --client-id $userPoolClientId` should return "users/read" in "AllowedOAuthScopes"
 */
const userPool = new lib_1.UserPool(stack, 'myuserpool', {
    userPoolName: 'MyUserPool',
    removalPolicy: core_1.RemovalPolicy.DESTROY,
});
const readScope = new lib_1.ResourceServerScope({ scopeName: 'read', scopeDescription: 'read only' });
const userServer = userPool.addResourceServer('myserver', {
    identifier: 'users',
    scopes: [readScope],
});
const client = userPool.addClient('client', {
    userPoolClientName: 'users-app',
    generateSecret: true,
    oAuth: {
        flows: {
            clientCredentials: true,
        },
        scopes: [
            lib_1.OAuthScope.resourceServer(userServer, readScope),
        ],
    },
});
new core_1.CfnOutput(stack, 'pool-id', {
    value: userPool.userPoolId,
});
new core_1.CfnOutput(stack, 'client-id', {
    value: client.userPoolClientId,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudXNlci1wb29sLXJlc291cmNlLXNlcnZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnVzZXItcG9vbC1yZXNvdXJjZS1zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBcUU7QUFDckUsZ0NBQW1FO0FBRW5FLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLGlDQUFpQyxDQUFDLENBQUM7QUFFaEU7Ozs7Ozs7R0FPRztBQUNILE1BQU0sUUFBUSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7SUFDakQsWUFBWSxFQUFFLFlBQVk7SUFDMUIsYUFBYSxFQUFFLG9CQUFhLENBQUMsT0FBTztDQUNyQyxDQUFDLENBQUM7QUFFSCxNQUFNLFNBQVMsR0FBRyxJQUFJLHlCQUFtQixDQUFDLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQ2hHLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUU7SUFDeEQsVUFBVSxFQUFFLE9BQU87SUFDbkIsTUFBTSxFQUFFLENBQUMsU0FBUyxDQUFDO0NBQ3BCLENBQUMsQ0FBQztBQUVILE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO0lBQzFDLGtCQUFrQixFQUFFLFdBQVc7SUFDL0IsY0FBYyxFQUFFLElBQUk7SUFDcEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFO1lBQ0wsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QjtRQUNELE1BQU0sRUFBRTtZQUNOLGdCQUFVLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUM7U0FDakQ7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILElBQUksZ0JBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO0lBQzlCLEtBQUssRUFBRSxRQUFRLENBQUMsVUFBVTtDQUMzQixDQUFDLENBQUM7QUFFSCxJQUFJLGdCQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtJQUNoQyxLQUFLLEVBQUUsTUFBTSxDQUFDLGdCQUFnQjtDQUMvQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIENmbk91dHB1dCwgUmVtb3ZhbFBvbGljeSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IE9BdXRoU2NvcGUsIFJlc291cmNlU2VydmVyU2NvcGUsIFVzZXJQb29sIH0gZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnaW50ZWctdXNlci1wb29sLXJlc291cmNlLXNlcnZlcicpO1xuXG4vKlxuICogU3RhY2sgdmVyaWZpY2F0aW9uIHN0ZXBzOlxuICogQ29nbml0byB3aWxsIG9ubHkgYWxsb3cgeW91IHRvIGFkZCBhIGN1c3RvbSBzY29wZSBvbiBhIHVzZXIgcG9vbCBjbGllbnQgdGhhdCBpcyBkZWZpbmVkIGJ5IGEgcmVzb3VyY2Ugc2VydmVyLlxuICogQ2hlY2tpbmcgdGhlIGFwcCBjbGllbnQgc2NvcGVzIHdpbGwgdmVyaWZ5IGlmIHRoZSByZXNvdXJjZSBzZXJ2ZXIgaXMgY29uZmlndXJlZCBjb3JyZWN0bHkuXG4gKiBUaGUgZXhwb3J0cyB1c2VyUG9vbElkIGFuZCB1c2VyUG9vbENsaWVudElkIGFyZSBleHBvcnRlZCBoZXJlIHRvIHRlc3RcbiAqXG4gKiAqIGBhd3MgY29nbml0by1pZHAgZGVzY3JpYmUtdXNlci1wb29sLWNsaWVudCAtLXVzZXItcG9vbC1pZCAkdXNlclBvb2xJZCAtLWNsaWVudC1pZCAkdXNlclBvb2xDbGllbnRJZGAgc2hvdWxkIHJldHVybiBcInVzZXJzL3JlYWRcIiBpbiBcIkFsbG93ZWRPQXV0aFNjb3Blc1wiXG4gKi9cbmNvbnN0IHVzZXJQb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnbXl1c2VycG9vbCcsIHtcbiAgdXNlclBvb2xOYW1lOiAnTXlVc2VyUG9vbCcsXG4gIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbn0pO1xuXG5jb25zdCByZWFkU2NvcGUgPSBuZXcgUmVzb3VyY2VTZXJ2ZXJTY29wZSh7IHNjb3BlTmFtZTogJ3JlYWQnLCBzY29wZURlc2NyaXB0aW9uOiAncmVhZCBvbmx5JyB9KTtcbmNvbnN0IHVzZXJTZXJ2ZXIgPSB1c2VyUG9vbC5hZGRSZXNvdXJjZVNlcnZlcignbXlzZXJ2ZXInLCB7XG4gIGlkZW50aWZpZXI6ICd1c2VycycsXG4gIHNjb3BlczogW3JlYWRTY29wZV0sXG59KTtcblxuY29uc3QgY2xpZW50ID0gdXNlclBvb2wuYWRkQ2xpZW50KCdjbGllbnQnLCB7XG4gIHVzZXJQb29sQ2xpZW50TmFtZTogJ3VzZXJzLWFwcCcsXG4gIGdlbmVyYXRlU2VjcmV0OiB0cnVlLFxuICBvQXV0aDoge1xuICAgIGZsb3dzOiB7XG4gICAgICBjbGllbnRDcmVkZW50aWFsczogdHJ1ZSxcbiAgICB9LFxuICAgIHNjb3BlczogW1xuICAgICAgT0F1dGhTY29wZS5yZXNvdXJjZVNlcnZlcih1c2VyU2VydmVyLCByZWFkU2NvcGUpLFxuICAgIF0sXG4gIH0sXG59KTtcblxubmV3IENmbk91dHB1dChzdGFjaywgJ3Bvb2wtaWQnLCB7XG4gIHZhbHVlOiB1c2VyUG9vbC51c2VyUG9vbElkLFxufSk7XG5cbm5ldyBDZm5PdXRwdXQoc3RhY2ssICdjbGllbnQtaWQnLCB7XG4gIHZhbHVlOiBjbGllbnQudXNlclBvb2xDbGllbnRJZCxcbn0pO1xuIl19