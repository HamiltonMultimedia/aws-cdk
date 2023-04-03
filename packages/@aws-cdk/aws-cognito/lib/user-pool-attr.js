"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientAttributes = exports.DateTimeAttribute = exports.BooleanAttribute = exports.NumberAttribute = exports.StringAttribute = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const attr_names_1 = require("./private/attr-names");
/**
 * The String custom attribute type.
 */
class StringAttribute {
    constructor(props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_StringAttributeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, StringAttribute);
            }
            throw error;
        }
        if (props.minLen && !core_1.Token.isUnresolved(props.minLen) && props.minLen < 0) {
            throw new Error(`minLen cannot be less than 0 (value: ${props.minLen}).`);
        }
        if (props.maxLen && !core_1.Token.isUnresolved(props.maxLen) && props.maxLen > 2048) {
            throw new Error(`maxLen cannot be greater than 2048 (value: ${props.maxLen}).`);
        }
        this.minLen = props?.minLen;
        this.maxLen = props?.maxLen;
        this.mutable = props?.mutable;
    }
    bind() {
        let stringConstraints;
        if (this.minLen || this.maxLen) {
            stringConstraints = {
                minLen: this.minLen,
                maxLen: this.maxLen,
            };
        }
        return {
            dataType: 'String',
            stringConstraints,
            mutable: this.mutable,
        };
    }
}
exports.StringAttribute = StringAttribute;
_a = JSII_RTTI_SYMBOL_1;
StringAttribute[_a] = { fqn: "@aws-cdk/aws-cognito.StringAttribute", version: "0.0.0" };
/**
 * The Number custom attribute type.
 */
class NumberAttribute {
    constructor(props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_NumberAttributeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, NumberAttribute);
            }
            throw error;
        }
        this.min = props?.min;
        this.max = props?.max;
        this.mutable = props?.mutable;
    }
    bind() {
        let numberConstraints;
        if (this.min || this.max) {
            numberConstraints = {
                min: this.min,
                max: this.max,
            };
        }
        return {
            dataType: 'Number',
            numberConstraints,
            mutable: this.mutable,
        };
    }
}
exports.NumberAttribute = NumberAttribute;
_b = JSII_RTTI_SYMBOL_1;
NumberAttribute[_b] = { fqn: "@aws-cdk/aws-cognito.NumberAttribute", version: "0.0.0" };
/**
 * The Boolean custom attribute type.
 */
class BooleanAttribute {
    constructor(props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_CustomAttributeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, BooleanAttribute);
            }
            throw error;
        }
        this.mutable = props?.mutable;
    }
    bind() {
        return {
            dataType: 'Boolean',
            mutable: this.mutable,
        };
    }
}
exports.BooleanAttribute = BooleanAttribute;
_c = JSII_RTTI_SYMBOL_1;
BooleanAttribute[_c] = { fqn: "@aws-cdk/aws-cognito.BooleanAttribute", version: "0.0.0" };
/**
 * The DateTime custom attribute type.
 */
class DateTimeAttribute {
    constructor(props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_CustomAttributeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, DateTimeAttribute);
            }
            throw error;
        }
        this.mutable = props?.mutable;
    }
    bind() {
        return {
            dataType: 'DateTime',
            mutable: this.mutable,
        };
    }
}
exports.DateTimeAttribute = DateTimeAttribute;
_d = JSII_RTTI_SYMBOL_1;
DateTimeAttribute[_d] = { fqn: "@aws-cdk/aws-cognito.DateTimeAttribute", version: "0.0.0" };
/**
 * A set of attributes, useful to set Read and Write attributes
 */
