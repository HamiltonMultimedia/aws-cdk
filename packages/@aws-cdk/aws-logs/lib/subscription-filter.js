"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionFilter = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const logs_generated_1 = require("./logs.generated");
/**
 * A new Subscription on a CloudWatch log group.
 */
class SubscriptionFilter extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_SubscriptionFilterProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, SubscriptionFilter);
            }
            throw error;
        }
        const destProps = props.destination.bind(this, props.logGroup);
        new logs_generated_1.CfnSubscriptionFilter(this, 'Resource', {
            logGroupName: props.logGroup.logGroupName,
            destinationArn: destProps.arn,
            roleArn: destProps.role && destProps.role.roleArn,
            filterPattern: props.filterPattern.logPatternString,
        });
    }
}
exports.SubscriptionFilter = SubscriptionFilter;
_a = JSII_RTTI_SYMBOL_1;
SubscriptionFilter[_a] = { fqn: "@aws-cdk/aws-logs.SubscriptionFilter", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9uLWZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN1YnNjcmlwdGlvbi1maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esd0NBQXlDO0FBR3pDLHFEQUF5RDtBQThDekQ7O0dBRUc7QUFDSCxNQUFhLGtCQUFtQixTQUFRLGVBQVE7SUFDOUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE4QjtRQUN0RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBRlIsa0JBQWtCOzs7O1FBSTNCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFL0QsSUFBSSxzQ0FBcUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzFDLFlBQVksRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVk7WUFDekMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxHQUFHO1lBQzdCLE9BQU8sRUFBRSxTQUFTLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTztZQUNqRCxhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0I7U0FDcEQsQ0FBQyxDQUFDO0tBQ0o7O0FBWkgsZ0RBYUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJTG9nR3JvdXAsIFN1YnNjcmlwdGlvbkZpbHRlck9wdGlvbnMgfSBmcm9tICcuL2xvZy1ncm91cCc7XG5pbXBvcnQgeyBDZm5TdWJzY3JpcHRpb25GaWx0ZXIgfSBmcm9tICcuL2xvZ3MuZ2VuZXJhdGVkJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGNsYXNzZXMgdGhhdCBjYW4gYmUgdGhlIGRlc3RpbmF0aW9uIG9mIGEgbG9nIFN1YnNjcmlwdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIElMb2dTdWJzY3JpcHRpb25EZXN0aW5hdGlvbiB7XG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHByb3BlcnRpZXMgcmVxdWlyZWQgdG8gc2VuZCBzdWJzY3JpcHRpb24gZXZlbnRzIHRvIHRoaXMgZGVzdGluYXRpb24uXG4gICAqXG4gICAqIElmIG5lY2Vzc2FyeSwgdGhlIGRlc3RpbmF0aW9uIGNhbiB1c2UgdGhlIHByb3BlcnRpZXMgb2YgdGhlIFN1YnNjcmlwdGlvbkZpbHRlclxuICAgKiBvYmplY3QgaXRzZWxmIHRvIGNvbmZpZ3VyZSBpdHMgcGVybWlzc2lvbnMgdG8gYWxsb3cgdGhlIHN1YnNjcmlwdGlvbiB0byB3cml0ZVxuICAgKiB0byBpdC5cbiAgICpcbiAgICogVGhlIGRlc3RpbmF0aW9uIG1heSByZWNvbmZpZ3VyZSBpdHMgb3duIHBlcm1pc3Npb25zIGluIHJlc3BvbnNlIHRvIHRoaXNcbiAgICogZnVuY3Rpb24gY2FsbC5cbiAgICovXG4gIGJpbmQoc2NvcGU6IENvbnN0cnVjdCwgc291cmNlTG9nR3JvdXA6IElMb2dHcm91cCk6IExvZ1N1YnNjcmlwdGlvbkRlc3RpbmF0aW9uQ29uZmlnO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgcmV0dXJuZWQgYnkgYSBTdWJzY3JpcHRpb24gZGVzdGluYXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2dTdWJzY3JpcHRpb25EZXN0aW5hdGlvbkNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBzdWJzY3JpcHRpb24ncyBkZXN0aW5hdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgYXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSByb2xlIHRvIGFzc3VtZSB0byB3cml0ZSBsb2cgZXZlbnRzIHRvIHRoZSBkZXN0aW5hdGlvblxuICAgKlxuICAgKiBAZGVmYXVsdCBObyByb2xlIGFzc3VtZWRcbiAgICovXG4gIHJlYWRvbmx5IHJvbGU/OiBpYW0uSVJvbGU7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBTdWJzY3JpcHRpb25GaWx0ZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdWJzY3JpcHRpb25GaWx0ZXJQcm9wcyBleHRlbmRzIFN1YnNjcmlwdGlvbkZpbHRlck9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGxvZyBncm91cCB0byBjcmVhdGUgdGhlIHN1YnNjcmlwdGlvbiBvbi5cbiAgICovXG4gIHJlYWRvbmx5IGxvZ0dyb3VwOiBJTG9nR3JvdXA7XG59XG5cbi8qKlxuICogQSBuZXcgU3Vic2NyaXB0aW9uIG9uIGEgQ2xvdWRXYXRjaCBsb2cgZ3JvdXAuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJzY3JpcHRpb25GaWx0ZXIgZXh0ZW5kcyBSZXNvdXJjZSB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTdWJzY3JpcHRpb25GaWx0ZXJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBkZXN0UHJvcHMgPSBwcm9wcy5kZXN0aW5hdGlvbi5iaW5kKHRoaXMsIHByb3BzLmxvZ0dyb3VwKTtcblxuICAgIG5ldyBDZm5TdWJzY3JpcHRpb25GaWx0ZXIodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbG9nR3JvdXBOYW1lOiBwcm9wcy5sb2dHcm91cC5sb2dHcm91cE5hbWUsXG4gICAgICBkZXN0aW5hdGlvbkFybjogZGVzdFByb3BzLmFybixcbiAgICAgIHJvbGVBcm46IGRlc3RQcm9wcy5yb2xlICYmIGRlc3RQcm9wcy5yb2xlLnJvbGVBcm4sXG4gICAgICBmaWx0ZXJQYXR0ZXJuOiBwcm9wcy5maWx0ZXJQYXR0ZXJuLmxvZ1BhdHRlcm5TdHJpbmcsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==