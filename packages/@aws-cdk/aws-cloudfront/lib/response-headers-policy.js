"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadersReferrerPolicy = exports.HeadersFrameOption = exports.ResponseHeadersPolicy = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const cloudfront_generated_1 = require("./cloudfront.generated");
/**
 * A Response Headers Policy configuration
 *
 * @resource AWS::CloudFront::ResponseHeadersPolicy
 */
class ResponseHeadersPolicy extends core_1.Resource {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.responseHeadersPolicyName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_ResponseHeadersPolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ResponseHeadersPolicy);
            }
            throw error;
        }
        const responseHeadersPolicyName = props.responseHeadersPolicyName ?? core_1.Names.uniqueResourceName(this, {
            maxLength: 128,
        });
        const resource = new cloudfront_generated_1.CfnResponseHeadersPolicy(this, 'Resource', {
            responseHeadersPolicyConfig: {
                name: responseHeadersPolicyName,
                comment: props.comment,
                corsConfig: props.corsBehavior ? this._renderCorsConfig(props.corsBehavior) : undefined,
                customHeadersConfig: props.customHeadersBehavior ? this._renderCustomHeadersConfig(props.customHeadersBehavior) : undefined,
                securityHeadersConfig: props.securityHeadersBehavior ? this._renderSecurityHeadersConfig(props.securityHeadersBehavior) : undefined,
                removeHeadersConfig: props.removeHeaders ? this._renderRemoveHeadersConfig(props.removeHeaders) : undefined,
                serverTimingHeadersConfig: props.serverTimingSamplingRate ? this._renderServerTimingHeadersConfig(props.serverTimingSamplingRate) : undefined,
            },
        });
        this.responseHeadersPolicyId = resource.ref;
    }
    /**
     * Import an existing Response Headers Policy from its ID.
     */
    static fromResponseHeadersPolicyId(scope, id, responseHeadersPolicyId) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.responseHeadersPolicyId = responseHeadersPolicyId;
            }
        }
        return new Import(scope, id);
    }
    static fromManagedResponseHeadersPolicy(managedResponseHeadersPolicyId) {
        return new class {
            constructor() {
                this.responseHeadersPolicyId = managedResponseHeadersPolicyId;
            }
        };
    }
    _renderCorsConfig(behavior) {
        return {
            accessControlAllowCredentials: behavior.accessControlAllowCredentials,
            accessControlAllowHeaders: { items: behavior.accessControlAllowHeaders },
            accessControlAllowMethods: { items: behavior.accessControlAllowMethods },
            accessControlAllowOrigins: { items: behavior.accessControlAllowOrigins },
            accessControlExposeHeaders: behavior.accessControlExposeHeaders ? { items: behavior.accessControlExposeHeaders } : undefined,
            accessControlMaxAgeSec: behavior.accessControlMaxAge ? behavior.accessControlMaxAge.toSeconds() : undefined,
            originOverride: behavior.originOverride,
        };
    }
    _renderCustomHeadersConfig(behavior) {
        return {
            items: behavior.customHeaders,
        };
    }
    _renderSecurityHeadersConfig(behavior) {
        return {
            contentSecurityPolicy: behavior.contentSecurityPolicy,
            contentTypeOptions: behavior.contentTypeOptions,
            frameOptions: behavior.frameOptions,
            referrerPolicy: behavior.referrerPolicy,
            strictTransportSecurity: behavior.strictTransportSecurity ? {
                ...behavior.strictTransportSecurity,
                accessControlMaxAgeSec: behavior.strictTransportSecurity.accessControlMaxAge.toSeconds(),
            } : undefined,
            xssProtection: behavior.xssProtection,
        };
    }
    _renderRemoveHeadersConfig(headers) {
        const readonlyHeaders = ['content-encoding', 'content-length', 'transfer-encoding', 'warning', 'via'];
        return {
            items: headers.map(header => {
                if (!core_1.Token.isUnresolved(header) && readonlyHeaders.includes(header.toLowerCase())) {
                    throw new Error(`Cannot remove read-only header ${header}`);
                }
                return { header };
            }),
        };
    }
    _renderServerTimingHeadersConfig(samplingRate) {
        if (!core_1.Token.isUnresolved(samplingRate)) {
            if ((samplingRate < 0 || samplingRate > 100)) {
                throw new Error(`Sampling rate must be between 0 and 100 (inclusive), received ${samplingRate}`);
            }
            if (!hasMaxDecimalPlaces(samplingRate, 4)) {
                throw new Error(`Sampling rate can have up to four decimal places, received ${samplingRate}`);
            }
        }
        return {
            enabled: true,
            samplingRate,
        };
    }
}
exports.ResponseHeadersPolicy = ResponseHeadersPolicy;
_a = JSII_RTTI_SYMBOL_1;
ResponseHeadersPolicy[_a] = { fqn: "@aws-cdk/aws-cloudfront.ResponseHeadersPolicy", version: "0.0.0" };
/** Use this managed policy to allow simple CORS requests from any origin. */
ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS = ResponseHeadersPolicy.fromManagedResponseHeadersPolicy('60669652-455b-4ae9-85a4-c4c02393f86c');
/** Use this managed policy to allow CORS requests from any origin, including preflight requests. */
ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT = ResponseHeadersPolicy.fromManagedResponseHeadersPolicy('5cc3b908-e619-4b99-88e5-2cf7f45965bd');
/** Use this managed policy to add a set of security headers to all responses that CloudFront sends to viewers. */
ResponseHeadersPolicy.SECURITY_HEADERS = ResponseHeadersPolicy.fromManagedResponseHeadersPolicy('67f7725c-6f97-4210-82d7-5512b31e9d03');
/** Use this managed policy to allow simple CORS requests from any origin and add a set of security headers to all responses that CloudFront sends to viewers. */
ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_AND_SECURITY_HEADERS = ResponseHeadersPolicy.fromManagedResponseHeadersPolicy('e61eb60c-9c35-4d20-a928-2b84e02af89c');
/** Use this managed policy to allow CORS requests from any origin, including preflight requests, and add a set of security headers to all responses that CloudFront sends to viewers. */
ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS = ResponseHeadersPolicy.fromManagedResponseHeadersPolicy('eaab4381-ed33-4a86-88ca-d9558dc6cd63');
/**
 * Enum representing possible values of the X-Frame-Options HTTP response header.
 */
var HeadersFrameOption;
(function (HeadersFrameOption) {
    /**
     * The page can only be displayed in a frame on the same origin as the page itself.
     */
    HeadersFrameOption["DENY"] = "DENY";
    /**
     * The page can only be displayed in a frame on the specified origin.
     */
    HeadersFrameOption["SAMEORIGIN"] = "SAMEORIGIN";
})(HeadersFrameOption = exports.HeadersFrameOption || (exports.HeadersFrameOption = {}));
/**
 * Enum representing possible values of the Referrer-Policy HTTP response header.
 */