class ClientAttributes {
    /**
     * Creates a ClientAttributes with the specified attributes
     *
     * @default - a ClientAttributes object without any attributes
     */
    constructor() {
        this.attributesSet = new Set();
    }
    /**
     * Creates a custom ClientAttributes with the specified attributes
     * @param attributes a list of standard attributes to add to the set
     */
    withStandardAttributes(attributes) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_StandardAttributesMask(attributes);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.withStandardAttributes);
            }
            throw error;
        }
        let attributesSet = new Set(this.attributesSet);
        // iterate through key-values in the `StandardAttributeNames` constant
        // to get the value for all attributes
        for (const attributeKey in attr_names_1.StandardAttributeNames) {
            if (attributes[attributeKey] === true) {
                const attributeName = attr_names_1.StandardAttributeNames[attributeKey];
                attributesSet.add(attributeName);
            }
        }
        let aux = new ClientAttributes();
        aux.attributesSet = attributesSet;
        return aux;
    }
    /**
     * Creates a custom ClientAttributes with the specified attributes
     * @param attributes a list of custom attributes to add to the set
     */
    withCustomAttributes(...attributes) {
        let attributesSet = new Set(this.attributesSet);
        for (let attribute of attributes) {
            // custom attributes MUST begin with `custom:`, so add the string if not present
            if (!attribute.startsWith('custom:')) {
                attribute = 'custom:' + attribute;
            }
            attributesSet.add(attribute);
        }
        let aux = new ClientAttributes();
        aux.attributesSet = attributesSet;
        return aux;
    }
    /**
     * The list of attributes represented by this ClientAttributes
     */
    attributes() {
        // sorting is unnecessary but it simplify testing
        return Array.from(this.attributesSet).sort();
    }
}
exports.ClientAttributes = ClientAttributes;
_e = JSII_RTTI_SYMBOL_1;
ClientAttributes[_e] = { fqn: "@aws-cdk/aws-cognito.ClientAttributes", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wb29sLWF0dHIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2VyLXBvb2wtYXR0ci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBc0M7QUFDdEMscURBQThEO0FBeU85RDs7R0FFRztBQUNILE1BQWEsZUFBZTtJQUsxQixZQUFZLFFBQThCLEVBQUU7Ozs7OzsrQ0FMakMsZUFBZTs7OztRQU14QixJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN6RSxNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztTQUMzRTtRQUNELElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLFlBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFO1lBQzVFLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO1NBQ2pGO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLEVBQUUsTUFBTSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxFQUFFLE1BQU0sQ0FBQztRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxPQUFPLENBQUM7S0FDL0I7SUFFTSxJQUFJO1FBQ1QsSUFBSSxpQkFBeUQsQ0FBQztRQUM5RCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUM5QixpQkFBaUIsR0FBRztnQkFDbEIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNuQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07YUFDcEIsQ0FBQztTQUNIO1FBRUQs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QUFTLENBQUM7YUFDbkM7WUFDRCxhQUFhLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsSUFBSSxHQUFHLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1FBQ2pDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ2xDLE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFFRDs7T0FFRztJQUNJLFVBQVU7UUFDZixpREFBaUQ7UUFDakQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUM5Qzs7QUEzREgsNENBNERDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFN0YW5kYXJkQXR0cmlidXRlTmFtZXMgfSBmcm9tICcuL3ByaXZhdGUvYXR0ci1uYW1lcyc7XG5cbi8qKlxuICogVGhlIHNldCBvZiBzdGFuZGFyZCBhdHRyaWJ1dGVzIHRoYXQgY2FuIGJlIG1hcmtlZCBhcyByZXF1aXJlZCBvciBtdXRhYmxlLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3VzZXItcG9vbC1zZXR0aW5ncy1hdHRyaWJ1dGVzLmh0bWwjY29nbml0by11c2VyLXBvb2xzLXN0YW5kYXJkLWF0dHJpYnV0ZXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdGFuZGFyZEF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIHVzZXIncyBwb3N0YWwgYWRkcmVzcy5cbiAgICogQGRlZmF1bHQgLSBzZWUgdGhlIGRlZmF1bHRzIHVuZGVyIGBTdGFuZGFyZEF0dHJpYnV0ZWBcbiAgICovXG4gIHJlYWRvbmx5IGFkZHJlc3M/OiBTdGFuZGFyZEF0dHJpYnV0ZTtcblxuICAvKipcbiAgICogVGhlIHVzZXIncyBiaXJ0aGRheSwgcmVwcmVzZW50ZWQgYXMgYW4gSVNPIDg2MDE6MjAwNCBmb3JtYXQuXG4gICAqIEBkZWZhdWx0IC0gc2VlIHRoZSBkZWZhdWx0cyB1bmRlciBgU3RhbmRhcmRBdHRyaWJ1dGVgXG4gICAqL1xuICByZWFkb25seSBiaXJ0aGRhdGU/OiBTdGFuZGFyZEF0dHJpYnV0ZTtcblxuICAvKipcbiAgICogVGhlIHVzZXIncyBlLW1haWwgYWRkcmVzcywgcmVwcmVzZW50ZWQgYXMgYW4gUkZDIDUzMjIgW1JGQzUzMjJdIGFkZHItc3BlYy5cbiAgICogQGRlZmF1bHQgLSBzZWUgdGhlIGRlZmF1bHRzIHVuZGVyIGBTdGFuZGFyZEF0dHJpYnV0ZWBcbiAgICovXG4gIHJlYWRvbmx5IGVtYWlsPzogU3RhbmRhcmRBdHRyaWJ1dGU7XG5cbiAgLyoqXG4gICAqIFRoZSBzdXJuYW1lIG9yIGxhc3QgbmFtZSBvZiB0aGUgdXNlci5cbiAgICogQGRlZmF1bHQgLSBzZWUgdGhlIGRlZmF1bHRzIHVuZGVyIGBTdGFuZGFyZEF0dHJpYnV0ZWBcbiAgICovXG4gIHJlYWRvbmx5IGZhbWlseU5hbWU/OiBTdGFuZGFyZEF0dHJpYnV0ZTtcblxuICAvKipcbiAgICogVGhlIHVzZXIncyBnZW5kZXIuXG4gICAqIEBkZWZhdWx0IC0gc2VlIHRoZSBkZWZhdWx0cyB1bmRlciBgU3RhbmRhcmRBdHRyaWJ1dGVgXG4gICAqL1xuICByZWFkb25seSBnZW5kZXI/OiBTdGFuZGFyZEF0dHJpYnV0ZTtcblxuICAvKipcbiAgICogVGhlIHVzZXIncyBmaXJzdCBuYW1lIG9yIGdpdmUgbmFtZS5cbiAgICogQGRlZmF1bHQgLSBzZWUgdGhlIGRlZmF1bHRzIHVuZGVyIGBTdGFuZGFyZEF0dHJpYnV0ZWBcbiAgICovXG4gIHJlYWRvbmx5IGdpdmVuTmFtZT86IFN0YW5kYXJkQXR0cmlidXRlO1xuXG4gIC8qKlxuICAgKiBUaGUgdXNlcidzIGxvY2FsZSwgcmVwcmVzZW50ZWQgYXMgYSBCQ1A0NyBbUkZDNTY0Nl0gbGFuZ3VhZ2UgdGFnLlxuICAgKiBAZGVmYXVsdCAtIHNlZSB0aGUgZGVmYXVsdHMgdW5kZXIgYFN0YW5kYXJkQXR0cmlidXRlYFxuICAgKi9cbiAgcmVhZG9ubHkgbG9jYWxlPzogU3RhbmRhcmRBdHRyaWJ1dGU7XG5cbiAgLyoqXG4gICAqIFRoZSB1c2VyJ3MgbWlkZGxlIG5hbWUuXG4gICAqIEBkZWZhdWx0IC0gc2VlIHRoZSBkZWZhdWx0cyB1bmRlciBgU3RhbmRhcmRBdHRyaWJ1dGVgXG4gICAqL1xuICByZWFkb25seSBtaWRkbGVOYW1lPzogU3RhbmRhcmRBdHRyaWJ1dGU7XG5cbiAgLyoqXG4gICAqIFRoZSB1c2VyJ3MgZnVsbCBuYW1lIGluIGRpc3BsYXlhYmxlIGZvcm0sIGluY2x1ZGluZyBhbGwgbmFtZSBwYXJ0cywgdGl0bGVzIGFuZCBzdWZmaXhlcy5cbiAgICogQGRlZmF1bHQgLSBzZWUgdGhlIGRlZmF1bHRzIHVuZGVyIGBTdGFuZGFyZEF0dHJpYnV0ZWBcbiAgICovXG4gIHJlYWRvbmx5IGZ1bGxuYW1lPzogU3RhbmRhcmRBdHRyaWJ1dGU7XG5cbiAgLyoqXG4gICAqIFRoZSB1c2VyJ3Mgbmlja25hbWUgb3IgY2FzdWFsIG5hbWUuXG4gICAqIEBkZWZhdWx0IC0gc2VlIHRoZSBkZWZhdWx0cyB1bmRlciBgU3RhbmRhcmRBdHRyaWJ1dGVgXG4gICAqL1xuICByZWFkb25seSBuaWNrbmFtZT86IFN0YW5kYXJkQXR0cmlidXRlO1xuXG4gIC8qKlxuICAgKiBUaGUgdXNlcidzIHRlbGVwaG9uZSBudW1iZXIuXG4gICAqIEBkZWZhdWx0IC0gc2VlIHRoZSBkZWZhdWx0cyB1bmRlciBgU3RhbmRhcmRBdHRyaWJ1dGVgXG4gICAqL1xuICByZWFkb25seSBwaG9uZU51bWJlcj86IFN0YW5kYXJkQXR0cmlidXRlO1xuXG4gIC8qKlxuICAgKiBUaGUgVVJMIHRvIHRoZSB1c2VyJ3MgcHJvZmlsZSBwaWN0dXJlLlxuICAgKiBAZGVmYXVsdCAtIHNlZSB0aGUgZGVmYXVsdHMgdW5kZXIgYFN0YW5kYXJkQXR0cmlidXRlYFxuICAgKi9cbiAgcmVhZG9ubHkgcHJvZmlsZVBpY3R1cmU/OiBTdGFuZGFyZEF0dHJpYnV0ZTtcblxuICAvKipcbiAgICogVGhlIHVzZXIncyBwcmVmZmVyZWQgdXNlcm5hbWUsIGRpZmZlcmVudCBmcm9tIHRoZSBpbW11dGFibGUgdXNlciBuYW1lLlxuICAgKiBAZGVmYXVsdCAtIHNlZSB0aGUgZGVmYXVsdHMgdW5kZXIgYFN0YW5kYXJkQXR0cmlidXRlYFxuICAgKi9cbiAgcmVhZG9ubHkgcHJlZmVycmVkVXNlcm5hbWU/OiBTdGFuZGFyZEF0dHJpYnV0ZTtcblxuICAvKipcbiAgICogVGhlIFVSTCB0byB0aGUgdXNlcidzIHByb2ZpbGUgcGFnZS5cbiAgICogQGRlZmF1bHQgLSBzZWUgdGhlIGRlZmF1bHRzIHVuZGVyIGBTdGFuZGFyZEF0dHJpYnV0ZWBcbiAgICovXG4gIHJlYWRvbmx5IHByb2ZpbGVQYWdlPzogU3RhbmRhcmRBdHRyaWJ1dGU7XG5cbiAgLyoqXG4gICAqIFRoZSB1c2VyJ3MgdGltZSB6b25lLlxuICAgKiBAZGVmYXVsdCAtIHNlZSB0aGUgZGVmYXVsdHMgdW5kZXIgYFN0YW5kYXJkQXR0cmlidXRlYFxuICAgKi9cbiAgcmVhZG9ubHkgdGltZXpvbmU/OiBTdGFuZGFyZEF0dHJpYnV0ZTtcblxuICAvKipcbiAgICogVGhlIHRpbWUsIHRoZSB1c2VyJ3MgaW5mb3JtYXRpb24gd2FzIGxhc3QgdXBkYXRlZC5cbiAgICogQGRlZmF1bHQgLSBzZWUgdGhlIGRlZmF1bHRzIHVuZGVyIGBTdGFuZGFyZEF0dHJpYnV0ZWBcbiAgICovXG4gIHJlYWRvbmx5IGxhc3RVcGRhdGVUaW1lPzogU3RhbmRhcmRBdHRyaWJ1dGU7XG5cbiAgLyoqXG4gICAqIFRoZSBVUkwgdG8gdGhlIHVzZXIncyB3ZWIgcGFnZSBvciBibG9nLlxuICAgKiBAZGVmYXVsdCAtIHNlZSB0aGUgZGVmYXVsdHMgdW5kZXIgYFN0YW5kYXJkQXR0cmlidXRlYFxuICAgKi9cbiAgcmVhZG9ubHkgd2Vic2l0ZT86IFN0YW5kYXJkQXR0cmlidXRlO1xuXG4gIC8qKlxuICAgKiBERVBSRUNBVEVEXG4gICAqIEBkZXByZWNhdGVkIHRoaXMgaXMgbm90IGEgc3RhbmRhcmQgYXR0cmlidXRlIGFuZCB3YXMgaW5jb3JyZWN0bHkgYWRkZWQgdG8gdGhlIENESy5cbiAgICogSXQgaXMgYSBDb2duaXRvIGJ1aWx0LWluIGF0dHJpYnV0ZSBhbmQgY2Fubm90IGJlIGNvbnRyb2xsZWQgYXMgcGFydCBvZiB1c2VyIHBvb2wgY3JlYXRpb24uXG4gICAqIEBkZWZhdWx0IC0gc2VlIHRoZSBkZWZhdWx0cyB1bmRlciBgU3RhbmRhcmRBdHRyaWJ1dGVgXG4gICAqL1xuICByZWFkb25seSBlbWFpbFZlcmlmaWVkPzogU3RhbmRhcmRBdHRyaWJ1dGU7XG5cbiAgLyoqXG4gICAqIERFUFJFQ0FURURcbiAgICogQGRlcHJlY2F0ZWQgdGhpcyBpcyBub3QgYSBzdGFuZGFyZCBhdHRyaWJ1dGUgYW5kIHdhcyBpbmNvcnJlY3RseSBhZGRlZCB0byB0aGUgQ0RLLlxuICAgKiBJdCBpcyBhIENvZ25pdG8gYnVpbHQtaW4gYXR0cmlidXRlIGFuZCBjYW5ub3QgYmUgY29udHJvbGxlZCBhcyBwYXJ0IG9mIHVzZXIgcG9vbCBjcmVhdGlvbi5cbiAgICogQGRlZmF1bHQgLSBzZWUgdGhlIGRlZmF1bHRzIHVuZGVyIGBTdGFuZGFyZEF0dHJpYnV0ZWBcbiAgICovXG4gIHJlYWRvbmx5IHBob25lTnVtYmVyVmVyaWZpZWQ/OiBTdGFuZGFyZEF0dHJpYnV0ZTtcbn1cblxuLyoqXG4gKiBTdGFuZGFyZCBhdHRyaWJ1dGUgdGhhdCBjYW4gYmUgbWFya2VkIGFzIHJlcXVpcmVkIG9yIG11dGFibGUuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLXNldHRpbmdzLWF0dHJpYnV0ZXMuaHRtbCNjb2duaXRvLXVzZXItcG9vbHMtc3RhbmRhcmQtYXR0cmlidXRlc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFN0YW5kYXJkQXR0cmlidXRlIHtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRoZSB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlIGNhbiBiZSBjaGFuZ2VkLlxuICAgKiBGb3IgYW55IHVzZXIgcG9vbCBhdHRyaWJ1dGUgdGhhdCdzIG1hcHBlZCB0byBhbiBpZGVudGl0eSBwcm92aWRlciBhdHRyaWJ1dGUsIHRoaXMgbXVzdCBiZSBzZXQgdG8gYHRydWVgLlxuICAgKiBBbWF6b24gQ29nbml0byB1cGRhdGVzIG1hcHBlZCBhdHRyaWJ1dGVzIHdoZW4gdXNlcnMgc2lnbiBpbiB0byB5b3VyIGFwcGxpY2F0aW9uIHRocm91Z2ggYW4gaWRlbnRpdHkgcHJvdmlkZXIuXG4gICAqIElmIGFuIGF0dHJpYnV0ZSBpcyBpbW11dGFibGUsIEFtYXpvbiBDb2duaXRvIHRocm93cyBhbiBlcnJvciB3aGVuIGl0IGF0dGVtcHRzIHRvIHVwZGF0ZSB0aGUgYXR0cmlidXRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBtdXRhYmxlPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRoZSBhdHRyaWJ1dGUgaXMgcmVxdWlyZWQgdXBvbiB1c2VyIHJlZ2lzdHJhdGlvbi5cbiAgICogSWYgdGhlIGF0dHJpYnV0ZSBpcyByZXF1aXJlZCBhbmQgdGhlIHVzZXIgZG9lcyBub3QgcHJvdmlkZSBhIHZhbHVlLCByZWdpc3RyYXRpb24gb3Igc2lnbi1pbiB3aWxsIGZhaWwuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSByZXF1aXJlZD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIGN1c3RvbSBhdHRyaWJ1dGUgdHlwZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQ3VzdG9tQXR0cmlidXRlIHtcbiAgLyoqXG4gICAqIEJpbmQgdGhpcyBjdXN0b20gYXR0cmlidXRlIHR5cGUgdG8gdGhlIHZhbHVlcyBhcyBleHBlY3RlZCBieSBDbG91ZEZvcm1hdGlvblxuICAgKi9cbiAgYmluZCgpOiBDdXN0b21BdHRyaWJ1dGVDb25maWc7XG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiB0aGF0IHdpbGwgYmUgZmVkIGludG8gQ2xvdWRGb3JtYXRpb24gZm9yIGFueSBjdXN0b20gYXR0cmlidXRlIHR5cGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tQXR0cmlidXRlQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBkYXRhIHR5cGUgb2YgdGhlIGN1c3RvbSBhdHRyaWJ1dGUuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8tdXNlci1pZGVudGl0eS1wb29scy9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9TY2hlbWFBdHRyaWJ1dGVUeXBlLmh0bWwjQ29nbml0b1VzZXJQb29scy1UeXBlLVNjaGVtYUF0dHJpYnV0ZVR5cGUtQXR0cmlidXRlRGF0YVR5cGVcbiAgICovXG4gIHJlYWRvbmx5IGRhdGFUeXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25zdHJhaW50cyBmb3IgYSBjdXN0b20gYXR0cmlidXRlIG9mICdTdHJpbmcnIGRhdGEgdHlwZS5cbiAgICogQGRlZmF1bHQgLSBOb25lLlxuICAgKi9cbiAgcmVhZG9ubHkgc3RyaW5nQ29uc3RyYWludHM/OiBTdHJpbmdBdHRyaWJ1dGVDb25zdHJhaW50cztcblxuICAvKipcbiAgICogVGhlIGNvbnN0cmFpbnRzIGZvciBhIGN1c3RvbSBhdHRyaWJ1dGUgb2YgdGhlICdOdW1iZXInIGRhdGEgdHlwZS5cbiAgICogQGRlZmF1bHQgLSBOb25lLlxuICAgKi9cbiAgcmVhZG9ubHkgbnVtYmVyQ29uc3RyYWludHM/OiBOdW1iZXJBdHRyaWJ1dGVDb25zdHJhaW50cztcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUgY2FuIGJlIGNoYW5nZWQuXG4gICAqIEZvciBhbnkgdXNlciBwb29sIGF0dHJpYnV0ZSB0aGF0J3MgbWFwcGVkIHRvIGFuIGlkZW50aXR5IHByb3ZpZGVyIGF0dHJpYnV0ZSwgeW91IG11c3Qgc2V0IHRoaXMgcGFyYW1ldGVyIHRvIHRydWUuXG4gICAqIEFtYXpvbiBDb2duaXRvIHVwZGF0ZXMgbWFwcGVkIGF0dHJpYnV0ZXMgd2hlbiB1c2VycyBzaWduIGluIHRvIHlvdXIgYXBwbGljYXRpb24gdGhyb3VnaCBhbiBpZGVudGl0eSBwcm92aWRlci5cbiAgICogSWYgYW4gYXR0cmlidXRlIGlzIGltbXV0YWJsZSwgQW1hem9uIENvZ25pdG8gdGhyb3dzIGFuIGVycm9yIHdoZW4gaXQgYXR0ZW1wdHMgdG8gdXBkYXRlIHRoZSBhdHRyaWJ1dGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBtdXRhYmxlPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDb25zdHJhaW50cyB0aGF0IGNhbiBiZSBhcHBsaWVkIHRvIGEgY3VzdG9tIGF0dHJpYnV0ZSBvZiBhbnkgdHlwZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDdXN0b21BdHRyaWJ1dGVQcm9wcyB7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgd2hldGhlciB0aGUgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZSBjYW4gYmUgY2hhbmdlZC5cbiAgICogRm9yIGFueSB1c2VyIHBvb2wgYXR0cmlidXRlIHRoYXQncyBtYXBwZWQgdG8gYW4gaWRlbnRpdHkgcHJvdmlkZXIgYXR0cmlidXRlLCB5b3UgbXVzdCBzZXQgdGhpcyBwYXJhbWV0ZXIgdG8gdHJ1ZS5cbiAgICogQW1hem9uIENvZ25pdG8gdXBkYXRlcyBtYXBwZWQgYXR0cmlidXRlcyB3aGVuIHVzZXJzIHNpZ24gaW4gdG8geW91ciBhcHBsaWNhdGlvbiB0aHJvdWdoIGFuIGlkZW50aXR5IHByb3ZpZGVyLlxuICAgKiBJZiBhbiBhdHRyaWJ1dGUgaXMgaW1tdXRhYmxlLCBBbWF6b24gQ29nbml0byB0aHJvd3MgYW4gZXJyb3Igd2hlbiBpdCBhdHRlbXB0cyB0byB1cGRhdGUgdGhlIGF0dHJpYnV0ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IG11dGFibGU/OiBib29sZWFuXG59XG5cbi8qKlxuICogQ29uc3RyYWludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIGN1c3RvbSBhdHRyaWJ1dGUgb2Ygc3RyaW5nIHR5cGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RyaW5nQXR0cmlidXRlQ29uc3RyYWludHMge1xuICAvKipcbiAgICogTWluaW11bSBsZW5ndGggb2YgdGhpcyBhdHRyaWJ1dGUuXG4gICAqIEBkZWZhdWx0IDBcbiAgICovXG4gIHJlYWRvbmx5IG1pbkxlbj86IG51bWJlcjtcblxuICAvKipcbiAgICogTWF4aW11bSBsZW5ndGggb2YgdGhpcyBhdHRyaWJ1dGUuXG4gICAqIEBkZWZhdWx0IDIwNDhcbiAgICovXG4gIHJlYWRvbmx5IG1heExlbj86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBQcm9wcyBmb3IgY29uc3RydWN0aW5nIGEgU3RyaW5nQXR0clxuICovXG5leHBvcnQgaW50ZXJmYWNlIFN0cmluZ0F0dHJpYnV0ZVByb3BzIGV4dGVuZHMgU3RyaW5nQXR0cmlidXRlQ29uc3RyYWludHMsIEN1c3RvbUF0dHJpYnV0ZVByb3BzIHtcbn1cblxuLyoqXG4gKiBUaGUgU3RyaW5nIGN1c3RvbSBhdHRyaWJ1dGUgdHlwZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0cmluZ0F0dHJpYnV0ZSBpbXBsZW1lbnRzIElDdXN0b21BdHRyaWJ1dGUge1xuICBwcml2YXRlIHJlYWRvbmx5IG1pbkxlbj86IG51bWJlcjtcbiAgcHJpdmF0ZSByZWFkb25seSBtYXhMZW4/OiBudW1iZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgbXV0YWJsZT86IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IFN0cmluZ0F0dHJpYnV0ZVByb3BzID0ge30pIHtcbiAgICBpZiAocHJvcHMubWluTGVuICYmICFUb2tlbi5pc1VucmVzb2x2ZWQocHJvcHMubWluTGVuKSAmJiBwcm9wcy5taW5MZW4gPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYG1pbkxlbiBjYW5ub3QgYmUgbGVzcyB0aGFuIDAgKHZhbHVlOiAke3Byb3BzLm1pbkxlbn0pLmApO1xuICAgIH1cbiAgICBpZiAocHJvcHMubWF4TGVuICYmICFUb2tlbi5pc1VucmVzb2x2ZWQocHJvcHMubWF4TGVuKSAmJiBwcm9wcy5tYXhMZW4gPiAyMDQ4KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYG1heExlbiBjYW5ub3QgYmUgZ3JlYXRlciB0aGFuIDIwNDggKHZhbHVlOiAke3Byb3BzLm1heExlbn0pLmApO1xuICAgIH1cbiAgICB0aGlzLm1pbkxlbiA9IHByb3BzPy5taW5MZW47XG4gICAgdGhpcy5tYXhMZW4gPSBwcm9wcz8ubWF4TGVuO1xuICAgIHRoaXMubXV0YWJsZSA9IHByb3BzPy5tdXRhYmxlO1xuICB9XG5cbiAgcHVibGljIGJpbmQoKTogQ3VzdG9tQXR0cmlidXRlQ29uZmlnIHtcbiAgICBsZXQgc3RyaW5nQ29uc3RyYWludHM6IFN0cmluZ0F0dHJpYnV0ZUNvbnN0cmFpbnRzIHwgdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLm1pbkxlbiB8fCB0aGlzLm1heExlbikge1xuICAgICAgc3RyaW5nQ29uc3RyYWludHMgPSB7XG4gICAgICAgIG1pbkxlbjogdGhpcy5taW5MZW4sXG4gICAgICAgIG1heExlbjogdGhpcy5tYXhMZW4sXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBkYXRhVHlwZTogJ1N0cmluZycsXG4gICAgICBzdHJpbmdDb25zdHJhaW50cyxcbiAgICAgIG11dGFibGU6IHRoaXMubXV0YWJsZSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQ29uc3RyYWludHMgdGhhdCBjYW4gYmUgYXBwbGllZCB0byBhIGN1c3RvbSBhdHRyaWJ1dGUgb2YgbnVtYmVyIHR5cGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTnVtYmVyQXR0cmlidXRlQ29uc3RyYWludHMge1xuICAvKipcbiAgICogTWluaW11bSB2YWx1ZSBvZiB0aGlzIGF0dHJpYnV0ZS5cbiAgICogQGRlZmF1bHQgLSBubyBtaW5pbXVtIHZhbHVlXG4gICAqL1xuICByZWFkb25seSBtaW4/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIE1heGltdW0gdmFsdWUgb2YgdGhpcyBhdHRyaWJ1dGUuXG4gICAqIEBkZWZhdWx0IC0gbm8gbWF4aW11bSB2YWx1ZVxuICAgKi9cbiAgcmVhZG9ubHkgbWF4PzogbnVtYmVyO1xufVxuXG4vKipcbiAqIFByb3BzIGZvciBOdW1iZXJBdHRyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTnVtYmVyQXR0cmlidXRlUHJvcHMgZXh0ZW5kcyBOdW1iZXJBdHRyaWJ1dGVDb25zdHJhaW50cywgQ3VzdG9tQXR0cmlidXRlUHJvcHMge1xufVxuXG4vKipcbiAqIFRoZSBOdW1iZXIgY3VzdG9tIGF0dHJpYnV0ZSB0eXBlLlxuICovXG5leHBvcnQgY2xhc3MgTnVtYmVyQXR0cmlidXRlIGltcGxlbWVudHMgSUN1c3RvbUF0dHJpYnV0ZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbWluPzogbnVtYmVyO1xuICBwcml2YXRlIHJlYWRvbmx5IG1heD86IG51bWJlcjtcbiAgcHJpdmF0ZSByZWFkb25seSBtdXRhYmxlPzogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogTnVtYmVyQXR0cmlidXRlUHJvcHMgPSB7fSkge1xuICAgIHRoaXMubWluID0gcHJvcHM/Lm1pbjtcbiAgICB0aGlzLm1heCA9IHByb3BzPy5tYXg7XG4gICAgdGhpcy5tdXRhYmxlID0gcHJvcHM/Lm11dGFibGU7XG4gIH1cblxuICBwdWJsaWMgYmluZCgpOiBDdXN0b21BdHRyaWJ1dGVDb25maWcge1xuICAgIGxldCBudW1iZXJDb25zdHJhaW50czogTnVtYmVyQXR0cmlidXRlQ29uc3RyYWludHMgfCB1bmRlZmluZWQ7XG4gICAgaWYgKHRoaXMubWluIHx8IHRoaXMubWF4KSB7XG4gICAgICBudW1iZXJDb25zdHJhaW50cyA9IHtcbiAgICAgICAgbWluOiB0aGlzLm1pbixcbiAgICAgICAgbWF4OiB0aGlzLm1heCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGFUeXBlOiAnTnVtYmVyJyxcbiAgICAgIG51bWJlckNvbnN0cmFpbnRzLFxuICAgICAgbXV0YWJsZTogdGhpcy5tdXRhYmxlLFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgQm9vbGVhbiBjdXN0b20gYXR0cmlidXRlIHR5cGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBCb29sZWFuQXR0cmlidXRlIGltcGxlbWVudHMgSUN1c3RvbUF0dHJpYnV0ZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbXV0YWJsZT86IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IEN1c3RvbUF0dHJpYnV0ZVByb3BzID0ge30pIHtcbiAgICB0aGlzLm11dGFibGUgPSBwcm9wcz8ubXV0YWJsZTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKCk6IEN1c3RvbUF0dHJpYnV0ZUNvbmZpZyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGFUeXBlOiAnQm9vbGVhbicsXG4gICAgICBtdXRhYmxlOiB0aGlzLm11dGFibGUsXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBEYXRlVGltZSBjdXN0b20gYXR0cmlidXRlIHR5cGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBEYXRlVGltZUF0dHJpYnV0ZSBpbXBsZW1lbnRzIElDdXN0b21BdHRyaWJ1dGUge1xuICBwcml2YXRlIHJlYWRvbmx5IG11dGFibGU/OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBDdXN0b21BdHRyaWJ1dGVQcm9wcyA9IHt9KSB7XG4gICAgdGhpcy5tdXRhYmxlID0gcHJvcHM/Lm11dGFibGU7XG4gIH1cblxuICBwdWJsaWMgYmluZCgpOiBDdXN0b21BdHRyaWJ1dGVDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhVHlwZTogJ0RhdGVUaW1lJyxcbiAgICAgIG11dGFibGU6IHRoaXMubXV0YWJsZSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogVGhpcyBpbnRlcmZhY2UgY29udGFpbnMgc3RhbmRhcmQgYXR0cmlidXRlcyByZWNvZ25pemVkIGJ5IENvZ25pdG9cbiAqIGZyb20gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3VzZXItcG9vbC1zZXR0aW5ncy1hdHRyaWJ1dGVzLmh0bWxcbiAqIGluY2x1ZGluZyBidWlsdC1pbiBhdHRyaWJ1dGVzIGBlbWFpbF92ZXJpZmllZGAgYW5kIGBwaG9uZV9udW1iZXJfdmVyaWZpZWRgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RhbmRhcmRBdHRyaWJ1dGVzTWFzayB7XG4gIC8qKlxuICAgKiBUaGUgdXNlcidzIHBvc3RhbCBhZGRyZXNzLlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgYWRkcmVzcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSB1c2VyJ3MgYmlydGhkYXksIHJlcHJlc2VudGVkIGFzIGFuIElTTyA4NjAxOjIwMDQgZm9ybWF0LlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgYmlydGhkYXRlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHVzZXIncyBlLW1haWwgYWRkcmVzcywgcmVwcmVzZW50ZWQgYXMgYW4gUkZDIDUzMjIgW1JGQzUzMjJdIGFkZHItc3BlYy5cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGVtYWlsPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHN1cm5hbWUgb3IgbGFzdCBuYW1lIG9mIHRoZSB1c2VyLlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZmFtaWx5TmFtZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSB1c2VyJ3MgZ2VuZGVyLlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZ2VuZGVyPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHVzZXIncyBmaXJzdCBuYW1lIG9yIGdpdmUgbmFtZS5cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGdpdmVuTmFtZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSB1c2VyJ3MgbG9jYWxlLCByZXByZXNlbnRlZCBhcyBhIEJDUDQ3IFtSRkM1NjQ2XSBsYW5ndWFnZSB0YWcuXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBsb2NhbGU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgdXNlcidzIG1pZGRsZSBuYW1lLlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgbWlkZGxlTmFtZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSB1c2VyJ3MgZnVsbCBuYW1lIGluIGRpc3BsYXlhYmxlIGZvcm0sIGluY2x1ZGluZyBhbGwgbmFtZSBwYXJ0cywgdGl0bGVzIGFuZCBzdWZmaXhlcy5cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGZ1bGxuYW1lPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHVzZXIncyBuaWNrbmFtZSBvciBjYXN1YWwgbmFtZS5cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IG5pY2tuYW1lPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHVzZXIncyB0ZWxlcGhvbmUgbnVtYmVyLlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcGhvbmVOdW1iZXI/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgVVJMIHRvIHRoZSB1c2VyJ3MgcHJvZmlsZSBwaWN0dXJlLlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJvZmlsZVBpY3R1cmU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgdXNlcidzIHByZWZmZXJlZCB1c2VybmFtZSwgZGlmZmVyZW50IGZyb20gdGhlIGltbXV0YWJsZSB1c2VyIG5hbWUuXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBwcmVmZXJyZWRVc2VybmFtZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBVUkwgdG8gdGhlIHVzZXIncyBwcm9maWxlIHBhZ2UuXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBwcm9maWxlUGFnZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSB1c2VyJ3MgdGltZSB6b25lLlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgdGltZXpvbmU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgdGltZSwgdGhlIHVzZXIncyBpbmZvcm1hdGlvbiB3YXMgbGFzdCB1cGRhdGVkLlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgbGFzdFVwZGF0ZVRpbWU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgVVJMIHRvIHRoZSB1c2VyJ3Mgd2ViIHBhZ2Ugb3IgYmxvZy5cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHdlYnNpdGU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBlbWFpbCBhZGRyZXNzIGhhcyBiZWVuIHZlcmlmaWVkLlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZW1haWxWZXJpZmllZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHBob25lIG51bWJlciBoYXMgYmVlbiB2ZXJpZmllZC5cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHBob25lTnVtYmVyVmVyaWZpZWQ/OiBib29sZWFuO1xufVxuXG5cbi8qKlxuICogQSBzZXQgb2YgYXR0cmlidXRlcywgdXNlZnVsIHRvIHNldCBSZWFkIGFuZCBXcml0ZSBhdHRyaWJ1dGVzXG4gKi9cbmV4cG9ydCBjbGFzcyBDbGllbnRBdHRyaWJ1dGVzIHtcblxuICAvKipcbiAgICogVGhlIHNldCBvZiBhdHRyaWJ1dGVzXG4gICAqL1xuICBwcml2YXRlIGF0dHJpYnV0ZXNTZXQ6IFNldDxzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgQ2xpZW50QXR0cmlidXRlcyB3aXRoIHRoZSBzcGVjaWZpZWQgYXR0cmlidXRlc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIGEgQ2xpZW50QXR0cmlidXRlcyBvYmplY3Qgd2l0aG91dCBhbnkgYXR0cmlidXRlc1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hdHRyaWJ1dGVzU2V0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGN1c3RvbSBDbGllbnRBdHRyaWJ1dGVzIHdpdGggdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGVzXG4gICAqIEBwYXJhbSBhdHRyaWJ1dGVzIGEgbGlzdCBvZiBzdGFuZGFyZCBhdHRyaWJ1dGVzIHRvIGFkZCB0byB0aGUgc2V0XG4gICAqL1xuICBwdWJsaWMgd2l0aFN0YW5kYXJkQXR0cmlidXRlcyhhdHRyaWJ1dGVzOiBTdGFuZGFyZEF0dHJpYnV0ZXNNYXNrKTogQ2xpZW50QXR0cmlidXRlcyB7XG4gICAgbGV0IGF0dHJpYnV0ZXNTZXQgPSBuZXcgU2V0KHRoaXMuYXR0cmlidXRlc1NldCk7XG4gICAgLy8gaXRlcmF0ZSB0aHJvdWdoIGtleS12YWx1ZXMgaW4gdGhlIGBTdGFuZGFyZEF0dHJpYnV0ZU5hbWVzYCBjb25zdGFudFxuICAgIC8vIHRvIGdldCB0aGUgdmFsdWUgZm9yIGFsbCBhdHRyaWJ1dGVzXG4gICAgZm9yIChjb25zdCBhdHRyaWJ1dGVLZXkgaW4gU3RhbmRhcmRBdHRyaWJ1dGVOYW1lcykge1xuICAgICAgaWYgKChhdHRyaWJ1dGVzIGFzIGFueSlbYXR0cmlidXRlS2V5XSA9PT0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gKFN0YW5kYXJkQXR0cmlidXRlTmFtZXMgYXMgYW55KVthdHRyaWJ1dGVLZXldO1xuICAgICAgICBhdHRyaWJ1dGVzU2V0LmFkZChhdHRyaWJ1dGVOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IGF1eCA9IG5ldyBDbGllbnRBdHRyaWJ1dGVzKCk7XG4gICAgYXV4LmF0dHJpYnV0ZXNTZXQgPSBhdHRyaWJ1dGVzU2V0O1xuICAgIHJldHVybiBhdXg7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGN1c3RvbSBDbGllbnRBdHRyaWJ1dGVzIHdpdGggdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGVzXG4gICAqIEBwYXJhbSBhdHRyaWJ1dGVzIGEgbGlzdCBvZiBjdXN0b20gYXR0cmlidXRlcyB0byBhZGQgdG8gdGhlIHNldFxuICAgKi9cbiAgcHVibGljIHdpdGhDdXN0b21BdHRyaWJ1dGVzKC4uLmF0dHJpYnV0ZXM6IHN0cmluZ1tdKTogQ2xpZW50QXR0cmlidXRlcyB7XG4gICAgbGV0IGF0dHJpYnV0ZXNTZXQ6IFNldDxzdHJpbmc+ID0gbmV3IFNldCh0aGlzLmF0dHJpYnV0ZXNTZXQpO1xuICAgIGZvciAobGV0IGF0dHJpYnV0ZSBvZiBhdHRyaWJ1dGVzKSB7XG4gICAgICAvLyBjdXN0b20gYXR0cmlidXRlcyBNVVNUIGJlZ2luIHdpdGggYGN1c3RvbTpgLCBzbyBhZGQgdGhlIHN0cmluZyBpZiBub3QgcHJlc2VudFxuICAgICAgaWYgKCFhdHRyaWJ1dGUuc3RhcnRzV2l0aCgnY3VzdG9tOicpKSB7XG4gICAgICAgIGF0dHJpYnV0ZSA9ICdjdXN0b206JyArIGF0dHJpYnV0ZTtcbiAgICAgIH1cbiAgICAgIGF0dHJpYnV0ZXNTZXQuYWRkKGF0dHJpYnV0ZSk7XG4gICAgfVxuICAgIGxldCBhdXggPSBuZXcgQ2xpZW50QXR0cmlidXRlcygpO1xuICAgIGF1eC5hdHRyaWJ1dGVzU2V0ID0gYXR0cmlidXRlc1NldDtcbiAgICByZXR1cm4gYXV4O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIGF0dHJpYnV0ZXMgcmVwcmVzZW50ZWQgYnkgdGhpcyBDbGllbnRBdHRyaWJ1dGVzXG4gICAqL1xuICBwdWJsaWMgYXR0cmlidXRlcygpOiBzdHJpbmdbXSB7XG4gICAgLy8gc29ydGluZyBpcyB1bm5lY2Vzc2FyeSBidXQgaXQgc2ltcGxpZnkgdGVzdGluZ1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuYXR0cmlidXRlc1NldCkuc29ydCgpO1xuICB9XG59XG4iXX0=