"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
const cdk = require("@aws-cdk/core");
const ecs = require("../../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
    memoryLimitMiB: 1024,
    cpu: 512,
});
taskDefinition.addContainer('web', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    portMappings: [{
            containerPort: 80,
            protocol: ecs.Protocol.TCP,
        }],
});
const service = new ecs.FargateService(stack, 'Service', {
    cluster,
    taskDefinition,
});
const scaling = service.autoScaleTaskCount({ maxCapacity: 10 });
// Quite low to try and force it to scale
scaling.scaleOnCpuUtilization('ReasonableCpu', { targetUtilizationPercent: 10 });
const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc, internetFacing: true });
const listener = lb.addListener('PublicListener', { port: 80, open: true });
listener.addTargets('Fargate', {
    port: 80,
    targets: [service],
});
new cdk.CfnOutput(stack, 'LoadBalancerDNS', { value: lb.loadBalancerDnsName });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGItYXdzdnBjLW53LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcubGItYXdzdnBjLW53LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXdDO0FBQ3hDLDZEQUE2RDtBQUM3RCxxQ0FBcUM7QUFDckMsaUNBQWlDO0FBRWpDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFFbEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUVyRCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUVsRSxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO0lBQ3JFLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLEdBQUcsRUFBRSxHQUFHO0NBQ1QsQ0FBQyxDQUFDO0FBRUgsY0FBYyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUU7SUFDakMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDO0lBQ2xFLFlBQVksRUFBRSxDQUFDO1lBQ2IsYUFBYSxFQUFFLEVBQUU7WUFDakIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRztTQUMzQixDQUFDO0NBQ0gsQ0FBQyxDQUFDO0FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7SUFDdkQsT0FBTztJQUNQLGNBQWM7Q0FDZixDQUFDLENBQUM7QUFFSCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNoRSx5Q0FBeUM7QUFDekMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLGVBQWUsRUFBRSxFQUFFLHdCQUF3QixFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFFakYsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN6RixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM1RSxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRTtJQUM3QixJQUFJLEVBQUUsRUFBRTtJQUNSLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7QUFFL0UsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWxidjIgZnJvbSAnQGF3cy1jZGsvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJy4uLy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWVjcy1pbnRlZycpO1xuXG5jb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycsIHsgbWF4QXpzOiAyIH0pO1xuXG5jb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRmFyZ2F0ZUNsdXN0ZXInLCB7IHZwYyB9KTtcblxuY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnLCB7XG4gIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICBjcHU6IDUxMixcbn0pO1xuXG50YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICBwb3J0TWFwcGluZ3M6IFt7XG4gICAgY29udGFpbmVyUG9ydDogODAsXG4gICAgcHJvdG9jb2w6IGVjcy5Qcm90b2NvbC5UQ1AsXG4gIH1dLFxufSk7XG5cbmNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgY2x1c3RlcixcbiAgdGFza0RlZmluaXRpb24sXG59KTtcblxuY29uc3Qgc2NhbGluZyA9IHNlcnZpY2UuYXV0b1NjYWxlVGFza0NvdW50KHsgbWF4Q2FwYWNpdHk6IDEwIH0pO1xuLy8gUXVpdGUgbG93IHRvIHRyeSBhbmQgZm9yY2UgaXQgdG8gc2NhbGVcbnNjYWxpbmcuc2NhbGVPbkNwdVV0aWxpemF0aW9uKCdSZWFzb25hYmxlQ3B1JywgeyB0YXJnZXRVdGlsaXphdGlvblBlcmNlbnQ6IDEwIH0pO1xuXG5jb25zdCBsYiA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywgeyB2cGMsIGludGVybmV0RmFjaW5nOiB0cnVlIH0pO1xuY29uc3QgbGlzdGVuZXIgPSBsYi5hZGRMaXN0ZW5lcignUHVibGljTGlzdGVuZXInLCB7IHBvcnQ6IDgwLCBvcGVuOiB0cnVlIH0pO1xubGlzdGVuZXIuYWRkVGFyZ2V0cygnRmFyZ2F0ZScsIHtcbiAgcG9ydDogODAsXG4gIHRhcmdldHM6IFtzZXJ2aWNlXSxcbn0pO1xuXG5uZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ0xvYWRCYWxhbmNlckROUycsIHsgdmFsdWU6IGxiLmxvYWRCYWxhbmNlckRuc05hbWUgfSk7XG5cbmFwcC5zeW50aCgpO1xuIl19