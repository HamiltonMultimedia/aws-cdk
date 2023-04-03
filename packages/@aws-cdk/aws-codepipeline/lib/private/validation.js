"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNamespaceName = exports.validateArtifactName = exports.validateName = exports.validateSourceAction = exports.validateArtifactBounds = void 0;
const cdk = require("@aws-cdk/core");
const action_1 = require("../action");
/**
 * Validation function that checks if the number of artifacts is within the given bounds
 */
function validateArtifactBounds(type, artifacts, min, max, category, provider) {
    const ret = [];
    if (artifacts.length < min) {
        ret.push(`${category}/${provider} must have at least ${min} ${type} artifacts`);
    }
    if (artifacts.length > max) {
        ret.push(`${category}/${provider} cannot have more than ${max} ${type} artifacts`);
    }
    return ret;
}
exports.validateArtifactBounds = validateArtifactBounds;
/**
 * Validation function that guarantees that an action is or is not a source action. This is useful because Source actions can only be
 * in the first stage of a pipeline, and the first stage can only contain source actions.
 */
function validateSourceAction(mustBeSource, category, actionName, stageName) {
    if (mustBeSource !== (category === action_1.ActionCategory.SOURCE)) {
        return [`Action ${actionName} in stage ${stageName}: ` + (mustBeSource ? 'first stage may only contain Source actions'
                : 'Source actions may only occur in first stage')];
    }
    return [];
}
exports.validateSourceAction = validateSourceAction;
/**
 * Regex to validate Pipeline, Stage, Action names
 *
 * https://docs.aws.amazon.com/codepipeline/latest/userguide/limits.html
 */
const VALID_IDENTIFIER_REGEX = /^[a-zA-Z0-9.@_-]{1,100}$/;
/**
 * Validate the given name of a pipeline component. Pipeline component names all have the same restrictions.
 * This can be used to validate the name of all components of a pipeline.
 */