var HeadersReferrerPolicy;
(function (HeadersReferrerPolicy) {
    /**
     * The referrer policy is not set.
     */
    HeadersReferrerPolicy["NO_REFERRER"] = "no-referrer";
    /**
     * The referrer policy is no-referrer-when-downgrade.
     */
    HeadersReferrerPolicy["NO_REFERRER_WHEN_DOWNGRADE"] = "no-referrer-when-downgrade";
    /**
     * The referrer policy is origin.
     */
    HeadersReferrerPolicy["ORIGIN"] = "origin";
    /**
     * The referrer policy is origin-when-cross-origin.
     */
    HeadersReferrerPolicy["ORIGIN_WHEN_CROSS_ORIGIN"] = "origin-when-cross-origin";
    /**
     * The referrer policy is same-origin.
     */
    HeadersReferrerPolicy["SAME_ORIGIN"] = "same-origin";
    /**
     * The referrer policy is strict-origin.
     */
    HeadersReferrerPolicy["STRICT_ORIGIN"] = "strict-origin";
    /**
     * The referrer policy is strict-origin-when-cross-origin.
     */
    HeadersReferrerPolicy["STRICT_ORIGIN_WHEN_CROSS_ORIGIN"] = "strict-origin-when-cross-origin";
    /**
     * The referrer policy is unsafe-url.
     */
    HeadersReferrerPolicy["UNSAFE_URL"] = "unsafe-url";
})(HeadersReferrerPolicy = exports.HeadersReferrerPolicy || (exports.HeadersReferrerPolicy = {}));
function hasMaxDecimalPlaces(num, decimals) {
    const parts = num.toString().split('.');
    return parts.length === 1 || parts[1].length <= decimals;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uc2UtaGVhZGVycy1wb2xpY3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXNwb25zZS1oZWFkZXJzLXBvbGljeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBaUU7QUFFakUsaUVBQWtFO0FBcUVsRTs7OztHQUlHO0FBQ0gsTUFBYSxxQkFBc0IsU0FBUSxlQUFRO0lBK0JqRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQW9DLEVBQUU7UUFDOUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLHlCQUF5QjtTQUM5QyxDQUFDLENBQUM7Ozs7OzsrQ0FsQ00scUJBQXFCOzs7O1FBb0M5QixNQUFNLHlCQUF5QixHQUFHLEtBQUssQ0FBQyx5QkFBeUIsSUFBSSxZQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFO1lBQ2xHLFNBQVMsRUFBRSxHQUFHO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSwrQ0FBd0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzlELDJCQUEyQixFQUFFO2dCQUMzQixJQUFJLEVBQUUseUJBQXlCO2dCQUMvQixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87Z0JBQ3RCLFVBQVUsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUN2RixtQkFBbUIsRUFBRSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztnQkFDM0gscUJBQXFCLEVBQUUsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsS0FBSyxD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QXFCLENBQUMsZ0NBQWdDLENBQUMsc0NBQXNDLENBQUMsQ0FBQztBQXdXckw7O0dBRUc7QUFDSCxJQUFZLGtCQVVYO0FBVkQsV0FBWSxrQkFBa0I7SUFDNUI7O09BRUc7SUFDSCxtQ0FBYSxDQUFBO0lBRWI7O09BRUc7SUFDSCwrQ0FBeUIsQ0FBQTtBQUMzQixDQUFDLEVBVlcsa0JBQWtCLEdBQWxCLDBCQUFrQixLQUFsQiwwQkFBa0IsUUFVN0I7QUFFRDs7R0FFRztBQUNILElBQVkscUJBd0NYO0FBeENELFdBQVkscUJBQXFCO0lBQy9COztPQUVHO0lBQ0gsb0RBQTJCLENBQUE7SUFFM0I7O09BRUc7SUFDSCxrRkFBeUQsQ0FBQTtJQUV6RDs7T0FFRztJQUNILDBDQUFpQixDQUFBO0lBRWpCOztPQUVHO0lBQ0gsOEVBQXFELENBQUE7SUFFckQ7O09BRUc7SUFDSCxvREFBMkIsQ0FBQTtJQUUzQjs7T0FFRztJQUNILHdEQUErQixDQUFBO0lBRS9COztPQUVHO0lBQ0gsNEZBQW1FLENBQUE7SUFFbkU7O09BRUc7SUFDSCxrREFBeUIsQ0FBQTtBQUMzQixDQUFDLEVBeENXLHFCQUFxQixHQUFyQiw2QkFBcUIsS0FBckIsNkJBQXFCLFFBd0NoQztBQUVELFNBQVMsbUJBQW1CLENBQUMsR0FBVyxFQUFFLFFBQWdCO0lBQ3hELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEMsT0FBTyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQztBQUMzRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHVyYXRpb24sIE5hbWVzLCBSZXNvdXJjZSwgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuUmVzcG9uc2VIZWFkZXJzUG9saWN5IH0gZnJvbSAnLi9jbG91ZGZyb250LmdlbmVyYXRlZCc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHJlc3BvbnNlIGhlYWRlcnMgcG9saWN5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElSZXNwb25zZUhlYWRlcnNQb2xpY3kge1xuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSByZXNwb25zZSBoZWFkZXJzIHBvbGljeVxuICAgKiBAYXR0cmlidXRlXG4gICAqKi9cbiAgcmVhZG9ubHkgcmVzcG9uc2VIZWFkZXJzUG9saWN5SWQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBjcmVhdGluZyBhIFJlc3BvbnNlIEhlYWRlcnMgUG9saWN5XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVzcG9uc2VIZWFkZXJzUG9saWN5UHJvcHMge1xuICAvKipcbiAgICogQSB1bmlxdWUgbmFtZSB0byBpZGVudGlmeSB0aGUgcmVzcG9uc2UgaGVhZGVycyBwb2xpY3kuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZ2VuZXJhdGVkIGZyb20gdGhlIGBpZGBcbiAgICovXG4gIHJlYWRvbmx5IHJlc3BvbnNlSGVhZGVyc1BvbGljeU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgY29tbWVudCB0byBkZXNjcmliZSB0aGUgcmVzcG9uc2UgaGVhZGVycyBwb2xpY3kuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gY29tbWVudFxuICAgKi9cbiAgcmVhZG9ubHkgY29tbWVudD86IHN0cmluZztcblxuICAvKipcbiAgICogQSBjb25maWd1cmF0aW9uIGZvciBhIHNldCBvZiBIVFRQIHJlc3BvbnNlIGhlYWRlcnMgdGhhdCBhcmUgdXNlZCBmb3IgY3Jvc3Mtb3JpZ2luIHJlc291cmNlIHNoYXJpbmcgKENPUlMpLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGNvcnMgYmVoYXZpb3JcbiAgICovXG4gIHJlYWRvbmx5IGNvcnNCZWhhdmlvcj86IFJlc3BvbnNlSGVhZGVyc0NvcnNCZWhhdmlvcjtcblxuICAvKipcbiAgICogQSBjb25maWd1cmF0aW9uIGZvciBhIHNldCBvZiBjdXN0b20gSFRUUCByZXNwb25zZSBoZWFkZXJzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGN1c3RvbSBoZWFkZXJzIGJlaGF2aW9yXG4gICAqL1xuICByZWFkb25seSBjdXN0b21IZWFkZXJzQmVoYXZpb3I/OiBSZXNwb25zZUN1c3RvbUhlYWRlcnNCZWhhdmlvcjtcblxuICAvKipcbiAgICogQSBjb25maWd1cmF0aW9uIGZvciBhIHNldCBvZiBzZWN1cml0eS1yZWxhdGVkIEhUVFAgcmVzcG9uc2UgaGVhZGVycy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBzZWN1cml0eSBoZWFkZXJzIGJlaGF2aW9yXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eUhlYWRlcnNCZWhhdmlvcj86IFJlc3BvbnNlU2VjdXJpdHlIZWFkZXJzQmVoYXZpb3I7XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBIVFRQIHJlc3BvbnNlIGhlYWRlcnMgdGhhdCBDbG91ZEZyb250IHJlbW92ZXMgZnJvbSBIVFRQIHJlc3BvbnNlc1xuICAgKiB0aGF0IGl0IHNlbmRzIHRvIHZpZXdlcnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gaGVhZGVycyBhcmUgcmVtb3ZlZFxuICAgKi9cbiAgcmVhZG9ubHkgcmVtb3ZlSGVhZGVycz86IHN0cmluZ1tdXG5cbiAgLyoqXG4gICAqIFRoZSBwZXJjZW50YWdlIG9mIHJlc3BvbnNlcyB0aGF0IHlvdSB3YW50IENsb3VkRnJvbnQgdG8gYWRkIHRoZSBTZXJ2ZXItVGltaW5nXG4gICAqIGhlYWRlciB0by5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBTZXJ2ZXItVGltaW5nIGhlYWRlciBpcyBhZGRlZCB0byBIVFRQIHJlc3BvbnNlc1xuICAgKi9cbiAgcmVhZG9ubHkgc2VydmVyVGltaW5nU2FtcGxpbmdSYXRlPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIEEgUmVzcG9uc2UgSGVhZGVycyBQb2xpY3kgY29uZmlndXJhdGlvblxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkNsb3VkRnJvbnQ6OlJlc3BvbnNlSGVhZGVyc1BvbGljeVxuICovXG5leHBvcnQgY2xhc3MgUmVzcG9uc2VIZWFkZXJzUG9saWN5IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJUmVzcG9uc2VIZWFkZXJzUG9saWN5IHtcblxuICAvKiogVXNlIHRoaXMgbWFuYWdlZCBwb2xpY3kgdG8gYWxsb3cgc2ltcGxlIENPUlMgcmVxdWVzdHMgZnJvbSBhbnkgb3JpZ2luLiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENPUlNfQUxMT1dfQUxMX09SSUdJTlMgPSBSZXNwb25zZUhlYWRlcnNQb2xpY3kuZnJvbU1hbmFnZWRSZXNwb25zZUhlYWRlcnNQb2xpY3koJzYwNjY5NjUyLTQ1NWItNGFlOS04NWE0LWM0YzAyMzkzZjg2YycpO1xuICAvKiogVXNlIHRoaXMgbWFuYWdlZCBwb2xpY3kgdG8gYWxsb3cgQ09SUyByZXF1ZXN0cyBmcm9tIGFueSBvcmlnaW4sIGluY2x1ZGluZyBwcmVmbGlnaHQgcmVxdWVzdHMuICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ09SU19BTExPV19BTExfT1JJR0lOU19XSVRIX1BSRUZMSUdIVCA9IFJlc3BvbnNlSGVhZGVyc1BvbGljeS5mcm9tTWFuYWdlZFJlc3BvbnNlSGVhZGVyc1BvbGljeSgnNWNjM2I5MDgtZTYxOS00Yjk5LTg4ZTUtMmNmN2Y0NTk2NWJkJyk7XG4gIC8qKiBVc2UgdGhpcyBtYW5hZ2VkIHBvbGljeSB0byBhZGQgYSBzZXQgb2Ygc2VjdXJpdHkgaGVhZGVycyB0byBhbGwgcmVzcG9uc2VzIHRoYXQgQ2xvdWRGcm9udCBzZW5kcyB0byB2aWV3ZXJzLiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFNFQ1VSSVRZX0hFQURFUlMgPSBSZXNwb25zZUhlYWRlcnNQb2xpY3kuZnJvbU1hbmFnZWRSZXNwb25zZUhlYWRlcnNQb2xpY3koJzY3Zjc3MjVjLTZmOTctNDIxMC04MmQ3LTU1MTJiMzFlOWQwMycpO1xuICAvKiogVXNlIHRoaXMgbWFuYWdlZCBwb2xpY3kgdG8gYWxsb3cgc2ltcGxlIENPUlMgcmVxdWVzdHMgZnJvbSBhbnkgb3JpZ2luIGFuZCBhZGQgYSBzZXQgb2Ygc2VjdXJpdHkgaGVhZGVycyB0byBhbGwgcmVzcG9uc2VzIHRoYXQgQ2xvdWRGcm9udCBzZW5kcyB0byB2aWV3ZXJzLiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENPUlNfQUxMT1dfQUxMX09SSUdJTlNfQU5EX1NFQ1VSSVRZX0hFQURFUlMgPSBSZXNwb25zZUhlYWRlcnNQb2xpY3kuZnJvbU1hbmFnZWRSZXNwb25zZUhlYWRlcnNQb2xpY3koJ2U2MWViNjBjLTljMzUtNGQyMC1hOTI4LTJiODRlMDJhZjg5YycpO1xuICAvKiogVXNlIHRoaXMgbWFuYWdlZCBwb2xpY3kgdG8gYWxsb3cgQ09SUyByZXF1ZXN0cyBmcm9tIGFueSBvcmlnaW4sIGluY2x1ZGluZyBwcmVmbGlnaHQgcmVxdWVzdHMsIGFuZCBhZGQgYSBzZXQgb2Ygc2VjdXJpdHkgaGVhZGVycyB0byBhbGwgcmVzcG9uc2VzIHRoYXQgQ2xvdWRGcm9udCBzZW5kcyB0byB2aWV3ZXJzLiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENPUlNfQUxMT1dfQUxMX09SSUdJTlNfV0lUSF9QUkVGTElHSFRfQU5EX1NFQ1VSSVRZX0hFQURFUlMgPSBSZXNwb25zZUhlYWRlcnNQb2xpY3kuZnJvbU1hbmFnZWRSZXNwb25zZUhlYWRlcnNQb2xpY3koJ2VhYWI0MzgxLWVkMzMtNGE4Ni04OGNhLWQ5NTU4ZGM2Y2Q2MycpO1xuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgUmVzcG9uc2UgSGVhZGVycyBQb2xpY3kgZnJvbSBpdHMgSUQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21SZXNwb25zZUhlYWRlcnNQb2xpY3lJZChzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNwb25zZUhlYWRlcnNQb2xpY3lJZDogc3RyaW5nKTogSVJlc3BvbnNlSGVhZGVyc1BvbGljeSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJUmVzcG9uc2VIZWFkZXJzUG9saWN5IHtcbiAgICAgIHB1YmxpYyByZWFkb25seSByZXNwb25zZUhlYWRlcnNQb2xpY3lJZCA9IHJlc3BvbnNlSGVhZGVyc1BvbGljeUlkO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZnJvbU1hbmFnZWRSZXNwb25zZUhlYWRlcnNQb2xpY3kobWFuYWdlZFJlc3BvbnNlSGVhZGVyc1BvbGljeUlkOiBzdHJpbmcpOiBJUmVzcG9uc2VIZWFkZXJzUG9saWN5IHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGltcGxlbWVudHMgSVJlc3BvbnNlSGVhZGVyc1BvbGljeSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgcmVzcG9uc2VIZWFkZXJzUG9saWN5SWQgPSBtYW5hZ2VkUmVzcG9uc2VIZWFkZXJzUG9saWN5SWQ7XG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSByZXNwb25zZUhlYWRlcnNQb2xpY3lJZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBSZXNwb25zZUhlYWRlcnNQb2xpY3lQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLnJlc3BvbnNlSGVhZGVyc1BvbGljeU5hbWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNwb25zZUhlYWRlcnNQb2xpY3lOYW1lID0gcHJvcHMucmVzcG9uc2VIZWFkZXJzUG9saWN5TmFtZSA/PyBOYW1lcy51bmlxdWVSZXNvdXJjZU5hbWUodGhpcywge1xuICAgICAgbWF4TGVuZ3RoOiAxMjgsXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5SZXNwb25zZUhlYWRlcnNQb2xpY3kodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgcmVzcG9uc2VIZWFkZXJzUG9saWN5Q29uZmlnOiB7XG4gICAgICAgIG5hbWU6IHJlc3BvbnNlSGVhZGVyc1BvbGljeU5hbWUsXG4gICAgICAgIGNvbW1lbnQ6IHByb3BzLmNvbW1lbnQsXG4gICAgICAgIGNvcnNDb25maWc6IHByb3BzLmNvcnNCZWhhdmlvciA/IHRoaXMuX3JlbmRlckNvcnNDb25maWcocHJvcHMuY29yc0JlaGF2aW9yKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3VzdG9tSGVhZGVyc0NvbmZpZzogcHJvcHMuY3VzdG9tSGVhZGVyc0JlaGF2aW9yID8gdGhpcy5fcmVuZGVyQ3VzdG9tSGVhZGVyc0NvbmZpZyhwcm9wcy5jdXN0b21IZWFkZXJzQmVoYXZpb3IpIDogdW5kZWZpbmVkLFxuICAgICAgICBzZWN1cml0eUhlYWRlcnNDb25maWc6IHByb3BzLnNlY3VyaXR5SGVhZGVyc0JlaGF2aW9yID8gdGhpcy5fcmVuZGVyU2VjdXJpdHlIZWFkZXJzQ29uZmlnKHByb3BzLnNlY3VyaXR5SGVhZGVyc0JlaGF2aW9yKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgcmVtb3ZlSGVhZGVyc0NvbmZpZzogcHJvcHMucmVtb3ZlSGVhZGVycyA/IHRoaXMuX3JlbmRlclJlbW92ZUhlYWRlcnNDb25maWcocHJvcHMucmVtb3ZlSGVhZGVycykgOiB1bmRlZmluZWQsXG4gICAgICAgIHNlcnZlclRpbWluZ0hlYWRlcnNDb25maWc6IHByb3BzLnNlcnZlclRpbWluZ1NhbXBsaW5nUmF0ZSA/IHRoaXMuX3JlbmRlclNlcnZlclRpbWluZ0hlYWRlcnNDb25maWcocHJvcHMuc2VydmVyVGltaW5nU2FtcGxpbmdSYXRlKSA6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlc3BvbnNlSGVhZGVyc1BvbGljeUlkID0gcmVzb3VyY2UucmVmO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVuZGVyQ29yc0NvbmZpZyhiZWhhdmlvcjogUmVzcG9uc2VIZWFkZXJzQ29yc0JlaGF2aW9yKTogQ2ZuUmVzcG9uc2VIZWFkZXJzUG9saWN5LkNvcnNDb25maWdQcm9wZXJ0eSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjY2Vzc0NvbnRyb2xBbGxvd0NyZWRlbnRpYWxzOiBiZWhhdmlvci5hY2Nlc3NDb250cm9sQWxsb3dDcmVkZW50aWFscyxcbiAgICAgIGFjY2Vzc0NvbnRyb2xBbGxvd0hlYWRlcnM6IHsgaXRlbXM6IGJlaGF2aW9yLmFjY2Vzc0NvbnRyb2xBbGxvd0hlYWRlcnMgfSxcbiAgICAgIGFjY2Vzc0NvbnRyb2xBbGxvd01ldGhvZHM6IHsgaXRlbXM6IGJlaGF2aW9yLmFjY2Vzc0NvbnRyb2xBbGxvd01ldGhvZHMgfSxcbiAgICAgIGFjY2Vzc0NvbnRyb2xBbGxvd09yaWdpbnM6IHsgaXRlbXM6IGJlaGF2aW9yLmFjY2Vzc0NvbnRyb2xBbGxvd09yaWdpbnMgfSxcbiAgICAgIGFjY2Vzc0NvbnRyb2xFeHBvc2VIZWFkZXJzOiBiZWhhdmlvci5hY2Nlc3NDb250cm9sRXhwb3NlSGVhZGVycyA/IHsgaXRlbXM6IGJlaGF2aW9yLmFjY2Vzc0NvbnRyb2xFeHBvc2VIZWFkZXJzIH0gOiB1bmRlZmluZWQsXG4gICAgICBhY2Nlc3NDb250cm9sTWF4QWdlU2VjOiBiZWhhdmlvci5hY2Nlc3NDb250cm9sTWF4QWdlID8gYmVoYXZpb3IuYWNjZXNzQ29udHJvbE1heEFnZS50b1NlY29uZHMoKSA6IHVuZGVmaW5lZCxcbiAgICAgIG9yaWdpbk92ZXJyaWRlOiBiZWhhdmlvci5vcmlnaW5PdmVycmlkZSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVuZGVyQ3VzdG9tSGVhZGVyc0NvbmZpZyhiZWhhdmlvcjogUmVzcG9uc2VDdXN0b21IZWFkZXJzQmVoYXZpb3IpOiBDZm5SZXNwb25zZUhlYWRlcnNQb2xpY3kuQ3VzdG9tSGVhZGVyc0NvbmZpZ1Byb3BlcnR5IHtcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXM6IGJlaGF2aW9yLmN1c3RvbUhlYWRlcnMsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlbmRlclNlY3VyaXR5SGVhZGVyc0NvbmZpZyhiZWhhdmlvcjogUmVzcG9uc2VTZWN1cml0eUhlYWRlcnNCZWhhdmlvcik6IENmblJlc3BvbnNlSGVhZGVyc1BvbGljeS5TZWN1cml0eUhlYWRlcnNDb25maWdQcm9wZXJ0eSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnRTZWN1cml0eVBvbGljeTogYmVoYXZpb3IuY29udGVudFNlY3VyaXR5UG9saWN5LFxuICAgICAgY29udGVudFR5cGVPcHRpb25zOiBiZWhhdmlvci5jb250ZW50VHlwZU9wdGlvbnMsXG4gICAgICBmcmFtZU9wdGlvbnM6IGJlaGF2aW9yLmZyYW1lT3B0aW9ucyxcbiAgICAgIHJlZmVycmVyUG9saWN5OiBiZWhhdmlvci5yZWZlcnJlclBvbGljeSxcbiAgICAgIHN0cmljdFRyYW5zcG9ydFNlY3VyaXR5OiBiZWhhdmlvci5zdHJpY3RUcmFuc3BvcnRTZWN1cml0eSA/IHtcbiAgICAgICAgLi4uYmVoYXZpb3Iuc3RyaWN0VHJhbnNwb3J0U2VjdXJpdHksXG4gICAgICAgIGFjY2Vzc0NvbnRyb2xNYXhBZ2VTZWM6IGJlaGF2aW9yLnN0cmljdFRyYW5zcG9ydFNlY3VyaXR5LmFjY2Vzc0NvbnRyb2xNYXhBZ2UudG9TZWNvbmRzKCksXG4gICAgICB9OiB1bmRlZmluZWQsXG4gICAgICB4c3NQcm90ZWN0aW9uOiBiZWhhdmlvci54c3NQcm90ZWN0aW9uLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF9yZW5kZXJSZW1vdmVIZWFkZXJzQ29uZmlnKGhlYWRlcnM6IHN0cmluZ1tdKTogQ2ZuUmVzcG9uc2VIZWFkZXJzUG9saWN5LlJlbW92ZUhlYWRlcnNDb25maWdQcm9wZXJ0eSB7XG4gICAgY29uc3QgcmVhZG9ubHlIZWFkZXJzID0gWydjb250ZW50LWVuY29kaW5nJywgJ2NvbnRlbnQtbGVuZ3RoJywgJ3RyYW5zZmVyLWVuY29kaW5nJywgJ3dhcm5pbmcnLCAndmlhJ107XG5cbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXM6IGhlYWRlcnMubWFwKGhlYWRlciA9PiB7XG4gICAgICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKGhlYWRlcikgJiYgcmVhZG9ubHlIZWFkZXJzLmluY2x1ZGVzKGhlYWRlci50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHJlbW92ZSByZWFkLW9ubHkgaGVhZGVyICR7aGVhZGVyfWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGhlYWRlciB9O1xuICAgICAgfSksXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlbmRlclNlcnZlclRpbWluZ0hlYWRlcnNDb25maWcoc2FtcGxpbmdSYXRlOiBudW1iZXIpOiBDZm5SZXNwb25zZUhlYWRlcnNQb2xpY3kuU2VydmVyVGltaW5nSGVhZGVyc0NvbmZpZ1Byb3BlcnR5IHtcbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChzYW1wbGluZ1JhdGUpKSB7XG4gICAgICBpZiAoKHNhbXBsaW5nUmF0ZSA8IDAgfHwgc2FtcGxpbmdSYXRlID4gMTAwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNhbXBsaW5nIHJhdGUgbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDEwMCAoaW5jbHVzaXZlKSwgcmVjZWl2ZWQgJHtzYW1wbGluZ1JhdGV9YCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghaGFzTWF4RGVjaW1hbFBsYWNlcyhzYW1wbGluZ1JhdGUsIDQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgU2FtcGxpbmcgcmF0ZSBjYW4gaGF2ZSB1cCB0byBmb3VyIGRlY2ltYWwgcGxhY2VzLCByZWNlaXZlZCAke3NhbXBsaW5nUmF0ZX1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIHNhbXBsaW5nUmF0ZSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBmb3IgYSBzZXQgb2YgSFRUUCByZXNwb25zZSBoZWFkZXJzIHRoYXQgYXJlIHVzZWQgZm9yIGNyb3NzLW9yaWdpbiByZXNvdXJjZSBzaGFyaW5nIChDT1JTKS5cbiAqIENsb3VkRnJvbnQgYWRkcyB0aGVzZSBoZWFkZXJzIHRvIEhUVFAgcmVzcG9uc2VzIHRoYXQgaXQgc2VuZHMgZm9yIENPUlMgcmVxdWVzdHMgdGhhdCBtYXRjaCBhIGNhY2hlIGJlaGF2aW9yXG4gKiBhc3NvY2lhdGVkIHdpdGggdGhpcyByZXNwb25zZSBoZWFkZXJzIHBvbGljeS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXNwb25zZUhlYWRlcnNDb3JzQmVoYXZpb3Ige1xuICAvKipcbiAgICogQSBCb29sZWFuIHRoYXQgQ2xvdWRGcm9udCB1c2VzIGFzIHRoZSB2YWx1ZSBmb3IgdGhlIEFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzIEhUVFAgcmVzcG9uc2UgaGVhZGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgYWNjZXNzQ29udHJvbEFsbG93Q3JlZGVudGlhbHM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBIVFRQIGhlYWRlciBuYW1lcyB0aGF0IENsb3VkRnJvbnQgaW5jbHVkZXMgYXMgdmFsdWVzIGZvciB0aGUgQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyBIVFRQIHJlc3BvbnNlIGhlYWRlci5cbiAgICogWW91IGNhbiBzcGVjaWZ5IGBbJyonXWAgdG8gYWxsb3cgYWxsIGhlYWRlcnMuXG4gICAqL1xuICByZWFkb25seSBhY2Nlc3NDb250cm9sQWxsb3dIZWFkZXJzOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogQSBsaXN0IG9mIEhUVFAgbWV0aG9kcyB0aGF0IENsb3VkRnJvbnQgaW5jbHVkZXMgYXMgdmFsdWVzIGZvciB0aGUgQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyBIVFRQIHJlc3BvbnNlIGhlYWRlci5cbiAgICovXG4gIHJlYWRvbmx5IGFjY2Vzc0NvbnRyb2xBbGxvd01ldGhvZHM6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2Ygb3JpZ2lucyAoZG9tYWluIG5hbWVzKSB0aGF0IENsb3VkRnJvbnQgY2FuIHVzZSBhcyB0aGUgdmFsdWUgZm9yIHRoZSBBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4gSFRUUCByZXNwb25zZSBoZWFkZXIuXG4gICAqIFlvdSBjYW4gc3BlY2lmeSBgWycqJ11gIHRvIGFsbG93IGFsbCBvcmlnaW5zLlxuICAgKi9cbiAgcmVhZG9ubHkgYWNjZXNzQ29udHJvbEFsbG93T3JpZ2luczogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBIVFRQIGhlYWRlcnMgdGhhdCBDbG91ZEZyb250IGluY2x1ZGVzIGFzIHZhbHVlcyBmb3IgdGhlIEFjY2Vzcy1Db250cm9sLUV4cG9zZS1IZWFkZXJzIEhUVFAgcmVzcG9uc2UgaGVhZGVyLlxuICAgKiBZb3UgY2FuIHNwZWNpZnkgYFsnKiddYCB0byBleHBvc2UgYWxsIGhlYWRlcnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gaGVhZGVycyBleHBvc2VkXG4gICAqL1xuICByZWFkb25seSBhY2Nlc3NDb250cm9sRXhwb3NlSGVhZGVycz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBIG51bWJlciB0aGF0IENsb3VkRnJvbnQgdXNlcyBhcyB0aGUgdmFsdWUgZm9yIHRoZSBBY2Nlc3MtQ29udHJvbC1NYXgtQWdlIEhUVFAgcmVzcG9uc2UgaGVhZGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIG1heCBhZ2VcbiAgICovXG4gIHJlYWRvbmx5IGFjY2Vzc0NvbnRyb2xNYXhBZ2U/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogQSBCb29sZWFuIHRoYXQgZGV0ZXJtaW5lcyB3aGV0aGVyIENsb3VkRnJvbnQgb3ZlcnJpZGVzIEhUVFAgcmVzcG9uc2UgaGVhZGVycyByZWNlaXZlZCBmcm9tIHRoZSBvcmlnaW4gd2l0aCB0aGUgb25lcyBzcGVjaWZpZWQgaW4gdGhpcyByZXNwb25zZSBoZWFkZXJzIHBvbGljeS5cbiAgICovXG4gIHJlYWRvbmx5IG9yaWdpbk92ZXJyaWRlOiBib29sZWFuO1xufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gZm9yIGEgc2V0IG9mIEhUVFAgcmVzcG9uc2UgaGVhZGVycyB0aGF0IGFyZSBzZW50IGZvciByZXF1ZXN0cyB0aGF0IG1hdGNoIGEgY2FjaGUgYmVoYXZpb3JcbiAqIHRoYXTigJlzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHJlc3BvbnNlIGhlYWRlcnMgcG9saWN5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlc3BvbnNlQ3VzdG9tSGVhZGVyc0JlaGF2aW9yIHtcbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIEhUVFAgcmVzcG9uc2UgaGVhZGVycyBhbmQgdGhlaXIgdmFsdWVzLlxuICAgKi9cbiAgcmVhZG9ubHkgY3VzdG9tSGVhZGVyczogUmVzcG9uc2VDdXN0b21IZWFkZXJbXTtcbn1cblxuLyoqXG4gKiBBbiBIVFRQIHJlc3BvbnNlIGhlYWRlciBuYW1lIGFuZCBpdHMgdmFsdWUuXG4gKiBDbG91ZEZyb250IGluY2x1ZGVzIHRoaXMgaGVhZGVyIGluIEhUVFAgcmVzcG9uc2VzIHRoYXQgaXQgc2VuZHMgZm9yIHJlcXVlc3RzIHRoYXQgbWF0Y2ggYSBjYWNoZSBiZWhhdmlvciB0aGF04oCZcyBhc3NvY2lhdGVkIHdpdGggdGhpcyByZXNwb25zZSBoZWFkZXJzIHBvbGljeS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXNwb25zZUN1c3RvbUhlYWRlciB7XG4gIC8qKlxuICAgKiBUaGUgSFRUUCByZXNwb25zZSBoZWFkZXIgbmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IGhlYWRlcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIEJvb2xlYW4gdGhhdCBkZXRlcm1pbmVzIHdoZXRoZXIgQ2xvdWRGcm9udCBvdmVycmlkZXMgYSByZXNwb25zZSBoZWFkZXIgd2l0aCB0aGUgc2FtZSBuYW1lXG4gICAqIHJlY2VpdmVkIGZyb20gdGhlIG9yaWdpbiB3aXRoIHRoZSBoZWFkZXIgc3BlY2lmaWVkIGhlcmUuXG4gICAqL1xuICByZWFkb25seSBvdmVycmlkZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHZhbHVlIGZvciB0aGUgSFRUUCByZXNwb25zZSBoZWFkZXIuXG4gICAqL1xuICByZWFkb25seSB2YWx1ZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gZm9yIGEgc2V0IG9mIHNlY3VyaXR5LXJlbGF0ZWQgSFRUUCByZXNwb25zZSBoZWFkZXJzLlxuICogQ2xvdWRGcm9udCBhZGRzIHRoZXNlIGhlYWRlcnMgdG8gSFRUUCByZXNwb25zZXMgdGhhdCBpdCBzZW5kcyBmb3IgcmVxdWVzdHMgdGhhdCBtYXRjaCBhIGNhY2hlIGJlaGF2aW9yXG4gKiBhc3NvY2lhdGVkIHdpdGggdGhpcyByZXNwb25zZSBoZWFkZXJzIHBvbGljeS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXNwb25zZVNlY3VyaXR5SGVhZGVyc0JlaGF2aW9yIHtcbiAgLyoqXG4gICAqIFRoZSBwb2xpY3kgZGlyZWN0aXZlcyBhbmQgdGhlaXIgdmFsdWVzIHRoYXQgQ2xvdWRGcm9udCBpbmNsdWRlcyBhcyB2YWx1ZXMgZm9yIHRoZSBDb250ZW50LVNlY3VyaXR5LVBvbGljeSBIVFRQIHJlc3BvbnNlIGhlYWRlci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBjb250ZW50IHNlY3VyaXR5IHBvbGljeVxuICAgKi9cbiAgcmVhZG9ubHkgY29udGVudFNlY3VyaXR5UG9saWN5PzogUmVzcG9uc2VIZWFkZXJzQ29udGVudFNlY3VyaXR5UG9saWN5O1xuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgQ2xvdWRGcm9udCBpbmNsdWRlcyB0aGUgWC1Db250ZW50LVR5cGUtT3B0aW9ucyBIVFRQIHJlc3BvbnNlIGhlYWRlciB3aXRoIGl0cyB2YWx1ZSBzZXQgdG8gbm9zbmlmZi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBjb250ZW50IHR5cGUgb3B0aW9uc1xuICAgKi9cbiAgcmVhZG9ubHkgY29udGVudFR5cGVPcHRpb25zPzogUmVzcG9uc2VIZWFkZXJzQ29udGVudFR5cGVPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgQ2xvdWRGcm9udCBpbmNsdWRlcyB0aGUgWC1GcmFtZS1PcHRpb25zIEhUVFAgcmVzcG9uc2UgaGVhZGVyIGFuZCB0aGUgaGVhZGVy4oCZcyB2YWx1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBmcmFtZSBvcHRpb25zXG4gICAqL1xuICByZWFkb25seSBmcmFtZU9wdGlvbnM/OiBSZXNwb25zZUhlYWRlcnNGcmFtZU9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hldGhlciBDbG91ZEZyb250IGluY2x1ZGVzIHRoZSBSZWZlcnJlci1Qb2xpY3kgSFRUUCByZXNwb25zZSBoZWFkZXIgYW5kIHRoZSBoZWFkZXLigJlzIHZhbHVlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHJlZmVycmVyIHBvbGljeVxuICAgKi9cbiAgcmVhZG9ubHkgcmVmZXJyZXJQb2xpY3k/OiBSZXNwb25zZUhlYWRlcnNSZWZlcnJlclBvbGljeTtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIENsb3VkRnJvbnQgaW5jbHVkZXMgdGhlIFN0cmljdC1UcmFuc3BvcnQtU2VjdXJpdHkgSFRUUCByZXNwb25zZSBoZWFkZXIgYW5kIHRoZSBoZWFkZXLigJlzIHZhbHVlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHN0cmljdCB0cmFuc3BvcnQgc2VjdXJpdHlcbiAgICovXG4gIHJlYWRvbmx5IHN0cmljdFRyYW5zcG9ydFNlY3VyaXR5PzogUmVzcG9uc2VIZWFkZXJzU3RyaWN0VHJhbnNwb3J0U2VjdXJpdHk7XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hldGhlciBDbG91ZEZyb250IGluY2x1ZGVzIHRoZSBYLVhTUy1Qcm90ZWN0aW9uIEhUVFAgcmVzcG9uc2UgaGVhZGVyIGFuZCB0aGUgaGVhZGVy4oCZcyB2YWx1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyB4c3MgcHJvdGVjdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgeHNzUHJvdGVjdGlvbj86IFJlc3BvbnNlSGVhZGVyc1hTU1Byb3RlY3Rpb247XG59XG5cbi8qKlxuICogVGhlIHBvbGljeSBkaXJlY3RpdmVzIGFuZCB0aGVpciB2YWx1ZXMgdGhhdCBDbG91ZEZyb250IGluY2x1ZGVzIGFzIHZhbHVlcyBmb3IgdGhlIENvbnRlbnQtU2VjdXJpdHktUG9saWN5IEhUVFAgcmVzcG9uc2UgaGVhZGVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlc3BvbnNlSGVhZGVyc0NvbnRlbnRTZWN1cml0eVBvbGljeSB7XG4gIC8qKlxuICAgKiBUaGUgcG9saWN5IGRpcmVjdGl2ZXMgYW5kIHRoZWlyIHZhbHVlcyB0aGF0IENsb3VkRnJvbnQgaW5jbHVkZXMgYXMgdmFsdWVzIGZvciB0aGUgQ29udGVudC1TZWN1cml0eS1Qb2xpY3kgSFRUUCByZXNwb25zZSBoZWFkZXIuXG4gICAqL1xuICByZWFkb25seSBjb250ZW50U2VjdXJpdHlQb2xpY3k6IHN0cmluZztcblxuICAvKipcbiAgICogQSBCb29sZWFuIHRoYXQgZGV0ZXJtaW5lcyB3aGV0aGVyIENsb3VkRnJvbnQgb3ZlcnJpZGVzIHRoZSBDb250ZW50LVNlY3VyaXR5LVBvbGljeSBIVFRQIHJlc3BvbnNlIGhlYWRlclxuICAgKiByZWNlaXZlZCBmcm9tIHRoZSBvcmlnaW4gd2l0aCB0aGUgb25lIHNwZWNpZmllZCBpbiB0aGlzIHJlc3BvbnNlIGhlYWRlcnMgcG9saWN5LlxuICAgKi9cbiAgcmVhZG9ubHkgb3ZlcnJpZGU6IGJvb2xlYW47XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIENsb3VkRnJvbnQgaW5jbHVkZXMgdGhlIFgtQ29udGVudC1UeXBlLU9wdGlvbnMgSFRUUCByZXNwb25zZSBoZWFkZXIgd2l0aCBpdHMgdmFsdWUgc2V0IHRvIG5vc25pZmYuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVzcG9uc2VIZWFkZXJzQ29udGVudFR5cGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIEEgQm9vbGVhbiB0aGF0IGRldGVybWluZXMgd2hldGhlciBDbG91ZEZyb250IG92ZXJyaWRlcyB0aGUgWC1Db250ZW50LVR5cGUtT3B0aW9ucyBIVFRQIHJlc3BvbnNlIGhlYWRlclxuICAgKiByZWNlaXZlZCBmcm9tIHRoZSBvcmlnaW4gd2l0aCB0aGUgb25lIHNwZWNpZmllZCBpbiB0aGlzIHJlc3BvbnNlIGhlYWRlcnMgcG9saWN5LlxuICAgKi9cbiAgcmVhZG9ubHkgb3ZlcnJpZGU6IGJvb2xlYW47XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIENsb3VkRnJvbnQgaW5jbHVkZXMgdGhlIFgtRnJhbWUtT3B0aW9ucyBIVFRQIHJlc3BvbnNlIGhlYWRlciBhbmQgdGhlIGhlYWRlcuKAmXMgdmFsdWUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVzcG9uc2VIZWFkZXJzRnJhbWVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSB2YWx1ZSBvZiB0aGUgWC1GcmFtZS1PcHRpb25zIEhUVFAgcmVzcG9uc2UgaGVhZGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgZnJhbWVPcHRpb246IEhlYWRlcnNGcmFtZU9wdGlvbjtcblxuICAvKipcbiAgICogQSBCb29sZWFuIHRoYXQgZGV0ZXJtaW5lcyB3aGV0aGVyIENsb3VkRnJvbnQgb3ZlcnJpZGVzIHRoZSBYLUZyYW1lLU9wdGlvbnMgSFRUUCByZXNwb25zZSBoZWFkZXJcbiAgICogcmVjZWl2ZWQgZnJvbSB0aGUgb3JpZ2luIHdpdGggdGhlIG9uZSBzcGVjaWZpZWQgaW4gdGhpcyByZXNwb25zZSBoZWFkZXJzIHBvbGljeS5cbiAgICovXG4gIHJlYWRvbmx5IG92ZXJyaWRlOiBib29sZWFuO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBDbG91ZEZyb250IGluY2x1ZGVzIHRoZSBSZWZlcnJlci1Qb2xpY3kgSFRUUCByZXNwb25zZSBoZWFkZXIgYW5kIHRoZSBoZWFkZXLigJlzIHZhbHVlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlc3BvbnNlSGVhZGVyc1JlZmVycmVyUG9saWN5IHtcbiAgLyoqXG4gICAqIFRoZSB2YWx1ZSBvZiB0aGUgUmVmZXJyZXItUG9saWN5IEhUVFAgcmVzcG9uc2UgaGVhZGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVmZXJyZXJQb2xpY3k6IEhlYWRlcnNSZWZlcnJlclBvbGljeTtcblxuICAvKipcbiAgICogQSBCb29sZWFuIHRoYXQgZGV0ZXJtaW5lcyB3aGV0aGVyIENsb3VkRnJvbnQgb3ZlcnJpZGVzIHRoZSBSZWZlcnJlci1Qb2xpY3kgSFRUUCByZXNwb25zZSBoZWFkZXJcbiAgICogcmVjZWl2ZWQgZnJvbSB0aGUgb3JpZ2luIHdpdGggdGhlIG9uZSBzcGVjaWZpZWQgaW4gdGhpcyByZXNwb25zZSBoZWFkZXJzIHBvbGljeS5cbiAgICovXG4gIHJlYWRvbmx5IG92ZXJyaWRlOiBib29sZWFuO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBDbG91ZEZyb250IGluY2x1ZGVzIHRoZSBTdHJpY3QtVHJhbnNwb3J0LVNlY3VyaXR5IEhUVFAgcmVzcG9uc2UgaGVhZGVyIGFuZCB0aGUgaGVhZGVy4oCZcyB2YWx1ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXNwb25zZUhlYWRlcnNTdHJpY3RUcmFuc3BvcnRTZWN1cml0eSB7XG4gIC8qKlxuICAgKiBBIG51bWJlciB0aGF0IENsb3VkRnJvbnQgdXNlcyBhcyB0aGUgdmFsdWUgZm9yIHRoZSBtYXgtYWdlIGRpcmVjdGl2ZSBpbiB0aGUgU3RyaWN0LVRyYW5zcG9ydC1TZWN1cml0eSBIVFRQIHJlc3BvbnNlIGhlYWRlci5cbiAgICovXG4gIHJlYWRvbmx5IGFjY2Vzc0NvbnRyb2xNYXhBZ2U6IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBBIEJvb2xlYW4gdGhhdCBkZXRlcm1pbmVzIHdoZXRoZXIgQ2xvdWRGcm9udCBpbmNsdWRlcyB0aGUgaW5jbHVkZVN1YkRvbWFpbnMgZGlyZWN0aXZlIGluIHRoZSBTdHJpY3QtVHJhbnNwb3J0LVNlY3VyaXR5IEhUVFAgcmVzcG9uc2UgaGVhZGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5jbHVkZVN1YmRvbWFpbnM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIEJvb2xlYW4gdGhhdCBkZXRlcm1pbmVzIHdoZXRoZXIgQ2xvdWRGcm9udCBvdmVycmlkZXMgdGhlIFN0cmljdC1UcmFuc3BvcnQtU2VjdXJpdHkgSFRUUCByZXNwb25zZSBoZWFkZXJcbiAgICogcmVjZWl2ZWQgZnJvbSB0aGUgb3JpZ2luIHdpdGggdGhlIG9uZSBzcGVjaWZpZWQgaW4gdGhpcyByZXNwb25zZSBoZWFkZXJzIHBvbGljeS5cbiAgICovXG4gIHJlYWRvbmx5IG92ZXJyaWRlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIEJvb2xlYW4gdGhhdCBkZXRlcm1pbmVzIHdoZXRoZXIgQ2xvdWRGcm9udCBpbmNsdWRlcyB0aGUgcHJlbG9hZCBkaXJlY3RpdmUgaW4gdGhlIFN0cmljdC1UcmFuc3BvcnQtU2VjdXJpdHkgSFRUUCByZXNwb25zZSBoZWFkZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBwcmVsb2FkPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgQ2xvdWRGcm9udCBpbmNsdWRlcyB0aGUgWC1YU1MtUHJvdGVjdGlvbiBIVFRQIHJlc3BvbnNlIGhlYWRlciBhbmQgdGhlIGhlYWRlcuKAmXMgdmFsdWUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVzcG9uc2VIZWFkZXJzWFNTUHJvdGVjdGlvbiB7XG4gIC8qKlxuICAgKiBBIEJvb2xlYW4gdGhhdCBkZXRlcm1pbmVzIHdoZXRoZXIgQ2xvdWRGcm9udCBpbmNsdWRlcyB0aGUgbW9kZT1ibG9jayBkaXJlY3RpdmUgaW4gdGhlIFgtWFNTLVByb3RlY3Rpb24gaGVhZGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgbW9kZUJsb2NrPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBCb29sZWFuIHRoYXQgZGV0ZXJtaW5lcyB3aGV0aGVyIENsb3VkRnJvbnQgb3ZlcnJpZGVzIHRoZSBYLVhTUy1Qcm90ZWN0aW9uIEhUVFAgcmVzcG9uc2UgaGVhZGVyXG4gICAqIHJlY2VpdmVkIGZyb20gdGhlIG9yaWdpbiB3aXRoIHRoZSBvbmUgc3BlY2lmaWVkIGluIHRoaXMgcmVzcG9uc2UgaGVhZGVycyBwb2xpY3kuXG4gICAqL1xuICByZWFkb25seSBvdmVycmlkZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBCb29sZWFuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgdmFsdWUgb2YgdGhlIFgtWFNTLVByb3RlY3Rpb24gSFRUUCByZXNwb25zZSBoZWFkZXIuXG4gICAqIFdoZW4gdGhpcyBzZXR0aW5nIGlzIHRydWUsIHRoZSB2YWx1ZSBvZiB0aGUgWC1YU1MtUHJvdGVjdGlvbiBoZWFkZXIgaXMgMS5cbiAgICogV2hlbiB0aGlzIHNldHRpbmcgaXMgZmFsc2UsIHRoZSB2YWx1ZSBvZiB0aGUgWC1YU1MtUHJvdGVjdGlvbiBoZWFkZXIgaXMgMC5cbiAgICovXG4gIHJlYWRvbmx5IHByb3RlY3Rpb246IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgcmVwb3J0aW5nIFVSSSwgd2hpY2ggQ2xvdWRGcm9udCB1c2VzIGFzIHRoZSB2YWx1ZSBvZiB0aGUgcmVwb3J0IGRpcmVjdGl2ZSBpbiB0aGUgWC1YU1MtUHJvdGVjdGlvbiBoZWFkZXIuXG4gICAqIFlvdSBjYW5ub3Qgc3BlY2lmeSBhIFJlcG9ydFVyaSB3aGVuIE1vZGVCbG9jayBpcyB0cnVlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHJlcG9ydCB1cmlcbiAgICovXG4gIHJlYWRvbmx5IHJlcG9ydFVyaT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBFbnVtIHJlcHJlc2VudGluZyBwb3NzaWJsZSB2YWx1ZXMgb2YgdGhlIFgtRnJhbWUtT3B0aW9ucyBIVFRQIHJlc3BvbnNlIGhlYWRlci5cbiAqL1xuZXhwb3J0IGVudW0gSGVhZGVyc0ZyYW1lT3B0aW9uIHtcbiAgLyoqXG4gICAqIFRoZSBwYWdlIGNhbiBvbmx5IGJlIGRpc3BsYXllZCBpbiBhIGZyYW1lIG9uIHRoZSBzYW1lIG9yaWdpbiBhcyB0aGUgcGFnZSBpdHNlbGYuXG4gICAqL1xuICBERU5ZID0gJ0RFTlknLFxuXG4gIC8qKlxuICAgKiBUaGUgcGFnZSBjYW4gb25seSBiZSBkaXNwbGF5ZWQgaW4gYSBmcmFtZSBvbiB0aGUgc3BlY2lmaWVkIG9yaWdpbi5cbiAgICovXG4gIFNBTUVPUklHSU4gPSAnU0FNRU9SSUdJTicsXG59XG5cbi8qKlxuICogRW51bSByZXByZXNlbnRpbmcgcG9zc2libGUgdmFsdWVzIG9mIHRoZSBSZWZlcnJlci1Qb2xpY3kgSFRUUCByZXNwb25zZSBoZWFkZXIuXG4gKi9cbmV4cG9ydCBlbnVtIEhlYWRlcnNSZWZlcnJlclBvbGljeSB7XG4gIC8qKlxuICAgKiBUaGUgcmVmZXJyZXIgcG9saWN5IGlzIG5vdCBzZXQuXG4gICAqL1xuICBOT19SRUZFUlJFUiA9ICduby1yZWZlcnJlcicsXG5cbiAgLyoqXG4gICAqIFRoZSByZWZlcnJlciBwb2xpY3kgaXMgbm8tcmVmZXJyZXItd2hlbi1kb3duZ3JhZGUuXG4gICAqL1xuICBOT19SRUZFUlJFUl9XSEVOX0RPV05HUkFERSA9ICduby1yZWZlcnJlci13aGVuLWRvd25ncmFkZScsXG5cbiAgLyoqXG4gICAqIFRoZSByZWZlcnJlciBwb2xpY3kgaXMgb3JpZ2luLlxuICAgKi9cbiAgT1JJR0lOID0gJ29yaWdpbicsXG5cbiAgLyoqXG4gICAqIFRoZSByZWZlcnJlciBwb2xpY3kgaXMgb3JpZ2luLXdoZW4tY3Jvc3Mtb3JpZ2luLlxuICAgKi9cbiAgT1JJR0lOX1dIRU5fQ1JPU1NfT1JJR0lOID0gJ29yaWdpbi13aGVuLWNyb3NzLW9yaWdpbicsXG5cbiAgLyoqXG4gICAqIFRoZSByZWZlcnJlciBwb2xpY3kgaXMgc2FtZS1vcmlnaW4uXG4gICAqL1xuICBTQU1FX09SSUdJTiA9ICdzYW1lLW9yaWdpbicsXG5cbiAgLyoqXG4gICAqIFRoZSByZWZlcnJlciBwb2xpY3kgaXMgc3RyaWN0LW9yaWdpbi5cbiAgICovXG4gIFNUUklDVF9PUklHSU4gPSAnc3RyaWN0LW9yaWdpbicsXG5cbiAgLyoqXG4gICAqIFRoZSByZWZlcnJlciBwb2xpY3kgaXMgc3RyaWN0LW9yaWdpbi13aGVuLWNyb3NzLW9yaWdpbi5cbiAgICovXG4gIFNUUklDVF9PUklHSU5fV0hFTl9DUk9TU19PUklHSU4gPSAnc3RyaWN0LW9yaWdpbi13aGVuLWNyb3NzLW9yaWdpbicsXG5cbiAgLyoqXG4gICAqIFRoZSByZWZlcnJlciBwb2xpY3kgaXMgdW5zYWZlLXVybC5cbiAgICovXG4gIFVOU0FGRV9VUkwgPSAndW5zYWZlLXVybCcsXG59XG5cbmZ1bmN0aW9uIGhhc01heERlY2ltYWxQbGFjZXMobnVtOiBudW1iZXIsIGRlY2ltYWxzOiBudW1iZXIpOiBib29sZWFuIHtcbiAgY29uc3QgcGFydHMgPSBudW0udG9TdHJpbmcoKS5zcGxpdCgnLicpO1xuICByZXR1cm4gcGFydHMubGVuZ3RoID09PSAxIHx8IHBhcnRzWzFdLmxlbmd0aCA8PSBkZWNpbWFscztcbn1cbiJdfQ==