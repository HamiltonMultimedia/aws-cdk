"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
const cdk = require("@aws-cdk/core");
const ecs = require("../../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-ecs');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
    instanceType: new ec2.InstanceType('t2.micro'),
});
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
// networkMode defaults to "bridge"
// memoryMiB: '1GB',
// cpu: '512'
});
const container = taskDefinition.addContainer('web', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 256,
});
container.addPortMappings({
    containerPort: 80,
    hostPort: 8080,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGItYnJpZGdlLW53LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcubGItYnJpZGdlLW53LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esd0NBQXdDO0FBQ3hDLDZEQUE2RDtBQUM3RCxxQ0FBcUM7QUFDckMsaUNBQWlDO0FBRWpDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUV0RCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBRXJELE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUM5RCxPQUFPLENBQUMsV0FBVyxDQUFDLHlCQUF5QixFQUFFO0lBQzdDLFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO0NBQy9DLENBQUMsQ0FBQztBQUVILE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7QUFDakUsbUNBQW1DO0FBQ25DLG9CQUFvQjtBQUNwQixhQUFhO0NBQ2QsQ0FBQyxDQUFDO0FBRUgsTUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUU7SUFDbkQsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDO0lBQ2xFLGNBQWMsRUFBRSxHQUFHO0NBQ3BCLENBQUMsQ0FBQztBQUNILFNBQVMsQ0FBQyxlQUFlLENBQUM7SUFDeEIsYUFBYSxFQUFFLEVBQUU7SUFDakIsUUFBUSxFQUFFLElBQUk7SUFDZCxRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHO0NBQzNCLENBQUMsQ0FBQztBQUVILE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO0lBQ25ELE9BQU87SUFDUCxjQUFjO0NBQ2YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxFQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN6RixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM1RSxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRTtJQUN6QixJQUFJLEVBQUUsRUFBRTtJQUNSLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7QUFFL0UsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnLi4vLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtZWNzLWludGVnLWVjcycpO1xuXG5jb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycsIHsgbWF4QXpzOiAyIH0pO1xuXG5jb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHN0YWNrLCAnRWNzQ2x1c3RlcicsIHsgdnBjIH0pO1xuY2x1c3Rlci5hZGRDYXBhY2l0eSgnRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG59KTtcblxuY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicsIHtcbiAgLy8gbmV0d29ya01vZGUgZGVmYXVsdHMgdG8gXCJicmlkZ2VcIlxuICAvLyBtZW1vcnlNaUI6ICcxR0InLFxuICAvLyBjcHU6ICc1MTInXG59KTtcblxuY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCd3ZWInLCB7XG4gIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbWF6b24vYW1hem9uLWVjcy1zYW1wbGUnKSxcbiAgbWVtb3J5TGltaXRNaUI6IDI1Nixcbn0pO1xuY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7XG4gIGNvbnRhaW5lclBvcnQ6IDgwLFxuICBob3N0UG9ydDogODA4MCxcbiAgcHJvdG9jb2w6IGVjcy5Qcm90b2NvbC5UQ1AsXG59KTtcblxuY29uc3Qgc2VydmljZSA9IG5ldyBlY3MuRWMyU2VydmljZShzdGFjaywgJ1NlcnZpY2UnLCB7XG4gIGNsdXN0ZXIsXG4gIHRhc2tEZWZpbml0aW9uLFxufSk7XG5cbmNvbnN0IGxiID0gbmV3IGVsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7IHZwYywgaW50ZXJuZXRGYWNpbmc6IHRydWUgfSk7XG5jb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdQdWJsaWNMaXN0ZW5lcicsIHsgcG9ydDogODAsIG9wZW46IHRydWUgfSk7XG5saXN0ZW5lci5hZGRUYXJnZXRzKCdFQ1MnLCB7XG4gIHBvcnQ6IDgwLFxuICB0YXJnZXRzOiBbc2VydmljZV0sXG59KTtcblxubmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdMb2FkQmFsYW5jZXJETlMnLCB7IHZhbHVlOiBsYi5sb2FkQmFsYW5jZXJEbnNOYW1lIH0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==