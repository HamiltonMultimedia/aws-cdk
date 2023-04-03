"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const servicediscovery = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-servicediscovery-integ');
const namespace = new servicediscovery.PublicDnsNamespace(stack, 'Namespace', {
    name: 'foobar.com',
});
const service = namespace.createService('Service', {
    name: 'foo',
    dnsRecordType: servicediscovery.DnsRecordType.A,
    dnsTtl: cdk.Duration.seconds(30),
    healthCheck: {
        type: servicediscovery.HealthCheckType.HTTPS,
        resourcePath: '/healthcheck',
        failureThreshold: 2,
    },
});
service.registerIpInstance('IpInstance', {
    ipv4: '54.239.25.192',
    port: 443,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc2VydmljZS13aXRoLXB1YmxpYy1kbnMtbmFtZXNwYWNlLmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnNlcnZpY2Utd2l0aC1wdWJsaWMtZG5zLW5hbWVzcGFjZS5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBcUM7QUFDckMsMkNBQTJDO0FBRTNDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztBQUUvRCxNQUFNLFNBQVMsR0FBRyxJQUFJLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7SUFDNUUsSUFBSSxFQUFFLFlBQVk7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUU7SUFDakQsSUFBSSxFQUFFLEtBQUs7SUFDWCxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDL0MsTUFBTSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUNoQyxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLEtBQUs7UUFDNUMsWUFBWSxFQUFFLGNBQWM7UUFDNUIsZ0JBQWdCLEVBQUUsQ0FBQztLQUNwQjtDQUNGLENBQUMsQ0FBQztBQUVILE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUU7SUFDdkMsSUFBSSxFQUFFLGVBQWU7SUFDckIsSUFBSSxFQUFFLEdBQUc7Q0FDVixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBzZXJ2aWNlZGlzY292ZXJ5IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLXNlcnZpY2VkaXNjb3ZlcnktaW50ZWcnKTtcblxuY29uc3QgbmFtZXNwYWNlID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuUHVibGljRG5zTmFtZXNwYWNlKHN0YWNrLCAnTmFtZXNwYWNlJywge1xuICBuYW1lOiAnZm9vYmFyLmNvbScsXG59KTtcblxuY29uc3Qgc2VydmljZSA9IG5hbWVzcGFjZS5jcmVhdGVTZXJ2aWNlKCdTZXJ2aWNlJywge1xuICBuYW1lOiAnZm9vJyxcbiAgZG5zUmVjb3JkVHlwZTogc2VydmljZWRpc2NvdmVyeS5EbnNSZWNvcmRUeXBlLkEsXG4gIGRuc1R0bDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMzApLFxuICBoZWFsdGhDaGVjazoge1xuICAgIHR5cGU6IHNlcnZpY2VkaXNjb3ZlcnkuSGVhbHRoQ2hlY2tUeXBlLkhUVFBTLFxuICAgIHJlc291cmNlUGF0aDogJy9oZWFsdGhjaGVjaycsXG4gICAgZmFpbHVyZVRocmVzaG9sZDogMixcbiAgfSxcbn0pO1xuXG5zZXJ2aWNlLnJlZ2lzdGVySXBJbnN0YW5jZSgnSXBJbnN0YW5jZScsIHtcbiAgaXB2NDogJzU0LjIzOS4yNS4xOTInLFxuICBwb3J0OiA0NDMsXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=