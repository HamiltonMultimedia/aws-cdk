#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
const route53 = require("@aws-cdk/aws-route53");
const cdk = require("@aws-cdk/core");
const targets = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-integ');
const vpc = new ec2.Vpc(stack, 'VPC', {
    maxAzs: 2,
});
const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
    vpc,
    internetFacing: true,
});
const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });
new route53.ARecord(zone, 'Alias', {
    zone,
    recordName: '_foo',
    target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(lb)),
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYWxiLWFsaWFzLXRhcmdldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmFsYi1hbGlhcy10YXJnZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esd0NBQXdDO0FBQ3hDLDZEQUE2RDtBQUM3RCxnREFBZ0Q7QUFDaEQscUNBQXFDO0FBQ3JDLGtDQUFrQztBQUVsQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHFCQUFxQixDQUFDLENBQUM7QUFFeEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7SUFDcEMsTUFBTSxFQUFFLENBQUM7Q0FDVixDQUFDLENBQUM7QUFFSCxNQUFNLEVBQUUsR0FBRyxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO0lBQ3hELEdBQUc7SUFDSCxjQUFjLEVBQUUsSUFBSTtDQUNyQixDQUFDLENBQUM7QUFFSCxNQUFNLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7QUFFNUYsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7SUFDakMsSUFBSTtJQUNKLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE1BQU0sRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztDQUMzRSxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mic7XG5pbXBvcnQgKiBhcyByb3V0ZTUzIGZyb20gJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHRhcmdldHMgZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWVsYnYyLWludGVnJyk7XG5cbmNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJywge1xuICBtYXhBenM6IDIsXG59KTtcblxuY29uc3QgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHtcbiAgdnBjLFxuICBpbnRlcm5ldEZhY2luZzogdHJ1ZSxcbn0pO1xuXG5jb25zdCB6b25lID0gbmV3IHJvdXRlNTMuUHVibGljSG9zdGVkWm9uZShzdGFjaywgJ0hvc3RlZFpvbmUnLCB7IHpvbmVOYW1lOiAndGVzdC5wdWJsaWMnIH0pO1xuXG5uZXcgcm91dGU1My5BUmVjb3JkKHpvbmUsICdBbGlhcycsIHtcbiAgem9uZSxcbiAgcmVjb3JkTmFtZTogJ19mb28nLFxuICB0YXJnZXQ6IHJvdXRlNTMuUmVjb3JkVGFyZ2V0LmZyb21BbGlhcyhuZXcgdGFyZ2V0cy5Mb2FkQmFsYW5jZXJUYXJnZXQobGIpKSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==