"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
const cdk = require("@aws-cdk/core");
const ecs = require("../../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
    instanceType: new ec2.InstanceType('t2.micro'),
});
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
    networkMode: ecs.NetworkMode.AWS_VPC,
});
const container = taskDefinition.addContainer('web', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 256,
});
container.addPortMappings({
    containerPort: 80,
    protocol: ecs.Protocol.TCP,
});
const service = new ecs.Ec2Service(stack, 'Service', {
    cluster,
    taskDefinition,
});
const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc, internetFacing: true });
const listener = lb.addListener('PublicListener', { port: 80, open: true });
listener.addTargets('ECS', {
    port: 80,
    targets: [service],
});
new cdk.CfnOutput(stack, 'LoadBalancerDNS', { value: lb.loadBalancerDnsName });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGItYXdzdnBjLW53LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcubGItYXdzdnBjLW53LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXdDO0FBQ3hDLDZEQUE2RDtBQUM3RCxxQ0FBcUM7QUFDckMsaUNBQWlDO0FBRWpDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFFbEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUVyRCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDOUQsT0FBTyxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRTtJQUM3QyxZQUFZLEVBQUUsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztDQUMvQyxDQUFDLENBQUM7QUFFSCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO0lBQ2pFLFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU87Q0FDckMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUU7SUFDbkQsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDO0lBQ2xFLGNBQWMsRUFBRSxHQUFHO0NBQ3BCLENBQUMsQ0FBQztBQUVILFNBQVMsQ0FBQyxlQUFlLENBQUM7SUFDeEIsYUFBYSxFQUFFLEVBQUU7SUFDakIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRztDQUMzQixDQUFDLENBQUM7QUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtJQUNuRCxPQUFPO0lBQ1AsY0FBYztDQUNmLENBQUMsQ0FBQztBQUVILE1BQU0sRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDekYsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDNUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUU7SUFDekIsSUFBSSxFQUFFLEVBQUU7SUFDUixPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUM7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO0FBRS9FLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVsYnYyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lbGFzdGljbG9hZGJhbGFuY2luZ3YyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICcuLi8uLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1lY3MtaW50ZWcnKTtcblxuY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnLCB7IG1heEF6czogMiB9KTtcblxuY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7IHZwYyB9KTtcbmNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywge1xuICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpLFxufSk7XG5cbmNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnLCB7XG4gIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQyxcbn0pO1xuXG5jb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxuICBtZW1vcnlMaW1pdE1pQjogMjU2LFxufSk7XG5cbmNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3Moe1xuICBjb250YWluZXJQb3J0OiA4MCxcbiAgcHJvdG9jb2w6IGVjcy5Qcm90b2NvbC5UQ1AsXG59KTtcblxuY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gIGNsdXN0ZXIsXG4gIHRhc2tEZWZpbml0aW9uLFxufSk7XG5cbmNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYywgaW50ZXJuZXRGYWNpbmc6IHRydWUgfSk7XG5jb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdQdWJsaWNMaXN0ZW5lcicsIHsgcG9ydDogODAsIG9wZW46IHRydWUgfSk7XG5saXN0ZW5lci5hZGRUYXJnZXRzKCdFQ1MnLCB7XG4gIHBvcnQ6IDgwLFxuICB0YXJnZXRzOiBbc2VydmljZV0sXG59KTtcblxubmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdMb2FkQmFsYW5jZXJETlMnLCB7IHZhbHVlOiBsYi5sb2FkQmFsYW5jZXJEbnNOYW1lIH0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==