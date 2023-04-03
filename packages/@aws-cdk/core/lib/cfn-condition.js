"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnCondition = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cfn_element_1 = require("./cfn-element");
/**
 * Represents a CloudFormation condition, for resources which must be conditionally created and
 * the determination must be made at deploy time.
 */
class CfnCondition extends cfn_element_1.CfnElement {
    /**
     * Build a new condition. The condition must be constructed with a condition token,
     * that the condition is based on.
     */
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CfnConditionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnCondition);
            }
            throw error;
        }
        this.expression = props && props.expression;
    }
    /**
     * @internal
     */
    _toCloudFormation() {
        if (!this.expression) {
            return {};
        }
        return {
            Conditions: {
                [this.logicalId]: this.expression,
            },
        };
    }
    /**
     * Synthesizes the condition.
     */
    resolve(_context) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IResolveContext(_context);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.resolve);
            }
            throw error;
        }
        return { Condition: this.logicalId };
    }
}
exports.CfnCondition = CfnCondition;
_a = JSII_RTTI_SYMBOL_1;
CfnCondition[_a] = { fqn: "@aws-cdk/core.CfnCondition", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWNvbmRpdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNmbi1jb25kaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsK0NBQTJDO0FBWTNDOzs7R0FHRztBQUNILE1BQWEsWUFBYSxTQUFRLHdCQUFVO0lBTTFDOzs7T0FHRztJQUNILFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBeUI7UUFDakUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQVhSLFlBQVk7Ozs7UUFZckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQztLQUM3QztJQUVEOztPQUVHO0lBQ0ksaUJBQWlCO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BCLE9BQU8sRUFBRyxDQUFDO1NBQ1o7UUFFRCxPQUFPO1lBQ0wsVUFBVSxFQUFFO2dCQUNWLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVO2FBQ2xDO1NBQ0YsQ0FBQztLQUNIO0lBRUQ7O09BRUc7SUFDSSxPQUFPLENBQUMsUUFBeUI7Ozs7Ozs7Ozs7UUFDdEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDdEM7O0FBbkNILG9DQW9DQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuRWxlbWVudCB9IGZyb20gJy4vY2ZuLWVsZW1lbnQnO1xuaW1wb3J0IHsgSVJlc29sdmFibGUsIElSZXNvbHZlQ29udGV4dCB9IGZyb20gJy4vcmVzb2x2YWJsZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuQ29uZGl0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIGV4cHJlc3Npb24gdGhhdCB0aGUgY29uZGl0aW9uIHdpbGwgZXZhbHVhdGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS5cbiAgICovXG4gIHJlYWRvbmx5IGV4cHJlc3Npb24/OiBJQ2ZuQ29uZGl0aW9uRXhwcmVzc2lvbjtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgQ2xvdWRGb3JtYXRpb24gY29uZGl0aW9uLCBmb3IgcmVzb3VyY2VzIHdoaWNoIG11c3QgYmUgY29uZGl0aW9uYWxseSBjcmVhdGVkIGFuZFxuICogdGhlIGRldGVybWluYXRpb24gbXVzdCBiZSBtYWRlIGF0IGRlcGxveSB0aW1lLlxuICovXG5leHBvcnQgY2xhc3MgQ2ZuQ29uZGl0aW9uIGV4dGVuZHMgQ2ZuRWxlbWVudCBpbXBsZW1lbnRzIElDZm5Db25kaXRpb25FeHByZXNzaW9uLCBJUmVzb2x2YWJsZSB7XG4gIC8qKlxuICAgKiBUaGUgY29uZGl0aW9uIHN0YXRlbWVudC5cbiAgICovXG4gIHB1YmxpYyBleHByZXNzaW9uPzogSUNmbkNvbmRpdGlvbkV4cHJlc3Npb247XG5cbiAgLyoqXG4gICAqIEJ1aWxkIGEgbmV3IGNvbmRpdGlvbi4gVGhlIGNvbmRpdGlvbiBtdXN0IGJlIGNvbnN0cnVjdGVkIHdpdGggYSBjb25kaXRpb24gdG9rZW4sXG4gICAqIHRoYXQgdGhlIGNvbmRpdGlvbiBpcyBiYXNlZCBvbi5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogQ2ZuQ29uZGl0aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgIHRoaXMuZXhwcmVzc2lvbiA9IHByb3BzICYmIHByb3BzLmV4cHJlc3Npb247XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3RvQ2xvdWRGb3JtYXRpb24oKTogb2JqZWN0IHtcbiAgICBpZiAoIXRoaXMuZXhwcmVzc2lvbikge1xuICAgICAgcmV0dXJuIHsgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgQ29uZGl0aW9uczoge1xuICAgICAgICBbdGhpcy5sb2dpY2FsSWRdOiB0aGlzLmV4cHJlc3Npb24sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogU3ludGhlc2l6ZXMgdGhlIGNvbmRpdGlvbi5cbiAgICovXG4gIHB1YmxpYyByZXNvbHZlKF9jb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpOiBhbnkge1xuICAgIHJldHVybiB7IENvbmRpdGlvbjogdGhpcy5sb2dpY2FsSWQgfTtcbiAgfVxufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBDbG91ZEZvcm1hdGlvbiBlbGVtZW50IHRoYXQgY2FuIGJlIHVzZWQgd2l0aGluIGEgQ29uZGl0aW9uLlxuICpcbiAqIFlvdSBjYW4gdXNlIGludHJpbnNpYyBmdW5jdGlvbnMsIHN1Y2ggYXMgYGBGbi5jb25kaXRpb25JZmBgLFxuICogYGBGbi5jb25kaXRpb25FcXVhbHNgYCwgYW5kIGBgRm4uY29uZGl0aW9uTm90YGAsIHRvIGNvbmRpdGlvbmFsbHkgY3JlYXRlXG4gKiBzdGFjayByZXNvdXJjZXMuIFRoZXNlIGNvbmRpdGlvbnMgYXJlIGV2YWx1YXRlZCBiYXNlZCBvbiBpbnB1dCBwYXJhbWV0ZXJzXG4gKiB0aGF0IHlvdSBkZWNsYXJlIHdoZW4geW91IGNyZWF0ZSBvciB1cGRhdGUgYSBzdGFjay4gQWZ0ZXIgeW91IGRlZmluZSBhbGwgeW91clxuICogY29uZGl0aW9ucywgeW91IGNhbiBhc3NvY2lhdGUgdGhlbSB3aXRoIHJlc291cmNlcyBvciByZXNvdXJjZSBwcm9wZXJ0aWVzIGluXG4gKiB0aGUgUmVzb3VyY2VzIGFuZCBPdXRwdXRzIHNlY3Rpb25zIG9mIGEgdGVtcGxhdGUuXG4gKlxuICogWW91IGRlZmluZSBhbGwgY29uZGl0aW9ucyBpbiB0aGUgQ29uZGl0aW9ucyBzZWN0aW9uIG9mIGEgdGVtcGxhdGUgZXhjZXB0IGZvclxuICogYGBGbi5jb25kaXRpb25JZmBgIGNvbmRpdGlvbnMuIFlvdSBjYW4gdXNlIHRoZSBgYEZuLmNvbmRpdGlvbklmYGAgY29uZGl0aW9uXG4gKiBpbiB0aGUgbWV0YWRhdGEgYXR0cmlidXRlLCB1cGRhdGUgcG9saWN5IGF0dHJpYnV0ZSwgYW5kIHByb3BlcnR5IHZhbHVlcyBpblxuICogdGhlIFJlc291cmNlcyBzZWN0aW9uIGFuZCBPdXRwdXRzIHNlY3Rpb25zIG9mIGEgdGVtcGxhdGUuXG4gKlxuICogWW91IG1pZ2h0IHVzZSBjb25kaXRpb25zIHdoZW4geW91IHdhbnQgdG8gcmV1c2UgYSB0ZW1wbGF0ZSB0aGF0IGNhbiBjcmVhdGVcbiAqIHJlc291cmNlcyBpbiBkaWZmZXJlbnQgY29udGV4dHMsIHN1Y2ggYXMgYSB0ZXN0IGVudmlyb25tZW50IHZlcnN1cyBhXG4gKiBwcm9kdWN0aW9uIGVudmlyb25tZW50LiBJbiB5b3VyIHRlbXBsYXRlLCB5b3UgY2FuIGFkZCBhbiBFbnZpcm9ubWVudFR5cGVcbiAqIGlucHV0IHBhcmFtZXRlciwgd2hpY2ggYWNjZXB0cyBlaXRoZXIgcHJvZCBvciB0ZXN0IGFzIGlucHV0cy4gRm9yIHRoZVxuICogcHJvZHVjdGlvbiBlbnZpcm9ubWVudCwgeW91IG1pZ2h0IGluY2x1ZGUgQW1hem9uIEVDMiBpbnN0YW5jZXMgd2l0aCBjZXJ0YWluXG4gKiBjYXBhYmlsaXRpZXM7IGhvd2V2ZXIsIGZvciB0aGUgdGVzdCBlbnZpcm9ubWVudCwgeW91IHdhbnQgdG8gdXNlIGxlc3NcbiAqIGNhcGFiaWxpdGllcyB0byBzYXZlIGNvc3RzLiBXaXRoIGNvbmRpdGlvbnMsIHlvdSBjYW4gZGVmaW5lIHdoaWNoIHJlc291cmNlc1xuICogYXJlIGNyZWF0ZWQgYW5kIGhvdyB0aGV5J3JlIGNvbmZpZ3VyZWQgZm9yIGVhY2ggZW52aXJvbm1lbnQgdHlwZS5cbiAqXG4gKiBZb3UgY2FuIHVzZSBgdG9TdHJpbmdgIHdoZW4geW91IHdpc2ggdG8gZW1iZWQgYSBjb25kaXRpb24gZXhwcmVzc2lvblxuICogaW4gYSBwcm9wZXJ0eSB2YWx1ZSB0aGF0IGFjY2VwdHMgYSBgc3RyaW5nYC4gRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqIG5ldyBzcXMuUXVldWUodGhpcywgJ015UXVldWUnLCB7XG4gKiAgIHF1ZXVlTmFtZTogRm4uY29uZGl0aW9uSWYoJ0NvbmRpdGlvbicsICdIZWxsbycsICdXb3JsZCcpLnRvU3RyaW5nKClcbiAqIH0pO1xuICogYGBgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUNmbkNvbmRpdGlvbkV4cHJlc3Npb24gZXh0ZW5kcyBJUmVzb2x2YWJsZSB7fVxuXG4vKipcbiAqIEludGVyZmFjZSB0byBzcGVjaWZ5IGNlcnRhaW4gZnVuY3Rpb25zIGFzIFNlcnZpY2UgQ2F0YWxvZyBydWxlLXNwZWNpZmMuXG4gKiBUaGVzZSBmdW5jdGlvbnMgY2FuIG9ubHkgYmUgdXNlZCBpbiBgYFJ1bGVzYGAgc2VjdGlvbiBvZiB0ZW1wbGF0ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQ2ZuUnVsZUNvbmRpdGlvbkV4cHJlc3Npb24gZXh0ZW5kcyBJQ2ZuQ29uZGl0aW9uRXhwcmVzc2lvbiB7XG4gIC8qKlxuICAgKiBUaGlzIGZpZWxkIGlzIG9ubHkgbmVlZGVkIHRvIGRlZmVhdCBUeXBlU2NyaXB0J3Mgc3RydWN0dXJhbCB0eXBpbmcuXG4gICAqIEl0IGlzIG5ldmVyIHVzZWQuXG4gICAqL1xuICByZWFkb25seSBkaXNhbWJpZ3VhdG9yOiBib29sZWFuO1xufVxuIl19