function validateName(thing, name) {
    validateAgainstRegex(VALID_IDENTIFIER_REGEX, thing, name);
}
exports.validateName = validateName;
function validateArtifactName(artifactName) {
    // https://docs.aws.amazon.com/codepipeline/latest/APIReference/API_Artifact.html#CodePipeline-Type-Artifact-name
    validateAgainstRegex(/^[a-zA-Z0-9_-]{1,100}$/, 'Artifact', artifactName);
}
exports.validateArtifactName = validateArtifactName;
function validateNamespaceName(namespaceName) {
    validateAgainstRegex(/^[A-Za-z0-9@_-]{1,100}$/, 'Namespace', namespaceName);
}
exports.validateNamespaceName = validateNamespaceName;
function validateAgainstRegex(regex, thing, name) {
    // name could be a Token - in that case, skip validation altogether
    if (cdk.Token.isUnresolved(name)) {
        return;
    }
    if (name !== undefined && !regex.test(name)) {
        throw new Error(`${thing} name must match regular expression: ${regex.toString()}, got '${name}'`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZhbGlkYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLHNDQUEyQztBQUczQzs7R0FFRztBQUNILFNBQWdCLHNCQUFzQixDQUNwQyxJQUFZLEVBQUUsU0FBcUIsRUFDbkMsR0FBVyxFQUFFLEdBQVcsRUFDeEIsUUFBZ0IsRUFBRSxRQUFnQjtJQUNsQyxNQUFNLEdBQUcsR0FBYSxFQUFFLENBQUM7SUFFekIsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtRQUMxQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxJQUFJLFFBQVEsdUJBQXVCLEdBQUcsSUFBSSxJQUFJLFlBQVksQ0FBQyxDQUFDO0tBQ2pGO0lBRUQsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtRQUMxQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxJQUFJLFFBQVEsMEJBQTBCLEdBQUcsSUFBSSxJQUFJLFlBQVksQ0FBQyxDQUFDO0tBQ3BGO0lBRUQsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBZkQsd0RBZUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFnQixvQkFBb0IsQ0FBQyxZQUFxQixFQUFFLFFBQWdCLEVBQUUsVUFBa0IsRUFBRSxTQUFpQjtJQUNqSCxJQUFJLFlBQVksS0FBSyxDQUFDLFFBQVEsS0FBSyx1QkFBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3pELE9BQU8sQ0FBQyxVQUFVLFVBQVUsYUFBYSxTQUFTLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsNkNBQTZDO2dCQUNwSCxDQUFDLENBQUMsOENBQThDLENBQUMsQ0FBQyxDQUFDO0tBQ3REO0lBQ0QsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDO0FBTkQsb0RBTUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxzQkFBc0IsR0FBRywwQkFBMEIsQ0FBQztBQUUxRDs7O0dBR0c7QUFDSCxTQUFnQixZQUFZLENBQUMsS0FBYSxFQUFFLElBQXdCO0lBQ2xFLG9CQUFvQixDQUFDLHNCQUFzQixFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM1RCxDQUFDO0FBRkQsb0NBRUM7QUFFRCxTQUFnQixvQkFBb0IsQ0FBQyxZQUFnQztJQUNuRSxpSEFBaUg7SUFDakgsb0JBQW9CLENBQUMsd0JBQXdCLEVBQUUsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzNFLENBQUM7QUFIRCxvREFHQztBQUVELFNBQWdCLHFCQUFxQixDQUFDLGFBQWlDO0lBQ3JFLG9CQUFvQixDQUFDLHlCQUF5QixFQUFFLFdBQVcsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUM5RSxDQUFDO0FBRkQsc0RBRUM7QUFFRCxTQUFTLG9CQUFvQixDQUFDLEtBQWEsRUFBRSxLQUFhLEVBQUUsSUFBd0I7SUFDbEYsbUVBQW1FO0lBQ25FLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDaEMsT0FBTztLQUNSO0lBRUQsSUFBSSxJQUFJLEtBQUssU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUMzQyxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyx3Q0FBd0MsS0FBSyxDQUFDLFFBQVEsRUFBRSxVQUFVLElBQUksR0FBRyxDQUFDLENBQUM7S0FDcEc7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQWN0aW9uQ2F0ZWdvcnkgfSBmcm9tICcuLi9hY3Rpb24nO1xuaW1wb3J0IHsgQXJ0aWZhY3QgfSBmcm9tICcuLi9hcnRpZmFjdCc7XG5cbi8qKlxuICogVmFsaWRhdGlvbiBmdW5jdGlvbiB0aGF0IGNoZWNrcyBpZiB0aGUgbnVtYmVyIG9mIGFydGlmYWN0cyBpcyB3aXRoaW4gdGhlIGdpdmVuIGJvdW5kc1xuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVBcnRpZmFjdEJvdW5kcyhcbiAgdHlwZTogc3RyaW5nLCBhcnRpZmFjdHM6IEFydGlmYWN0W10sXG4gIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcixcbiAgY2F0ZWdvcnk6IHN0cmluZywgcHJvdmlkZXI6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc3QgcmV0OiBzdHJpbmdbXSA9IFtdO1xuXG4gIGlmIChhcnRpZmFjdHMubGVuZ3RoIDwgbWluKSB7XG4gICAgcmV0LnB1c2goYCR7Y2F0ZWdvcnl9LyR7cHJvdmlkZXJ9IG11c3QgaGF2ZSBhdCBsZWFzdCAke21pbn0gJHt0eXBlfSBhcnRpZmFjdHNgKTtcbiAgfVxuXG4gIGlmIChhcnRpZmFjdHMubGVuZ3RoID4gbWF4KSB7XG4gICAgcmV0LnB1c2goYCR7Y2F0ZWdvcnl9LyR7cHJvdmlkZXJ9IGNhbm5vdCBoYXZlIG1vcmUgdGhhbiAke21heH0gJHt0eXBlfSBhcnRpZmFjdHNgKTtcbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogVmFsaWRhdGlvbiBmdW5jdGlvbiB0aGF0IGd1YXJhbnRlZXMgdGhhdCBhbiBhY3Rpb24gaXMgb3IgaXMgbm90IGEgc291cmNlIGFjdGlvbi4gVGhpcyBpcyB1c2VmdWwgYmVjYXVzZSBTb3VyY2UgYWN0aW9ucyBjYW4gb25seSBiZVxuICogaW4gdGhlIGZpcnN0IHN0YWdlIG9mIGEgcGlwZWxpbmUsIGFuZCB0aGUgZmlyc3Qgc3RhZ2UgY2FuIG9ubHkgY29udGFpbiBzb3VyY2UgYWN0aW9ucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlU291cmNlQWN0aW9uKG11c3RCZVNvdXJjZTogYm9vbGVhbiwgY2F0ZWdvcnk6IHN0cmluZywgYWN0aW9uTmFtZTogc3RyaW5nLCBzdGFnZU5hbWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgaWYgKG11c3RCZVNvdXJjZSAhPT0gKGNhdGVnb3J5ID09PSBBY3Rpb25DYXRlZ29yeS5TT1VSQ0UpKSB7XG4gICAgcmV0dXJuIFtgQWN0aW9uICR7YWN0aW9uTmFtZX0gaW4gc3RhZ2UgJHtzdGFnZU5hbWV9OiBgICsgKG11c3RCZVNvdXJjZSA/ICdmaXJzdCBzdGFnZSBtYXkgb25seSBjb250YWluIFNvdXJjZSBhY3Rpb25zJ1xuICAgICAgOiAnU291cmNlIGFjdGlvbnMgbWF5IG9ubHkgb2NjdXIgaW4gZmlyc3Qgc3RhZ2UnKV07XG4gIH1cbiAgcmV0dXJuIFtdO1xufVxuXG4vKipcbiAqIFJlZ2V4IHRvIHZhbGlkYXRlIFBpcGVsaW5lLCBTdGFnZSwgQWN0aW9uIG5hbWVzXG4gKlxuICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVwaXBlbGluZS9sYXRlc3QvdXNlcmd1aWRlL2xpbWl0cy5odG1sXG4gKi9cbmNvbnN0IFZBTElEX0lERU5USUZJRVJfUkVHRVggPSAvXlthLXpBLVowLTkuQF8tXXsxLDEwMH0kLztcblxuLyoqXG4gKiBWYWxpZGF0ZSB0aGUgZ2l2ZW4gbmFtZSBvZiBhIHBpcGVsaW5lIGNvbXBvbmVudC4gUGlwZWxpbmUgY29tcG9uZW50IG5hbWVzIGFsbCBoYXZlIHRoZSBzYW1lIHJlc3RyaWN0aW9ucy5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gdmFsaWRhdGUgdGhlIG5hbWUgb2YgYWxsIGNvbXBvbmVudHMgb2YgYSBwaXBlbGluZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlTmFtZSh0aGluZzogc3RyaW5nLCBuYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgdmFsaWRhdGVBZ2FpbnN0UmVnZXgoVkFMSURfSURFTlRJRklFUl9SRUdFWCwgdGhpbmcsIG5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVBcnRpZmFjdE5hbWUoYXJ0aWZhY3ROYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVwaXBlbGluZS9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9BcnRpZmFjdC5odG1sI0NvZGVQaXBlbGluZS1UeXBlLUFydGlmYWN0LW5hbWVcbiAgdmFsaWRhdGVBZ2FpbnN0UmVnZXgoL15bYS16QS1aMC05Xy1dezEsMTAwfSQvLCAnQXJ0aWZhY3QnLCBhcnRpZmFjdE5hbWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVOYW1lc3BhY2VOYW1lKG5hbWVzcGFjZU5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICB2YWxpZGF0ZUFnYWluc3RSZWdleCgvXltBLVphLXowLTlAXy1dezEsMTAwfSQvLCAnTmFtZXNwYWNlJywgbmFtZXNwYWNlTmFtZSk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlQWdhaW5zdFJlZ2V4KHJlZ2V4OiBSZWdFeHAsIHRoaW5nOiBzdHJpbmcsIG5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZCkge1xuICAvLyBuYW1lIGNvdWxkIGJlIGEgVG9rZW4gLSBpbiB0aGF0IGNhc2UsIHNraXAgdmFsaWRhdGlvbiBhbHRvZ2V0aGVyXG4gIGlmIChjZGsuVG9rZW4uaXNVbnJlc29sdmVkKG5hbWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKG5hbWUgIT09IHVuZGVmaW5lZCAmJiAhcmVnZXgudGVzdChuYW1lKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGluZ30gbmFtZSBtdXN0IG1hdGNoIHJlZ3VsYXIgZXhwcmVzc2lvbjogJHtyZWdleC50b1N0cmluZygpfSwgZ290ICcke25hbWV9J2ApO1xuICB9XG59XG4iXX0=