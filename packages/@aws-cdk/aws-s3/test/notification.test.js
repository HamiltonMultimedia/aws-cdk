"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const s3 = require("../lib");
describe('notification', () => {
    test('when notification is added a custom s3 bucket notification resource is provisioned', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'MyBucket');
        bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
            bind: () => ({
                arn: 'ARN',
                type: s3.BucketNotificationDestinationType.TOPIC,
            }),
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
            NotificationConfiguration: {
                TopicConfigurations: [
                    {
                        Events: [
                            's3:ObjectCreated:*',
                        ],
                        TopicArn: 'ARN',
                    },
                ],
            },
        });
    });
    test('can specify a custom role for the notifications handler of imported buckets', () => {
        const stack = new cdk.Stack();
        const importedRole = iam.Role.fromRoleArn(stack, 'role', 'arn:aws:iam::111111111111:role/DevsNotAllowedToTouch');
        const bucket = s3.Bucket.fromBucketAttributes(stack, 'MyBucket', {
            bucketName: 'foo-bar',
            notificationsHandlerRole: importedRole,
        });
        bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
            bind: () => ({
                arn: 'ARN',
                type: s3.BucketNotificationDestinationType.TOPIC,
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Description: 'AWS CloudFormation handler for "Custom::S3BucketNotifications" resources (@aws-cdk/aws-s3)',
            Role: 'arn:aws:iam::111111111111:role/DevsNotAllowedToTouch',
        });
    });
    test('can specify prefix and suffix filter rules', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'MyBucket');
        bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
            bind: () => ({
                arn: 'ARN',
                type: s3.BucketNotificationDestinationType.TOPIC,
            }),
        }, { prefix: 'images/', suffix: '.png' });
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
            NotificationConfiguration: {
                TopicConfigurations: [
                    {
                        Events: [
                            's3:ObjectCreated:*',
                        ],
                        Filter: {
                            Key: {
                                FilterRules: [
                                    {
                                        Name: 'suffix',
                                        Value: '.png',
                                    },
                                    {
                                        Name: 'prefix',
                                        Value: 'images/',
                                    },
                                ],
                            },
                        },
                        TopicArn: 'ARN',
                    },
                ],
            },
        });
    });
    test('the notification lambda handler must depend on the role to prevent executing too early', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'MyBucket');
        bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
            bind: () => ({
                arn: 'ARN',
                type: s3.BucketNotificationDestinationType.TOPIC,
            }),
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Function', {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Role: {
                    'Fn::GetAtt': [
                        'BucketNotificationsHandler050a0587b7544547bf325f094a3db834RoleB6FB88EC',
                        'Arn',
                    ],
                },
            },
            DependsOn: ['BucketNotificationsHandler050a0587b7544547bf325f094a3db834RoleDefaultPolicy2CF63D36',
                'BucketNotificationsHandler050a0587b7544547bf325f094a3db834RoleB6FB88EC'],
        });
    });
    test('throws with multiple prefix rules in a filter', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'MyBucket');
        expect(() => bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
            bind: () => ({
                arn: 'ARN',
                type: s3.BucketNotificationDestinationType.TOPIC,
            }),
        }, { prefix: 'images/' }, { prefix: 'archive/' })).toThrow(/prefix rule/);
    });
    test('throws with multiple suffix rules in a filter', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'MyBucket');
        expect(() => bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
            bind: () => ({
                arn: 'ARN',
                type: s3.BucketNotificationDestinationType.TOPIC,
            }),
        }, { suffix: '.png' }, { suffix: '.zip' })).toThrow(/suffix rule/);
    });
    test('EventBridge notification custom resource', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new s3.Bucket(stack, 'MyBucket', {
            eventBridgeEnabled: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
            NotificationConfiguration: {
                EventBridgeConfiguration: {},
            },
        });
    });
    test('check notifications handler runtime version', () => {
        const stack = new cdk.Stack();
        const importedRole = iam.Role.fromRoleArn(stack, 'role', 'arn:aws:iam::111111111111:role/DevsNotAllowedToTouch');
        const bucket = s3.Bucket.fromBucketAttributes(stack, 'MyBucket', {
            bucketName: 'foo-bar',
            notificationsHandlerRole: importedRole,
        });
        bucket.addEventNotification(s3.EventType.OBJECT_CREATED, {
            bind: () => ({
                arn: 'ARN',
                type: s3.BucketNotificationDestinationType.TOPIC,
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
            Runtime: 'python3.9',
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJub3RpZmljYXRpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLDZCQUE2QjtBQUU3QixRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUM1QixJQUFJLENBQUMsb0ZBQW9GLEVBQUUsR0FBRyxFQUFFO1FBQzlGLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFaEQsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFO1lBQ3ZELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUNYLEdBQUcsRUFBRSxLQUFLO2dCQUNWLElBQUksRUFBRSxFQUFFLENBQUMsaUNBQWlDLENBQUMsS0FBSzthQUNqRCxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLCtCQUErQixFQUFFO1lBQy9FLHlCQUF5QixFQUFFO2dCQUN6QixtQkFBbUIsRUFBRTtvQkFDbkI7d0JBQ0UsTUFBTSxFQUFFOzRCQUNOLG9CQUFvQjt5QkFDckI7d0JBQ0QsUUFBUSxFQUFFLEtBQUs7cUJBQ2hCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2RUFBNkUsRUFBRSxHQUFHLEVBQUU7UUFDdkYsTUFBTSxLQUFL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QUssRUFBRSxVQUFVLEVBQUU7WUFDL0QsVUFBVSxFQUFFLFNBQVM7WUFDckIsd0JBQXdCLEVBQUUsWUFBWTtTQUN2QyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUU7WUFDdkQsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ1gsR0FBRyxFQUFFLEtBQUs7Z0JBQ1YsSUFBSSxFQUFFLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQyxLQUFLO2FBQ2pELENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx1QkFBdUIsRUFBRTtZQUN2RSxPQUFPLEVBQUUsV0FBVztTQUNyQixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdub3RpZmljYXRpb24nLCAoKSA9PiB7XG4gIHRlc3QoJ3doZW4gbm90aWZpY2F0aW9uIGlzIGFkZGVkIGEgY3VzdG9tIHMzIGJ1Y2tldCBub3RpZmljYXRpb24gcmVzb3VyY2UgaXMgcHJvdmlzaW9uZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcblxuICAgIGJ1Y2tldC5hZGRFdmVudE5vdGlmaWNhdGlvbihzMy5FdmVudFR5cGUuT0JKRUNUX0NSRUFURUQsIHtcbiAgICAgIGJpbmQ6ICgpID0+ICh7XG4gICAgICAgIGFybjogJ0FSTicsXG4gICAgICAgIHR5cGU6IHMzLkJ1Y2tldE5vdGlmaWNhdGlvbkRlc3RpbmF0aW9uVHlwZS5UT1BJQyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIDEpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OlMzQnVja2V0Tm90aWZpY2F0aW9ucycsIHtcbiAgICAgIE5vdGlmaWNhdGlvbkNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgVG9waWNDb25maWd1cmF0aW9uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEV2ZW50czogW1xuICAgICAgICAgICAgICAnczM6T2JqZWN0Q3JlYXRlZDoqJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBUb3BpY0FybjogJ0FSTicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBzcGVjaWZ5IGEgY3VzdG9tIHJvbGUgZm9yIHRoZSBub3RpZmljYXRpb25zIGhhbmRsZXIgb2YgaW1wb3J0ZWQgYnVja2V0cycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGltcG9ydGVkUm9sZSA9IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHN0YWNrLCAncm9sZScsICdhcm46YXdzOmlhbTo6MTExMTExMTExMTExOnJvbGUvRGV2c05vdEFsbG93ZWRUb1RvdWNoJyk7XG5cbiAgICBjb25zdCBidWNrZXQgPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXMoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgICAgIGJ1Y2tldE5hbWU6ICdmb28tYmFyJyxcbiAgICAgIG5vdGlmaWNhdGlvbnNIYW5kbGVyUm9sZTogaW1wb3J0ZWRSb2xlLFxuICAgIH0pO1xuXG4gICAgYnVja2V0LmFkZEV2ZW50Tm90aWZpY2F0aW9uKHMzLkV2ZW50VHlwZS5PQkpFQ1RfQ1JFQVRFRCwge1xuICAgICAgYmluZDogKCkgPT4gKHtcbiAgICAgICAgYXJuOiAnQVJOJyxcbiAgICAgICAgdHlwZTogczMuQnVja2V0Tm90aWZpY2F0aW9uRGVzdGluYXRpb25UeXBlLlRPUElDLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgRGVzY3JpcHRpb246ICdBV1MgQ2xvdWRGb3JtYXRpb24gaGFuZGxlciBmb3IgXCJDdXN0b206OlMzQnVja2V0Tm90aWZpY2F0aW9uc1wiIHJlc291cmNlcyAoQGF3cy1jZGsvYXdzLXMzKScsXG4gICAgICBSb2xlOiAnYXJuOmF3czppYW06OjExMTExMTExMTExMTpyb2xlL0RldnNOb3RBbGxvd2VkVG9Ub3VjaCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBzcGVjaWZ5IHByZWZpeCBhbmQgc3VmZml4IGZpbHRlciBydWxlcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuXG4gICAgYnVja2V0LmFkZEV2ZW50Tm90aWZpY2F0aW9uKHMzLkV2ZW50VHlwZS5PQkpFQ1RfQ1JFQVRFRCwge1xuICAgICAgYmluZDogKCkgPT4gKHtcbiAgICAgICAgYXJuOiAnQVJOJyxcbiAgICAgICAgdHlwZTogczMuQnVja2V0Tm90aWZpY2F0aW9uRGVzdGluYXRpb25UeXBlLlRPUElDLFxuICAgICAgfSksXG4gICAgfSwgeyBwcmVmaXg6ICdpbWFnZXMvJywgc3VmZml4OiAnLnBuZycgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpTM0J1Y2tldE5vdGlmaWNhdGlvbnMnLCB7XG4gICAgICBOb3RpZmljYXRpb25Db25maWd1cmF0aW9uOiB7XG4gICAgICAgIFRvcGljQ29uZmlndXJhdGlvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBFdmVudHM6IFtcbiAgICAgICAgICAgICAgJ3MzOk9iamVjdENyZWF0ZWQ6KicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRmlsdGVyOiB7XG4gICAgICAgICAgICAgIEtleToge1xuICAgICAgICAgICAgICAgIEZpbHRlclJ1bGVzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIE5hbWU6ICdzdWZmaXgnLFxuICAgICAgICAgICAgICAgICAgICBWYWx1ZTogJy5wbmcnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgTmFtZTogJ3ByZWZpeCcsXG4gICAgICAgICAgICAgICAgICAgIFZhbHVlOiAnaW1hZ2VzLycsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgVG9waWNBcm46ICdBUk4nLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aGUgbm90aWZpY2F0aW9uIGxhbWJkYSBoYW5kbGVyIG11c3QgZGVwZW5kIG9uIHRoZSByb2xlIHRvIHByZXZlbnQgZXhlY3V0aW5nIHRvbyBlYXJseScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuXG4gICAgYnVja2V0LmFkZEV2ZW50Tm90aWZpY2F0aW9uKHMzLkV2ZW50VHlwZS5PQkpFQ1RfQ1JFQVRFRCwge1xuICAgICAgYmluZDogKCkgPT4gKHtcbiAgICAgICAgYXJuOiAnQVJOJyxcbiAgICAgICAgdHlwZTogczMuQnVja2V0Tm90aWZpY2F0aW9uRGVzdGluYXRpb25UeXBlLlRPUElDLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICBUeXBlOiAnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJyxcbiAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgUm9sZToge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0J1Y2tldE5vdGlmaWNhdGlvbnNIYW5kbGVyMDUwYTA1ODdiNzU0NDU0N2JmMzI1ZjA5NGEzZGI4MzRSb2xlQjZGQjg4RUMnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBEZXBlbmRzT246IFsnQnVja2V0Tm90aWZpY2F0aW9uc0hhbmRsZXIwNTBhMDU4N2I3NTQ0NTQ3YmYzMjVmMDk0YTNkYjgzNFJvbGVEZWZhdWx0UG9saWN5MkNGNjNEMzYnLFxuICAgICAgICAnQnVja2V0Tm90aWZpY2F0aW9uc0hhbmRsZXIwNTBhMDU4N2I3NTQ0NTQ3YmYzMjVmMDk0YTNkYjgzNFJvbGVCNkZCODhFQyddLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2l0aCBtdWx0aXBsZSBwcmVmaXggcnVsZXMgaW4gYSBmaWx0ZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcblxuICAgIGV4cGVjdCgoKSA9PiBidWNrZXQuYWRkRXZlbnROb3RpZmljYXRpb24oczMuRXZlbnRUeXBlLk9CSkVDVF9DUkVBVEVELCB7XG4gICAgICBiaW5kOiAoKSA9PiAoe1xuICAgICAgICBhcm46ICdBUk4nLFxuICAgICAgICB0eXBlOiBzMy5CdWNrZXROb3RpZmljYXRpb25EZXN0aW5hdGlvblR5cGUuVE9QSUMsXG4gICAgICB9KSxcbiAgICB9LCB7IHByZWZpeDogJ2ltYWdlcy8nIH0sIHsgcHJlZml4OiAnYXJjaGl2ZS8nIH0pKS50b1Rocm93KC9wcmVmaXggcnVsZS8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2l0aCBtdWx0aXBsZSBzdWZmaXggcnVsZXMgaW4gYSBmaWx0ZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcblxuICAgIGV4cGVjdCgoKSA9PiBidWNrZXQuYWRkRXZlbnROb3RpZmljYXRpb24oczMuRXZlbnRUeXBlLk9CSkVDVF9DUkVBVEVELCB7XG4gICAgICBiaW5kOiAoKSA9PiAoe1xuICAgICAgICBhcm46ICdBUk4nLFxuICAgICAgICB0eXBlOiBzMy5CdWNrZXROb3RpZmljYXRpb25EZXN0aW5hdGlvblR5cGUuVE9QSUMsXG4gICAgICB9KSxcbiAgICB9LCB7IHN1ZmZpeDogJy5wbmcnIH0sIHsgc3VmZml4OiAnLnppcCcgfSkpLnRvVGhyb3coL3N1ZmZpeCBydWxlLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0V2ZW50QnJpZGdlIG5vdGlmaWNhdGlvbiBjdXN0b20gcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gICAgICBldmVudEJyaWRnZUVuYWJsZWQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIDEpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OlMzQnVja2V0Tm90aWZpY2F0aW9ucycsIHtcbiAgICAgIE5vdGlmaWNhdGlvbkNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRXZlbnRCcmlkZ2VDb25maWd1cmF0aW9uOiB7fSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuICB0ZXN0KCdjaGVjayBub3RpZmljYXRpb25zIGhhbmRsZXIgcnVudGltZSB2ZXJzaW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgaW1wb3J0ZWRSb2xlID0gaWFtLlJvbGUuZnJvbVJvbGVBcm4oc3RhY2ssICdyb2xlJywgJ2Fybjphd3M6aWFtOjoxMTExMTExMTExMTE6cm9sZS9EZXZzTm90QWxsb3dlZFRvVG91Y2gnKTtcblxuICAgIGNvbnN0IGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyhzdGFjaywgJ015QnVja2V0Jywge1xuICAgICAgYnVja2V0TmFtZTogJ2Zvby1iYXInLFxuICAgICAgbm90aWZpY2F0aW9uc0hhbmRsZXJSb2xlOiBpbXBvcnRlZFJvbGUsXG4gICAgfSk7XG5cbiAgICBidWNrZXQuYWRkRXZlbnROb3RpZmljYXRpb24oczMuRXZlbnRUeXBlLk9CSkVDVF9DUkVBVEVELCB7XG4gICAgICBiaW5kOiAoKSA9PiAoe1xuICAgICAgICBhcm46ICdBUk4nLFxuICAgICAgICB0eXBlOiBzMy5CdWNrZXROb3RpZmljYXRpb25EZXN0aW5hdGlvblR5cGUuVE9QSUMsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgICBSdW50aW1lOiAncHl0aG9uMy45JyxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==