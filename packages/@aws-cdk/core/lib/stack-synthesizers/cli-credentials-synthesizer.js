"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliCredentialsStackSynthesizer = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cxapi = require("@aws-cdk/cx-api");
const _shared_1 = require("./_shared");
const asset_manifest_builder_1 = require("./asset-manifest-builder");
const default_synthesizer_1 = require("./default-synthesizer");
const stack_synthesizer_1 = require("./stack-synthesizer");
const token_1 = require("../token");
/**
 * A synthesizer that uses conventional asset locations, but not conventional deployment roles
 *
 * Instead of assuming the bootstrapped deployment roles, all stack operations will be performed
 * using the CLI's current credentials.
 *
 * - This synthesizer does not support deploying to accounts to which the CLI does not have
 *   credentials. It also does not support deploying using **CDK Pipelines**. For either of those
 *   features, use `DefaultStackSynthesizer`.
 * - This synthesizer requires an S3 bucket and ECR repository with well-known names. To
 *   not depend on those, use `LegacyStackSynthesizer`.
 *
 * Be aware that your CLI credentials must be valid for the duration of the
 * entire deployment. If you are using session credentials, make sure the
 * session lifetime is long enough.
 *
 * By default, expects the environment to have been bootstrapped with just the staging resources
 * of the Bootstrap Stack V2 (also known as "modern bootstrap stack"). You can override
 * the default names using the synthesizer's construction properties.
 */
