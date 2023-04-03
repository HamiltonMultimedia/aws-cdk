"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructInfoFromStack = exports.constructInfoFromConstruct = void 0;
const stack_1 = require("../stack");
const stage_1 = require("../stage");
const ALLOWED_FQN_PREFIXES = [
    // SCOPES
    '@aws-cdk/', '@aws-cdk-containers/', '@aws-solutions-konstruk/', '@aws-solutions-constructs/', '@amzn/', '@cdklabs/',
    // PACKAGES
    'aws-rfdk.', 'aws-cdk-lib.',
];
/**
 * Symbol for accessing jsii runtime information
 *
 * Introduced in jsii 1.19.0, cdk 1.90.0.
 */
const JSII_RUNTIME_SYMBOL = Symbol.for('jsii.rtti');
function constructInfoFromConstruct(construct) {
    const jsiiRuntimeInfo = Object.getPrototypeOf(construct).constructor[JSII_RUNTIME_SYMBOL];
    if (typeof jsiiRuntimeInfo === 'object'
        && jsiiRuntimeInfo !== null
        && typeof jsiiRuntimeInfo.fqn === 'string'
        && typeof jsiiRuntimeInfo.version === 'string') {
        return { fqn: jsiiRuntimeInfo.fqn, version: jsiiRuntimeInfo.version };
    }
    else if (jsiiRuntimeInfo) {
        // There is something defined, but doesn't match our expectations. Fail fast and hard.
        throw new Error(`malformed jsii runtime info for construct: '${construct.node.path}'`);
    }
    return undefined;
}
exports.constructInfoFromConstruct = constructInfoFromConstruct;
/**
 * For a given stack, walks the tree and finds the runtime info for all constructs within the tree.
 * Returns the unique list of construct info present in the stack,
 * as long as the construct fully-qualified names match the defined allow list.
 */
function constructInfoFromStack(stack) {
    const isDefined = (value) => value !== undefined;
    const allConstructInfos = constructsInStack(stack)
        .map(construct => constructInfoFromConstruct(construct))
        .filter(isDefined)
        .filter(info => ALLOWED_FQN_PREFIXES.find(prefix => info.fqn.startsWith(prefix)));
    // Adds the jsii runtime as a psuedo construct for reporting purposes.
    allConstructInfos.push({
        fqn: 'jsii-runtime.Runtime',
        version: getJsiiAgentVersion(),
    });
    // Filter out duplicate values
    const uniqKeys = new Set();
    return allConstructInfos.filter(construct => {
        const constructKey = `${construct.fqn}@${construct.version}`;
        const isDuplicate = uniqKeys.has(constructKey);
        uniqKeys.add(constructKey);
        return !isDuplicate;
    });
}
exports.constructInfoFromStack = constructInfoFromStack;
/**
 * Returns all constructs under the parent construct (including the parent),
 * stopping when it reaches a boundary of another stack (e.g., Stack, Stage, NestedStack).
 */
