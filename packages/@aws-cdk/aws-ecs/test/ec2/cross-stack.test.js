"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
const core_1 = require("@aws-cdk/core");
const ecs = require("../../lib");
const util_1 = require("../util");
// Test various cross-stack Cluster/Service/ALB scenario's
let app;
let stack1;
let stack2;
let cluster;
let service;
describe('cross stack', () => {
    beforeEach(() => {
        app = new core_1.App();
        stack1 = new core_1.Stack(app, 'Stack1');
        const vpc = new ec2.Vpc(stack1, 'Vpc');
        cluster = new ecs.Cluster(stack1, 'Cluster', {
            vpc,
        });
        util_1.addDefaultCapacityProvider(cluster, stack1, vpc);
        stack2 = new core_1.Stack(app, 'Stack2');
        const taskDefinition = new ecs.Ec2TaskDefinition(stack2, 'TD');
        const container = taskDefinition.addContainer('Main', {
            image: ecs.ContainerImage.fromRegistry('asdf'),
            memoryLimitMiB: 512,
        });
        container.addPortMappings({ containerPort: 8000 });
        service = new ecs.Ec2Service(stack2, 'Service', {
            cluster,
            taskDefinition,
        });
    });
    test('ALB next to Service', () => {
        // WHEN
        const lb = new elbv2.ApplicationLoadBalancer(stack2, 'ALB', { vpc: cluster.vpc });
        const listener = lb.addListener('listener', { port: 80 });
        listener.addTargets('target', {
            port: 80,
            targets: [service],
        });
        // THEN: it shouldn't throw due to cyclic dependencies
        assertions_1.Template.fromStack(stack2).resourceCountIs('AWS::ECS::Service', 1);
        expectIngress(stack2);
    });
    test('ALB next to Cluster', () => {
        // WHEN
        const lb = new elbv2.ApplicationLoadBalancer(stack1, 'ALB', { vpc: cluster.vpc });
        const listener = lb.addListener('listener', { port: 80 });
        listener.addTargets('target', {
            port: 80,
            targets: [service],
        });
        // THEN: it shouldn't throw due to cyclic dependencies
        assertions_1.Template.fromStack(stack2).resourceCountIs('AWS::ECS::Service', 1);
        expectIngress(stack2);
    });
    test('ALB in its own stack', () => {
        // WHEN
        const stack3 = new core_1.Stack(app, 'Stack3');
        const lb = new elbv2.ApplicationLoadBalancer(stack3, 'ALB', { vpc: cluster.vpc });
        const listener = lb.addListener('listener', { port: 80 });
        listener.addTargets('target', {
            port: 80,
            targets: [service],
        });
        // THEN: it shouldn't throw due to cyclic dependencies
        assertions_1.Template.fromStack(stack2).resourceCountIs('AWS::ECS::Service', 1);
        expectIngress(stack2);
    });
});
function expectIngress(stack) {
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
        FromPort: 32768,
        ToPort: 65535,
        GroupId: { 'Fn::ImportValue': 'Stack1:ExportsOutputFnGetAttDefaultAutoScalingGroupInstanceSecurityGroupFBA881D0GroupId2F7C804A' },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvc3Mtc3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyb3NzLXN0YWNrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msd0NBQXdDO0FBQ3hDLDZEQUE2RDtBQUM3RCx3Q0FBMkM7QUFDM0MsaUNBQWlDO0FBQ2pDLGtDQUFxRDtBQUVyRCwwREFBMEQ7QUFFMUQsSUFBSSxHQUFRLENBQUM7QUFDYixJQUFJLE1BQWEsQ0FBQztBQUNsQixJQUFJLE1BQWEsQ0FBQztBQUNsQixJQUFJLE9BQW9CLENBQUM7QUFDekIsSUFBSSxPQUF1QixDQUFDO0FBRTVCLFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQzNCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztRQUVoQixNQUFNLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkMsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFO1lBQzNDLEdBQUc7U0FDSixDQUFDLENBQUM7UUFDSCxpQ0FBMEIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRWpELE1BQU0sR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbEMsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9ELE1BQU0sU0FBUyxHQUFHLGNBQWMsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO1lBQ3BELEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FB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QUMsS0FBWTtJQUNqQyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxnQ0FBZ0MsRUFBRTtRQUNoRixRQUFRLEVBQUUsS0FBSztRQUNmLE1BQU0sRUFBRSxLQUFLO1FBQ2IsT0FBTyxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsaUdBQWlHLEVBQUU7S0FDbEksQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mic7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnLi4vLi4vbGliJztcbmltcG9ydCB7IGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyIH0gZnJvbSAnLi4vdXRpbCc7XG5cbi8vIFRlc3QgdmFyaW91cyBjcm9zcy1zdGFjayBDbHVzdGVyL1NlcnZpY2UvQUxCIHNjZW5hcmlvJ3NcblxubGV0IGFwcDogQXBwO1xubGV0IHN0YWNrMTogU3RhY2s7XG5sZXQgc3RhY2syOiBTdGFjaztcbmxldCBjbHVzdGVyOiBlY3MuQ2x1c3RlcjtcbmxldCBzZXJ2aWNlOiBlY3MuRWMyU2VydmljZTtcblxuZGVzY3JpYmUoJ2Nyb3NzIHN0YWNrJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2sxLCAnVnBjJyk7XG4gICAgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjazEsICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgIH0pO1xuICAgIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyKGNsdXN0ZXIsIHN0YWNrMSwgdnBjKTtcblxuICAgIHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInKTtcbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2syLCAnVEQnKTtcbiAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ01haW4nLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYXNkZicpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICB9KTtcbiAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHsgY29udGFpbmVyUG9ydDogODAwMCB9KTtcblxuICAgIHNlcnZpY2UgPSBuZXcgZWNzLkVjMlNlcnZpY2Uoc3RhY2syLCAnU2VydmljZScsIHtcbiAgICAgIGNsdXN0ZXIsXG4gICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ0FMQiBuZXh0IHRvIFNlcnZpY2UnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrMiwgJ0FMQicsIHsgdnBjOiBjbHVzdGVyLnZwYyB9KTtcbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdsaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG4gICAgbGlzdGVuZXIuYWRkVGFyZ2V0cygndGFyZ2V0Jywge1xuICAgICAgcG9ydDogODAsXG4gICAgICB0YXJnZXRzOiBbc2VydmljZV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOOiBpdCBzaG91bGRuJ3QgdGhyb3cgZHVlIHRvIGN5Y2xpYyBkZXBlbmRlbmNpZXNcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUNTOjpTZXJ2aWNlJywgMSk7XG5cbiAgICBleHBlY3RJbmdyZXNzKHN0YWNrMik7XG5cblxuICB9KTtcblxuICB0ZXN0KCdBTEIgbmV4dCB0byBDbHVzdGVyJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjazEsICdBTEInLCB7IHZwYzogY2x1c3Rlci52cGMgfSk7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignbGlzdGVuZXInLCB7IHBvcnQ6IDgwIH0pO1xuICAgIGxpc3RlbmVyLmFkZFRhcmdldHMoJ3RhcmdldCcsIHtcbiAgICAgIHBvcnQ6IDgwLFxuICAgICAgdGFyZ2V0czogW3NlcnZpY2VdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTjogaXQgc2hvdWxkbid0IHRocm93IGR1ZSB0byBjeWNsaWMgZGVwZW5kZW5jaWVzXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMikucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDUzo6U2VydmljZScsIDEpO1xuICAgIGV4cGVjdEluZ3Jlc3Moc3RhY2syKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ0FMQiBpbiBpdHMgb3duIHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFjazMgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2szJyk7XG4gICAgY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2szLCAnQUxCJywgeyB2cGM6IGNsdXN0ZXIudnBjIH0pO1xuICAgIGNvbnN0IGxpc3RlbmVyID0gbGIuYWRkTGlzdGVuZXIoJ2xpc3RlbmVyJywgeyBwb3J0OiA4MCB9KTtcbiAgICBsaXN0ZW5lci5hZGRUYXJnZXRzKCd0YXJnZXQnLCB7XG4gICAgICBwb3J0OiA4MCxcbiAgICAgIHRhcmdldHM6IFtzZXJ2aWNlXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU46IGl0IHNob3VsZG4ndCB0aHJvdyBkdWUgdG8gY3ljbGljIGRlcGVuZGVuY2llc1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazIpLnJlc291cmNlQ291bnRJcygnQVdTOjpFQ1M6OlNlcnZpY2UnLCAxKTtcbiAgICBleHBlY3RJbmdyZXNzKHN0YWNrMik7XG5cblxuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBleHBlY3RJbmdyZXNzKHN0YWNrOiBTdGFjaykge1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBJbmdyZXNzJywge1xuICAgIEZyb21Qb3J0OiAzMjc2OCxcbiAgICBUb1BvcnQ6IDY1NTM1LFxuICAgIEdyb3VwSWQ6IHsgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFjazE6RXhwb3J0c091dHB1dEZuR2V0QXR0RGVmYXVsdEF1dG9TY2FsaW5nR3JvdXBJbnN0YW5jZVNlY3VyaXR5R3JvdXBGQkE4ODFEMEdyb3VwSWQyRjdDODA0QScgfSxcbiAgfSk7XG59XG4iXX0=