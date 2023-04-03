"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
// CloudFormation supports InlineCode only for a subset of runtimes. This integration test
// is used to verify that the ones marked in the CDK are in fact supported by CloudFormation.
// Running `cdk deploy` on this stack will confirm if all the runtimes here are supported.
//
// To verify that the lambda function works correctly, use the function names that are part
// of the stack output (printed on the console at the end of 'cdk deploy') and run the command -
// aws lambda invoke --function-name <function-name>
//
// If successful, the output will contain "success"
const app = new core_1.App();
const stack = new core_1.Stack(app, 'aws-cdk-lambda-runtime-inlinecode');
const python37 = new lib_1.Function(stack, 'PYTHON_3_7', {
    code: new lib_1.InlineCode('def handler(event, context):\n  return "success"'),
    handler: 'index.handler',
    runtime: lib_1.Runtime.PYTHON_3_7,
});
new core_1.CfnOutput(stack, 'PYTHON_3_7-functionName', { value: python37.functionName });
const python38 = new lib_1.Function(stack, 'PYTHON_3_8', {
    code: new lib_1.InlineCode('def handler(event, context):\n  return "success"'),
    handler: 'index.handler',
    runtime: lib_1.Runtime.PYTHON_3_8,
});
new core_1.CfnOutput(stack, 'PYTHON_3_8-functionName', { value: python38.functionName });
const python39 = new lib_1.Function(stack, 'PYTHON_3_9', {
    code: new lib_1.InlineCode('def handler(event, context):\n  return "success"'),
    handler: 'index.handler',
    runtime: lib_1.Runtime.PYTHON_3_9,
});
new core_1.CfnOutput(stack, 'PYTHON_3_9-functionName', { value: python39.functionName });
const node14xfn = new lib_1.Function(stack, 'NODEJS_14_X', {
    code: new lib_1.InlineCode('exports.handler = async function(event) { return "success" }'),
    handler: 'index.handler',
    runtime: lib_1.Runtime.NODEJS_14_X,
});
new core_1.CfnOutput(stack, 'NODEJS_14_X-functionName', { value: node14xfn.functionName });
const node16xfn = new lib_1.Function(stack, 'NODEJS_16_X', {
    code: new lib_1.InlineCode('exports.handler = async function(event) { return "success" }'),
    handler: 'index.handler',
    runtime: lib_1.Runtime.NODEJS_16_X,
});
new core_1.CfnOutput(stack, 'NODEJS_16_X-functionName', { value: node16xfn.functionName });
const node18xfn = new lib_1.Function(stack, 'NODEJS_18_X', {
    code: new lib_1.InlineCode('exports.handler = async function(event) { return "success" }'),
    handler: 'index.handler',
    runtime: lib_1.Runtime.NODEJS_18_X,
});
new core_1.CfnOutput(stack, 'NODEJS_18_X-functionName', { value: node18xfn.functionName });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucnVudGltZS5pbmxpbmVjb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucnVudGltZS5pbmxpbmVjb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXNEO0FBQ3RELGdDQUF1RDtBQUV2RCwwRkFBMEY7QUFDMUYsNkZBQTZGO0FBQzdGLDBGQUEwRjtBQUMxRixFQUFFO0FBQ0YsMkZBQTJGO0FBQzNGLGdHQUFnRztBQUNoRyxvREFBb0Q7QUFDcEQsRUFBRTtBQUNGLG1EQUFtRDtBQUVuRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0FBRXRCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO0FBRWxFLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7SUFDakQsSUFBSSxFQUFFLElBQUksZ0JBQVUsQ0FBQyxrREFBa0QsQ0FBQztJQUN4RSxPQUFPLEVBQUUsZUFBZTtJQUN4QixPQUFPLEVBQUUsYUFBTyxDQUFDLFVBQVU7Q0FDNUIsQ0FBQyxDQUFDO0FBQ0gsSUFBSSxnQkFBUyxDQUFDLEtBQUssRUFBRSx5QkFBeUIsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztBQUVsRixNQUFNLFFBQVEsR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO0lBQ2pELElBQUksRUFBRSxJQUFJLGdCQUFVLENBQUMsa0RBQWtELENBQUM7SUFDeEUsT0FBTyxFQUFFLGVBQWU7SUFDeEIsT0FBTyxFQUFFLGFBQU8sQ0FBQyxVQUFVO0NBQzVCLENBQUMsQ0FBQztBQUNILElBQUksZ0JBQVMsQ0FBQyxLQUFLLEVBQUUseUJBQXlCLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7QUFFbEYsTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtJQUNqRCxJQUFJLEVBQUUsSUFBSSxnQkFBVSxDQUFDLGtEQUFrRCxDQUFDO0lBQ3hFLE9BQU8sRUFBRSxlQUFlO0lBQ3hCLE9BQU8sRUFBRSxhQUFPLENBQUMsVUFBVTtDQUM1QixDQUFDLENBQUM7QUFDSCxJQUFJLGdCQUFTLENBQUMsS0FBSyxFQUFFLHlCQUF5QixFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBRWxGLE1BQU0sU0FBUyxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7SUFDbkQsSUFBSSxFQUFFLElBQUksZ0JBQVUsQ0FBQyw4REFBOEQsQ0FBQztJQUNwRixPQUFPLEVBQUUsZUFBZTtJQUN4QixPQUFPLEVBQUUsYUFBTyxDQUFDLFdBQVc7Q0FDN0IsQ0FBQyxDQUFDO0FBQ0gsSUFBSSxnQkFBUyxDQUFDLEtBQUssRUFBRSwwQkFBMEIsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztBQUVwRixNQUFNLFNBQVMsR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO0lBQ25ELElBQUksRUFBRSxJQUFJLGdCQUFVLENBQUMsOERBQThELENBQUM7SUFDcEYsT0FBTyxFQUFFLGVBQWU7SUFDeEIsT0FBTyxFQUFFLGFBQU8sQ0FBQyxXQUFXO0NBQzdCLENBQUMsQ0FBQztBQUNILElBQUksZ0JBQVMsQ0FBQyxLQUFLLEVBQUUsMEJBQTBCLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7QUFFcEYsTUFBTSxTQUFTLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtJQUNuRCxJQUFJLEVBQUUsSUFBSSxnQkFBVSxDQUFDLDhEQUE4RCxDQUFDO0lBQ3BGLE9BQU8sRUFBRSxlQUFlO0lBQ3hCLE9BQU8sRUFBRSxhQUFPLENBQUMsV0FBVztDQUM3QixDQUFDLENBQUM7QUFDSCxJQUFJLGdCQUFTLENBQUMsS0FBSyxFQUFFLDBCQUEwQixFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBRXBGLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgRnVuY3Rpb24sIElubGluZUNvZGUsIFJ1bnRpbWUgfSBmcm9tICcuLi9saWInO1xuXG4vLyBDbG91ZEZvcm1hdGlvbiBzdXBwb3J0cyBJbmxpbmVDb2RlIG9ubHkgZm9yIGEgc3Vic2V0IG9mIHJ1bnRpbWVzLiBUaGlzIGludGVncmF0aW9uIHRlc3Rcbi8vIGlzIHVzZWQgdG8gdmVyaWZ5IHRoYXQgdGhlIG9uZXMgbWFya2VkIGluIHRoZSBDREsgYXJlIGluIGZhY3Qgc3VwcG9ydGVkIGJ5IENsb3VkRm9ybWF0aW9uLlxuLy8gUnVubmluZyBgY2RrIGRlcGxveWAgb24gdGhpcyBzdGFjayB3aWxsIGNvbmZpcm0gaWYgYWxsIHRoZSBydW50aW1lcyBoZXJlIGFyZSBzdXBwb3J0ZWQuXG4vL1xuLy8gVG8gdmVyaWZ5IHRoYXQgdGhlIGxhbWJkYSBmdW5jdGlvbiB3b3JrcyBjb3JyZWN0bHksIHVzZSB0aGUgZnVuY3Rpb24gbmFtZXMgdGhhdCBhcmUgcGFydFxuLy8gb2YgdGhlIHN0YWNrIG91dHB1dCAocHJpbnRlZCBvbiB0aGUgY29uc29sZSBhdCB0aGUgZW5kIG9mICdjZGsgZGVwbG95JykgYW5kIHJ1biB0aGUgY29tbWFuZCAtXG4vLyBhd3MgbGFtYmRhIGludm9rZSAtLWZ1bmN0aW9uLW5hbWUgPGZ1bmN0aW9uLW5hbWU+XG4vL1xuLy8gSWYgc3VjY2Vzc2Z1bCwgdGhlIG91dHB1dCB3aWxsIGNvbnRhaW4gXCJzdWNjZXNzXCJcblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdhd3MtY2RrLWxhbWJkYS1ydW50aW1lLWlubGluZWNvZGUnKTtcblxuY29uc3QgcHl0aG9uMzcgPSBuZXcgRnVuY3Rpb24oc3RhY2ssICdQWVRIT05fM183Jywge1xuICBjb2RlOiBuZXcgSW5saW5lQ29kZSgnZGVmIGhhbmRsZXIoZXZlbnQsIGNvbnRleHQpOlxcbiAgcmV0dXJuIFwic3VjY2Vzc1wiJyksXG4gIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgcnVudGltZTogUnVudGltZS5QWVRIT05fM183LFxufSk7XG5uZXcgQ2ZuT3V0cHV0KHN0YWNrLCAnUFlUSE9OXzNfNy1mdW5jdGlvbk5hbWUnLCB7IHZhbHVlOiBweXRob24zNy5mdW5jdGlvbk5hbWUgfSk7XG5cbmNvbnN0IHB5dGhvbjM4ID0gbmV3IEZ1bmN0aW9uKHN0YWNrLCAnUFlUSE9OXzNfOCcsIHtcbiAgY29kZTogbmV3IElubGluZUNvZGUoJ2RlZiBoYW5kbGVyKGV2ZW50LCBjb250ZXh0KTpcXG4gIHJldHVybiBcInN1Y2Nlc3NcIicpLFxuICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gIHJ1bnRpbWU6IFJ1bnRpbWUuUFlUSE9OXzNfOCxcbn0pO1xubmV3IENmbk91dHB1dChzdGFjaywgJ1BZVEhPTl8zXzgtZnVuY3Rpb25OYW1lJywgeyB2YWx1ZTogcHl0aG9uMzguZnVuY3Rpb25OYW1lIH0pO1xuXG5jb25zdCBweXRob24zOSA9IG5ldyBGdW5jdGlvbihzdGFjaywgJ1BZVEhPTl8zXzknLCB7XG4gIGNvZGU6IG5ldyBJbmxpbmVDb2RlKCdkZWYgaGFuZGxlcihldmVudCwgY29udGV4dCk6XFxuICByZXR1cm4gXCJzdWNjZXNzXCInKSxcbiAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICBydW50aW1lOiBSdW50aW1lLlBZVEhPTl8zXzksXG59KTtcbm5ldyBDZm5PdXRwdXQoc3RhY2ssICdQWVRIT05fM185LWZ1bmN0aW9uTmFtZScsIHsgdmFsdWU6IHB5dGhvbjM5LmZ1bmN0aW9uTmFtZSB9KTtcblxuY29uc3Qgbm9kZTE0eGZuID0gbmV3IEZ1bmN0aW9uKHN0YWNrLCAnTk9ERUpTXzE0X1gnLCB7XG4gIGNvZGU6IG5ldyBJbmxpbmVDb2RlKCdleHBvcnRzLmhhbmRsZXIgPSBhc3luYyBmdW5jdGlvbihldmVudCkgeyByZXR1cm4gXCJzdWNjZXNzXCIgfScpLFxuICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzE0X1gsXG59KTtcbm5ldyBDZm5PdXRwdXQoc3RhY2ssICdOT0RFSlNfMTRfWC1mdW5jdGlvbk5hbWUnLCB7IHZhbHVlOiBub2RlMTR4Zm4uZnVuY3Rpb25OYW1lIH0pO1xuXG5jb25zdCBub2RlMTZ4Zm4gPSBuZXcgRnVuY3Rpb24oc3RhY2ssICdOT0RFSlNfMTZfWCcsIHtcbiAgY29kZTogbmV3IElubGluZUNvZGUoJ2V4cG9ydHMuaGFuZGxlciA9IGFzeW5jIGZ1bmN0aW9uKGV2ZW50KSB7IHJldHVybiBcInN1Y2Nlc3NcIiB9JyksXG4gIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMTZfWCxcbn0pO1xubmV3IENmbk91dHB1dChzdGFjaywgJ05PREVKU18xNl9YLWZ1bmN0aW9uTmFtZScsIHsgdmFsdWU6IG5vZGUxNnhmbi5mdW5jdGlvbk5hbWUgfSk7XG5cbmNvbnN0IG5vZGUxOHhmbiA9IG5ldyBGdW5jdGlvbihzdGFjaywgJ05PREVKU18xOF9YJywge1xuICBjb2RlOiBuZXcgSW5saW5lQ29kZSgnZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgZnVuY3Rpb24oZXZlbnQpIHsgcmV0dXJuIFwic3VjY2Vzc1wiIH0nKSxcbiAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICBydW50aW1lOiBSdW50aW1lLk5PREVKU18xOF9YLFxufSk7XG5uZXcgQ2ZuT3V0cHV0KHN0YWNrLCAnTk9ERUpTXzE4X1gtZnVuY3Rpb25OYW1lJywgeyB2YWx1ZTogbm9kZTE4eGZuLmZ1bmN0aW9uTmFtZSB9KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=