"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION_LOCKED = exports.trimFromStart = exports.calculateFunctionHash = void 0;
const core_1 = require("@aws-cdk/core");
const helpers_internal_1 = require("@aws-cdk/core/lib/helpers-internal");
const cx_api_1 = require("@aws-cdk/cx-api");
const function_1 = require("./function");
function calculateFunctionHash(fn, additional = '') {
    const stack = core_1.Stack.of(fn);
    const functionResource = fn.node.defaultChild;
    // render the cloudformation resource from this function
    const config = stack.resolve(functionResource._toCloudFormation());
    // config is of the shape: { Resources: { LogicalId: { Type: 'Function', Properties: { ... } }}}
    const resources = config.Resources;
    const resourceKeys = Object.keys(resources);
    if (resourceKeys.length !== 1) {
        throw new Error(`Expected one rendered CloudFormation resource but found ${resourceKeys.length}`);
    }
    const logicalId = resourceKeys[0];
    const properties = resources[logicalId].Properties;
    let stringifiedConfig;
    if (core_1.FeatureFlags.of(fn).isEnabled(cx_api_1.LAMBDA_RECOGNIZE_VERSION_PROPS)) {
        const updatedProps = sortProperties(filterUsefulKeys(properties));
        stringifiedConfig = JSON.stringify(updatedProps);
    }
    else {
        const sorted = sortProperties(properties);
        config.Resources[logicalId].Properties = sorted;
        stringifiedConfig = JSON.stringify(config);
    }
    if (core_1.FeatureFlags.of(fn).isEnabled(cx_api_1.LAMBDA_RECOGNIZE_LAYER_VERSION)) {
        stringifiedConfig = stringifiedConfig + calculateLayersHash(fn._layers);
    }
    return helpers_internal_1.md5hash(stringifiedConfig + additional);
}
exports.calculateFunctionHash = calculateFunctionHash;
function trimFromStart(s, maxLength) {
    const desiredLength = Math.min(maxLength, s.length);
    const newStart = s.length - desiredLength;
    return s.substring(newStart);
}
exports.trimFromStart = trimFromStart;
/*
 * The list of properties found in CfnFunction (or AWS::Lambda::Function).
 * They are classified as "locked" to a Function Version or not.
 * When a property is locked, any change to that property will not take effect on previously created Versions.
 * Instead, a new Version must be generated for the change to take effect.
 * Similarly, if a property that's not locked to a Version is modified, a new Version
 * must not be generated.
 *
 * Adding a new property to this list - If the property is part of the UpdateFunctionConfiguration
 * API or UpdateFunctionCode API, then it must be classified as true, otherwise false.
 * See https://docs.aws.amazon.com/lambda/latest/dg/API_UpdateFunctionConfiguration.html and
 * https://docs.aws.amazon.com/lambda/latest/dg/API_UpdateFunctionConfiguration.html
 */
