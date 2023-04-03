"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('Dashboard', () => {
    test('widgets in different adds are laid out underneath each other', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const dashboard = new lib_1.Dashboard(stack, 'Dash');
        // WHEN
        dashboard.addWidgets(new lib_1.TextWidget({
            width: 10,
            height: 2,
            markdown: 'first',
            background: lib_1.TextWidgetBackground.SOLID,
        }));
        dashboard.addWidgets(new lib_1.TextWidget({
            width: 1,
            height: 4,
            markdown: 'second',
            background: lib_1.TextWidgetBackground.TRANSPARENT,
        }));
        dashboard.addWidgets(new lib_1.TextWidget({
            width: 4,
            height: 1,
            markdown: 'third',
        }));
        // THEN
        const resources = assertions_1.Template.fromStack(stack).findResources('AWS::CloudWatch::Dashboard');
        expect(Object.keys(resources).length).toEqual(1);
        const key = Object.keys(resources)[0];
        hasWidgets(resources[key].Properties, [
            { type: 'text', width: 10, height: 2, x: 0, y: 0, properties: { markdown: 'first', background: lib_1.TextWidgetBackground.SOLID } },
            { type: 'text', width: 1, height: 4, x: 0, y: 2, properties: { markdown: 'second', background: lib_1.TextWidgetBackground.TRANSPARENT } },
            { type: 'text', width: 4, height: 1, x: 0, y: 6, properties: { markdown: 'third' } },
        ]);
    });
    test('widgets in same add are laid out next to each other', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const dashboard = new lib_1.Dashboard(stack, 'Dash');
        // WHEN
        dashboard.addWidgets(new lib_1.TextWidget({
            width: 10,
            height: 2,
            markdown: 'first',
        }), new lib_1.TextWidget({
            width: 1,
            height: 4,
            markdown: 'second',
        }), new lib_1.TextWidget({
            width: 4,
            height: 1,
            markdown: 'third',
        }));
        // THEN
        const resources = assertions_1.Template.fromStack(stack).findResources('AWS::CloudWatch::Dashboard');
        expect(Object.keys(resources).length).toEqual(1);
        const key = Object.keys(resources)[0];
        hasWidgets(resources[key].Properties, [
            { type: 'text', width: 10, height: 2, x: 0, y: 0, properties: { markdown: 'first' } },
            { type: 'text', width: 1, height: 4, x: 10, y: 0, properties: { markdown: 'second' } },
            { type: 'text', width: 4, height: 1, x: 11, y: 0, properties: { markdown: 'third' } },
        ]);
    });
    test('tokens in widgets are retained', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const dashboard = new lib_1.Dashboard(stack, 'Dash');
        // WHEN
        dashboard.addWidgets(new lib_1.GraphWidget({ width: 1, height: 1 }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Dashboard', {
            DashboardBody: {
                'Fn::Join': ['', [
                        '{"widgets":[{"type":"metric","width":1,"height":1,"x":0,"y":0,"properties":{"view":"timeSeries","region":"',
                        { Ref: 'AWS::Region' },
                        '","yAxis":{}}}]}',
                    ]],
            },
        });
    });
    test('dashboard body includes non-widget fields', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const dashboard = new lib_1.Dashboard(stack, 'Dash', {
            start: '-9H',
            end: '2018-12-17T06:00:00.000Z',
            periodOverride: lib_1.PeriodOverride.INHERIT,
        });
        // WHEN
        dashboard.addWidgets(new lib_1.GraphWidget({ width: 1, height: 1 }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Dashboard', {
            DashboardBody: {
                'Fn::Join': ['', [
                        '{"start":"-9H","end":"2018-12-17T06:00:00.000Z","periodOverride":"inherit",\
"widgets":[{"type":"metric","width":1,"height":1,"x":0,"y":0,"properties":{"view":"timeSeries","region":"',
                        { Ref: 'AWS::Region' },
                        '","yAxis":{}}}]}',
                    ]],
            },
        });
    });
    test('DashboardName is set when provided', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'MyStack');
        // WHEN
        new lib_1.Dashboard(stack, 'MyDashboard', {
            dashboardName: 'MyCustomDashboardName',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Dashboard', {
            DashboardName: 'MyCustomDashboardName',
        });
    });
    test('DashboardName is not generated if not provided', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'MyStack');
        // WHEN
        new lib_1.Dashboard(stack, 'MyDashboard');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudWatch::Dashboard', {});
    });
    test('throws if DashboardName is not valid', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'MyStack');
        // WHEN
        const toThrow = () => {
            new lib_1.Dashboard(stack, 'MyDashboard', {
                dashboardName: 'My Invalid Dashboard Name',
            });
        };
        // THEN
        expect(() => toThrow()).toThrow(/field dashboardName contains invalid characters/);
    });
    test('dashboardArn should not include a region', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'MyStack', {
            env: {
                region: 'invalid-region',
            },
        });
        // WHEN
        const dashboard = new lib_1.Dashboard(stack, 'MyStack');
        // THEN
        expect(dashboard.dashboardArn).not.toContain('invalid-region');
    });
    test('metric warnings are added to dashboard', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'MyStack');
        const m = new lib_1.MathExpression({ expression: 'oops' });
        // WHEN
        new lib_1.Dashboard(stack, 'MyDashboard', {
            widgets: [
                [new lib_1.GraphWidget({ left: [m] }), new lib_1.TextWidget({ markdown: 'asdf' })],
            ],
        });
        // THEN
        const template = assertions_1.Annotations.fromStack(stack);
        template.hasWarning('/MyStack/MyDashboard', assertions_1.Match.stringLikeRegexp("Math expression 'oops' references unknown identifiers"));
    });
});
/**
 * Returns a property predicate that checks that the given Dashboard has the indicated widgets
 */
