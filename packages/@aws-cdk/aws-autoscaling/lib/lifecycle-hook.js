"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleTransition = exports.DefaultResult = exports.LifecycleHook = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const autoscaling_generated_1 = require("./autoscaling.generated");
/**
 * Define a life cycle hook
 */
class LifecycleHook extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.lifecycleHookName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_LifecycleHookProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LifecycleHook);
            }
            throw error;
        }
        const targetProps = props.notificationTarget ? props.notificationTarget.bind(this, { lifecycleHook: this, role: props.role }) : undefined;
        if (props.role) {
            this._role = props.role;
            if (!props.notificationTarget) {
                throw new Error("'notificationTarget' parameter required when 'role' parameter is specified");
            }
        }
        else {
            this._role = targetProps ? targetProps.createdRole : undefined;
        }
        const l1NotificationTargetArn = targetProps ? targetProps.notificationTargetArn : undefined;
        const l1RoleArn = this._role ? this.role.roleArn : undefined;
        const resource = new autoscaling_generated_1.CfnLifecycleHook(this, 'Resource', {
            autoScalingGroupName: props.autoScalingGroup.autoScalingGroupName,
            defaultResult: props.defaultResult,
            heartbeatTimeout: props.heartbeatTimeout && props.heartbeatTimeout.toSeconds(),
            lifecycleHookName: this.physicalName,
            lifecycleTransition: props.lifecycleTransition,
            notificationMetadata: props.notificationMetadata,
            notificationTargetArn: l1NotificationTargetArn,
            roleArn: l1RoleArn,
        });
        // A LifecycleHook resource is going to do a permissions test upon creation,
        // so we have to make sure the role has full permissions before creating the
        // lifecycle hook.
        if (this._role) {
            resource.node.addDependency(this.role);
        }
        this.lifecycleHookName = resource.ref;
    }
    /**
     * The role that allows the ASG to publish to the notification target
     *
     * @default - A default role is created if 'notificationTarget' is specified.
     * Otherwise, no role is created.
     */
    get role() {
        if (!this._role) {
            throw new Error('\'role\' is undefined. Please specify a \'role\' or specify a \'notificationTarget\' to have a role provided for you.');
        }
        return this._role;
    }
}
exports.LifecycleHook = LifecycleHook;
_a = JSII_RTTI_SYMBOL_1;
LifecycleHook[_a] = { fqn: "@aws-cdk/aws-autoscaling.LifecycleHook", version: "0.0.0" };
var DefaultResult;
(function (DefaultResult) {
    DefaultResult["CONTINUE"] = "CONTINUE";
    DefaultResult["ABANDON"] = "ABANDON";
})(DefaultResult = exports.DefaultResult || (exports.DefaultResult = {}));
/**
 * What instance transition to attach the hook to
 */