exports.VERSION_LOCKED = {
    // locked to the version
    Architectures: true,
    Code: true,
    DeadLetterConfig: true,
    Description: true,
    Environment: true,
    EphemeralStorage: true,
    FileSystemConfigs: true,
    FunctionName: true,
    Handler: true,
    ImageConfig: true,
    KmsKeyArn: true,
    Layers: true,
    MemorySize: true,
    PackageType: true,
    Role: true,
    Runtime: true,
    RuntimeManagementConfig: true,
    SnapStart: true,
    Timeout: true,
    TracingConfig: true,
    VpcConfig: true,
    // not locked to the version
    CodeSigningConfigArn: false,
    ReservedConcurrentExecutions: false,
    Tags: false,
};
function filterUsefulKeys(properties) {
    const versionProps = { ...exports.VERSION_LOCKED, ...function_1.Function._VER_PROPS };
    const unclassified = Object.entries(properties)
        .filter(([k, v]) => v != null && !Object.keys(versionProps).includes(k))
        .map(([k, _]) => k);
    if (unclassified.length > 0) {
        throw new Error(`The following properties are not recognized as version properties: [${unclassified}].`
            + ' See the README of the aws-lambda module to learn more about this and to fix it.');
    }
    const notLocked = Object.entries(versionProps).filter(([_, v]) => !v).map(([k, _]) => k);
    notLocked.forEach(p => delete properties[p]);
    const ret = {};
    Object.entries(properties).filter(([k, _]) => versionProps[k]).forEach(([k, v]) => ret[k] = v);
    return ret;
}
function sortProperties(properties) {
    const ret = {};
    // We take all required properties in the order that they were historically,
    // to make sure the hash we calculate is stable.
    // There cannot be more required properties added in the future,
    // as that would be a backwards-incompatible change.
    const requiredProperties = ['Code', 'Handler', 'Role', 'Runtime'];
    for (const requiredProperty of requiredProperties) {
        ret[requiredProperty] = properties[requiredProperty];
    }
    // then, add all of the non-required properties,
    // in the original order
    for (const property of Object.keys(properties)) {
        if (requiredProperties.indexOf(property) === -1) {
            ret[property] = properties[property];
        }
    }
    return ret;
}
function calculateLayersHash(layers) {
    const layerConfig = {};
    for (const layer of layers) {
        const stack = core_1.Stack.of(layer);
        const layerResource = layer.node.defaultChild;
        // if there is no layer resource, then the layer was imported
        // and we will include the layer arn and runtimes in the hash
        if (layerResource === undefined) {
            // ARN may have unresolved parts in it, but we didn't deal with this previously
            // so deal with it now for backwards compatibility.
            if (!core_1.Token.isUnresolved(layer.layerVersionArn)) {
                layerConfig[layer.layerVersionArn] = layer.compatibleRuntimes;
            }
            else {
                layerConfig[layer.node.id] = {
                    arn: stack.resolve(layer.layerVersionArn),
                    runtimes: layer.compatibleRuntimes?.map(r => r.name),
                };
            }
            continue;
        }
        const config = stack.resolve(layerResource._toCloudFormation());
        const resources = config.Resources;
        const resourceKeys = Object.keys(resources);
        if (resourceKeys.length !== 1) {
            throw new Error(`Expected one rendered CloudFormation resource but found ${resourceKeys.length}`);
        }
        const logicalId = resourceKeys[0];
        const properties = resources[logicalId].Properties;
        // all properties require replacement, so they are all version locked.
        layerConfig[layer.node.id] = properties;
    }
    return helpers_internal_1.md5hash(JSON.stringify(layerConfig));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24taGFzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZ1bmN0aW9uLWhhc2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0NBQXdFO0FBQ3hFLHlFQUE2RDtBQUM3RCw0Q0FBaUc7QUFDakcseUNBQXdEO0FBR3hELFNBQWdCLHFCQUFxQixDQUFDLEVBQWtCLEVBQUUsYUFBcUIsRUFBRTtJQUMvRSxNQUFNLEtBQUssR0FBRyxZQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRTNCLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUEyQixDQUFDO0lBRTdELHdEQUF3RDtJQUN4RCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFFLGdCQUF3QixDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztJQUM1RSxnR0FBZ0c7SUFDaEcsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzVDLElBQUksWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQywyREFBMkQsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7S0FDbkc7SUFDRCxNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUVuRCxJQUFJLGlCQUFpQixDQUFDO0lBQ3RCLElBQUksbUJBQVksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLHVDQUE4QixDQUFDLEVBQUU7UUFDakUsTUFBTSxZQUFZLEdBQUcsY0FBYyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDbEUsaUJBQWlC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QUM7UUFDbkMsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1QyxJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1NBQ25HO1FBQ0QsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDbkQsc0VBQXNFO1FBQ3RFLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztLQUN6QztJQUVELE9BQU8sMEJBQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDOUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENmblJlc291cmNlLCBGZWF0dXJlRmxhZ3MsIFN0YWNrLCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgbWQ1aGFzaCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUvbGliL2hlbHBlcnMtaW50ZXJuYWwnO1xuaW1wb3J0IHsgTEFNQkRBX1JFQ09HTklaRV9MQVlFUl9WRVJTSU9OLCBMQU1CREFfUkVDT0dOSVpFX1ZFUlNJT05fUFJPUFMgfSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgRnVuY3Rpb24gYXMgTGFtYmRhRnVuY3Rpb24gfSBmcm9tICcuL2Z1bmN0aW9uJztcbmltcG9ydCB7IElMYXllclZlcnNpb24gfSBmcm9tICcuL2xheWVycyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVGdW5jdGlvbkhhc2goZm46IExhbWJkYUZ1bmN0aW9uLCBhZGRpdGlvbmFsOiBzdHJpbmcgPSAnJykge1xuICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKGZuKTtcblxuICBjb25zdCBmdW5jdGlvblJlc291cmNlID0gZm4ubm9kZS5kZWZhdWx0Q2hpbGQgYXMgQ2ZuUmVzb3VyY2U7XG5cbiAgLy8gcmVuZGVyIHRoZSBjbG91ZGZvcm1hdGlvbiByZXNvdXJjZSBmcm9tIHRoaXMgZnVuY3Rpb25cbiAgY29uc3QgY29uZmlnID0gc3RhY2sucmVzb2x2ZSgoZnVuY3Rpb25SZXNvdXJjZSBhcyBhbnkpLl90b0Nsb3VkRm9ybWF0aW9uKCkpO1xuICAvLyBjb25maWcgaXMgb2YgdGhlIHNoYXBlOiB7IFJlc291cmNlczogeyBMb2dpY2FsSWQ6IHsgVHlwZTogJ0Z1bmN0aW9uJywgUHJvcGVydGllczogeyAuLi4gfSB9fX1cbiAgY29uc3QgcmVzb3VyY2VzID0gY29uZmlnLlJlc291cmNlcztcbiAgY29uc3QgcmVzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMocmVzb3VyY2VzKTtcbiAgaWYgKHJlc291cmNlS2V5cy5sZW5ndGggIT09IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIG9uZSByZW5kZXJlZCBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBidXQgZm91bmQgJHtyZXNvdXJjZUtleXMubGVuZ3RofWApO1xuICB9XG4gIGNvbnN0IGxvZ2ljYWxJZCA9IHJlc291cmNlS2V5c1swXTtcbiAgY29uc3QgcHJvcGVydGllcyA9IHJlc291cmNlc1tsb2dpY2FsSWRdLlByb3BlcnRpZXM7XG5cbiAgbGV0IHN0cmluZ2lmaWVkQ29uZmlnO1xuICBpZiAoRmVhdHVyZUZsYWdzLm9mKGZuKS5pc0VuYWJsZWQoTEFNQkRBX1JFQ09HTklaRV9WRVJTSU9OX1BST1BTKSkge1xuICAgIGNvbnN0IHVwZGF0ZWRQcm9wcyA9IHNvcnRQcm9wZXJ0aWVzKGZpbHRlclVzZWZ1bEtleXMocHJvcGVydGllcykpO1xuICAgIHN0cmluZ2lmaWVkQ29uZmlnID0gSlNPTi5zdHJpbmdpZnkodXBkYXRlZFByb3BzKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBzb3J0ZWQgPSBzb3J0UHJvcGVydGllcyhwcm9wZXJ0aWVzKTtcbiAgICBjb25maWcuUmVzb3VyY2VzW2xvZ2ljYWxJZF0uUHJvcGVydGllcyA9IHNvcnRlZDtcbiAgICBzdHJpbmdpZmllZENvbmZpZyA9IEpTT04uc3RyaW5naWZ5KGNvbmZpZyk7XG4gIH1cblxuICBpZiAoRmVhdHVyZUZsYWdzLm9mKGZuKS5pc0VuYWJsZWQoTEFNQkRBX1JFQ09HTklaRV9MQVlFUl9WRVJTSU9OKSkge1xuICAgIHN0cmluZ2lmaWVkQ29uZmlnID0gc3RyaW5naWZpZWRDb25maWcgKyBjYWxjdWxhdGVMYXllcnNIYXNoKGZuLl9sYXllcnMpO1xuICB9XG5cbiAgcmV0dXJuIG1kNWhhc2goc3RyaW5naWZpZWRDb25maWcgKyBhZGRpdGlvbmFsKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyaW1Gcm9tU3RhcnQoczogc3RyaW5nLCBtYXhMZW5ndGg6IG51bWJlcikge1xuICBjb25zdCBkZXNpcmVkTGVuZ3RoID0gTWF0aC5taW4obWF4TGVuZ3RoLCBzLmxlbmd0aCk7XG4gIGNvbnN0IG5ld1N0YXJ0ID0gcy5sZW5ndGggLSBkZXNpcmVkTGVuZ3RoO1xuICByZXR1cm4gcy5zdWJzdHJpbmcobmV3U3RhcnQpO1xufVxuXG4vKlxuICogVGhlIGxpc3Qgb2YgcHJvcGVydGllcyBmb3VuZCBpbiBDZm5GdW5jdGlvbiAob3IgQVdTOjpMYW1iZGE6OkZ1bmN0aW9uKS5cbiAqIFRoZXkgYXJlIGNsYXNzaWZpZWQgYXMgXCJsb2NrZWRcIiB0byBhIEZ1bmN0aW9uIFZlcnNpb24gb3Igbm90LlxuICogV2hlbiBhIHByb3BlcnR5IGlzIGxvY2tlZCwgYW55IGNoYW5nZSB0byB0aGF0IHByb3BlcnR5IHdpbGwgbm90IHRha2UgZWZmZWN0IG9uIHByZXZpb3VzbHkgY3JlYXRlZCBWZXJzaW9ucy5cbiAqIEluc3RlYWQsIGEgbmV3IFZlcnNpb24gbXVzdCBiZSBnZW5lcmF0ZWQgZm9yIHRoZSBjaGFuZ2UgdG8gdGFrZSBlZmZlY3QuXG4gKiBTaW1pbGFybHksIGlmIGEgcHJvcGVydHkgdGhhdCdzIG5vdCBsb2NrZWQgdG8gYSBWZXJzaW9uIGlzIG1vZGlmaWVkLCBhIG5ldyBWZXJzaW9uXG4gKiBtdXN0IG5vdCBiZSBnZW5lcmF0ZWQuXG4gKlxuICogQWRkaW5nIGEgbmV3IHByb3BlcnR5IHRvIHRoaXMgbGlzdCAtIElmIHRoZSBwcm9wZXJ0eSBpcyBwYXJ0IG9mIHRoZSBVcGRhdGVGdW5jdGlvbkNvbmZpZ3VyYXRpb25cbiAqIEFQSSBvciBVcGRhdGVGdW5jdGlvbkNvZGUgQVBJLCB0aGVuIGl0IG11c3QgYmUgY2xhc3NpZmllZCBhcyB0cnVlLCBvdGhlcndpc2UgZmFsc2UuXG4gKiBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2xhbWJkYS9sYXRlc3QvZGcvQVBJX1VwZGF0ZUZ1bmN0aW9uQ29uZmlndXJhdGlvbi5odG1sIGFuZFxuICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2xhbWJkYS9sYXRlc3QvZGcvQVBJX1VwZGF0ZUZ1bmN0aW9uQ29uZmlndXJhdGlvbi5odG1sXG4gKi9cbmV4cG9ydCBjb25zdCBWRVJTSU9OX0xPQ0tFRDogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0gPSB7XG4gIC8vIGxvY2tlZCB0byB0aGUgdmVyc2lvblxuICBBcmNoaXRlY3R1cmVzOiB0cnVlLFxuICBDb2RlOiB0cnVlLFxuICBEZWFkTGV0dGVyQ29uZmlnOiB0cnVlLFxuICBEZXNjcmlwdGlvbjogdHJ1ZSxcbiAgRW52aXJvbm1lbnQ6IHRydWUsXG4gIEVwaGVtZXJhbFN0b3JhZ2U6IHRydWUsXG4gIEZpbGVTeXN0ZW1Db25maWdzOiB0cnVlLFxuICBGdW5jdGlvbk5hbWU6IHRydWUsXG4gIEhhbmRsZXI6IHRydWUsXG4gIEltYWdlQ29uZmlnOiB0cnVlLFxuICBLbXNLZXlBcm46IHRydWUsXG4gIExheWVyczogdHJ1ZSxcbiAgTWVtb3J5U2l6ZTogdHJ1ZSxcbiAgUGFja2FnZVR5cGU6IHRydWUsXG4gIFJvbGU6IHRydWUsXG4gIFJ1bnRpbWU6IHRydWUsXG4gIFJ1bnRpbWVNYW5hZ2VtZW50Q29uZmlnOiB0cnVlLFxuICBTbmFwU3RhcnQ6IHRydWUsXG4gIFRpbWVvdXQ6IHRydWUsXG4gIFRyYWNpbmdDb25maWc6IHRydWUsXG4gIFZwY0NvbmZpZzogdHJ1ZSxcblxuICAvLyBub3QgbG9ja2VkIHRvIHRoZSB2ZXJzaW9uXG4gIENvZGVTaWduaW5nQ29uZmlnQXJuOiBmYWxzZSxcbiAgUmVzZXJ2ZWRDb25jdXJyZW50RXhlY3V0aW9uczogZmFsc2UsXG4gIFRhZ3M6IGZhbHNlLFxufTtcblxuZnVuY3Rpb24gZmlsdGVyVXNlZnVsS2V5cyhwcm9wZXJ0aWVzOiBhbnkpIHtcbiAgY29uc3QgdmVyc2lvblByb3BzID0geyAuLi5WRVJTSU9OX0xPQ0tFRCwgLi4uTGFtYmRhRnVuY3Rpb24uX1ZFUl9QUk9QUyB9O1xuICBjb25zdCB1bmNsYXNzaWZpZWQgPSBPYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzKVxuICAgIC5maWx0ZXIoKFtrLCB2XSkgPT4gdiAhPSBudWxsICYmICFPYmplY3Qua2V5cyh2ZXJzaW9uUHJvcHMpLmluY2x1ZGVzKGspKVxuICAgIC5tYXAoKFtrLCBfXSkgPT4gayk7XG4gIGlmICh1bmNsYXNzaWZpZWQubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzIGFyZSBub3QgcmVjb2duaXplZCBhcyB2ZXJzaW9uIHByb3BlcnRpZXM6IFske3VuY2xhc3NpZmllZH1dLmBcbiAgICAgICsgJyBTZWUgdGhlIFJFQURNRSBvZiB0aGUgYXdzLWxhbWJkYSBtb2R1bGUgdG8gbGVhcm4gbW9yZSBhYm91dCB0aGlzIGFuZCB0byBmaXggaXQuJyk7XG4gIH1cbiAgY29uc3Qgbm90TG9ja2VkID0gT2JqZWN0LmVudHJpZXModmVyc2lvblByb3BzKS5maWx0ZXIoKFtfLCB2XSkgPT4gIXYpLm1hcCgoW2ssIF9dKSA9PiBrKTtcbiAgbm90TG9ja2VkLmZvckVhY2gocCA9PiBkZWxldGUgcHJvcGVydGllc1twXSk7XG5cbiAgY29uc3QgcmV0OiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XG4gIE9iamVjdC5lbnRyaWVzKHByb3BlcnRpZXMpLmZpbHRlcigoW2ssIF9dKSA9PiB2ZXJzaW9uUHJvcHNba10pLmZvckVhY2goKFtrLCB2XSkgPT4gcmV0W2tdID0gdik7XG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIHNvcnRQcm9wZXJ0aWVzKHByb3BlcnRpZXM6IGFueSkge1xuICBjb25zdCByZXQ6IGFueSA9IHt9O1xuICAvLyBXZSB0YWtlIGFsbCByZXF1aXJlZCBwcm9wZXJ0aWVzIGluIHRoZSBvcmRlciB0aGF0IHRoZXkgd2VyZSBoaXN0b3JpY2FsbHksXG4gIC8vIHRvIG1ha2Ugc3VyZSB0aGUgaGFzaCB3ZSBjYWxjdWxhdGUgaXMgc3RhYmxlLlxuICAvLyBUaGVyZSBjYW5ub3QgYmUgbW9yZSByZXF1aXJlZCBwcm9wZXJ0aWVzIGFkZGVkIGluIHRoZSBmdXR1cmUsXG4gIC8vIGFzIHRoYXQgd291bGQgYmUgYSBiYWNrd2FyZHMtaW5jb21wYXRpYmxlIGNoYW5nZS5cbiAgY29uc3QgcmVxdWlyZWRQcm9wZXJ0aWVzID0gWydDb2RlJywgJ0hhbmRsZXInLCAnUm9sZScsICdSdW50aW1lJ107XG4gIGZvciAoY29uc3QgcmVxdWlyZWRQcm9wZXJ0eSBvZiByZXF1aXJlZFByb3BlcnRpZXMpIHtcbiAgICByZXRbcmVxdWlyZWRQcm9wZXJ0eV0gPSBwcm9wZXJ0aWVzW3JlcXVpcmVkUHJvcGVydHldO1xuICB9XG4gIC8vIHRoZW4sIGFkZCBhbGwgb2YgdGhlIG5vbi1yZXF1aXJlZCBwcm9wZXJ0aWVzLFxuICAvLyBpbiB0aGUgb3JpZ2luYWwgb3JkZXJcbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSkge1xuICAgIGlmIChyZXF1aXJlZFByb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eSkgPT09IC0xKSB7XG4gICAgICByZXRbcHJvcGVydHldID0gcHJvcGVydGllc1twcm9wZXJ0eV07XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZUxheWVyc0hhc2gobGF5ZXJzOiBJTGF5ZXJWZXJzaW9uW10pOiBzdHJpbmcge1xuICBjb25zdCBsYXllckNvbmZpZzoge1trZXk6IHN0cmluZ106IGFueSB9ID0ge307XG4gIGZvciAoY29uc3QgbGF5ZXIgb2YgbGF5ZXJzKSB7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZihsYXllcik7XG4gICAgY29uc3QgbGF5ZXJSZXNvdXJjZSA9IGxheWVyLm5vZGUuZGVmYXVsdENoaWxkIGFzIENmblJlc291cmNlO1xuICAgIC8vIGlmIHRoZXJlIGlzIG5vIGxheWVyIHJlc291cmNlLCB0aGVuIHRoZSBsYXllciB3YXMgaW1wb3J0ZWRcbiAgICAvLyBhbmQgd2Ugd2lsbCBpbmNsdWRlIHRoZSBsYXllciBhcm4gYW5kIHJ1bnRpbWVzIGluIHRoZSBoYXNoXG4gICAgaWYgKGxheWVyUmVzb3VyY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQVJOIG1heSBoYXZlIHVucmVzb2x2ZWQgcGFydHMgaW4gaXQsIGJ1dCB3ZSBkaWRuJ3QgZGVhbCB3aXRoIHRoaXMgcHJldmlvdXNseVxuICAgICAgLy8gc28gZGVhbCB3aXRoIGl0IG5vdyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gICAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChsYXllci5sYXllclZlcnNpb25Bcm4pKSB7XG4gICAgICAgIGxheWVyQ29uZmlnW2xheWVyLmxheWVyVmVyc2lvbkFybl0gPSBsYXllci5jb21wYXRpYmxlUnVudGltZXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYXllckNvbmZpZ1tsYXllci5ub2RlLmlkXSA9IHtcbiAgICAgICAgICBhcm46IHN0YWNrLnJlc29sdmUobGF5ZXIubGF5ZXJWZXJzaW9uQXJuKSxcbiAgICAgICAgICBydW50aW1lczogbGF5ZXIuY29tcGF0aWJsZVJ1bnRpbWVzPy5tYXAociA9PiByLm5hbWUpLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGNvbmZpZyA9IHN0YWNrLnJlc29sdmUoKGxheWVyUmVzb3VyY2UgYXMgYW55KS5fdG9DbG91ZEZvcm1hdGlvbigpKTtcbiAgICBjb25zdCByZXNvdXJjZXMgPSBjb25maWcuUmVzb3VyY2VzO1xuICAgIGNvbnN0IHJlc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHJlc291cmNlcyk7XG4gICAgaWYgKHJlc291cmNlS2V5cy5sZW5ndGggIT09IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgb25lIHJlbmRlcmVkIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGJ1dCBmb3VuZCAke3Jlc291cmNlS2V5cy5sZW5ndGh9YCk7XG4gICAgfVxuICAgIGNvbnN0IGxvZ2ljYWxJZCA9IHJlc291cmNlS2V5c1swXTtcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gcmVzb3VyY2VzW2xvZ2ljYWxJZF0uUHJvcGVydGllcztcbiAgICAvLyBhbGwgcHJvcGVydGllcyByZXF1aXJlIHJlcGxhY2VtZW50LCBzbyB0aGV5IGFyZSBhbGwgdmVyc2lvbiBsb2NrZWQuXG4gICAgbGF5ZXJDb25maWdbbGF5ZXIubm9kZS5pZF0gPSBwcm9wZXJ0aWVzO1xuICB9XG5cbiAgcmV0dXJuIG1kNWhhc2goSlNPTi5zdHJpbmdpZnkobGF5ZXJDb25maWcpKTtcbn1cbiJdfQ==