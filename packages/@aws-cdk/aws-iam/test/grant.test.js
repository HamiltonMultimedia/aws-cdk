"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const iam = require("../lib");
let stack;
let resource;
beforeEach(() => {
    stack = new core_1.Stack();
    resource = new core_1.CfnResource(stack, 'SomeResource', {
        type: 'CDK::Test::SomeResource',
    });
});
describe('IAM grant', () => {
    test('Grant.drop() returns a no-op grant', () => {
        const user = new iam.User(stack, 'poo');
        const grant = iam.Grant.drop(user, 'dropping me');
        expect(grant.success).toBeFalsy();
        expect(grant.principalStatement).toBeUndefined();
        expect(grant.resourceStatement).toBeUndefined();
    });
});
describe('Grant dependencies', () => {
    test('can depend on grant added to role', () => {
        // GIVEN
        const role = new iam.Role(stack, 'Role', {
            assumedBy: new iam.ServicePrincipal('bla.amazonaws.com'),
        });
        // WHEN
        applyGrantWithDependencyTo(role);
        // THEN
        expectDependencyOn('RoleDefaultPolicy5FFB7DAB');
    });
    test('can depend on grant added to role wrapped with conditions', () => {
        // GIVEN
        const role = new iam.Role(stack, 'Role', {
            assumedBy: new iam.ServicePrincipal('bla.amazonaws.com'),
        });
        // WHEN
        applyGrantWithDependencyTo(new iam.PrincipalWithConditions(role, {
            StringEquals: { 'aws:something': 'happy' },
        }));
        // THEN
        expectDependencyOn('RoleDefaultPolicy5FFB7DAB');
    });
    test('can depend on grant added to lazy role', () => {
        // GIVEN
        const role = new iam.LazyRole(stack, 'Role', {
            assumedBy: new iam.ServicePrincipal('bla.amazonaws.com'),
        });
        // WHEN
        applyGrantWithDependencyTo(role);
        Array.isArray(role.roleArn); // Force instantiation
        // THEN
        expectDependencyOn('RoleDefaultPolicy5FFB7DAB');
    });
    test('can depend on grant added to resource', () => {
        // WHEN
        iam.Grant.addToPrincipalOrResource({
            actions: ['service:DoAThing'],
            grantee: new iam.ServicePrincipal('bla.amazonaws.com'),
            resourceArns: ['*'],
            resource: new FakeResourceWithPolicy(stack, 'Buckaroo'),
        }).applyBefore(resource);
        // THEN
        expectDependencyOn('BuckarooPolicy74174DA4');
    });
    test('can depend on grant added to principal AND resource', () => {
        // GIVEN
        const role = new iam.Role(stack, 'Role', {
            assumedBy: new iam.ServicePrincipal('bla.amazonaws.com'),
        });
        // WHEN
        iam.Grant.addToPrincipalAndResource({
            actions: ['service:DoAThing'],
            grantee: role,
            resourceArns: ['*'],
            resource: new FakeResourceWithPolicy(stack, 'Buckaroo'),
        }).applyBefore(resource);
        // THEN
        expectDependencyOn('RoleDefaultPolicy5FFB7DAB');
        expectDependencyOn('BuckarooPolicy74174DA4');
    });
    test('can combine two grants', () => {
        // GIVEN
        const role1 = new iam.Role(stack, 'Role1', {
            assumedBy: new iam.ServicePrincipal('bla.amazonaws.com'),
        });
        const role2 = new iam.Role(stack, 'Role2', {
            assumedBy: new iam.ServicePrincipal('bla.amazonaws.com'),
        });
        // WHEN
        const g1 = iam.Grant.addToPrincipal({
            actions: ['service:DoAThing'],
            grantee: role1,
            resourceArns: ['*'],
        });
        const g2 = iam.Grant.addToPrincipal({
            actions: ['service:DoAThing'],
            grantee: role2,
            resourceArns: ['*'],
        });
        (g1.combine(g2)).applyBefore(resource);
        // THEN
        expectDependencyOn('Role1DefaultPolicyD3EF4D0A');
        expectDependencyOn('Role2DefaultPolicy3A7A0A1B');
    });
});
function applyGrantWithDependencyTo(principal) {
    iam.Grant.addToPrincipal({
        actions: ['service:DoAThing'],
        grantee: principal,
        resourceArns: ['*'],
    }).applyBefore(resource);
}
function expectDependencyOn(id) {
    assertions_1.Template.fromStack(stack).hasResource('CDK::Test::SomeResource', {
        DependsOn: assertions_1.Match.arrayWith([id]),
    });
}
class FakeResourceWithPolicy extends core_1.Resource {
    constructor(scope, id) {
        super(scope, id);
        this.policy = new core_1.CfnResource(this, 'Policy', {
            type: 'CDK::Test::BuckarooPolicy',
        });
    }
    addToResourcePolicy(_statement) {
        return { statementAdded: true, policyDependable: this.policy };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhbnQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdyYW50LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsd0NBQTZEO0FBRTdELDhCQUE4QjtBQUU5QixJQUFJLEtBQVksQ0FBQztBQUNqQixJQUFJLFFBQXFCLENBQUM7QUFDMUIsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBQ3BCLFFBQVEsR0FBRyxJQUFJLGtCQUFXLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtRQUNoRCxJQUFJLEVBQUUseUJBQXlCO0tBQ2hDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDekIsSUFBSSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtRQUM5QyxNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUVsRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNqRCxNQUFNLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7SUFDbEMsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUM3QyxRQUFRO1FBQ1IsTUFBTSxJQUFJLEdBQUcsSUFB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Q0FBQyxjQUFjLENBQUM7UUFDdkIsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQUM7UUFDN0IsT0FBTyxFQUFFLFNBQVM7UUFDbEIsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDO0tBQ3BCLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsRUFBVTtJQUNwQyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMseUJBQXlCLEVBQUU7UUFDL0QsU0FBUyxFQUFFLGtCQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDakMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELE1BQU0sc0JBQXVCLFNBQVEsZUFBUTtJQUczQyxZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxrQkFBVyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDNUMsSUFBSSxFQUFFLDJCQUEyQjtTQUNsQyxDQUFDLENBQUM7S0FDSjtJQUVNLG1CQUFtQixDQUFDLFVBQStCO1FBQ3hELE9BQU8sRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNoRTtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUsIE1hdGNoIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBDZm5SZXNvdXJjZSwgUmVzb3VyY2UsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICcuLi9saWInO1xuXG5sZXQgc3RhY2s6IFN0YWNrO1xubGV0IHJlc291cmNlOiBDZm5SZXNvdXJjZTtcbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBTdGFjaygpO1xuICByZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1NvbWVSZXNvdXJjZScsIHtcbiAgICB0eXBlOiAnQ0RLOjpUZXN0OjpTb21lUmVzb3VyY2UnLFxuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnSUFNIGdyYW50JywgKCkgPT4ge1xuICB0ZXN0KCdHcmFudC5kcm9wKCkgcmV0dXJucyBhIG5vLW9wIGdyYW50JywgKCkgPT4ge1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdwb28nKTtcbiAgICBjb25zdCBncmFudCA9IGlhbS5HcmFudC5kcm9wKHVzZXIsICdkcm9wcGluZyBtZScpO1xuXG4gICAgZXhwZWN0KGdyYW50LnN1Y2Nlc3MpLnRvQmVGYWxzeSgpO1xuICAgIGV4cGVjdChncmFudC5wcmluY2lwYWxTdGF0ZW1lbnQpLnRvQmVVbmRlZmluZWQoKTtcbiAgICBleHBlY3QoZ3JhbnQucmVzb3VyY2VTdGF0ZW1lbnQpLnRvQmVVbmRlZmluZWQoKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ0dyYW50IGRlcGVuZGVuY2llcycsICgpID0+IHtcbiAgdGVzdCgnY2FuIGRlcGVuZCBvbiBncmFudCBhZGRlZCB0byByb2xlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnYmxhLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhcHBseUdyYW50V2l0aERlcGVuZGVuY3lUbyhyb2xlKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3REZXBlbmRlbmN5T24oJ1JvbGVEZWZhdWx0UG9saWN5NUZGQjdEQUInKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGRlcGVuZCBvbiBncmFudCBhZGRlZCB0byByb2xlIHdyYXBwZWQgd2l0aCBjb25kaXRpb25zJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnYmxhLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhcHBseUdyYW50V2l0aERlcGVuZGVuY3lUbyhuZXcgaWFtLlByaW5jaXBhbFdpdGhDb25kaXRpb25zKHJvbGUsIHtcbiAgICAgIFN0cmluZ0VxdWFsczogeyAnYXdzOnNvbWV0aGluZyc6ICdoYXBweScgfSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0RGVwZW5kZW5jeU9uKCdSb2xlRGVmYXVsdFBvbGljeTVGRkI3REFCJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBkZXBlbmQgb24gZ3JhbnQgYWRkZWQgdG8gbGF6eSByb2xlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uTGF6eVJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2JsYS5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgYXBwbHlHcmFudFdpdGhEZXBlbmRlbmN5VG8ocm9sZSk7XG4gICAgQXJyYXkuaXNBcnJheShyb2xlLnJvbGVBcm4pOyAvLyBGb3JjZSBpbnN0YW50aWF0aW9uXG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0RGVwZW5kZW5jeU9uKCdSb2xlRGVmYXVsdFBvbGljeTVGRkI3REFCJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBkZXBlbmQgb24gZ3JhbnQgYWRkZWQgdG8gcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbE9yUmVzb3VyY2Uoe1xuICAgICAgYWN0aW9uczogWydzZXJ2aWNlOkRvQVRoaW5nJ10sXG4gICAgICBncmFudGVlOiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2JsYS5hbWF6b25hd3MuY29tJyksXG4gICAgICByZXNvdXJjZUFybnM6IFsnKiddLFxuICAgICAgcmVzb3VyY2U6IG5ldyBGYWtlUmVzb3VyY2VXaXRoUG9saWN5KHN0YWNrLCAnQnVja2Fyb28nKSxcbiAgICB9KS5hcHBseUJlZm9yZShyZXNvdXJjZSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0RGVwZW5kZW5jeU9uKCdCdWNrYXJvb1BvbGljeTc0MTc0REE0Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBkZXBlbmQgb24gZ3JhbnQgYWRkZWQgdG8gcHJpbmNpcGFsIEFORCByZXNvdXJjZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2JsYS5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsQW5kUmVzb3VyY2Uoe1xuICAgICAgYWN0aW9uczogWydzZXJ2aWNlOkRvQVRoaW5nJ10sXG4gICAgICBncmFudGVlOiByb2xlLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbJyonXSxcbiAgICAgIHJlc291cmNlOiBuZXcgRmFrZVJlc291cmNlV2l0aFBvbGljeShzdGFjaywgJ0J1Y2thcm9vJyksXG4gICAgfSkuYXBwbHlCZWZvcmUocmVzb3VyY2UpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdERlcGVuZGVuY3lPbignUm9sZURlZmF1bHRQb2xpY3k1RkZCN0RBQicpO1xuICAgIGV4cGVjdERlcGVuZGVuY3lPbignQnVja2Fyb29Qb2xpY3k3NDE3NERBNCcpO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gY29tYmluZSB0d28gZ3JhbnRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgcm9sZTEgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlMScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdibGEuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuICAgIGNvbnN0IHJvbGUyID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZTInLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnYmxhLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBnMSA9IGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6RG9BVGhpbmcnXSxcbiAgICAgIGdyYW50ZWU6IHJvbGUxLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbJyonXSxcbiAgICB9KTtcbiAgICBjb25zdCBnMiA9IGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6RG9BVGhpbmcnXSxcbiAgICAgIGdyYW50ZWU6IHJvbGUyLFxuICAgICAgcmVzb3VyY2VBcm5zOiBbJyonXSxcbiAgICB9KTtcblxuICAgIChnMS5jb21iaW5lKGcyKSkuYXBwbHlCZWZvcmUocmVzb3VyY2UpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdERlcGVuZGVuY3lPbignUm9sZTFEZWZhdWx0UG9saWN5RDNFRjREMEEnKTtcbiAgICBleHBlY3REZXBlbmRlbmN5T24oJ1JvbGUyRGVmYXVsdFBvbGljeTNBN0EwQTFCJyk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIGFwcGx5R3JhbnRXaXRoRGVwZW5kZW5jeVRvKHByaW5jaXBhbDogaWFtLklQcmluY2lwYWwpIHtcbiAgaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6RG9BVGhpbmcnXSxcbiAgICBncmFudGVlOiBwcmluY2lwYWwsXG4gICAgcmVzb3VyY2VBcm5zOiBbJyonXSxcbiAgfSkuYXBwbHlCZWZvcmUocmVzb3VyY2UpO1xufVxuXG5mdW5jdGlvbiBleHBlY3REZXBlbmRlbmN5T24oaWQ6IHN0cmluZykge1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdDREs6OlRlc3Q6OlNvbWVSZXNvdXJjZScsIHtcbiAgICBEZXBlbmRzT246IE1hdGNoLmFycmF5V2l0aChbaWRdKSxcbiAgfSk7XG59XG5cbmNsYXNzIEZha2VSZXNvdXJjZVdpdGhQb2xpY3kgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIGlhbS5JUmVzb3VyY2VXaXRoUG9saWN5IHtcbiAgcHJpdmF0ZSByZWFkb25seSBwb2xpY3k6IENmblJlc291cmNlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgdGhpcy5wb2xpY3kgPSBuZXcgQ2ZuUmVzb3VyY2UodGhpcywgJ1BvbGljeScsIHtcbiAgICAgIHR5cGU6ICdDREs6OlRlc3Q6OkJ1Y2thcm9vUG9saWN5JyxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb1Jlc291cmNlUG9saWN5KF9zdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpOiBpYW0uQWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdCB7XG4gICAgcmV0dXJuIHsgc3RhdGVtZW50QWRkZWQ6IHRydWUsIHBvbGljeURlcGVuZGFibGU6IHRoaXMucG9saWN5IH07XG4gIH1cbn1cbiJdfQ==