"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const lib_1 = require("../lib");
class CompositeAlarmIntegrationTest extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const testMetric = new lib_1.Metric({
            namespace: 'CDK/Test',
            metricName: 'Metric',
        });
        const alarm1 = new lib_1.Alarm(this, 'Alarm1', {
            metric: testMetric,
            threshold: 100,
            evaluationPeriods: 3,
        });
        const alarm2 = new lib_1.Alarm(this, 'Alarm2', {
            metric: testMetric,
            threshold: 1000,
            evaluationPeriods: 3,
        });
        const alarm3 = new lib_1.Alarm(this, 'Alarm3', {
            metric: testMetric,
            threshold: 10000,
            evaluationPeriods: 3,
        });
        const alarm4 = new lib_1.Alarm(this, 'Alarm4', {
            metric: testMetric,
            threshold: 100000,
            evaluationPeriods: 3,
        });
        const alarm5 = new lib_1.Alarm(this, 'Alarm5', {
            alarmName: 'Alarm with space in name',
            metric: testMetric,
            threshold: 100000,
            evaluationPeriods: 3,
        });
        const alarmRule = lib_1.AlarmRule.anyOf(lib_1.AlarmRule.allOf(lib_1.AlarmRule.anyOf(alarm1, lib_1.AlarmRule.fromAlarm(alarm2, lib_1.AlarmState.OK), alarm3, alarm5), lib_1.AlarmRule.not(lib_1.AlarmRule.fromAlarm(alarm4, lib_1.AlarmState.INSUFFICIENT_DATA))), lib_1.AlarmRule.fromBoolean(false));
        new lib_1.CompositeAlarm(this, 'CompositeAlarm', {
            alarmRule,
            actionsSuppressor: alarm5,
        });
    }
}
const app = new core_1.App();
new integ_tests_1.IntegTest(app, 'cdk-integ-composite-alarm', {
    testCases: [new CompositeAlarmIntegrationTest(app, 'CompositeAlarmIntegrationTest')],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY29tcG9zaXRlLWFsYXJtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY29tcG9zaXRlLWFsYXJtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXVEO0FBQ3ZELHNEQUFpRDtBQUNqRCxnQ0FBOEU7QUFFOUUsTUFBTSw2QkFBOEIsU0FBUSxZQUFLO0lBRS9DLFlBQVksS0FBVSxFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUNwRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFVBQVUsR0FBRyxJQUFJLFlBQU0sQ0FBQztZQUM1QixTQUFTLEVBQUUsVUFBVTtZQUNyQixVQUFVLEVBQUUsUUFBUTtTQUNyQixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ3ZDLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLFNBQVMsRUFBRSxHQUFHO1lBQ2QsaUJBQWlCLEVBQUUsQ0FBQztTQUNyQixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ3ZDLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsaUJBQWlCLEVBQUUsQ0FBQztTQUNyQixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ3ZDLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLFNBQVMsRUFBRSxLQUFLO1lBQ2hCLGlCQUFpQixFQUFFLENBQUM7U0FDckIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUN2QyxNQUFNLEVBQUUsVUFBVTtZQUNsQixTQUFTLEVBQUUsTUFBTTtZQUNqQixpQkFBaUIsRUFBRSxDQUFDO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLElBQUksV0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDdkMsU0FBUyxFQUFFLDBCQUEwQjtZQUNyQyxNQUFNLEVBQUUsVUFBVTtZQUNsQixTQUFTLEVBQUUsTUFBTTtZQUNqQixpQkFBaUIsRUFBRSxDQUFDO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLGVBQVMsQ0FBQyxLQUFLLENBQy9CLGVBQVMsQ0FBQyxLQUFLLENBQ2IsZUFBUyxDQUFDLEtBQUssQ0FDYixNQUFNLEVBQ04sZUFBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsZ0JBQVUsQ0FBQyxFQUFFLENBQUMsRUFDMUMsTUFBTSxFQUNOLE1BQU0sQ0FDUCxFQUNELGVBQVMsQ0FBQyxHQUFHLENBQUMsZUFBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsZ0JBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQ3pFLEVBQ0QsZUFBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FDN0IsQ0FBQztRQUVGLElBQUksb0JBQWMsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDekMsU0FBUztZQUNULGlCQUFpQixFQUFFLE1BQU07U0FDMUIsQ0FBQyxDQUFDO0tBQ0o7Q0FFRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFFdEIsSUFBSSx1QkFBUyxDQUFDLEdBQUcsRUFBRSwyQkFBMkIsRUFBRTtJQUM5QyxTQUFTLEVBQUUsQ0FBQyxJQUFJLDZCQUE2QixDQUFDLEdBQUcsRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO0NBQ3JGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCB7IEFsYXJtLCBBbGFybVJ1bGUsIEFsYXJtU3RhdGUsIENvbXBvc2l0ZUFsYXJtLCBNZXRyaWMgfSBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBDb21wb3NpdGVBbGFybUludGVncmF0aW9uVGVzdCBleHRlbmRzIFN0YWNrIHtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHRlc3RNZXRyaWMgPSBuZXcgTWV0cmljKHtcbiAgICAgIG5hbWVzcGFjZTogJ0NESy9UZXN0JyxcbiAgICAgIG1ldHJpY05hbWU6ICdNZXRyaWMnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWxhcm0xID0gbmV3IEFsYXJtKHRoaXMsICdBbGFybTEnLCB7XG4gICAgICBtZXRyaWM6IHRlc3RNZXRyaWMsXG4gICAgICB0aHJlc2hvbGQ6IDEwMCxcbiAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWxhcm0yID0gbmV3IEFsYXJtKHRoaXMsICdBbGFybTInLCB7XG4gICAgICBtZXRyaWM6IHRlc3RNZXRyaWMsXG4gICAgICB0aHJlc2hvbGQ6IDEwMDAsXG4gICAgICBldmFsdWF0aW9uUGVyaW9kczogMyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFsYXJtMyA9IG5ldyBBbGFybSh0aGlzLCAnQWxhcm0zJywge1xuICAgICAgbWV0cmljOiB0ZXN0TWV0cmljLFxuICAgICAgdGhyZXNob2xkOiAxMDAwMCxcbiAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWxhcm00ID0gbmV3IEFsYXJtKHRoaXMsICdBbGFybTQnLCB7XG4gICAgICBtZXRyaWM6IHRlc3RNZXRyaWMsXG4gICAgICB0aHJlc2hvbGQ6IDEwMDAwMCxcbiAgICAgIGV2YWx1YXRpb25QZXJpb2RzOiAzLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYWxhcm01ID0gbmV3IEFsYXJtKHRoaXMsICdBbGFybTUnLCB7XG4gICAgICBhbGFybU5hbWU6ICdBbGFybSB3aXRoIHNwYWNlIGluIG5hbWUnLFxuICAgICAgbWV0cmljOiB0ZXN0TWV0cmljLFxuICAgICAgdGhyZXNob2xkOiAxMDAwMDAsXG4gICAgICBldmFsdWF0aW9uUGVyaW9kczogMyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFsYXJtUnVsZSA9IEFsYXJtUnVsZS5hbnlPZihcbiAgICAgIEFsYXJtUnVsZS5hbGxPZihcbiAgICAgICAgQWxhcm1SdWxlLmFueU9mKFxuICAgICAgICAgIGFsYXJtMSxcbiAgICAgICAgICBBbGFybVJ1bGUuZnJvbUFsYXJtKGFsYXJtMiwgQWxhcm1TdGF0ZS5PSyksXG4gICAgICAgICAgYWxhcm0zLFxuICAgICAgICAgIGFsYXJtNSxcbiAgICAgICAgKSxcbiAgICAgICAgQWxhcm1SdWxlLm5vdChBbGFybVJ1bGUuZnJvbUFsYXJtKGFsYXJtNCwgQWxhcm1TdGF0ZS5JTlNVRkZJQ0lFTlRfREFUQSkpLFxuICAgICAgKSxcbiAgICAgIEFsYXJtUnVsZS5mcm9tQm9vbGVhbihmYWxzZSksXG4gICAgKTtcblxuICAgIG5ldyBDb21wb3NpdGVBbGFybSh0aGlzLCAnQ29tcG9zaXRlQWxhcm0nLCB7XG4gICAgICBhbGFybVJ1bGUsXG4gICAgICBhY3Rpb25zU3VwcHJlc3NvcjogYWxhcm01LFxuICAgIH0pO1xuICB9XG5cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG5uZXcgSW50ZWdUZXN0KGFwcCwgJ2Nkay1pbnRlZy1jb21wb3NpdGUtYWxhcm0nLCB7XG4gIHRlc3RDYXNlczogW25ldyBDb21wb3NpdGVBbGFybUludGVncmF0aW9uVGVzdChhcHAsICdDb21wb3NpdGVBbGFybUludGVncmF0aW9uVGVzdCcpXSxcbn0pO1xuIl19