var LifecycleTransition;
(function (LifecycleTransition) {
    /**
     * Execute the hook when an instance is about to be added
     */
    LifecycleTransition["INSTANCE_LAUNCHING"] = "autoscaling:EC2_INSTANCE_LAUNCHING";
    /**
     * Execute the hook when an instance is about to be terminated
     */
    LifecycleTransition["INSTANCE_TERMINATING"] = "autoscaling:EC2_INSTANCE_TERMINATING";
})(LifecycleTransition = exports.LifecycleTransition || (exports.LifecycleTransition = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlmZWN5Y2xlLWhvb2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsaWZlY3ljbGUtaG9vay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx3Q0FBOEQ7QUFHOUQsbUVBQTJEO0FBZ0YzRDs7R0FFRztBQUNILE1BQWEsYUFBYyxTQUFRLGVBQVE7SUF1QnpDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBeUI7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjtTQUN0QyxDQUFDLENBQUM7Ozs7OzsrQ0ExQk0sYUFBYTs7OztRQTRCdEIsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFFMUksSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQ2QsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBRXhCLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUU7Z0JBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsNEVBQTRFLENBQUMsQ0FBQzthQUMvRjtTQUNGO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1NBQ2hFO1FBRUQsTUFBTSx1QkFBdUIsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzVGLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFFN0QsTUFBTSxRQUFRLEdBQUcsSUFBSSx3Q0FBZ0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3RELG9CQUFvQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0I7WUFDakUsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhO1lBQ2xDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0IsSUFBSSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFO1lBQzlFLGlCQUFpQixFQUFFLElBQUksQ0FBQyxZQUFZO1lBQ3BDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxtQkFBbUI7WUFDOUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLG9CQUFvQjtZQUNoRCxxQkFBcUIsRUFBRSx1QkFBdUI7WUFDOUMsT0FBTyxFQUFFLFNBQVM7U0FDbkIsQ0FBQyxDQUFDO1FBRUgsNEVBQTRFO1FBQzVFLDRFQUE0RTtRQUM1RSxrQkFBa0I7UUFDbEIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2QsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7S0FDdkM7SUEzREQ7Ozs7O09BS0c7SUFDSCxJQUFXLElBQUk7UUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNmLE1BQU0sSUFBSSxLQUFLLENBQUMsdUhBQXVILENBQUMsQ0FBQztTQUMxSTtRQUVELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNuQjs7QUFmSCxzQ0ErREM7OztBQUVELElBQVksYUFHWDtBQUhELFdBQVksYUFBYTtJQUN2QixzQ0FBcUIsQ0FBQTtJQUNyQixvQ0FBbUIsQ0FBQTtBQUNyQixDQUFDLEVBSFcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUFHeEI7QUFFRDs7R0FFRztBQUNILElBQVksbUJBVVg7QUFWRCxXQUFZLG1CQUFtQjtJQUM3Qjs7T0FFRztJQUNILGdGQUF5RCxDQUFBO0lBRXpEOztPQUVHO0lBQ0gsb0ZBQTZELENBQUE7QUFDL0QsQ0FBQyxFQVZXLG1CQUFtQixHQUFuQiwyQkFBbUIsS0FBbkIsMkJBQW1CLFFBVTlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgRHVyYXRpb24sIElSZXNvdXJjZSwgUmVzb3VyY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUF1dG9TY2FsaW5nR3JvdXAgfSBmcm9tICcuL2F1dG8tc2NhbGluZy1ncm91cCc7XG5pbXBvcnQgeyBDZm5MaWZlY3ljbGVIb29rIH0gZnJvbSAnLi9hdXRvc2NhbGluZy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSUxpZmVjeWNsZUhvb2tUYXJnZXQgfSBmcm9tICcuL2xpZmVjeWNsZS1ob29rLXRhcmdldCc7XG5cbi8qKlxuICogQmFzaWMgcHJvcGVydGllcyBmb3IgYSBsaWZlY3ljbGUgaG9va1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEJhc2ljTGlmZWN5Y2xlSG9va1Byb3BzIHtcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIGxpZmVjeWNsZSBob29rXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQXV0b21hdGljYWxseSBnZW5lcmF0ZWQgbmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IGxpZmVjeWNsZUhvb2tOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYWN0aW9uIHRoZSBBdXRvIFNjYWxpbmcgZ3JvdXAgdGFrZXMgd2hlbiB0aGUgbGlmZWN5Y2xlIGhvb2sgdGltZW91dCBlbGFwc2VzIG9yIGlmIGFuIHVuZXhwZWN0ZWQgZmFpbHVyZSBvY2N1cnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IENvbnRpbnVlXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0UmVzdWx0PzogRGVmYXVsdFJlc3VsdDtcblxuICAvKipcbiAgICogTWF4aW11bSB0aW1lIGJldHdlZW4gY2FsbHMgdG8gUmVjb3JkTGlmZWN5Y2xlQWN0aW9uSGVhcnRiZWF0IGZvciB0aGUgaG9va1xuICAgKlxuICAgKiBJZiB0aGUgbGlmZWN5Y2xlIGhvb2sgdGltZXMgb3V0LCBwZXJmb3JtIHRoZSBhY3Rpb24gaW4gRGVmYXVsdFJlc3VsdC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBoZWFydGJlYXQgdGltZW91dC5cbiAgICovXG4gIHJlYWRvbmx5IGhlYXJ0YmVhdFRpbWVvdXQ/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIHN0YXRlIG9mIHRoZSBBbWF6b24gRUMyIGluc3RhbmNlIHRvIHdoaWNoIHlvdSB3YW50IHRvIGF0dGFjaCB0aGUgbGlmZWN5Y2xlIGhvb2suXG4gICAqL1xuICByZWFkb25seSBsaWZlY3ljbGVUcmFuc2l0aW9uOiBMaWZlY3ljbGVUcmFuc2l0aW9uO1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIGRhdGEgdG8gcGFzcyB0byB0aGUgbGlmZWN5Y2xlIGhvb2sgdGFyZ2V0XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gbWV0YWRhdGEuXG4gICAqL1xuICByZWFkb25seSBub3RpZmljYXRpb25NZXRhZGF0YT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHRhcmdldCBvZiB0aGUgbGlmZWN5Y2xlIGhvb2tcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyB0YXJnZXQuXG4gICAqL1xuICByZWFkb25seSBub3RpZmljYXRpb25UYXJnZXQ/OiBJTGlmZWN5Y2xlSG9va1RhcmdldDtcblxuICAvKipcbiAgICogVGhlIHJvbGUgdGhhdCBhbGxvd3MgcHVibGlzaGluZyB0byB0aGUgbm90aWZpY2F0aW9uIHRhcmdldFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgcm9sZSB3aWxsIGJlIGNyZWF0ZWQgaWYgYSB0YXJnZXQgaXMgcHJvdmlkZWQuIE90aGVyd2lzZSwgbm8gcm9sZSBpcyBjcmVhdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZT86IGlhbS5JUm9sZTtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIExpZmVjeWNsZSBob29rXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGlmZWN5Y2xlSG9va1Byb3BzIGV4dGVuZHMgQmFzaWNMaWZlY3ljbGVIb29rUHJvcHMge1xuICAvKipcbiAgICogVGhlIEF1dG9TY2FsaW5nR3JvdXAgdG8gYWRkIHRoZSBsaWZlY3ljbGUgaG9vayB0b1xuICAgKi9cbiAgcmVhZG9ubHkgYXV0b1NjYWxpbmdHcm91cDogSUF1dG9TY2FsaW5nR3JvdXA7XG59XG5cbi8qKlxuICogQSBiYXNpYyBsaWZlY3ljbGUgaG9vayBvYmplY3RcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJTGlmZWN5Y2xlSG9vayBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgcm9sZSBmb3IgdGhlIGxpZmVjeWNsZSBob29rIHRvIGV4ZWN1dGVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIGRlZmF1bHQgcm9sZSBpcyBjcmVhdGVkIGlmICdub3RpZmljYXRpb25UYXJnZXQnIGlzIHNwZWNpZmllZC5cbiAgICogT3RoZXJ3aXNlLCBubyByb2xlIGlzIGNyZWF0ZWQuXG4gICAqL1xuICByZWFkb25seSByb2xlOiBpYW0uSVJvbGU7XG59XG5cbi8qKlxuICogRGVmaW5lIGEgbGlmZSBjeWNsZSBob29rXG4gKi9cbmV4cG9ydCBjbGFzcyBMaWZlY3ljbGVIb29rIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJTGlmZWN5Y2xlSG9vayB7XG4gIHByaXZhdGUgX3JvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFRoZSByb2xlIHRoYXQgYWxsb3dzIHRoZSBBU0cgdG8gcHVibGlzaCB0byB0aGUgbm90aWZpY2F0aW9uIHRhcmdldFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgZGVmYXVsdCByb2xlIGlzIGNyZWF0ZWQgaWYgJ25vdGlmaWNhdGlvblRhcmdldCcgaXMgc3BlY2lmaWVkLlxuICAgKiBPdGhlcndpc2UsIG5vIHJvbGUgaXMgY3JlYXRlZC5cbiAgICovXG4gIHB1YmxpYyBnZXQgcm9sZSgpIHtcbiAgICBpZiAoIXRoaXMuX3JvbGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXFwncm9sZVxcJyBpcyB1bmRlZmluZWQuIFBsZWFzZSBzcGVjaWZ5IGEgXFwncm9sZVxcJyBvciBzcGVjaWZ5IGEgXFwnbm90aWZpY2F0aW9uVGFyZ2V0XFwnIHRvIGhhdmUgYSByb2xlIHByb3ZpZGVkIGZvciB5b3UuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3JvbGU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhpcyBsaWZlY3ljbGUgaG9va1xuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbGlmZWN5Y2xlSG9va05hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTGlmZWN5Y2xlSG9va1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLmxpZmVjeWNsZUhvb2tOYW1lLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGFyZ2V0UHJvcHMgPSBwcm9wcy5ub3RpZmljYXRpb25UYXJnZXQgPyBwcm9wcy5ub3RpZmljYXRpb25UYXJnZXQuYmluZCh0aGlzLCB7IGxpZmVjeWNsZUhvb2s6IHRoaXMsIHJvbGU6IHByb3BzLnJvbGUgfSkgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAocHJvcHMucm9sZSkge1xuICAgICAgdGhpcy5fcm9sZSA9IHByb3BzLnJvbGU7XG5cbiAgICAgIGlmICghcHJvcHMubm90aWZpY2F0aW9uVGFyZ2V0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIidub3RpZmljYXRpb25UYXJnZXQnIHBhcmFtZXRlciByZXF1aXJlZCB3aGVuICdyb2xlJyBwYXJhbWV0ZXIgaXMgc3BlY2lmaWVkXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yb2xlID0gdGFyZ2V0UHJvcHMgPyB0YXJnZXRQcm9wcy5jcmVhdGVkUm9sZSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBsMU5vdGlmaWNhdGlvblRhcmdldEFybiA9IHRhcmdldFByb3BzID8gdGFyZ2V0UHJvcHMubm90aWZpY2F0aW9uVGFyZ2V0QXJuIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IGwxUm9sZUFybiA9IHRoaXMuX3JvbGUgPyB0aGlzLnJvbGUucm9sZUFybiA6IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbkxpZmVjeWNsZUhvb2sodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgYXV0b1NjYWxpbmdHcm91cE5hbWU6IHByb3BzLmF1dG9TY2FsaW5nR3JvdXAuYXV0b1NjYWxpbmdHcm91cE5hbWUsXG4gICAgICBkZWZhdWx0UmVzdWx0OiBwcm9wcy5kZWZhdWx0UmVzdWx0LFxuICAgICAgaGVhcnRiZWF0VGltZW91dDogcHJvcHMuaGVhcnRiZWF0VGltZW91dCAmJiBwcm9wcy5oZWFydGJlYXRUaW1lb3V0LnRvU2Vjb25kcygpLFxuICAgICAgbGlmZWN5Y2xlSG9va05hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgbGlmZWN5Y2xlVHJhbnNpdGlvbjogcHJvcHMubGlmZWN5Y2xlVHJhbnNpdGlvbixcbiAgICAgIG5vdGlmaWNhdGlvbk1ldGFkYXRhOiBwcm9wcy5ub3RpZmljYXRpb25NZXRhZGF0YSxcbiAgICAgIG5vdGlmaWNhdGlvblRhcmdldEFybjogbDFOb3RpZmljYXRpb25UYXJnZXRBcm4sXG4gICAgICByb2xlQXJuOiBsMVJvbGVBcm4sXG4gICAgfSk7XG5cbiAgICAvLyBBIExpZmVjeWNsZUhvb2sgcmVzb3VyY2UgaXMgZ29pbmcgdG8gZG8gYSBwZXJtaXNzaW9ucyB0ZXN0IHVwb24gY3JlYXRpb24sXG4gICAgLy8gc28gd2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhlIHJvbGUgaGFzIGZ1bGwgcGVybWlzc2lvbnMgYmVmb3JlIGNyZWF0aW5nIHRoZVxuICAgIC8vIGxpZmVjeWNsZSBob29rLlxuICAgIGlmICh0aGlzLl9yb2xlKSB7XG4gICAgICByZXNvdXJjZS5ub2RlLmFkZERlcGVuZGVuY3kodGhpcy5yb2xlKTtcbiAgICB9XG5cbiAgICB0aGlzLmxpZmVjeWNsZUhvb2tOYW1lID0gcmVzb3VyY2UucmVmO1xuICB9XG59XG5cbmV4cG9ydCBlbnVtIERlZmF1bHRSZXN1bHQge1xuICBDT05USU5VRSA9ICdDT05USU5VRScsXG4gIEFCQU5ET04gPSAnQUJBTkRPTicsXG59XG5cbi8qKlxuICogV2hhdCBpbnN0YW5jZSB0cmFuc2l0aW9uIHRvIGF0dGFjaCB0aGUgaG9vayB0b1xuICovXG5leHBvcnQgZW51bSBMaWZlY3ljbGVUcmFuc2l0aW9uIHtcbiAgLyoqXG4gICAqIEV4ZWN1dGUgdGhlIGhvb2sgd2hlbiBhbiBpbnN0YW5jZSBpcyBhYm91dCB0byBiZSBhZGRlZFxuICAgKi9cbiAgSU5TVEFOQ0VfTEFVTkNISU5HID0gJ2F1dG9zY2FsaW5nOkVDMl9JTlNUQU5DRV9MQVVOQ0hJTkcnLFxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIHRoZSBob29rIHdoZW4gYW4gaW5zdGFuY2UgaXMgYWJvdXQgdG8gYmUgdGVybWluYXRlZFxuICAgKi9cbiAgSU5TVEFOQ0VfVEVSTUlOQVRJTkcgPSAnYXV0b3NjYWxpbmc6RUMyX0lOU1RBTkNFX1RFUk1JTkFUSU5HJyxcbn1cbiJdfQ==