class CliCredentialsStackSynthesizer extends stack_synthesizer_1.StackSynthesizer {
    constructor(props = {}) {
        super();
        this.props = props;
        this.assetManifest = new asset_manifest_builder_1.AssetManifestBuilder();
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CliCredentialsStackSynthesizerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CliCredentialsStackSynthesizer);
            }
            throw error;
        }
        for (const key in props) {
            if (props.hasOwnProperty(key)) {
                validateNoToken(key);
            }
        }
        function validateNoToken(key) {
            const prop = props[key];
            if (typeof prop === 'string' && token_1.Token.isUnresolved(prop)) {
                throw new Error(`CliCredentialsStackSynthesizer property '${key}' cannot contain tokens; only the following placeholder strings are allowed: ` + [
                    '${Qualifier}',
                    cxapi.EnvironmentPlaceholders.CURRENT_REGION,
                    cxapi.EnvironmentPlaceholders.CURRENT_ACCOUNT,
                    cxapi.EnvironmentPlaceholders.CURRENT_PARTITION,
                ].join(', '));
            }
        }
    }
    /**
     * The qualifier used to bootstrap this stack
     */
    get bootstrapQualifier() {
        return this.qualifier;
    }
    bind(stack) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Stack(stack);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        super.bind(stack);
        const qualifier = this.props.qualifier ?? stack.node.tryGetContext(default_synthesizer_1.BOOTSTRAP_QUALIFIER_CONTEXT) ?? default_synthesizer_1.DefaultStackSynthesizer.DEFAULT_QUALIFIER;
        this.qualifier = qualifier;
        const spec = new _shared_1.StringSpecializer(stack, qualifier);
        /* eslint-disable max-len */
        this.bucketName = spec.specialize(this.props.fileAssetsBucketName ?? default_synthesizer_1.DefaultStackSynthesizer.DEFAULT_FILE_ASSETS_BUCKET_NAME);
        this.repositoryName = spec.specialize(this.props.imageAssetsRepositoryName ?? default_synthesizer_1.DefaultStackSynthesizer.DEFAULT_IMAGE_ASSETS_REPOSITORY_NAME);
        this.bucketPrefix = spec.specialize(this.props.bucketPrefix ?? default_synthesizer_1.DefaultStackSynthesizer.DEFAULT_FILE_ASSET_PREFIX);
        this.dockerTagPrefix = spec.specialize(this.props.dockerTagPrefix ?? default_synthesizer_1.DefaultStackSynthesizer.DEFAULT_DOCKER_ASSET_PREFIX);
    }
    /**
     * Produce a bound Stack Synthesizer for the given stack.
     *
     * This method may be called more than once on the same object.
     */
    reusableBind(stack) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Stack(stack);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.reusableBind);
            }
            throw error;
        }
        // Create a copy of the current object and bind that
        const copy = Object.create(this);
        copy.bind(stack);
        return copy;
    }
    addFileAsset(asset) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_FileAssetSource(asset);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addFileAsset);
            }
            throw error;
        }
        _shared_1.assertBound(this.bucketName);
        const location = this.assetManifest.defaultAddFileAsset(this.boundStack, asset, {
            bucketName: this.bucketName,
            bucketPrefix: this.bucketPrefix,
        });
        return this.cloudFormationLocationFromFileAsset(location);
    }
    addDockerImageAsset(asset) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_DockerImageAssetSource(asset);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addDockerImageAsset);
            }
            throw error;
        }
        _shared_1.assertBound(this.repositoryName);
        const location = this.assetManifest.defaultAddDockerImageAsset(this.boundStack, asset, {
            repositoryName: this.repositoryName,
            dockerTagPrefix: this.dockerTagPrefix,
        });
        return this.cloudFormationLocationFromDockerImageAsset(location);
    }
    /**
     * Synthesize the associated stack to the session
     */
    synthesize(session) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ISynthesisSession(session);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.synthesize);
            }
            throw error;
        }
        _shared_1.assertBound(this.qualifier);
        const templateAssetSource = this.synthesizeTemplate(session);
        const templateAsset = this.addFileAsset(templateAssetSource);
        const assetManifestId = this.assetManifest.emitManifest(this.boundStack, session);
        this.emitArtifact(session, {
            stackTemplateAssetObjectUrl: templateAsset.s3ObjectUrlWithPlaceholders,
            additionalDependencies: [assetManifestId],
        });
    }
}
exports.CliCredentialsStackSynthesizer = CliCredentialsStackSynthesizer;
_a = JSII_RTTI_SYMBOL_1;
CliCredentialsStackSynthesizer[_a] = { fqn: "@aws-cdk/core.CliCredentialsStackSynthesizer", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLWNyZWRlbnRpYWxzLXN5bnRoZXNpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpLWNyZWRlbnRpYWxzLXN5bnRoZXNpemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHlDQUF5QztBQUN6Qyx1Q0FBMkQ7QUFDM0QscUVBQWdFO0FBQ2hFLCtEQUE2RjtBQUM3RiwyREFBdUQ7QUFJdkQsb0NBQWlDO0FBNERqQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1CRztBQUNILE1BQWEsOEJBQStCLFNBQVEsb0NBQWdCO0lBU2xFLFlBQTZCLFFBQTZDLEVBQUU7UUFDMUUsS0FBSyxFQUFFLENBQUM7UUFEbUIsVUFBSyxHQUFMLEtBQUssQ0FBMEM7UUFGM0Qsa0JBQWEsR0FBRyxJQUFJLDZDQUFvQixFQUFFLENBQUM7Ozs7OzsrQ0FQakQsOEJBQThCOzs7O1FBWXZDLEtBQUssTUFBTSxHQUFHLElBQUksS0FBSyxFQUFFO1lBQ3ZCLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDN0IsZUFBZSxDQUFDLEdBQWdELENBQUMsQ0FBQzthQUNuRTtTQUNGO1FBRUQsU0FBUyxlQUFlLENBQXNELEdBQU07WUFDbEYsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLGFBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3hELE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTRDLEdBQUcsK0VBQStFLEdBQUc7b0JBQy9JLGNBQWM7b0JBQ2QsS0FBSyxDQUFDLHVCQUF1QixDQUFDLGNBQWM7b0JBQzVDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxlQUFlO29CQUM3QyxLQUFLLENBQUMsdUJBQXVCLENBQUMsaUJBQWlCO2lCQUNoRCxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ2Y7UUFDSCxD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QyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVsRixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRTtZQUN6QiwyQkFBMkIsRUFBRSxhQUFhLENBQUMsMkJBQTJCO1lBQ3RFLHNCQUFzQixFQUFFLENBQUMsZUFBZSxDQUFDO1NBQzFDLENBQUMsQ0FBQztLQUNKOztBQXJHSCx3RUFzR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgYXNzZXJ0Qm91bmQsIFN0cmluZ1NwZWNpYWxpemVyIH0gZnJvbSAnLi9fc2hhcmVkJztcbmltcG9ydCB7IEFzc2V0TWFuaWZlc3RCdWlsZGVyIH0gZnJvbSAnLi9hc3NldC1tYW5pZmVzdC1idWlsZGVyJztcbmltcG9ydCB7IEJPT1RTVFJBUF9RVUFMSUZJRVJfQ09OVEVYVCwgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIgfSBmcm9tICcuL2RlZmF1bHQtc3ludGhlc2l6ZXInO1xuaW1wb3J0IHsgU3RhY2tTeW50aGVzaXplciB9IGZyb20gJy4vc3RhY2stc3ludGhlc2l6ZXInO1xuaW1wb3J0IHsgSVN5bnRoZXNpc1Nlc3Npb24sIElSZXVzYWJsZVN0YWNrU3ludGhlc2l6ZXIsIElCb3VuZFN0YWNrU3ludGhlc2l6ZXIgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IERvY2tlckltYWdlQXNzZXRMb2NhdGlvbiwgRG9ja2VySW1hZ2VBc3NldFNvdXJjZSwgRmlsZUFzc2V0TG9jYXRpb24sIEZpbGVBc3NldFNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uL3N0YWNrJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi4vdG9rZW4nO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIHRoZSBDbGlDcmVkZW50aWFsc1N0YWNrU3ludGhlc2l6ZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbGlDcmVkZW50aWFsc1N0YWNrU3ludGhlc2l6ZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBTMyBidWNrZXQgdG8gaG9sZCBmaWxlIGFzc2V0c1xuICAgKlxuICAgKiBZb3UgbXVzdCBzdXBwbHkgdGhpcyBpZiB5b3UgaGF2ZSBnaXZlbiBhIG5vbi1zdGFuZGFyZCBuYW1lIHRvIHRoZSBzdGFnaW5nIGJ1Y2tldC5cbiAgICpcbiAgICogVGhlIHBsYWNlaG9sZGVycyBgJHtRdWFsaWZpZXJ9YCwgYCR7QVdTOjpBY2NvdW50SWR9YCBhbmQgYCR7QVdTOjpSZWdpb259YCB3aWxsXG4gICAqIGJlIHJlcGxhY2VkIHdpdGggdGhlIHZhbHVlcyBvZiBxdWFsaWZpZXIgYW5kIHRoZSBzdGFjaydzIGFjY291bnQgYW5kIHJlZ2lvbixcbiAgICogcmVzcGVjdGl2ZWx5LlxuICAgKlxuICAgKiBAZGVmYXVsdCBEZWZhdWx0U3RhY2tTeW50aGVzaXplci5ERUZBVUxUX0ZJTEVfQVNTRVRTX0JVQ0tFVF9OQU1FXG4gICAqL1xuICByZWFkb25seSBmaWxlQXNzZXRzQnVja2V0TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGUgRUNSIHJlcG9zaXRvcnkgdG8gaG9sZCBEb2NrZXIgSW1hZ2UgYXNzZXRzXG4gICAqXG4gICAqIFlvdSBtdXN0IHN1cHBseSB0aGlzIGlmIHlvdSBoYXZlIGdpdmVuIGEgbm9uLXN0YW5kYXJkIG5hbWUgdG8gdGhlIEVDUiByZXBvc2l0b3J5LlxuICAgKlxuICAgKiBUaGUgcGxhY2Vob2xkZXJzIGAke1F1YWxpZmllcn1gLCBgJHtBV1M6OkFjY291bnRJZH1gIGFuZCBgJHtBV1M6OlJlZ2lvbn1gIHdpbGxcbiAgICogYmUgcmVwbGFjZWQgd2l0aCB0aGUgdmFsdWVzIG9mIHF1YWxpZmllciBhbmQgdGhlIHN0YWNrJ3MgYWNjb3VudCBhbmQgcmVnaW9uLFxuICAgKiByZXNwZWN0aXZlbHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfSU1BR0VfQVNTRVRTX1JFUE9TSVRPUllfTkFNRVxuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2VBc3NldHNSZXBvc2l0b3J5TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogUXVhbGlmaWVyIHRvIGRpc2FtYmlndWF0ZSBtdWx0aXBsZSBlbnZpcm9ubWVudHMgaW4gdGhlIHNhbWUgYWNjb3VudFxuICAgKlxuICAgKiBZb3UgY2FuIHVzZSB0aGlzIGFuZCBsZWF2ZSB0aGUgb3RoZXIgbmFtaW5nIHByb3BlcnRpZXMgZW1wdHkgaWYgeW91IGhhdmUgZGVwbG95ZWRcbiAgICogdGhlIGJvb3RzdHJhcCBlbnZpcm9ubWVudCB3aXRoIHN0YW5kYXJkIG5hbWVzIGJ1dCBvbmx5IGRpZmZlcm5ldCBxdWFsaWZpZXJzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFZhbHVlIG9mIGNvbnRleHQga2V5ICdAYXdzLWNkay9jb3JlOmJvb3RzdHJhcFF1YWxpZmllcicgaWYgc2V0LCBvdGhlcndpc2UgYERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfUVVBTElGSUVSYFxuICAgKi9cbiAgcmVhZG9ubHkgcXVhbGlmaWVyPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBidWNrZXRQcmVmaXggdG8gdXNlIHdoaWxlIHN0b3JpbmcgUzMgQXNzZXRzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9GSUxFX0FTU0VUX1BSRUZJWFxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0UHJlZml4Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIHByZWZpeCB0byB1c2Ugd2hpbGUgdGFnZ2luZyBhbmQgdXBsb2FkaW5nIERvY2tlciBpbWFnZXMgdG8gRUNSLlxuICAgKlxuICAgKiBUaGlzIGRvZXMgbm90IGFkZCBhbnkgc2VwYXJhdG9ycyAtIHRoZSBzb3VyY2UgaGFzaCB3aWxsIGJlIGFwcGVuZGVkIHRvXG4gICAqIHRoaXMgc3RyaW5nIGRpcmVjdGx5LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfRE9DS0VSX0FTU0VUX1BSRUZJWFxuICAgKi9cbiAgcmVhZG9ubHkgZG9ja2VyVGFnUHJlZml4Pzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgc3ludGhlc2l6ZXIgdGhhdCB1c2VzIGNvbnZlbnRpb25hbCBhc3NldCBsb2NhdGlvbnMsIGJ1dCBub3QgY29udmVudGlvbmFsIGRlcGxveW1lbnQgcm9sZXNcbiAqXG4gKiBJbnN0ZWFkIG9mIGFzc3VtaW5nIHRoZSBib290c3RyYXBwZWQgZGVwbG95bWVudCByb2xlcywgYWxsIHN0YWNrIG9wZXJhdGlvbnMgd2lsbCBiZSBwZXJmb3JtZWRcbiAqIHVzaW5nIHRoZSBDTEkncyBjdXJyZW50IGNyZWRlbnRpYWxzLlxuICpcbiAqIC0gVGhpcyBzeW50aGVzaXplciBkb2VzIG5vdCBzdXBwb3J0IGRlcGxveWluZyB0byBhY2NvdW50cyB0byB3aGljaCB0aGUgQ0xJIGRvZXMgbm90IGhhdmVcbiAqICAgY3JlZGVudGlhbHMuIEl0IGFsc28gZG9lcyBub3Qgc3VwcG9ydCBkZXBsb3lpbmcgdXNpbmcgKipDREsgUGlwZWxpbmVzKiouIEZvciBlaXRoZXIgb2YgdGhvc2VcbiAqICAgZmVhdHVyZXMsIHVzZSBgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXJgLlxuICogLSBUaGlzIHN5bnRoZXNpemVyIHJlcXVpcmVzIGFuIFMzIGJ1Y2tldCBhbmQgRUNSIHJlcG9zaXRvcnkgd2l0aCB3ZWxsLWtub3duIG5hbWVzLiBUb1xuICogICBub3QgZGVwZW5kIG9uIHRob3NlLCB1c2UgYExlZ2FjeVN0YWNrU3ludGhlc2l6ZXJgLlxuICpcbiAqIEJlIGF3YXJlIHRoYXQgeW91ciBDTEkgY3JlZGVudGlhbHMgbXVzdCBiZSB2YWxpZCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoZVxuICogZW50aXJlIGRlcGxveW1lbnQuIElmIHlvdSBhcmUgdXNpbmcgc2Vzc2lvbiBjcmVkZW50aWFscywgbWFrZSBzdXJlIHRoZVxuICogc2Vzc2lvbiBsaWZldGltZSBpcyBsb25nIGVub3VnaC5cbiAqXG4gKiBCeSBkZWZhdWx0LCBleHBlY3RzIHRoZSBlbnZpcm9ubWVudCB0byBoYXZlIGJlZW4gYm9vdHN0cmFwcGVkIHdpdGgganVzdCB0aGUgc3RhZ2luZyByZXNvdXJjZXNcbiAqIG9mIHRoZSBCb290c3RyYXAgU3RhY2sgVjIgKGFsc28ga25vd24gYXMgXCJtb2Rlcm4gYm9vdHN0cmFwIHN0YWNrXCIpLiBZb3UgY2FuIG92ZXJyaWRlXG4gKiB0aGUgZGVmYXVsdCBuYW1lcyB1c2luZyB0aGUgc3ludGhlc2l6ZXIncyBjb25zdHJ1Y3Rpb24gcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGNsYXNzIENsaUNyZWRlbnRpYWxzU3RhY2tTeW50aGVzaXplciBleHRlbmRzIFN0YWNrU3ludGhlc2l6ZXIgaW1wbGVtZW50cyBJUmV1c2FibGVTdGFja1N5bnRoZXNpemVyLCBJQm91bmRTdGFja1N5bnRoZXNpemVyIHtcbiAgcHJpdmF0ZSBxdWFsaWZpZXI/OiBzdHJpbmc7XG4gIHByaXZhdGUgYnVja2V0TmFtZT86IHN0cmluZztcbiAgcHJpdmF0ZSByZXBvc2l0b3J5TmFtZT86IHN0cmluZztcbiAgcHJpdmF0ZSBidWNrZXRQcmVmaXg/OiBzdHJpbmc7XG4gIHByaXZhdGUgZG9ja2VyVGFnUHJlZml4Pzogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgYXNzZXRNYW5pZmVzdCA9IG5ldyBBc3NldE1hbmlmZXN0QnVpbGRlcigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IENsaUNyZWRlbnRpYWxzU3RhY2tTeW50aGVzaXplclByb3BzID0ge30pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJvcHMpIHtcbiAgICAgIGlmIChwcm9wcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHZhbGlkYXRlTm9Ub2tlbihrZXkgYXMga2V5b2YgQ2xpQ3JlZGVudGlhbHNTdGFja1N5bnRoZXNpemVyUHJvcHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlTm9Ub2tlbjxBIGV4dGVuZHMga2V5b2YgQ2xpQ3JlZGVudGlhbHNTdGFja1N5bnRoZXNpemVyUHJvcHM+KGtleTogQSkge1xuICAgICAgY29uc3QgcHJvcCA9IHByb3BzW2tleV07XG4gICAgICBpZiAodHlwZW9mIHByb3AgPT09ICdzdHJpbmcnICYmIFRva2VuLmlzVW5yZXNvbHZlZChwcm9wKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENsaUNyZWRlbnRpYWxzU3RhY2tTeW50aGVzaXplciBwcm9wZXJ0eSAnJHtrZXl9JyBjYW5ub3QgY29udGFpbiB0b2tlbnM7IG9ubHkgdGhlIGZvbGxvd2luZyBwbGFjZWhvbGRlciBzdHJpbmdzIGFyZSBhbGxvd2VkOiBgICsgW1xuICAgICAgICAgICcke1F1YWxpZmllcn0nLFxuICAgICAgICAgIGN4YXBpLkVudmlyb25tZW50UGxhY2Vob2xkZXJzLkNVUlJFTlRfUkVHSU9OLFxuICAgICAgICAgIGN4YXBpLkVudmlyb25tZW50UGxhY2Vob2xkZXJzLkNVUlJFTlRfQUNDT1VOVCxcbiAgICAgICAgICBjeGFwaS5FbnZpcm9ubWVudFBsYWNlaG9sZGVycy5DVVJSRU5UX1BBUlRJVElPTixcbiAgICAgICAgXS5qb2luKCcsICcpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIHF1YWxpZmllciB1c2VkIHRvIGJvb3RzdHJhcCB0aGlzIHN0YWNrXG4gICAqL1xuICBwdWJsaWMgZ2V0IGJvb3RzdHJhcFF1YWxpZmllcigpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnF1YWxpZmllcjtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKHN0YWNrOiBTdGFjayk6IHZvaWQge1xuICAgIHN1cGVyLmJpbmQoc3RhY2spO1xuXG4gICAgY29uc3QgcXVhbGlmaWVyID0gdGhpcy5wcm9wcy5xdWFsaWZpZXIgPz8gc3RhY2subm9kZS50cnlHZXRDb250ZXh0KEJPT1RTVFJBUF9RVUFMSUZJRVJfQ09OVEVYVCkgPz8gRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9RVUFMSUZJRVI7XG4gICAgdGhpcy5xdWFsaWZpZXIgPSBxdWFsaWZpZXI7XG5cbiAgICBjb25zdCBzcGVjID0gbmV3IFN0cmluZ1NwZWNpYWxpemVyKHN0YWNrLCBxdWFsaWZpZXIpO1xuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuICAgIHRoaXMuYnVja2V0TmFtZSA9IHNwZWMuc3BlY2lhbGl6ZSh0aGlzLnByb3BzLmZpbGVBc3NldHNCdWNrZXROYW1lID8/IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfRklMRV9BU1NFVFNfQlVDS0VUX05BTUUpO1xuICAgIHRoaXMucmVwb3NpdG9yeU5hbWUgPSBzcGVjLnNwZWNpYWxpemUodGhpcy5wcm9wcy5pbWFnZUFzc2V0c1JlcG9zaXRvcnlOYW1lID8/IERlZmF1bHRTdGFja1N5bnRoZXNpemVyLkRFRkFVTFRfSU1BR0VfQVNTRVRTX1JFUE9TSVRPUllfTkFNRSk7XG4gICAgdGhpcy5idWNrZXRQcmVmaXggPSBzcGVjLnNwZWNpYWxpemUodGhpcy5wcm9wcy5idWNrZXRQcmVmaXggPz8gRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9GSUxFX0FTU0VUX1BSRUZJWCk7XG4gICAgdGhpcy5kb2NrZXJUYWdQcmVmaXggPSBzcGVjLnNwZWNpYWxpemUodGhpcy5wcm9wcy5kb2NrZXJUYWdQcmVmaXggPz8gRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIuREVGQVVMVF9ET0NLRVJfQVNTRVRfUFJFRklYKTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG1heC1sZW4gKi9cbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9kdWNlIGEgYm91bmQgU3RhY2sgU3ludGhlc2l6ZXIgZm9yIHRoZSBnaXZlbiBzdGFjay5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgbWF5IGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZSBvbiB0aGUgc2FtZSBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgcmV1c2FibGVCaW5kKHN0YWNrOiBTdGFjayk6IElCb3VuZFN0YWNrU3ludGhlc2l6ZXIge1xuICAgIC8vIENyZWF0ZSBhIGNvcHkgb2YgdGhlIGN1cnJlbnQgb2JqZWN0IGFuZCBiaW5kIHRoYXRcbiAgICBjb25zdCBjb3B5ID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcbiAgICBjb3B5LmJpbmQoc3RhY2spO1xuICAgIHJldHVybiBjb3B5O1xuICB9XG5cbiAgcHVibGljIGFkZEZpbGVBc3NldChhc3NldDogRmlsZUFzc2V0U291cmNlKTogRmlsZUFzc2V0TG9jYXRpb24ge1xuICAgIGFzc2VydEJvdW5kKHRoaXMuYnVja2V0TmFtZSk7XG5cbiAgICBjb25zdCBsb2NhdGlvbiA9IHRoaXMuYXNzZXRNYW5pZmVzdC5kZWZhdWx0QWRkRmlsZUFzc2V0KHRoaXMuYm91bmRTdGFjaywgYXNzZXQsIHtcbiAgICAgIGJ1Y2tldE5hbWU6IHRoaXMuYnVja2V0TmFtZSxcbiAgICAgIGJ1Y2tldFByZWZpeDogdGhpcy5idWNrZXRQcmVmaXgsXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuY2xvdWRGb3JtYXRpb25Mb2NhdGlvbkZyb21GaWxlQXNzZXQobG9jYXRpb24pO1xuICB9XG5cbiAgcHVibGljIGFkZERvY2tlckltYWdlQXNzZXQoYXNzZXQ6IERvY2tlckltYWdlQXNzZXRTb3VyY2UpOiBEb2NrZXJJbWFnZUFzc2V0TG9jYXRpb24ge1xuICAgIGFzc2VydEJvdW5kKHRoaXMucmVwb3NpdG9yeU5hbWUpO1xuXG4gICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLmFzc2V0TWFuaWZlc3QuZGVmYXVsdEFkZERvY2tlckltYWdlQXNzZXQodGhpcy5ib3VuZFN0YWNrLCBhc3NldCwge1xuICAgICAgcmVwb3NpdG9yeU5hbWU6IHRoaXMucmVwb3NpdG9yeU5hbWUsXG4gICAgICBkb2NrZXJUYWdQcmVmaXg6IHRoaXMuZG9ja2VyVGFnUHJlZml4LFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmNsb3VkRm9ybWF0aW9uTG9jYXRpb25Gcm9tRG9ja2VySW1hZ2VBc3NldChsb2NhdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogU3ludGhlc2l6ZSB0aGUgYXNzb2NpYXRlZCBzdGFjayB0byB0aGUgc2Vzc2lvblxuICAgKi9cbiAgcHVibGljIHN5bnRoZXNpemUoc2Vzc2lvbjogSVN5bnRoZXNpc1Nlc3Npb24pOiB2b2lkIHtcbiAgICBhc3NlcnRCb3VuZCh0aGlzLnF1YWxpZmllcik7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZUFzc2V0U291cmNlID0gdGhpcy5zeW50aGVzaXplVGVtcGxhdGUoc2Vzc2lvbik7XG4gICAgY29uc3QgdGVtcGxhdGVBc3NldCA9IHRoaXMuYWRkRmlsZUFzc2V0KHRlbXBsYXRlQXNzZXRTb3VyY2UpO1xuXG4gICAgY29uc3QgYXNzZXRNYW5pZmVzdElkID0gdGhpcy5hc3NldE1hbmlmZXN0LmVtaXRNYW5pZmVzdCh0aGlzLmJvdW5kU3RhY2ssIHNlc3Npb24pO1xuXG4gICAgdGhpcy5lbWl0QXJ0aWZhY3Qoc2Vzc2lvbiwge1xuICAgICAgc3RhY2tUZW1wbGF0ZUFzc2V0T2JqZWN0VXJsOiB0ZW1wbGF0ZUFzc2V0LnMzT2JqZWN0VXJsV2l0aFBsYWNlaG9sZGVycyxcbiAgICAgIGFkZGl0aW9uYWxEZXBlbmRlbmNpZXM6IFthc3NldE1hbmlmZXN0SWRdLFxuICAgIH0pO1xuICB9XG59XG4iXX0=