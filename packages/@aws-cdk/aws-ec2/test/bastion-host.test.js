"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('bastion host', () => {
    test('default instance is created in basic', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC');
        // WHEN
        new lib_1.BastionHostLinux(stack, 'Bastion', {
            vpc,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
            InstanceType: 't3.nano',
            SubnetId: { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
        });
    });
    test('default instance is created in isolated vpc', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC', {
            subnetConfiguration: [
                {
                    subnetType: lib_1.SubnetType.PRIVATE_ISOLATED,
                    name: 'Isolated',
                },
            ],
        });
        // WHEN
        new lib_1.BastionHostLinux(stack, 'Bastion', {
            vpc,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
            InstanceType: 't3.nano',
            SubnetId: { Ref: 'VPCIsolatedSubnet1SubnetEBD00FC6' },
        });
    });
    test('ebs volume is encrypted', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC', {
            subnetConfiguration: [
                {
                    subnetType: lib_1.SubnetType.PRIVATE_ISOLATED,
                    name: 'Isolated',
                },
            ],
        });
        // WHEN
        new lib_1.BastionHostLinux(stack, 'Bastion', {
            vpc,
            blockDevices: [{
                    deviceName: 'EBSBastionHost',
                    volume: lib_1.BlockDeviceVolume.ebs(10, {
                        encrypted: true,
                    }),
                }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
            BlockDeviceMappings: [
                {
                    DeviceName: 'EBSBastionHost',
                    Ebs: {
                        Encrypted: true,
                        VolumeSize: 10,
                    },
                },
            ],
        });
    });
    test('x86-64 instances use x86-64 image by default', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC');
        // WHEN
        new lib_1.BastionHostLinux(stack, 'Bastion', {
            vpc,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
            ImageId: {
                Ref: 'SsmParameterValueawsserviceamiamazonlinuxlatestamzn2amihvmx8664gp2C96584B6F00A464EAD1953AFF4B05118Parameter',
            },
        });
    });
    test('arm instances use arm image by default', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC');
        // WHEN
        new lib_1.BastionHostLinux(stack, 'Bastion', {
            vpc,
            instanceType: lib_1.InstanceType.of(lib_1.InstanceClass.T4G, lib_1.InstanceSize.NANO),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
            ImageId: {
                Ref: 'SsmParameterValueawsserviceamiamazonlinuxlatestamzn2amihvmarm64gp2C96584B6F00A464EAD1953AFF4B05118Parameter',
            },
        });
    });
    test('add CloudFormation Init to instance', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC');
        // WHEN
        new lib_1.BastionHostLinux(stack, 'Bastion', {
            vpc,
            initOptions: {
                timeout: core_1.Duration.minutes(30),
            },
            init: lib_1.CloudFormationInit.fromElements(lib_1.InitCommand.shellCommand('echo hello')),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::EC2::Instance', {
            CreationPolicy: {
                ResourceSignal: {
                    Timeout: 'PT30M',
                },
            },
            Metadata: {
                'AWS::CloudFormation::Init': {
                    config: {
                        commands: {
                            '000': {
                                command: 'echo hello',
                            },
                        },
                    },
                },
            },
        });
    });
    test('imdsv2 is required', () => {
        //GIVEN
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC');
        //WHEN
        new lib_1.BastionHostLinux(stack, 'Bastion', {
            vpc,
            requireImdsv2: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
            LaunchTemplateData: {
                MetadataOptions: {
                    HttpTokens: 'required',
                },
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzdGlvbi1ob3N0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXN0aW9uLWhvc3QudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBZ0Q7QUFDaEQsZ0NBQTBKO0FBRTFKLFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO0lBQzVCLElBQUksQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7UUFDaEQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWxDLE9BQU87UUFDUCxJQUFJLHNCQUFnQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDckMsR0FBRztTQUNKLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxvQkFBb0IsRUFBRTtZQUNwRSxZQUFZLEVBQUUsU0FBUztZQUN2QixRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsaUNBQWlDLEVBQUU7U0FDckQsQ0FBQyxDQUFDO0lBR0wsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1FBQ3ZELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDaEMsbUJBQW1CLEVBQUU7Z0JBQ25CO29CQUNFLFVBQVUsRUFBRSxnQkFBVSxDQUFDLGdCQUFnQjtvQkFDdkMsSUFBSSxFQUFFLFVBQVU7aUJBQ2pCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsSUFBSSxzQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ3JDLEdBQUc7U0FDSixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsb0JBQW9CLEVBQUU7WUFDcEUsWUFBWSxFQUFFLFNBQVM7WUFDdkIsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLGtDQUFrQyxFQUFFO1NBQ3RELENBQUMsQ0FBQztJQUdMLENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtRQUNuQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO1lBQ2hDLG1CQUFtQixFQUFFO2dCQUNuQjtvQkFDRSxVQUFVLEVBQUUsZ0JBQVUsQ0FBQyxnQkFBZ0I7b0JBQ3ZDLElBQUksRUFBRSxVQUFVO2lCQUNqQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLElBQUksc0JBQWdCLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUNyQyxHQUFHO1lBQ0gsWUFBWSxFQUFFLENBQUM7b0JBQ2IsVUFBVSxFQUFFLGdCQUFnQjtvQkFDNUIsTUFBTSxFQUFFLHVCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUU7d0JBQ2hDLFNBQVMsRUFBRSxJQUFJO3FCQUNoQixDQUFDO2lCQUNILENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsb0JBQW9CLEVBQUU7WUFDcEUsbUJBQW1CLEVBQUU7Z0JBQ25CO29CQUNFLFVBQVUsRUFBRSxnQkFBZ0I7b0JBQzVCLEdBQUcsRUFBRTt3QkFDSCxTQUFTLEVBQUUsSUFBSTt3QkFDZixVQUFVLEVBQUUsRUFBRTtxQkFDZjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBR0wsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFO1FBQ3hELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVsQyxPQUFPO1FBQ1AsSUFBSSxzQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ3JDLEdBQUc7U0FDSixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsb0JBQW9CLEVBQUU7WUFDcEUsT0FBTyxFQUFFO2dCQUNQLEdBQUcsRUFBRSw2R0FBNkc7YUFDbkg7U0FDRixDQUFDLENBQUM7SUFHTCxDQUFDLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLEVBQUU7UUFDbEQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWxDLE9BQU87UUFDUCxJQUFJLHNCQUFnQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDckMsR0FBRztZQUNILFlBQVksRUFBRSxrQkFBWSxDQUFDLEVBQUUsQ0FBQyxtQkFBYSxDQUFDLEdBQUcsRUFBRSxrQkFBWSxDQUFDLElBQUksQ0FBQztTQUNwRSxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsb0JBQW9CLEVBQUU7WUFDcEUsT0FBTyxFQUFFO2dCQUNQLEdBQUcsRUFBRSw2R0FBNkc7YUFDbkg7U0FDRixDQUFDLENBQUM7SUFHTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUU7UUFDL0MsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWxDLE9BQU87UUFDUCxJQUFJLHNCQUFnQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDckMsR0FBRztZQUNILFdBQVcsRUFBRTtnQkFDWCxPQUFPLEVBQUUsZUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7YUFDOUI7WUFDRCxJQUFJLEVBQUUsd0JBQWtCLENBQUMsWUFBWSxDQUNuQyxpQkFBVyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FDdkM7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLG9CQUFvQixFQUFFO1lBQzFELGNBQWMsRUFBRTtnQkFDZCxjQUFjLEVBQUU7b0JBQ2QsT0FBTyxFQUFFLE9BQU87aUJBQ2pCO2FBQ0Y7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsMkJBQTJCLEVBQUU7b0JBQzNCLE1BQU0sRUFBRTt3QkFDTixRQUFRLEVBQUU7NEJBQ1IsS0FBSyxFQUFFO2dDQUNMLE9BQU8sRUFBRSxZQUFZOzZCQUN0Qjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO1FBQzlCLE9BQU87UUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVsQyxNQUFNO1FBQ04sSUFBSSxzQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ3JDLEdBQUc7WUFDSCxhQUFhLEVBQUUsSUFBSTtTQUNwQixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMEJBQTBCLEVBQUU7WUFDMUUsa0JBQWtCLEVBQUU7Z0JBQ2xCLGVBQWUsRUFBRTtvQkFDZixVQUFVLEVBQUUsVUFBVTtpQkFDdkI7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgRHVyYXRpb24sIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBCYXN0aW9uSG9zdExpbnV4LCBCbG9ja0RldmljZVZvbHVtZSwgQ2xvdWRGb3JtYXRpb25Jbml0LCBJbml0Q29tbWFuZCwgSW5zdGFuY2VDbGFzcywgSW5zdGFuY2VTaXplLCBJbnN0YW5jZVR5cGUsIFN1Ym5ldFR5cGUsIFZwYyB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdiYXN0aW9uIGhvc3QnLCAoKSA9PiB7XG4gIHRlc3QoJ2RlZmF1bHQgaW5zdGFuY2UgaXMgY3JlYXRlZCBpbiBiYXNpYycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBCYXN0aW9uSG9zdExpbnV4KHN0YWNrLCAnQmFzdGlvbicsIHtcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6Okluc3RhbmNlJywge1xuICAgICAgSW5zdGFuY2VUeXBlOiAndDMubmFubycsXG4gICAgICBTdWJuZXRJZDogeyBSZWY6ICdWUENQcml2YXRlU3VibmV0MVN1Ym5ldDhCQ0ExMEUwJyB9LFxuICAgIH0pO1xuXG5cbiAgfSk7XG4gIHRlc3QoJ2RlZmF1bHQgaW5zdGFuY2UgaXMgY3JlYXRlZCBpbiBpc29sYXRlZCB2cGMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQsXG4gICAgICAgICAgbmFtZTogJ0lzb2xhdGVkJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEJhc3Rpb25Ib3N0TGludXgoc3RhY2ssICdCYXN0aW9uJywge1xuICAgICAgdnBjLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6SW5zdGFuY2UnLCB7XG4gICAgICBJbnN0YW5jZVR5cGU6ICd0My5uYW5vJyxcbiAgICAgIFN1Ym5ldElkOiB7IFJlZjogJ1ZQQ0lzb2xhdGVkU3VibmV0MVN1Ym5ldEVCRDAwRkM2JyB9LFxuICAgIH0pO1xuXG5cbiAgfSk7XG4gIHRlc3QoJ2VicyB2b2x1bWUgaXMgZW5jcnlwdGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJywge1xuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICB7XG4gICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVELFxuICAgICAgICAgIG5hbWU6ICdJc29sYXRlZCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBCYXN0aW9uSG9zdExpbnV4KHN0YWNrLCAnQmFzdGlvbicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGJsb2NrRGV2aWNlczogW3tcbiAgICAgICAgZGV2aWNlTmFtZTogJ0VCU0Jhc3Rpb25Ib3N0JyxcbiAgICAgICAgdm9sdW1lOiBCbG9ja0RldmljZVZvbHVtZS5lYnMoMTAsIHtcbiAgICAgICAgICBlbmNyeXB0ZWQ6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpJbnN0YW5jZScsIHtcbiAgICAgIEJsb2NrRGV2aWNlTWFwcGluZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIERldmljZU5hbWU6ICdFQlNCYXN0aW9uSG9zdCcsXG4gICAgICAgICAgRWJzOiB7XG4gICAgICAgICAgICBFbmNyeXB0ZWQ6IHRydWUsXG4gICAgICAgICAgICBWb2x1bWVTaXplOiAxMCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuXG4gIH0pO1xuICB0ZXN0KCd4ODYtNjQgaW5zdGFuY2VzIHVzZSB4ODYtNjQgaW1hZ2UgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBCYXN0aW9uSG9zdExpbnV4KHN0YWNrLCAnQmFzdGlvbicsIHtcbiAgICAgIHZwYyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6Okluc3RhbmNlJywge1xuICAgICAgSW1hZ2VJZDoge1xuICAgICAgICBSZWY6ICdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2VhbWlhbWF6b25saW51eGxhdGVzdGFtem4yYW1paHZteDg2NjRncDJDOTY1ODRCNkYwMEE0NjRFQUQxOTUzQUZGNEIwNTExOFBhcmFtZXRlcicsXG4gICAgICB9LFxuICAgIH0pO1xuXG5cbiAgfSk7XG4gIHRlc3QoJ2FybSBpbnN0YW5jZXMgdXNlIGFybSBpbWFnZSBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEJhc3Rpb25Ib3N0TGludXgoc3RhY2ssICdCYXN0aW9uJywge1xuICAgICAgdnBjLFxuICAgICAgaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGUub2YoSW5zdGFuY2VDbGFzcy5UNEcsIEluc3RhbmNlU2l6ZS5OQU5PKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6Okluc3RhbmNlJywge1xuICAgICAgSW1hZ2VJZDoge1xuICAgICAgICBSZWY6ICdTc21QYXJhbWV0ZXJWYWx1ZWF3c3NlcnZpY2VhbWlhbWF6b25saW51eGxhdGVzdGFtem4yYW1paHZtYXJtNjRncDJDOTY1ODRCNkYwMEE0NjRFQUQxOTUzQUZGNEIwNTExOFBhcmFtZXRlcicsXG4gICAgICB9LFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnYWRkIENsb3VkRm9ybWF0aW9uIEluaXQgdG8gaW5zdGFuY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQmFzdGlvbkhvc3RMaW51eChzdGFjaywgJ0Jhc3Rpb24nLCB7XG4gICAgICB2cGMsXG4gICAgICBpbml0T3B0aW9uczoge1xuICAgICAgICB0aW1lb3V0OiBEdXJhdGlvbi5taW51dGVzKDMwKSxcbiAgICAgIH0sXG4gICAgICBpbml0OiBDbG91ZEZvcm1hdGlvbkluaXQuZnJvbUVsZW1lbnRzKFxuICAgICAgICBJbml0Q29tbWFuZC5zaGVsbENvbW1hbmQoJ2VjaG8gaGVsbG8nKSxcbiAgICAgICksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpFQzI6Okluc3RhbmNlJywge1xuICAgICAgQ3JlYXRpb25Qb2xpY3k6IHtcbiAgICAgICAgUmVzb3VyY2VTaWduYWw6IHtcbiAgICAgICAgICBUaW1lb3V0OiAnUFQzME0nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIE1ldGFkYXRhOiB7XG4gICAgICAgICdBV1M6OkNsb3VkRm9ybWF0aW9uOjpJbml0Jzoge1xuICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgY29tbWFuZHM6IHtcbiAgICAgICAgICAgICAgJzAwMCc6IHtcbiAgICAgICAgICAgICAgICBjb21tYW5kOiAnZWNobyBoZWxsbycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpbWRzdjIgaXMgcmVxdWlyZWQnLCAoKSA9PiB7XG4gICAgLy9HSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuXG4gICAgLy9XSEVOXG4gICAgbmV3IEJhc3Rpb25Ib3N0TGludXgoc3RhY2ssICdCYXN0aW9uJywge1xuICAgICAgdnBjLFxuICAgICAgcmVxdWlyZUltZHN2MjogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywge1xuICAgICAgTGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIE1ldGFkYXRhT3B0aW9uczoge1xuICAgICAgICAgIEh0dHBUb2tlbnM6ICdyZXF1aXJlZCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19