function constructsInStack(construct) {
    const constructs = [construct];
    construct.node.children
        .filter(child => !stage_1.Stage.isStage(child) && !stack_1.Stack.isStack(child))
        .forEach(child => constructs.push(...constructsInStack(child)));
    return constructs;
}
function getJsiiAgentVersion() {
    let jsiiAgent = process.env.JSII_AGENT;
    // if JSII_AGENT is not specified, we will assume this is a node.js runtime
    // and plug in our node.js version
    if (!jsiiAgent) {
        jsiiAgent = `node.js/${process.version}`;
    }
    // Sanitize the agent to remove characters which might mess with the downstream
    // prefix encoding & decoding. In particular the .NET jsii agent takes a form like:
    // DotNet/5.0.3/.NETCoreApp,Version=v3.1/1.0.0.0
    // The `,` in the above messes with the prefix decoding when reporting the analytics.
    jsiiAgent = jsiiAgent.replace(/[^a-z0-9.-/=_]/gi, '-');
    return jsiiAgent;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZS1pbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicnVudGltZS1pbmZvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG9DQUFpQztBQUNqQyxvQ0FBaUM7QUFFakMsTUFBTSxvQkFBb0IsR0FBRztJQUMzQixTQUFTO0lBQ1QsV0FBVyxFQUFFLHNCQUFzQixFQUFFLDBCQUEwQixFQUFFLDRCQUE0QixFQUFFLFFBQVEsRUFBRSxXQUFXO0lBQ3BILFdBQVc7SUFDWCxXQUFXLEVBQUUsY0FBYztDQUM1QixDQUFDO0FBRUY7Ozs7R0FJRztBQUNILE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQVVwRCxTQUFnQiwwQkFBMEIsQ0FBQyxTQUFxQjtJQUM5RCxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzFGLElBQUksT0FBTyxlQUFlLEtBQUssUUFBUTtXQUNsQyxlQUFlLEtBQUssSUFBSTtXQUN4QixPQUFPLGVBQWUsQ0FBQyxHQUFHLEtBQUssUUFBUTtXQUN2QyxPQUFPLGVBQWUsQ0FBQyxPQUFPLEtBQUssUUFBUSxFQUFFO1FBQ2hELE9BQU8sRUFBRSxHQUFHLEVBQUUsZUFBZSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3ZFO1NBQU0sSUFBSSxlQUFlLEVBQUU7UUFDMUIsc0ZBQXNGO1FBQ3RGLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztLQUN4RjtJQUNELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFaRCxnRUFZQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixzQkFBc0IsQ0FBQyxLQUFZO0lBQ2pELE1BQU0sU0FBUyxHQUFHLENBQUMsS0FBZ0MsRUFBMEIsRUFBRSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUM7SUFFcEcsTUFBTSxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7U0FDL0MsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsMEJBQTBCLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDdkQsTUFBTSxDQUFDLFNBQVMsQ0FBQztTQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFcEYsc0VBQXNFO0lBQ3RFLGlCQUFpQixDQUFDLElBQUksQ0FBQztRQUNyQixHQUFHLEVBQUUsc0JBQXNCO1FBQzNCLE9BQU8sRUFBRSxtQkFBbUIsRUFBRTtLQUMvQixDQUFDLENBQUM7SUFFSCw4QkFBOEI7SUFDOUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUMzQixPQUFPLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUMxQyxNQUFNLFlBQVksR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzdELE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDL0MsUUFBUSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMzQixPQUFPLENBQUMsV0FBVyxDQUFDO0lBQ3RCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXRCRCx3REFzQkM7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLGlCQUFpQixDQUFDLFNBQXFCO0lBQzlDLE1BQU0sVUFBVSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0IsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRO1NBQ3BCLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0QsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRSxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDO0FBRUQsU0FBUyxtQkFBbUI7SUFDMUIsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7SUFFdkMsMkVBQTJFO0lBQzNFLGtDQUFrQztJQUNsQyxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QsU0FBUyxHQUFHLFdBQVcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzFDO0lBRUQsK0VBQStFO0lBQy9FLG1GQUFtRjtJQUNuRixnREFBZ0Q7SUFDaEQscUZBQXFGO0lBQ3JGLFNBQVMsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRXZELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uL3N0YWNrJztcbmltcG9ydCB7IFN0YWdlIH0gZnJvbSAnLi4vc3RhZ2UnO1xuXG5jb25zdCBBTExPV0VEX0ZRTl9QUkVGSVhFUyA9IFtcbiAgLy8gU0NPUEVTXG4gICdAYXdzLWNkay8nLCAnQGF3cy1jZGstY29udGFpbmVycy8nLCAnQGF3cy1zb2x1dGlvbnMta29uc3RydWsvJywgJ0Bhd3Mtc29sdXRpb25zLWNvbnN0cnVjdHMvJywgJ0BhbXpuLycsICdAY2RrbGFicy8nLFxuICAvLyBQQUNLQUdFU1xuICAnYXdzLXJmZGsuJywgJ2F3cy1jZGstbGliLicsXG5dO1xuXG4vKipcbiAqIFN5bWJvbCBmb3IgYWNjZXNzaW5nIGpzaWkgcnVudGltZSBpbmZvcm1hdGlvblxuICpcbiAqIEludHJvZHVjZWQgaW4ganNpaSAxLjE5LjAsIGNkayAxLjkwLjAuXG4gKi9cbmNvbnN0IEpTSUlfUlVOVElNRV9TWU1CT0wgPSBTeW1ib2wuZm9yKCdqc2lpLnJ0dGknKTtcblxuLyoqXG4gKiBTb3VyY2UgaW5mb3JtYXRpb24gb24gYSBjb25zdHJ1Y3QgKGNsYXNzIGZxbiBhbmQgdmVyc2lvbilcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb25zdHJ1Y3RJbmZvIHtcbiAgcmVhZG9ubHkgZnFuOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHZlcnNpb246IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnN0cnVjdEluZm9Gcm9tQ29uc3RydWN0KGNvbnN0cnVjdDogSUNvbnN0cnVjdCk6IENvbnN0cnVjdEluZm8gfCB1bmRlZmluZWQge1xuICBjb25zdCBqc2lpUnVudGltZUluZm8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY29uc3RydWN0KS5jb25zdHJ1Y3RvcltKU0lJX1JVTlRJTUVfU1lNQk9MXTtcbiAgaWYgKHR5cGVvZiBqc2lpUnVudGltZUluZm8gPT09ICdvYmplY3QnXG4gICAgJiYganNpaVJ1bnRpbWVJbmZvICE9PSBudWxsXG4gICAgJiYgdHlwZW9mIGpzaWlSdW50aW1lSW5mby5mcW4gPT09ICdzdHJpbmcnXG4gICAgJiYgdHlwZW9mIGpzaWlSdW50aW1lSW5mby52ZXJzaW9uID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB7IGZxbjoganNpaVJ1bnRpbWVJbmZvLmZxbiwgdmVyc2lvbjoganNpaVJ1bnRpbWVJbmZvLnZlcnNpb24gfTtcbiAgfSBlbHNlIGlmIChqc2lpUnVudGltZUluZm8pIHtcbiAgICAvLyBUaGVyZSBpcyBzb21ldGhpbmcgZGVmaW5lZCwgYnV0IGRvZXNuJ3QgbWF0Y2ggb3VyIGV4cGVjdGF0aW9ucy4gRmFpbCBmYXN0IGFuZCBoYXJkLlxuICAgIHRocm93IG5ldyBFcnJvcihgbWFsZm9ybWVkIGpzaWkgcnVudGltZSBpbmZvIGZvciBjb25zdHJ1Y3Q6ICcke2NvbnN0cnVjdC5ub2RlLnBhdGh9J2ApO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogRm9yIGEgZ2l2ZW4gc3RhY2ssIHdhbGtzIHRoZSB0cmVlIGFuZCBmaW5kcyB0aGUgcnVudGltZSBpbmZvIGZvciBhbGwgY29uc3RydWN0cyB3aXRoaW4gdGhlIHRyZWUuXG4gKiBSZXR1cm5zIHRoZSB1bmlxdWUgbGlzdCBvZiBjb25zdHJ1Y3QgaW5mbyBwcmVzZW50IGluIHRoZSBzdGFjayxcbiAqIGFzIGxvbmcgYXMgdGhlIGNvbnN0cnVjdCBmdWxseS1xdWFsaWZpZWQgbmFtZXMgbWF0Y2ggdGhlIGRlZmluZWQgYWxsb3cgbGlzdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnN0cnVjdEluZm9Gcm9tU3RhY2soc3RhY2s6IFN0YWNrKTogQ29uc3RydWN0SW5mb1tdIHtcbiAgY29uc3QgaXNEZWZpbmVkID0gKHZhbHVlOiBDb25zdHJ1Y3RJbmZvIHwgdW5kZWZpbmVkKTogdmFsdWUgaXMgQ29uc3RydWN0SW5mbyA9PiB2YWx1ZSAhPT0gdW5kZWZpbmVkO1xuXG4gIGNvbnN0IGFsbENvbnN0cnVjdEluZm9zID0gY29uc3RydWN0c0luU3RhY2soc3RhY2spXG4gICAgLm1hcChjb25zdHJ1Y3QgPT4gY29uc3RydWN0SW5mb0Zyb21Db25zdHJ1Y3QoY29uc3RydWN0KSlcbiAgICAuZmlsdGVyKGlzRGVmaW5lZClcbiAgICAuZmlsdGVyKGluZm8gPT4gQUxMT1dFRF9GUU5fUFJFRklYRVMuZmluZChwcmVmaXggPT4gaW5mby5mcW4uc3RhcnRzV2l0aChwcmVmaXgpKSk7XG5cbiAgLy8gQWRkcyB0aGUganNpaSBydW50aW1lIGFzIGEgcHN1ZWRvIGNvbnN0cnVjdCBmb3IgcmVwb3J0aW5nIHB1cnBvc2VzLlxuICBhbGxDb25zdHJ1Y3RJbmZvcy5wdXNoKHtcbiAgICBmcW46ICdqc2lpLXJ1bnRpbWUuUnVudGltZScsXG4gICAgdmVyc2lvbjogZ2V0SnNpaUFnZW50VmVyc2lvbigpLFxuICB9KTtcblxuICAvLyBGaWx0ZXIgb3V0IGR1cGxpY2F0ZSB2YWx1ZXNcbiAgY29uc3QgdW5pcUtleXMgPSBuZXcgU2V0KCk7XG4gIHJldHVybiBhbGxDb25zdHJ1Y3RJbmZvcy5maWx0ZXIoY29uc3RydWN0ID0+IHtcbiAgICBjb25zdCBjb25zdHJ1Y3RLZXkgPSBgJHtjb25zdHJ1Y3QuZnFufUAke2NvbnN0cnVjdC52ZXJzaW9ufWA7XG4gICAgY29uc3QgaXNEdXBsaWNhdGUgPSB1bmlxS2V5cy5oYXMoY29uc3RydWN0S2V5KTtcbiAgICB1bmlxS2V5cy5hZGQoY29uc3RydWN0S2V5KTtcbiAgICByZXR1cm4gIWlzRHVwbGljYXRlO1xuICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBjb25zdHJ1Y3RzIHVuZGVyIHRoZSBwYXJlbnQgY29uc3RydWN0IChpbmNsdWRpbmcgdGhlIHBhcmVudCksXG4gKiBzdG9wcGluZyB3aGVuIGl0IHJlYWNoZXMgYSBib3VuZGFyeSBvZiBhbm90aGVyIHN0YWNrIChlLmcuLCBTdGFjaywgU3RhZ2UsIE5lc3RlZFN0YWNrKS5cbiAqL1xuZnVuY3Rpb24gY29uc3RydWN0c0luU3RhY2soY29uc3RydWN0OiBJQ29uc3RydWN0KTogSUNvbnN0cnVjdFtdIHtcbiAgY29uc3QgY29uc3RydWN0cyA9IFtjb25zdHJ1Y3RdO1xuICBjb25zdHJ1Y3Qubm9kZS5jaGlsZHJlblxuICAgIC5maWx0ZXIoY2hpbGQgPT4gIVN0YWdlLmlzU3RhZ2UoY2hpbGQpICYmICFTdGFjay5pc1N0YWNrKGNoaWxkKSlcbiAgICAuZm9yRWFjaChjaGlsZCA9PiBjb25zdHJ1Y3RzLnB1c2goLi4uY29uc3RydWN0c0luU3RhY2soY2hpbGQpKSk7XG4gIHJldHVybiBjb25zdHJ1Y3RzO1xufVxuXG5mdW5jdGlvbiBnZXRKc2lpQWdlbnRWZXJzaW9uKCkge1xuICBsZXQganNpaUFnZW50ID0gcHJvY2Vzcy5lbnYuSlNJSV9BR0VOVDtcblxuICAvLyBpZiBKU0lJX0FHRU5UIGlzIG5vdCBzcGVjaWZpZWQsIHdlIHdpbGwgYXNzdW1lIHRoaXMgaXMgYSBub2RlLmpzIHJ1bnRpbWVcbiAgLy8gYW5kIHBsdWcgaW4gb3VyIG5vZGUuanMgdmVyc2lvblxuICBpZiAoIWpzaWlBZ2VudCkge1xuICAgIGpzaWlBZ2VudCA9IGBub2RlLmpzLyR7cHJvY2Vzcy52ZXJzaW9ufWA7XG4gIH1cblxuICAvLyBTYW5pdGl6ZSB0aGUgYWdlbnQgdG8gcmVtb3ZlIGNoYXJhY3RlcnMgd2hpY2ggbWlnaHQgbWVzcyB3aXRoIHRoZSBkb3duc3RyZWFtXG4gIC8vIHByZWZpeCBlbmNvZGluZyAmIGRlY29kaW5nLiBJbiBwYXJ0aWN1bGFyIHRoZSAuTkVUIGpzaWkgYWdlbnQgdGFrZXMgYSBmb3JtIGxpa2U6XG4gIC8vIERvdE5ldC81LjAuMy8uTkVUQ29yZUFwcCxWZXJzaW9uPXYzLjEvMS4wLjAuMFxuICAvLyBUaGUgYCxgIGluIHRoZSBhYm92ZSBtZXNzZXMgd2l0aCB0aGUgcHJlZml4IGRlY29kaW5nIHdoZW4gcmVwb3J0aW5nIHRoZSBhbmFseXRpY3MuXG4gIGpzaWlBZ2VudCA9IGpzaWlBZ2VudC5yZXBsYWNlKC9bXmEtejAtOS4tLz1fXS9naSwgJy0nKTtcblxuICByZXR1cm4ganNpaUFnZW50O1xufVxuIl19