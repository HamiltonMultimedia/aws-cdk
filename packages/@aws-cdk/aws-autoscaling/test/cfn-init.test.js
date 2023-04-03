"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const core_1 = require("@aws-cdk/core");
const autoscaling = require("../lib");
let stack;
let vpc;
let baseProps;
beforeEach(() => {
    stack = new core_1.Stack();
    vpc = new ec2.Vpc(stack, 'Vpc');
    baseProps = {
        vpc,
        machineImage: new ec2.AmazonLinuxImage(),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
        desiredCapacity: 5,
        minCapacity: 2,
    };
});
test('Signals.waitForAll uses desiredCapacity if available', () => {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
        ...baseProps,
        signals: autoscaling.Signals.waitForAll(),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
        CreationPolicy: {
            ResourceSignal: {
                Count: 5,
            },
        },
    });
});
test('Signals.waitForAll uses minCapacity if desiredCapacity is not available', () => {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
        ...baseProps,
        desiredCapacity: undefined,
        signals: autoscaling.Signals.waitForAll(),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
        CreationPolicy: {
            ResourceSignal: {
                Count: 2,
            },
        },
    });
});
test('Signals.waitForMinCapacity uses minCapacity', () => {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
        ...baseProps,
        signals: autoscaling.Signals.waitForMinCapacity(),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
        CreationPolicy: {
            ResourceSignal: {
                Count: 2,
            },
        },
    });
});
test('Signals.waitForCount uses given number', () => {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
        ...baseProps,
        signals: autoscaling.Signals.waitForCount(10),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
        CreationPolicy: {
            ResourceSignal: {
                Count: 10,
            },
        },
    });
});
test('When signals are given appropriate IAM policy is added', () => {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
        ...baseProps,
        signals: autoscaling.Signals.waitForAll(),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: assertions_1.Match.arrayWith([{
                    Action: 'cloudformation:SignalResource',
                    Effect: 'Allow',
                    Resource: { Ref: 'AWS::StackId' },
                }]),
        },
    });
});
test('UpdatePolicy.rollingUpdate() still correctly inserts IgnoreUnmodifiedGroupSizeProperties', () => {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
        ...baseProps,
        updatePolicy: autoscaling.UpdatePolicy.rollingUpdate(),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
        UpdatePolicy: {
            AutoScalingScheduledAction: {
                IgnoreUnmodifiedGroupSizeProperties: true,
            },
        },
    });
});
test('UpdatePolicy.rollingUpdate() with Signals uses those defaults', () => {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
        ...baseProps,
        signals: autoscaling.Signals.waitForCount(10, {
            minSuccessPercentage: 50,
            timeout: core_1.Duration.minutes(30),
        }),
        updatePolicy: autoscaling.UpdatePolicy.rollingUpdate(),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
        CreationPolicy: {
            AutoScalingCreationPolicy: {
                MinSuccessfulInstancesPercent: 50,
            },
            ResourceSignal: {
                Count: 10,
                Timeout: 'PT30M',
            },
        },
        UpdatePolicy: {
            AutoScalingRollingUpdate: {
                MinSuccessfulInstancesPercent: 50,
                PauseTime: 'PT30M',
                WaitOnResourceSignals: true,
            },
        },
    });
});
test('UpdatePolicy.rollingUpdate() without Signals', () => {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
        ...baseProps,
        updatePolicy: autoscaling.UpdatePolicy.rollingUpdate(),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
        UpdatePolicy: {
            AutoScalingRollingUpdate: {},
        },
    });
});
test('UpdatePolicy.replacingUpdate() renders correct UpdatePolicy', () => {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
        ...baseProps,
        updatePolicy: autoscaling.UpdatePolicy.replacingUpdate(),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
        UpdatePolicy: {
            AutoScalingReplacingUpdate: {
                WillReplace: true,
            },
        },
    });
});
test('Using init config in ASG leads to default updatepolicy', () => {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
        ...baseProps,
        init: ec2.CloudFormationInit.fromElements(ec2.InitCommand.shellCommand('echo hihi')),
        signals: autoscaling.Signals.waitForAll(),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::AutoScalingGroup', {
        UpdatePolicy: {
            AutoScalingRollingUpdate: assertions_1.Match.anyValue(),
        },
    });
});
test('Using init config in ASG leads to correct UserData and permissions', () => {
    // WHEN
    new autoscaling.AutoScalingGroup(stack, 'Asg', {
        ...baseProps,
        init: ec2.CloudFormationInit.fromElements(ec2.InitCommand.shellCommand('echo hihi')),
        signals: autoscaling.Signals.waitForAll(),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
        UserData: {
            'Fn::Base64': {
                'Fn::Join': ['', [
                        '#!/bin/bash\n# fingerprint: 593c357d7f305b75\n(\n  set +e\n  /opt/aws/bin/cfn-init -v --region ',
                        { Ref: 'AWS::Region' },
                        ' --stack ',
                        { Ref: 'AWS::StackName' },
                        ' --resource AsgASGD1D7B4E2 -c default\n  /opt/aws/bin/cfn-signal -e $? --region ',
                        { Ref: 'AWS::Region' },
                        ' --stack ',
                        { Ref: 'AWS::StackName' },
                        ' --resource AsgASGD1D7B4E2\n  cat /var/log/cfn-init.log >&2\n)',
                    ]],
            },
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: assertions_1.Match.arrayWith([{
                    Action: ['cloudformation:DescribeStackResource', 'cloudformation:SignalResource'],
                    Effect: 'Allow',
                    Resource: { Ref: 'AWS::StackId' },
                }]),
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWluaXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNmbi1pbml0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsd0NBQXdDO0FBQ3hDLHdDQUFnRDtBQUNoRCxzQ0FBc0M7QUFVdEMsSUFBSSxLQUFZLENBQUM7QUFDakIsSUFBSSxHQUFZLENBQUM7QUFDakIsSUFBSSxTQUFvQixDQUFDO0FBRXpCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7SUFDZCxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUNwQixHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUVoQyxTQUFTLEdBQUc7UUFDVixHQUFHO1FBQ0gsWUFBWSxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixFQUFFO1FBQ3hDLFlBQVksRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztRQUMvRSxlQUFlLEVBQUUsQ0FBQztRQUNsQixXQUFXLEVBQUUsQ0FBQztLQUNmLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7SUFDaEUsT0FBTztJQUNQLElBQUksV0FBVyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7UUFDN0MsR0FBRyxTQUFTO1FBQ1osT0FBTyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO0tBQzFDLENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsb0NBQW9DLEVBQUU7UUFDMUUsY0FBYyxFQUFFO1lBQ2QsY0FBYyxFQUFFO2dCQUNkLEtBQUssRUFBRSxDQUFD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RUFBRSwrQkFBK0IsQ0FBQztvQkFDakYsTUFBTSxFQUFFLE9BQU87b0JBQ2YsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLGNBQWMsRUFBRTtpQkFDbEMsQ0FBQyxDQUFDO1NBQ0o7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IHsgRHVyYXRpb24sIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBhdXRvc2NhbGluZyBmcm9tICcuLi9saWInO1xuXG5pbnRlcmZhY2UgQmFzZVByb3BzIHtcbiAgdnBjOiBlYzIuVnBjO1xuICBtYWNoaW5lSW1hZ2U6IGVjMi5JTWFjaGluZUltYWdlO1xuICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGU7XG4gIGRlc2lyZWRDYXBhY2l0eTogbnVtYmVyO1xuICBtaW5DYXBhY2l0eTogbnVtYmVyO1xufVxuXG5sZXQgc3RhY2s6IFN0YWNrO1xubGV0IHZwYzogZWMyLlZwYztcbmxldCBiYXNlUHJvcHM6IEJhc2VQcm9wcztcblxuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG5cbiAgYmFzZVByb3BzID0ge1xuICAgIHZwYyxcbiAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgZGVzaXJlZENhcGFjaXR5OiA1LFxuICAgIG1pbkNhcGFjaXR5OiAyLFxuICB9O1xufSk7XG5cbnRlc3QoJ1NpZ25hbHMud2FpdEZvckFsbCB1c2VzIGRlc2lyZWRDYXBhY2l0eSBpZiBhdmFpbGFibGUnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdBc2cnLCB7XG4gICAgLi4uYmFzZVByb3BzLFxuICAgIHNpZ25hbHM6IGF1dG9zY2FsaW5nLlNpZ25hbHMud2FpdEZvckFsbCgpLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgQ3JlYXRpb25Qb2xpY3k6IHtcbiAgICAgIFJlc291cmNlU2lnbmFsOiB7XG4gICAgICAgIENvdW50OiA1LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdTaWduYWxzLndhaXRGb3JBbGwgdXNlcyBtaW5DYXBhY2l0eSBpZiBkZXNpcmVkQ2FwYWNpdHkgaXMgbm90IGF2YWlsYWJsZScsICgpID0+IHtcbiAgLy8gV0hFTlxuICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ0FzZycsIHtcbiAgICAuLi5iYXNlUHJvcHMsXG4gICAgZGVzaXJlZENhcGFjaXR5OiB1bmRlZmluZWQsXG4gICAgc2lnbmFsczogYXV0b3NjYWxpbmcuU2lnbmFscy53YWl0Rm9yQWxsKCksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICBDcmVhdGlvblBvbGljeToge1xuICAgICAgUmVzb3VyY2VTaWduYWw6IHtcbiAgICAgICAgQ291bnQ6IDIsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1NpZ25hbHMud2FpdEZvck1pbkNhcGFjaXR5IHVzZXMgbWluQ2FwYWNpdHknLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdBc2cnLCB7XG4gICAgLi4uYmFzZVByb3BzLFxuICAgIHNpZ25hbHM6IGF1dG9zY2FsaW5nLlNpZ25hbHMud2FpdEZvck1pbkNhcGFjaXR5KCksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICBDcmVhdGlvblBvbGljeToge1xuICAgICAgUmVzb3VyY2VTaWduYWw6IHtcbiAgICAgICAgQ291bnQ6IDIsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1NpZ25hbHMud2FpdEZvckNvdW50IHVzZXMgZ2l2ZW4gbnVtYmVyJywgKCkgPT4ge1xuICAvLyBXSEVOXG4gIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnQXNnJywge1xuICAgIC4uLmJhc2VQcm9wcyxcbiAgICBzaWduYWxzOiBhdXRvc2NhbGluZy5TaWduYWxzLndhaXRGb3JDb3VudCgxMCksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICBDcmVhdGlvblBvbGljeToge1xuICAgICAgUmVzb3VyY2VTaWduYWw6IHtcbiAgICAgICAgQ291bnQ6IDEwLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdXaGVuIHNpZ25hbHMgYXJlIGdpdmVuIGFwcHJvcHJpYXRlIElBTSBwb2xpY3kgaXMgYWRkZWQnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdBc2cnLCB7XG4gICAgLi4uYmFzZVByb3BzLFxuICAgIHNpZ25hbHM6IGF1dG9zY2FsaW5nLlNpZ25hbHMud2FpdEZvckFsbCgpLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbe1xuICAgICAgICBBY3Rpb246ICdjbG91ZGZvcm1hdGlvbjpTaWduYWxSZXNvdXJjZScsXG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUmVzb3VyY2U6IHsgUmVmOiAnQVdTOjpTdGFja0lkJyB9LFxuICAgICAgfV0pLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1VwZGF0ZVBvbGljeS5yb2xsaW5nVXBkYXRlKCkgc3RpbGwgY29ycmVjdGx5IGluc2VydHMgSWdub3JlVW5tb2RpZmllZEdyb3VwU2l6ZVByb3BlcnRpZXMnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdBc2cnLCB7XG4gICAgLi4uYmFzZVByb3BzLFxuICAgIHVwZGF0ZVBvbGljeTogYXV0b3NjYWxpbmcuVXBkYXRlUG9saWN5LnJvbGxpbmdVcGRhdGUoKSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgIFVwZGF0ZVBvbGljeToge1xuICAgICAgQXV0b1NjYWxpbmdTY2hlZHVsZWRBY3Rpb246IHtcbiAgICAgICAgSWdub3JlVW5tb2RpZmllZEdyb3VwU2l6ZVByb3BlcnRpZXM6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1VwZGF0ZVBvbGljeS5yb2xsaW5nVXBkYXRlKCkgd2l0aCBTaWduYWxzIHVzZXMgdGhvc2UgZGVmYXVsdHMnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdBc2cnLCB7XG4gICAgLi4uYmFzZVByb3BzLFxuICAgIHNpZ25hbHM6IGF1dG9zY2FsaW5nLlNpZ25hbHMud2FpdEZvckNvdW50KDEwLCB7XG4gICAgICBtaW5TdWNjZXNzUGVyY2VudGFnZTogNTAsXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5taW51dGVzKDMwKSxcbiAgICB9KSxcbiAgICB1cGRhdGVQb2xpY3k6IGF1dG9zY2FsaW5nLlVwZGF0ZVBvbGljeS5yb2xsaW5nVXBkYXRlKCksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICBDcmVhdGlvblBvbGljeToge1xuICAgICAgQXV0b1NjYWxpbmdDcmVhdGlvblBvbGljeToge1xuICAgICAgICBNaW5TdWNjZXNzZnVsSW5zdGFuY2VzUGVyY2VudDogNTAsXG4gICAgICB9LFxuICAgICAgUmVzb3VyY2VTaWduYWw6IHtcbiAgICAgICAgQ291bnQ6IDEwLFxuICAgICAgICBUaW1lb3V0OiAnUFQzME0nLFxuICAgICAgfSxcbiAgICB9LFxuICAgIFVwZGF0ZVBvbGljeToge1xuICAgICAgQXV0b1NjYWxpbmdSb2xsaW5nVXBkYXRlOiB7XG4gICAgICAgIE1pblN1Y2Nlc3NmdWxJbnN0YW5jZXNQZXJjZW50OiA1MCxcbiAgICAgICAgUGF1c2VUaW1lOiAnUFQzME0nLFxuICAgICAgICBXYWl0T25SZXNvdXJjZVNpZ25hbHM6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1VwZGF0ZVBvbGljeS5yb2xsaW5nVXBkYXRlKCkgd2l0aG91dCBTaWduYWxzJywgKCkgPT4ge1xuICAvLyBXSEVOXG4gIG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnQXNnJywge1xuICAgIC4uLmJhc2VQcm9wcyxcbiAgICB1cGRhdGVQb2xpY3k6IGF1dG9zY2FsaW5nLlVwZGF0ZVBvbGljeS5yb2xsaW5nVXBkYXRlKCksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICBVcGRhdGVQb2xpY3k6IHtcbiAgICAgIEF1dG9TY2FsaW5nUm9sbGluZ1VwZGF0ZToge1xuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdVcGRhdGVQb2xpY3kucmVwbGFjaW5nVXBkYXRlKCkgcmVuZGVycyBjb3JyZWN0IFVwZGF0ZVBvbGljeScsICgpID0+IHtcbiAgLy8gV0hFTlxuICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ0FzZycsIHtcbiAgICAuLi5iYXNlUHJvcHMsXG4gICAgdXBkYXRlUG9saWN5OiBhdXRvc2NhbGluZy5VcGRhdGVQb2xpY3kucmVwbGFjaW5nVXBkYXRlKCksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgICBVcGRhdGVQb2xpY3k6IHtcbiAgICAgIEF1dG9TY2FsaW5nUmVwbGFjaW5nVXBkYXRlOiB7XG4gICAgICAgIFdpbGxSZXBsYWNlOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdVc2luZyBpbml0IGNvbmZpZyBpbiBBU0cgbGVhZHMgdG8gZGVmYXVsdCB1cGRhdGVwb2xpY3knLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdBc2cnLCB7XG4gICAgLi4uYmFzZVByb3BzLFxuICAgIGluaXQ6IGVjMi5DbG91ZEZvcm1hdGlvbkluaXQuZnJvbUVsZW1lbnRzKFxuICAgICAgZWMyLkluaXRDb21tYW5kLnNoZWxsQ29tbWFuZCgnZWNobyBoaWhpJyksXG4gICAgKSxcbiAgICBzaWduYWxzOiBhdXRvc2NhbGluZy5TaWduYWxzLndhaXRGb3JBbGwoKSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkF1dG9TY2FsaW5nOjpBdXRvU2NhbGluZ0dyb3VwJywge1xuICAgIFVwZGF0ZVBvbGljeToge1xuICAgICAgQXV0b1NjYWxpbmdSb2xsaW5nVXBkYXRlOiBNYXRjaC5hbnlWYWx1ZSgpLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1VzaW5nIGluaXQgY29uZmlnIGluIEFTRyBsZWFkcyB0byBjb3JyZWN0IFVzZXJEYXRhIGFuZCBwZXJtaXNzaW9ucycsICgpID0+IHtcbiAgLy8gV0hFTlxuICBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ0FzZycsIHtcbiAgICAuLi5iYXNlUHJvcHMsXG4gICAgaW5pdDogZWMyLkNsb3VkRm9ybWF0aW9uSW5pdC5mcm9tRWxlbWVudHMoXG4gICAgICBlYzIuSW5pdENvbW1hbmQuc2hlbGxDb21tYW5kKCdlY2hvIGhpaGknKSxcbiAgICApLFxuICAgIHNpZ25hbHM6IGF1dG9zY2FsaW5nLlNpZ25hbHMud2FpdEZvckFsbCgpLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uJywge1xuICAgIFVzZXJEYXRhOiB7XG4gICAgICAnRm46OkJhc2U2NCc6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgJyMhL2Jpbi9iYXNoXFxuIyBmaW5nZXJwcmludDogNTkzYzM1N2Q3ZjMwNWI3NVxcbihcXG4gIHNldCArZVxcbiAgL29wdC9hd3MvYmluL2Nmbi1pbml0IC12IC0tcmVnaW9uICcsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAnIC0tc3RhY2sgJyxcbiAgICAgICAgICB7IFJlZjogJ0FXUzo6U3RhY2tOYW1lJyB9LFxuICAgICAgICAgICcgLS1yZXNvdXJjZSBBc2dBU0dEMUQ3QjRFMiAtYyBkZWZhdWx0XFxuICAvb3B0L2F3cy9iaW4vY2ZuLXNpZ25hbCAtZSAkPyAtLXJlZ2lvbiAnLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgJyAtLXN0YWNrICcsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlN0YWNrTmFtZScgfSxcbiAgICAgICAgICAnIC0tcmVzb3VyY2UgQXNnQVNHRDFEN0I0RTJcXG4gIGNhdCAvdmFyL2xvZy9jZm4taW5pdC5sb2cgPiYyXFxuKScsXG4gICAgICAgIF1dLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW3tcbiAgICAgICAgQWN0aW9uOiBbJ2Nsb3VkZm9ybWF0aW9uOkRlc2NyaWJlU3RhY2tSZXNvdXJjZScsICdjbG91ZGZvcm1hdGlvbjpTaWduYWxSZXNvdXJjZSddLFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFJlc291cmNlOiB7IFJlZjogJ0FXUzo6U3RhY2tJZCcgfSxcbiAgICAgIH1dKSxcbiAgICB9LFxuICB9KTtcbn0pO1xuIl19