function hasWidgets(props, widgets) {
    let actualWidgets = [];
    try {
        actualWidgets = JSON.parse(props.DashboardBody).widgets;
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error parsing', props);
        throw e;
    }
    expect(actualWidgets).toEqual(expect.arrayContaining(widgets));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFzaGJvYXJkLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkYXNoYm9hcmQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFtRTtBQUNuRSx3Q0FBMkM7QUFDM0MsZ0NBQWtIO0FBRWxILFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLElBQUksQ0FBQyw4REFBOEQsRUFBRSxHQUFHLEVBQUU7UUFDeEUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxlQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRS9DLE9BQU87UUFDUCxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksZ0JBQVUsQ0FBQztZQUNsQyxLQUFLLEVBQUUsRUFBRTtZQUNULE1BQU0sRUFBRSxDQUFDO1lBQ1QsUUFBUSxFQUFFLE9BQU87WUFDakIsVUFBVSxFQUFFLDBCQUFvQixDQUFDLEtBQUs7U0FDdkMsQ0FBQyxDQUFDLENBQUM7UUFDSixTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksZ0JBQVUsQ0FBQztZQUNsQyxLQUFLLEVBQUUsQ0FBQztZQUNSLE1BQU0sRUFBRSxDQUFDO1lBQ1QsUUFBUSxFQUFFLFFBQVE7WUFDbEIsVUFBVSxFQUFFLDBCQUFvQixDQUFDLFdBQVc7U0FDN0MsQ0FBQyxDQUFDLENBQUM7UUFDSixTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksZ0JBQVUsQ0FBQztZQUNsQyxLQUFLLEVBQUUsQ0FBQztZQUNSLE1BQU0sRUFBRSxDQUFDO1lBQ1QsUUFBUSxFQUFFLE9BQU87U0FDbEIsQ0FBQyxDQUFDLENBQUM7UUFFSixPQUFPO1FBQ1AsTUFBTSxTQUFTLEdBQUcscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDeEYsTUFBTSxDQUFDLE1BQU0sQ0FB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QyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxDQUFDO0tBQ1Q7SUFDRCxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNqRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUsIEFubm90YXRpb25zLCBNYXRjaCB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgRGFzaGJvYXJkLCBHcmFwaFdpZGdldCwgUGVyaW9kT3ZlcnJpZGUsIFRleHRXaWRnZXQsIE1hdGhFeHByZXNzaW9uLCBUZXh0V2lkZ2V0QmFja2dyb3VuZCB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdEYXNoYm9hcmQnLCAoKSA9PiB7XG4gIHRlc3QoJ3dpZGdldHMgaW4gZGlmZmVyZW50IGFkZHMgYXJlIGxhaWQgb3V0IHVuZGVybmVhdGggZWFjaCBvdGhlcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgZGFzaGJvYXJkID0gbmV3IERhc2hib2FyZChzdGFjaywgJ0Rhc2gnKTtcblxuICAgIC8vIFdIRU5cbiAgICBkYXNoYm9hcmQuYWRkV2lkZ2V0cyhuZXcgVGV4dFdpZGdldCh7XG4gICAgICB3aWR0aDogMTAsXG4gICAgICBoZWlnaHQ6IDIsXG4gICAgICBtYXJrZG93bjogJ2ZpcnN0JyxcbiAgICAgIGJhY2tncm91bmQ6IFRleHRXaWRnZXRCYWNrZ3JvdW5kLlNPTElELFxuICAgIH0pKTtcbiAgICBkYXNoYm9hcmQuYWRkV2lkZ2V0cyhuZXcgVGV4dFdpZGdldCh7XG4gICAgICB3aWR0aDogMSxcbiAgICAgIGhlaWdodDogNCxcbiAgICAgIG1hcmtkb3duOiAnc2Vjb25kJyxcbiAgICAgIGJhY2tncm91bmQ6IFRleHRXaWRnZXRCYWNrZ3JvdW5kLlRSQU5TUEFSRU5ULFxuICAgIH0pKTtcbiAgICBkYXNoYm9hcmQuYWRkV2lkZ2V0cyhuZXcgVGV4dFdpZGdldCh7XG4gICAgICB3aWR0aDogNCxcbiAgICAgIGhlaWdodDogMSxcbiAgICAgIG1hcmtkb3duOiAndGhpcmQnLFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCByZXNvdXJjZXMgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmZpbmRSZXNvdXJjZXMoJ0FXUzo6Q2xvdWRXYXRjaDo6RGFzaGJvYXJkJyk7XG4gICAgZXhwZWN0KE9iamVjdC5rZXlzKHJlc291cmNlcykubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgIGNvbnN0IGtleSA9IE9iamVjdC5rZXlzKHJlc291cmNlcylbMF07XG4gICAgaGFzV2lkZ2V0cyhyZXNvdXJjZXNba2V5XS5Qcm9wZXJ0aWVzLCBbXG4gICAgICB7IHR5cGU6ICd0ZXh0Jywgd2lkdGg6IDEwLCBoZWlnaHQ6IDIsIHg6IDAsIHk6IDAsIHByb3BlcnRpZXM6IHsgbWFya2Rvd246ICdmaXJzdCcsIGJhY2tncm91bmQ6IFRleHRXaWRnZXRCYWNrZ3JvdW5kLlNPTElEIH0gfSxcbiAgICAgIHsgdHlwZTogJ3RleHQnLCB3aWR0aDogMSwgaGVpZ2h0OiA0LCB4OiAwLCB5OiAyLCBwcm9wZXJ0aWVzOiB7IG1hcmtkb3duOiAnc2Vjb25kJywgYmFja2dyb3VuZDogVGV4dFdpZGdldEJhY2tncm91bmQuVFJBTlNQQVJFTlQgfSB9LFxuICAgICAgeyB0eXBlOiAndGV4dCcsIHdpZHRoOiA0LCBoZWlnaHQ6IDEsIHg6IDAsIHk6IDYsIHByb3BlcnRpZXM6IHsgbWFya2Rvd246ICd0aGlyZCcgfSB9LFxuICAgIF0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnd2lkZ2V0cyBpbiBzYW1lIGFkZCBhcmUgbGFpZCBvdXQgbmV4dCB0byBlYWNoIG90aGVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBkYXNoYm9hcmQgPSBuZXcgRGFzaGJvYXJkKHN0YWNrLCAnRGFzaCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGRhc2hib2FyZC5hZGRXaWRnZXRzKFxuICAgICAgbmV3IFRleHRXaWRnZXQoe1xuICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgIGhlaWdodDogMixcbiAgICAgICAgbWFya2Rvd246ICdmaXJzdCcsXG4gICAgICB9KSxcbiAgICAgIG5ldyBUZXh0V2lkZ2V0KHtcbiAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgIGhlaWdodDogNCxcbiAgICAgICAgbWFya2Rvd246ICdzZWNvbmQnLFxuICAgICAgfSksXG4gICAgICBuZXcgVGV4dFdpZGdldCh7XG4gICAgICAgIHdpZHRoOiA0LFxuICAgICAgICBoZWlnaHQ6IDEsXG4gICAgICAgIG1hcmtkb3duOiAndGhpcmQnLFxuICAgICAgfSksXG4gICAgKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCByZXNvdXJjZXMgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmZpbmRSZXNvdXJjZXMoJ0FXUzo6Q2xvdWRXYXRjaDo6RGFzaGJvYXJkJyk7XG4gICAgZXhwZWN0KE9iamVjdC5rZXlzKHJlc291cmNlcykubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgIGNvbnN0IGtleSA9IE9iamVjdC5rZXlzKHJlc291cmNlcylbMF07XG4gICAgaGFzV2lkZ2V0cyhyZXNvdXJjZXNba2V5XS5Qcm9wZXJ0aWVzLCBbXG4gICAgICB7IHR5cGU6ICd0ZXh0Jywgd2lkdGg6IDEwLCBoZWlnaHQ6IDIsIHg6IDAsIHk6IDAsIHByb3BlcnRpZXM6IHsgbWFya2Rvd246ICdmaXJzdCcgfSB9LFxuICAgICAgeyB0eXBlOiAndGV4dCcsIHdpZHRoOiAxLCBoZWlnaHQ6IDQsIHg6IDEwLCB5OiAwLCBwcm9wZXJ0aWVzOiB7IG1hcmtkb3duOiAnc2Vjb25kJyB9IH0sXG4gICAgICB7IHR5cGU6ICd0ZXh0Jywgd2lkdGg6IDQsIGhlaWdodDogMSwgeDogMTEsIHk6IDAsIHByb3BlcnRpZXM6IHsgbWFya2Rvd246ICd0aGlyZCcgfSB9LFxuICAgIF0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgndG9rZW5zIGluIHdpZGdldHMgYXJlIHJldGFpbmVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBkYXNoYm9hcmQgPSBuZXcgRGFzaGJvYXJkKHN0YWNrLCAnRGFzaCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGRhc2hib2FyZC5hZGRXaWRnZXRzKFxuICAgICAgbmV3IEdyYXBoV2lkZ2V0KHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KSwgLy8gR3JhcGhXaWRnZXQgaGFzIGludGVybmFsIHJlZmVyZW5jZSB0byBjdXJyZW50IHJlZ2lvblxuICAgICk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRXYXRjaDo6RGFzaGJvYXJkJywge1xuICAgICAgRGFzaGJvYXJkQm9keToge1xuICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAne1wid2lkZ2V0c1wiOlt7XCJ0eXBlXCI6XCJtZXRyaWNcIixcIndpZHRoXCI6MSxcImhlaWdodFwiOjEsXCJ4XCI6MCxcInlcIjowLFwicHJvcGVydGllc1wiOntcInZpZXdcIjpcInRpbWVTZXJpZXNcIixcInJlZ2lvblwiOlwiJyxcbiAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICdcIixcInlBeGlzXCI6e319fV19JyxcbiAgICAgICAgXV0sXG4gICAgICB9LFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnZGFzaGJvYXJkIGJvZHkgaW5jbHVkZXMgbm9uLXdpZGdldCBmaWVsZHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGRhc2hib2FyZCA9IG5ldyBEYXNoYm9hcmQoc3RhY2ssICdEYXNoJyxcbiAgICAgIHtcbiAgICAgICAgc3RhcnQ6ICctOUgnLFxuICAgICAgICBlbmQ6ICcyMDE4LTEyLTE3VDA2OjAwOjAwLjAwMFonLFxuICAgICAgICBwZXJpb2RPdmVycmlkZTogUGVyaW9kT3ZlcnJpZGUuSU5IRVJJVCxcbiAgICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGRhc2hib2FyZC5hZGRXaWRnZXRzKFxuICAgICAgbmV3IEdyYXBoV2lkZ2V0KHsgd2lkdGg6IDEsIGhlaWdodDogMSB9KSwgLy8gR3JhcGhXaWRnZXQgaGFzIGludGVybmFsIHJlZmVyZW5jZSB0byBjdXJyZW50IHJlZ2lvblxuICAgICk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRXYXRjaDo6RGFzaGJvYXJkJywge1xuICAgICAgRGFzaGJvYXJkQm9keToge1xuICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAne1wic3RhcnRcIjpcIi05SFwiLFwiZW5kXCI6XCIyMDE4LTEyLTE3VDA2OjAwOjAwLjAwMFpcIixcInBlcmlvZE92ZXJyaWRlXCI6XCJpbmhlcml0XCIsXFxcblwid2lkZ2V0c1wiOlt7XCJ0eXBlXCI6XCJtZXRyaWNcIixcIndpZHRoXCI6MSxcImhlaWdodFwiOjEsXCJ4XCI6MCxcInlcIjowLFwicHJvcGVydGllc1wiOntcInZpZXdcIjpcInRpbWVTZXJpZXNcIixcInJlZ2lvblwiOlwiJyxcbiAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICdcIixcInlBeGlzXCI6e319fV19JyxcbiAgICAgICAgXV0sXG4gICAgICB9LFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnRGFzaGJvYXJkTmFtZSBpcyBzZXQgd2hlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IERhc2hib2FyZChzdGFjaywgJ015RGFzaGJvYXJkJywge1xuICAgICAgZGFzaGJvYXJkTmFtZTogJ015Q3VzdG9tRGFzaGJvYXJkTmFtZScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRXYXRjaDo6RGFzaGJvYXJkJywge1xuICAgICAgRGFzaGJvYXJkTmFtZTogJ015Q3VzdG9tRGFzaGJvYXJkTmFtZScsXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdEYXNoYm9hcmROYW1lIGlzIG5vdCBnZW5lcmF0ZWQgaWYgbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgRGFzaGJvYXJkKHN0YWNrLCAnTXlEYXNoYm9hcmQnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZFdhdGNoOjpEYXNoYm9hcmQnLCB7fSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgaWYgRGFzaGJvYXJkTmFtZSBpcyBub3QgdmFsaWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHRvVGhyb3cgPSAoKSA9PiB7XG4gICAgICBuZXcgRGFzaGJvYXJkKHN0YWNrLCAnTXlEYXNoYm9hcmQnLCB7XG4gICAgICAgIGRhc2hib2FyZE5hbWU6ICdNeSBJbnZhbGlkIERhc2hib2FyZCBOYW1lJyxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHRvVGhyb3coKSkudG9UaHJvdygvZmllbGQgZGFzaGJvYXJkTmFtZSBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZGFzaGJvYXJkQXJuIHNob3VsZCBub3QgaW5jbHVkZSBhIHJlZ2lvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIHJlZ2lvbjogJ2ludmFsaWQtcmVnaW9uJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgZGFzaGJvYXJkID0gbmV3IERhc2hib2FyZChzdGFjaywgJ015U3RhY2snKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoZGFzaGJvYXJkLmRhc2hib2FyZEFybikubm90LnRvQ29udGFpbignaW52YWxpZC1yZWdpb24nKTtcbiAgfSk7XG5cbiAgdGVzdCgnbWV0cmljIHdhcm5pbmdzIGFyZSBhZGRlZCB0byBkYXNoYm9hcmQnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcbiAgICBjb25zdCBtID0gbmV3IE1hdGhFeHByZXNzaW9uKHsgZXhwcmVzc2lvbjogJ29vcHMnIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBEYXNoYm9hcmQoc3RhY2ssICdNeURhc2hib2FyZCcsIHtcbiAgICAgIHdpZGdldHM6IFtcbiAgICAgICAgW25ldyBHcmFwaFdpZGdldCh7IGxlZnQ6IFttXSB9KSwgbmV3IFRleHRXaWRnZXQoeyBtYXJrZG93bjogJ2FzZGYnIH0pXSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBBbm5vdGF0aW9ucy5mcm9tU3RhY2soc3RhY2spO1xuICAgIHRlbXBsYXRlLmhhc1dhcm5pbmcoJy9NeVN0YWNrL015RGFzaGJvYXJkJywgTWF0Y2guc3RyaW5nTGlrZVJlZ2V4cChcIk1hdGggZXhwcmVzc2lvbiAnb29wcycgcmVmZXJlbmNlcyB1bmtub3duIGlkZW50aWZpZXJzXCIpKTtcbiAgfSk7XG59KTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgcHJvcGVydHkgcHJlZGljYXRlIHRoYXQgY2hlY2tzIHRoYXQgdGhlIGdpdmVuIERhc2hib2FyZCBoYXMgdGhlIGluZGljYXRlZCB3aWRnZXRzXG4gKi9cbmZ1bmN0aW9uIGhhc1dpZGdldHMocHJvcHM6IGFueSwgd2lkZ2V0czogYW55W10pIHtcbiAgbGV0IGFjdHVhbFdpZGdldHM6IGFueVtdID0gW107XG4gIHRyeSB7XG4gICAgYWN0dWFsV2lkZ2V0cyA9IEpTT04ucGFyc2UocHJvcHMuRGFzaGJvYXJkQm9keSkud2lkZ2V0cztcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgcGFyc2luZycsIHByb3BzKTtcbiAgICB0aHJvdyBlO1xuICB9XG4gIGV4cGVjdChhY3R1YWxXaWRnZXRzKS50b0VxdWFsKGV4cGVjdC5hcnJheUNvbnRhaW5pbmcod2lkZ2V0cykpO1xufVxuIl19