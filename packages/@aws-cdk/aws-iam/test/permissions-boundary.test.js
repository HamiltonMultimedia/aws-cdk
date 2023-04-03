"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const iam = require("../lib");
let app;
let stack;
beforeEach(() => {
    app = new core_1.App();
    stack = new core_1.Stack(app, 'Stack');
});
test('apply imported boundary to a role', () => {
    // GIVEN
    const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('service.amazonaws.com'),
    });
    // WHEN
    iam.PermissionsBoundary.of(role).apply(iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        PermissionsBoundary: {
            'Fn::Join': ['', [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::aws:policy/ReadOnlyAccess',
                ]],
        },
    });
});
test('apply imported boundary to a user', () => {
    // GIVEN
    const user = new iam.User(stack, 'User');
    // WHEN
    iam.PermissionsBoundary.of(user).apply(iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::User', {
        PermissionsBoundary: {
            'Fn::Join': ['', [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::aws:policy/ReadOnlyAccess',
                ]],
        },
    });
});
test('apply newly created boundary to a role', () => {
    // GIVEN
    const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('service.amazonaws.com'),
    });
    // WHEN
    iam.PermissionsBoundary.of(role).apply(new iam.ManagedPolicy(stack, 'Policy', {
        statements: [
            new iam.PolicyStatement({
                actions: ['*'],
                resources: ['*'],
            }),
        ],
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        PermissionsBoundary: { Ref: 'Policy23B91518' },
    });
});
test('apply boundary to role created by a custom resource', () => {
    // GIVEN
    const provider = core_1.CustomResourceProvider.getOrCreateProvider(stack, 'Empty', {
        codeDirectory: path.join(__dirname, 'custom-resource'),
        runtime: core_1.CustomResourceProviderRuntime.NODEJS_14_X,
    });
    // WHEN
    iam.PermissionsBoundary.of(provider).apply(new iam.ManagedPolicy(stack, 'Policy', {
        statements: [
            new iam.PolicyStatement({
                actions: ['*'],
                resources: ['*'],
            }),
        ],
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        PermissionsBoundary: { Ref: 'Policy23B91518' },
    });
});
test('apply boundary to users created via CfnResource', () => {
    // GIVEN
    const user = new core_1.CfnResource(stack, 'User', {
        type: 'AWS::IAM::User',
    });
    // WHEN
    iam.PermissionsBoundary.of(user).apply(new iam.ManagedPolicy(stack, 'Policy', {
        statements: [
            new iam.PolicyStatement({
                actions: ['*'],
                resources: ['*'],
            }),
        ],
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::User', {
        PermissionsBoundary: { Ref: 'Policy23B91518' },
    });
});
test('apply boundary to roles created via CfnResource', () => {
    // GIVEN
    const role = new core_1.CfnResource(stack, 'Role', {
        type: 'AWS::IAM::Role',
    });
    // WHEN
    iam.PermissionsBoundary.of(role).apply(new iam.ManagedPolicy(stack, 'Policy', {
        statements: [
            new iam.PolicyStatement({
                actions: ['*'],
                resources: ['*'],
            }),
        ],
    }));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        PermissionsBoundary: { Ref: 'Policy23B91518' },
    });
});
test('unapply inherited boundary from a user: order 1', () => {
    // GIVEN
    const user = new iam.User(stack, 'User');
    // WHEN
    iam.PermissionsBoundary.of(stack).apply(iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'));
    iam.PermissionsBoundary.of(user).clear();
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::User', {
        PermissionsBoundary: assertions_1.Match.absent(),
    });
});
test('unapply inherited boundary from a user: order 2', () => {
    // GIVEN
    const user = new iam.User(stack, 'User');
    // WHEN
    iam.PermissionsBoundary.of(user).clear();
    iam.PermissionsBoundary.of(stack).apply(iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::User', {
        PermissionsBoundary: assertions_1.Match.absent(),
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbnMtYm91bmRhcnkudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBlcm1pc3Npb25zLWJvdW5kYXJ5LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0Isb0RBQXNEO0FBQ3RELHdDQUErRztBQUMvRyw4QkFBOEI7QUFFOUIsSUFBSSxHQUFRLENBQUM7QUFDYixJQUFJLEtBQVksQ0FBQztBQUNqQixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7SUFDaEIsS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7SUFDN0MsUUFBUTtJQUNSLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1FBQ3ZDLFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQztLQUM3RCxDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AsR0FBRyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFFckcsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGdCQUFnQixFQUFFO1FBQ2hFLG1CQUFtQixFQUFFO1lBQ25CLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDZixNQUFNO29CQUNOLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFO29CQUN6QixpQ0FBaUM7aUJBQ2xDLENBQUM7U0FDSDtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMs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LENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBRXRHLE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBZ0IsRUFBRTtRQUNoRSxtQkFBbUIsRUFBRSxrQkFBSyxDQUFDLE1BQU0sRUFBRTtLQUNwQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IEFwcCwgQ2ZuUmVzb3VyY2UsIEN1c3RvbVJlc291cmNlUHJvdmlkZXIsIEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJy4uL2xpYic7XG5cbmxldCBhcHA6IEFwcDtcbmxldCBzdGFjazogU3RhY2s7XG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgYXBwID0gbmV3IEFwcCgpO1xuICBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycpO1xufSk7XG5cbnRlc3QoJ2FwcGx5IGltcG9ydGVkIGJvdW5kYXJ5IHRvIGEgcm9sZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ3NlcnZpY2UuYW1hem9uYXdzLmNvbScpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIGlhbS5QZXJtaXNzaW9uc0JvdW5kYXJ5Lm9mKHJvbGUpLmFwcGx5KGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnUmVhZE9ubHlBY2Nlc3MnKSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgUGVybWlzc2lvbnNCb3VuZGFyeToge1xuICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICdhcm46JyxcbiAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgJzppYW06OmF3czpwb2xpY3kvUmVhZE9ubHlBY2Nlc3MnLFxuICAgICAgXV0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnYXBwbHkgaW1wb3J0ZWQgYm91bmRhcnkgdG8gYSB1c2VyJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnVXNlcicpO1xuXG4gIC8vIFdIRU5cbiAgaWFtLlBlcm1pc3Npb25zQm91bmRhcnkub2YodXNlcikuYXBwbHkoaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdSZWFkT25seUFjY2VzcycpKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6VXNlcicsIHtcbiAgICBQZXJtaXNzaW9uc0JvdW5kYXJ5OiB7XG4gICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgJ2FybjonLFxuICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAnOmlhbTo6YXdzOnBvbGljeS9SZWFkT25seUFjY2VzcycsXG4gICAgICBdXSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdhcHBseSBuZXdseSBjcmVhdGVkIGJvdW5kYXJ5IHRvIGEgcm9sZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ3NlcnZpY2UuYW1hem9uYXdzLmNvbScpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIGlhbS5QZXJtaXNzaW9uc0JvdW5kYXJ5Lm9mKHJvbGUpLmFwcGx5KG5ldyBpYW0uTWFuYWdlZFBvbGljeShzdGFjaywgJ1BvbGljeScsIHtcbiAgICBzdGF0ZW1lbnRzOiBbXG4gICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFsnKiddLFxuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgfSksXG4gICAgXSxcbiAgfSkpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgIFBlcm1pc3Npb25zQm91bmRhcnk6IHsgUmVmOiAnUG9saWN5MjNCOTE1MTgnIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2FwcGx5IGJvdW5kYXJ5IHRvIHJvbGUgY3JlYXRlZCBieSBhIGN1c3RvbSByZXNvdXJjZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgcHJvdmlkZXIgPSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLmdldE9yQ3JlYXRlUHJvdmlkZXIoc3RhY2ssICdFbXB0eScsIHtcbiAgICBjb2RlRGlyZWN0b3J5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnY3VzdG9tLXJlc291cmNlJyksXG4gICAgcnVudGltZTogQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgaWFtLlBlcm1pc3Npb25zQm91bmRhcnkub2YocHJvdmlkZXIpLmFwcGx5KG5ldyBpYW0uTWFuYWdlZFBvbGljeShzdGFjaywgJ1BvbGljeScsIHtcbiAgICBzdGF0ZW1lbnRzOiBbXG4gICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFsnKiddLFxuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgfSksXG4gICAgXSxcbiAgfSkpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgIFBlcm1pc3Npb25zQm91bmRhcnk6IHsgUmVmOiAnUG9saWN5MjNCOTE1MTgnIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2FwcGx5IGJvdW5kYXJ5IHRvIHVzZXJzIGNyZWF0ZWQgdmlhIENmblJlc291cmNlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCB1c2VyID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnVXNlcicsIHtcbiAgICB0eXBlOiAnQVdTOjpJQU06OlVzZXInLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIGlhbS5QZXJtaXNzaW9uc0JvdW5kYXJ5Lm9mKHVzZXIpLmFwcGx5KG5ldyBpYW0uTWFuYWdlZFBvbGljeShzdGFjaywgJ1BvbGljeScsIHtcbiAgICBzdGF0ZW1lbnRzOiBbXG4gICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFsnKiddLFxuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgfSksXG4gICAgXSxcbiAgfSkpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpVc2VyJywge1xuICAgIFBlcm1pc3Npb25zQm91bmRhcnk6IHsgUmVmOiAnUG9saWN5MjNCOTE1MTgnIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2FwcGx5IGJvdW5kYXJ5IHRvIHJvbGVzIGNyZWF0ZWQgdmlhIENmblJlc291cmNlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCByb2xlID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnUm9sZScsIHtcbiAgICB0eXBlOiAnQVdTOjpJQU06OlJvbGUnLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIGlhbS5QZXJtaXNzaW9uc0JvdW5kYXJ5Lm9mKHJvbGUpLmFwcGx5KG5ldyBpYW0uTWFuYWdlZFBvbGljeShzdGFjaywgJ1BvbGljeScsIHtcbiAgICBzdGF0ZW1lbnRzOiBbXG4gICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFsnKiddLFxuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgfSksXG4gICAgXSxcbiAgfSkpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgIFBlcm1pc3Npb25zQm91bmRhcnk6IHsgUmVmOiAnUG9saWN5MjNCOTE1MTgnIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3VuYXBwbHkgaW5oZXJpdGVkIGJvdW5kYXJ5IGZyb20gYSB1c2VyOiBvcmRlciAxJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnVXNlcicpO1xuXG4gIC8vIFdIRU5cbiAgaWFtLlBlcm1pc3Npb25zQm91bmRhcnkub2Yoc3RhY2spLmFwcGx5KGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnUmVhZE9ubHlBY2Nlc3MnKSk7XG4gIGlhbS5QZXJtaXNzaW9uc0JvdW5kYXJ5Lm9mKHVzZXIpLmNsZWFyKCk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlVzZXInLCB7XG4gICAgUGVybWlzc2lvbnNCb3VuZGFyeTogTWF0Y2guYWJzZW50KCksXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3VuYXBwbHkgaW5oZXJpdGVkIGJvdW5kYXJ5IGZyb20gYSB1c2VyOiBvcmRlciAyJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnVXNlcicpO1xuXG4gIC8vIFdIRU5cbiAgaWFtLlBlcm1pc3Npb25zQm91bmRhcnkub2YodXNlcikuY2xlYXIoKTtcbiAgaWFtLlBlcm1pc3Npb25zQm91bmRhcnkub2Yoc3RhY2spLmFwcGx5KGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnUmVhZE9ubHlBY2Nlc3MnKSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlVzZXInLCB7XG4gICAgUGVybWlzc2lvbnNCb3VuZGFyeTogTWF0Y2guYWJzZW50KCksXG4gIH0pO1xufSk7XG4iXX0=