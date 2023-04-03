"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const util_1 = require("./util");
const ga = require("../lib");
test('create accelerator', () => {
    // GIVEN
    const { stack } = util_1.testFixture();
    // WHEN
    new ga.Accelerator(stack, 'Accelerator');
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::GlobalAccelerator::Accelerator', {
        Enabled: true,
    });
});
test('create listener', () => {
    // GIVEN
    const { stack } = util_1.testFixture();
    // WHEN
    const accelerator = new ga.Accelerator(stack, 'Accelerator');
    new ga.Listener(stack, 'Listener', {
        accelerator,
        portRanges: [
            {
                fromPort: 80,
                toPort: 80,
            },
        ],
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::GlobalAccelerator::Listener', {
        AcceleratorArn: {
            'Fn::GetAtt': [
                'Accelerator8EB0B6B1',
                'AcceleratorArn',
            ],
        },
        PortRanges: [
            {
                FromPort: 80,
                ToPort: 80,
            },
        ],
        Protocol: 'TCP',
        ClientAffinity: 'NONE',
    });
});
test('toPort defaults to fromPort if left out', () => {
    // GIVEN
    const { stack } = util_1.testFixture();
    // WHEN
    const accelerator = new ga.Accelerator(stack, 'Accelerator');
    accelerator.addListener('Listener', {
        portRanges: [
            { fromPort: 123 },
        ],
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::GlobalAccelerator::Listener', {
        PortRanges: [
            {
                FromPort: 123,
                ToPort: 123,
            },
        ],
    });
});
test('create endpointgroup', () => {
    // GIVEN
    const { stack } = util_1.testFixture();
    // WHEN
    const accelerator = new ga.Accelerator(stack, 'Accelerator');
    const listener = new ga.Listener(stack, 'Listener', {
        accelerator,
        portRanges: [
            {
                fromPort: 80,
                toPort: 80,
            },
        ],
    });
    new ga.EndpointGroup(stack, 'Group', { listener });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::GlobalAccelerator::EndpointGroup', {
        EndpointGroupRegion: {
            Ref: 'AWS::Region',
        },
        ListenerArn: {
            'Fn::GetAtt': [
                'Listener828B0E81',
                'ListenerArn',
            ],
        },
    });
});
test('endpointgroup region is the first endpoint\'s region', () => {
    // GIVEN
    const { stack } = util_1.testFixture();
    // WHEN
    const accelerator = new ga.Accelerator(stack, 'Accelerator');
    const listener = new ga.Listener(stack, 'Listener', {
        accelerator,
        portRanges: [{ fromPort: 80 }],
    });
    listener.addEndpointGroup('Group', {
        endpoints: [
            new ga.RawEndpoint({
                endpointId: 'x-123',
                region: 'us-bla-5',
            }),
        ],
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::GlobalAccelerator::EndpointGroup', {
        EndpointGroupRegion: 'us-bla-5',
    });
});
test('endpointgroup with all parameters', () => {
    // GIVEN
    const { stack } = util_1.testFixture();
    // WHEN
    const accelerator = new ga.Accelerator(stack, 'Accelerator');
    const listener = accelerator.addListener('Listener', {
        portRanges: [{ fromPort: 80 }],
    });
    listener.addEndpointGroup('Group', {
        region: 'us-bla-5',
        healthCheckInterval: core_1.Duration.seconds(10),
        healthCheckPath: '/ping',
        healthCheckPort: 123,
        healthCheckProtocol: ga.HealthCheckProtocol.HTTPS,
        healthCheckThreshold: 23,
        trafficDialPercentage: 86,
        portOverrides: [
            {
                listenerPort: 80,
                endpointPort: 8080,
            },
        ],
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::GlobalAccelerator::EndpointGroup', {
        EndpointGroupRegion: 'us-bla-5',
        HealthCheckIntervalSeconds: 10,
        HealthCheckPath: '/ping',
        HealthCheckPort: 123,
        HealthCheckProtocol: 'HTTPS',
        PortOverrides: [
            {
                EndpointPort: 8080,
                ListenerPort: 80,
            },
        ],
        ThresholdCount: 23,
        TrafficDialPercentage: 86,
    });
});
test('addEndpoint', () => {
    // GIVEN
    const { stack } = util_1.testFixture();
    // WHEN
    const accelerator = new ga.Accelerator(stack, 'Accelerator');
    const listener = new ga.Listener(stack, 'Listener', {
        accelerator,
        portRanges: [
            {
                fromPort: 80,
                toPort: 80,
            },
        ],
    });
    listener.addEndpointGroup('Group', {
        endpoints: [
            new ga.RawEndpoint({
                endpointId: 'i-123',
                preserveClientIp: true,
                weight: 30,
            }),
        ],
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::GlobalAccelerator::EndpointGroup', {
        EndpointConfigurations: [
            {
                EndpointId: 'i-123',
                ClientIPPreservationEnabled: true,
                Weight: 30,
            },
        ],
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsYWNjZWxlcmF0b3IudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdsb2JhbGFjY2VsZXJhdG9yLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msd0NBQXlDO0FBQ3pDLGlDQUFxQztBQUNyQyw2QkFBNkI7QUFFN0IsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtJQUM5QixRQUFRO0lBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLGtCQUFXLEVBQUUsQ0FBQztJQUVoQyxPQUFPO0lBQ1AsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztJQUV6QyxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUNBQXFDLEVBQUU7UUFDckYsT0FBTyxFQUFFLElBQUk7S0FDZCxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7SUFDM0IsUUFBUTtJQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxrQkFBVyxFQUFFLENBQUM7SUFFaEMsT0FBTztJQUNQLE1BQU0sV0FBVyxHQUFHLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDN0QsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7UUFDakMsV0FBVztRQUNYLFVBQVUsRUFBRTtZQUNWO2dCQUNFLFFBQVEsRUFBRSxFQUFFO2dCQUNaLE1BQU0sRUFBRSxFQUFFO2FBQ1g7U0FDRjtLQUNGLENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQ0FBa0MsRUFBRTtRQUNsRixjQUFjLEVBQUU7WUFDZCxZQUFZLEVB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bnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IER1cmF0aW9uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyB0ZXN0Rml4dHVyZSB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgKiBhcyBnYSBmcm9tICcuLi9saWInO1xuXG50ZXN0KCdjcmVhdGUgYWNjZWxlcmF0b3InLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgZ2EuQWNjZWxlcmF0b3Ioc3RhY2ssICdBY2NlbGVyYXRvcicpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6R2xvYmFsQWNjZWxlcmF0b3I6OkFjY2VsZXJhdG9yJywge1xuICAgIEVuYWJsZWQ6IHRydWUsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2NyZWF0ZSBsaXN0ZW5lcicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IGFjY2VsZXJhdG9yID0gbmV3IGdhLkFjY2VsZXJhdG9yKHN0YWNrLCAnQWNjZWxlcmF0b3InKTtcbiAgbmV3IGdhLkxpc3RlbmVyKHN0YWNrLCAnTGlzdGVuZXInLCB7XG4gICAgYWNjZWxlcmF0b3IsXG4gICAgcG9ydFJhbmdlczogW1xuICAgICAge1xuICAgICAgICBmcm9tUG9ydDogODAsXG4gICAgICAgIHRvUG9ydDogODAsXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6R2xvYmFsQWNjZWxlcmF0b3I6Okxpc3RlbmVyJywge1xuICAgIEFjY2VsZXJhdG9yQXJuOiB7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ0FjY2VsZXJhdG9yOEVCMEI2QjEnLFxuICAgICAgICAnQWNjZWxlcmF0b3JBcm4nLFxuICAgICAgXSxcbiAgICB9LFxuICAgIFBvcnRSYW5nZXM6IFtcbiAgICAgIHtcbiAgICAgICAgRnJvbVBvcnQ6IDgwLFxuICAgICAgICBUb1BvcnQ6IDgwLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFByb3RvY29sOiAnVENQJyxcbiAgICBDbGllbnRBZmZpbml0eTogJ05PTkUnLFxuICB9KTtcbn0pO1xuXG50ZXN0KCd0b1BvcnQgZGVmYXVsdHMgdG8gZnJvbVBvcnQgaWYgbGVmdCBvdXQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBhY2NlbGVyYXRvciA9IG5ldyBnYS5BY2NlbGVyYXRvcihzdGFjaywgJ0FjY2VsZXJhdG9yJyk7XG4gIGFjY2VsZXJhdG9yLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICBwb3J0UmFuZ2VzOiBbXG4gICAgICB7IGZyb21Qb3J0OiAxMjMgfSxcbiAgICBdLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6Okdsb2JhbEFjY2VsZXJhdG9yOjpMaXN0ZW5lcicsIHtcbiAgICBQb3J0UmFuZ2VzOiBbXG4gICAgICB7XG4gICAgICAgIEZyb21Qb3J0OiAxMjMsXG4gICAgICAgIFRvUG9ydDogMTIzLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdjcmVhdGUgZW5kcG9pbnRncm91cCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IGFjY2VsZXJhdG9yID0gbmV3IGdhLkFjY2VsZXJhdG9yKHN0YWNrLCAnQWNjZWxlcmF0b3InKTtcbiAgY29uc3QgbGlzdGVuZXIgPSBuZXcgZ2EuTGlzdGVuZXIoc3RhY2ssICdMaXN0ZW5lcicsIHtcbiAgICBhY2NlbGVyYXRvcixcbiAgICBwb3J0UmFuZ2VzOiBbXG4gICAgICB7XG4gICAgICAgIGZyb21Qb3J0OiA4MCxcbiAgICAgICAgdG9Qb3J0OiA4MCxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG4gIG5ldyBnYS5FbmRwb2ludEdyb3VwKHN0YWNrLCAnR3JvdXAnLCB7IGxpc3RlbmVyIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6R2xvYmFsQWNjZWxlcmF0b3I6OkVuZHBvaW50R3JvdXAnLCB7XG4gICAgRW5kcG9pbnRHcm91cFJlZ2lvbjoge1xuICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgIH0sXG4gICAgTGlzdGVuZXJBcm46IHtcbiAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAnTGlzdGVuZXI4MjhCMEU4MScsXG4gICAgICAgICdMaXN0ZW5lckFybicsXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2VuZHBvaW50Z3JvdXAgcmVnaW9uIGlzIHRoZSBmaXJzdCBlbmRwb2ludFxcJ3MgcmVnaW9uJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgYWNjZWxlcmF0b3IgPSBuZXcgZ2EuQWNjZWxlcmF0b3Ioc3RhY2ssICdBY2NlbGVyYXRvcicpO1xuICBjb25zdCBsaXN0ZW5lciA9IG5ldyBnYS5MaXN0ZW5lcihzdGFjaywgJ0xpc3RlbmVyJywge1xuICAgIGFjY2VsZXJhdG9yLFxuICAgIHBvcnRSYW5nZXM6IFt7IGZyb21Qb3J0OiA4MCB9XSxcbiAgfSk7XG4gIGxpc3RlbmVyLmFkZEVuZHBvaW50R3JvdXAoJ0dyb3VwJywge1xuICAgIGVuZHBvaW50czogW1xuICAgICAgbmV3IGdhLlJhd0VuZHBvaW50KHtcbiAgICAgICAgZW5kcG9pbnRJZDogJ3gtMTIzJyxcbiAgICAgICAgcmVnaW9uOiAndXMtYmxhLTUnLFxuICAgICAgfSksXG4gICAgXSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpHbG9iYWxBY2NlbGVyYXRvcjo6RW5kcG9pbnRHcm91cCcsIHtcbiAgICBFbmRwb2ludEdyb3VwUmVnaW9uOiAndXMtYmxhLTUnLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdlbmRwb2ludGdyb3VwIHdpdGggYWxsIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBhY2NlbGVyYXRvciA9IG5ldyBnYS5BY2NlbGVyYXRvcihzdGFjaywgJ0FjY2VsZXJhdG9yJyk7XG4gIGNvbnN0IGxpc3RlbmVyID0gYWNjZWxlcmF0b3IuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywge1xuICAgIHBvcnRSYW5nZXM6IFt7IGZyb21Qb3J0OiA4MCB9XSxcbiAgfSk7XG4gIGxpc3RlbmVyLmFkZEVuZHBvaW50R3JvdXAoJ0dyb3VwJywge1xuICAgIHJlZ2lvbjogJ3VzLWJsYS01JyxcbiAgICBoZWFsdGhDaGVja0ludGVydmFsOiBEdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICBoZWFsdGhDaGVja1BhdGg6ICcvcGluZycsXG4gICAgaGVhbHRoQ2hlY2tQb3J0OiAxMjMsXG4gICAgaGVhbHRoQ2hlY2tQcm90b2NvbDogZ2EuSGVhbHRoQ2hlY2tQcm90b2NvbC5IVFRQUyxcbiAgICBoZWFsdGhDaGVja1RocmVzaG9sZDogMjMsXG4gICAgdHJhZmZpY0RpYWxQZXJjZW50YWdlOiA4NixcbiAgICBwb3J0T3ZlcnJpZGVzOiBbXG4gICAgICB7XG4gICAgICAgIGxpc3RlbmVyUG9ydDogODAsXG4gICAgICAgIGVuZHBvaW50UG9ydDogODA4MCxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpHbG9iYWxBY2NlbGVyYXRvcjo6RW5kcG9pbnRHcm91cCcsIHtcbiAgICBFbmRwb2ludEdyb3VwUmVnaW9uOiAndXMtYmxhLTUnLFxuICAgIEhlYWx0aENoZWNrSW50ZXJ2YWxTZWNvbmRzOiAxMCxcbiAgICBIZWFsdGhDaGVja1BhdGg6ICcvcGluZycsXG4gICAgSGVhbHRoQ2hlY2tQb3J0OiAxMjMsXG4gICAgSGVhbHRoQ2hlY2tQcm90b2NvbDogJ0hUVFBTJyxcbiAgICBQb3J0T3ZlcnJpZGVzOiBbXG4gICAgICB7XG4gICAgICAgIEVuZHBvaW50UG9ydDogODA4MCxcbiAgICAgICAgTGlzdGVuZXJQb3J0OiA4MCxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBUaHJlc2hvbGRDb3VudDogMjMsXG4gICAgVHJhZmZpY0RpYWxQZXJjZW50YWdlOiA4NixcbiAgfSk7XG59KTtcblxudGVzdCgnYWRkRW5kcG9pbnQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBhY2NlbGVyYXRvciA9IG5ldyBnYS5BY2NlbGVyYXRvcihzdGFjaywgJ0FjY2VsZXJhdG9yJyk7XG4gIGNvbnN0IGxpc3RlbmVyID0gbmV3IGdhLkxpc3RlbmVyKHN0YWNrLCAnTGlzdGVuZXInLCB7XG4gICAgYWNjZWxlcmF0b3IsXG4gICAgcG9ydFJhbmdlczogW1xuICAgICAge1xuICAgICAgICBmcm9tUG9ydDogODAsXG4gICAgICAgIHRvUG9ydDogODAsXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xuXG5cbiAgbGlzdGVuZXIuYWRkRW5kcG9pbnRHcm91cCgnR3JvdXAnLCB7XG4gICAgZW5kcG9pbnRzOiBbXG4gICAgICBuZXcgZ2EuUmF3RW5kcG9pbnQoe1xuICAgICAgICBlbmRwb2ludElkOiAnaS0xMjMnLFxuICAgICAgICBwcmVzZXJ2ZUNsaWVudElwOiB0cnVlLFxuICAgICAgICB3ZWlnaHQ6IDMwLFxuICAgICAgfSksXG4gICAgXSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpHbG9iYWxBY2NlbGVyYXRvcjo6RW5kcG9pbnRHcm91cCcsIHtcbiAgICBFbmRwb2ludENvbmZpZ3VyYXRpb25zOiBbXG4gICAgICB7XG4gICAgICAgIEVuZHBvaW50SWQ6ICdpLTEyMycsXG4gICAgICAgIENsaWVudElQUHJlc2VydmF0aW9uRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgV2VpZ2h0OiAzMCxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTsiXX0=