"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateCFN = void 0;
/**
 * Simple function to evaluate CloudFormation intrinsics.
 *
 * Note that this function is not production quality, it exists to support tests.
 */
const cloudformation_lang_1 = require("../lib/private/cloudformation-lang");
function evaluateCFN(object, context = {}) {
    const intrinsicFns = {
        'Fn::Join'(separator, args) {
            if (typeof separator !== 'string') {
                // CFN does not support expressions here!
                throw new Error('\'separator\' argument of { Fn::Join } must be a string literal');
            }
            return evaluate(args).map(evaluate).join(separator);
        },
        'Fn::Split'(separator, args) {
            if (typeof separator !== 'string') {
                // CFN does not support expressions here!
                throw new Error('\'separator\' argument of { Fn::Split } must be a string literal');
            }
            return evaluate(args).split(separator);
        },
        'Fn::Select'(index, args) {
            return evaluate(args).map(evaluate)[index];
        },
        'Ref'(logicalId) {
            if (!(logicalId in context)) {
                throw new Error(`Trying to evaluate Ref of '${logicalId}' but not in context!`);
            }
            return context[logicalId];
        },
        'Fn::GetAtt'(logicalId, attributeName) {
            const key = `${logicalId}.${attributeName}`;
            if (!(key in context)) {
                throw new Error(`Trying to evaluate Fn::GetAtt of '${logicalId}.${attributeName}' but not in context!`);
            }
            return context[key];
        },
        'Fn::Sub'(template, explicitPlaceholders) {
            const placeholders = explicitPlaceholders ? evaluate(explicitPlaceholders) : context;
            if (typeof template !== 'string') {
                throw new Error('The first argument to {Fn::Sub} must be a string literal (cannot be the result of an expression)');
            }
            return template.replace(/\$\{([a-zA-Z0-9.:-]*)\}/g, (_, key) => {
                if (key in placeholders) {
                    return placeholders[key];
                }
                throw new Error(`Unknown placeholder in Fn::Sub: ${key}`);
            });
        },
    };
    return evaluate(object);
    function evaluate(obj) {
        if (Array.isArray(obj)) {
            return obj.map(evaluate);
        }
        if (typeof obj === 'object') {
            const intrinsic = parseIntrinsic(obj);
            if (intrinsic) {
                return evaluateIntrinsic(intrinsic);
            }
            const ret = {};
            for (const key of Object.keys(obj)) {
                ret[key] = evaluate(obj[key]);
            }
            return ret;
        }
        return obj;
    }
    function evaluateIntrinsic(intrinsic) {
        if (!(intrinsic.name in intrinsicFns)) {
            throw new Error(`Intrinsic ${intrinsic.name} not supported here`);
        }
        const argsAsArray = Array.isArray(intrinsic.args) ? intrinsic.args : [intrinsic.args];
        return intrinsicFns[intrinsic.name].apply(intrinsicFns, argsAsArray);
    }
}
exports.evaluateCFN = evaluateCFN;
function parseIntrinsic(x) {
    if (typeof x !== 'object' || x === null) {
        return undefined;
    }
    const keys = Object.keys(x);
    if (keys.length === 1 && (cloudformation_lang_1.isNameOfCloudFormationIntrinsic(keys[0]) || keys[0] === 'Ref')) {
        return {
            name: keys[0],
            args: x[keys[0]],
        };
    }
    return undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZhbHVhdGUtY2ZuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXZhbHVhdGUtY2ZuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7O0dBSUc7QUFDSCw0RUFBcUY7QUFFckYsU0FBZ0IsV0FBVyxDQUFDLE1BQVcsRUFBRSxVQUFtQyxFQUFFO0lBQzVFLE1BQU0sWUFBWSxHQUFRO1FBQ3hCLFVBQVUsQ0FBQyxTQUFpQixFQUFFLElBQWM7WUFDMUMsSUFBSSxPQUFPLFNBQVMsS0FBSyxRQUFRLEVBQUU7Z0JBQ2pDLHlDQUF5QztnQkFDekMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDO2FBQ3BGO1lBQ0QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNyRDtRQUVELFdBQVcsQ0FBQyxTQUFpQixFQUFFLElBQVM7WUFDdEMsSUFBSSxPQUFPLFNBQVMsS0FBSyxRQUFRLEVBQUU7Z0JBQ2pDLHlDQUF5QztnQkFDekMsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO2FBQ3JGO1lBQ0QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsWUFBWSxDQUFDLEtBQWEsRUFBRSxJQUFTO1lBQ25DLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM1QztRQUVELEtBQUssQ0FBQyxTQUFpQjtZQUNyQixJQUFJLENBQUMsQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLEVBQUU7Z0JBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLFNBQVMsdUJBQXVCLENBQUMsQ0FBQzthQUNqRjtZQUNELE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzNC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QUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxxREFBK0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUU7UUFDeEYsT0FBTztZQUNMLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2IsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDakIsQ0FBQztLQUNIO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU2ltcGxlIGZ1bmN0aW9uIHRvIGV2YWx1YXRlIENsb3VkRm9ybWF0aW9uIGludHJpbnNpY3MuXG4gKlxuICogTm90ZSB0aGF0IHRoaXMgZnVuY3Rpb24gaXMgbm90IHByb2R1Y3Rpb24gcXVhbGl0eSwgaXQgZXhpc3RzIHRvIHN1cHBvcnQgdGVzdHMuXG4gKi9cbmltcG9ydCB7IGlzTmFtZU9mQ2xvdWRGb3JtYXRpb25JbnRyaW5zaWMgfSBmcm9tICcuLi9saWIvcHJpdmF0ZS9jbG91ZGZvcm1hdGlvbi1sYW5nJztcblxuZXhwb3J0IGZ1bmN0aW9uIGV2YWx1YXRlQ0ZOKG9iamVjdDogYW55LCBjb250ZXh0OiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHt9KTogYW55IHtcbiAgY29uc3QgaW50cmluc2ljRm5zOiBhbnkgPSB7XG4gICAgJ0ZuOjpKb2luJyhzZXBhcmF0b3I6IHN0cmluZywgYXJnczogc3RyaW5nW10pIHtcbiAgICAgIGlmICh0eXBlb2Ygc2VwYXJhdG9yICE9PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBDRk4gZG9lcyBub3Qgc3VwcG9ydCBleHByZXNzaW9ucyBoZXJlIVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1xcJ3NlcGFyYXRvclxcJyBhcmd1bWVudCBvZiB7IEZuOjpKb2luIH0gbXVzdCBiZSBhIHN0cmluZyBsaXRlcmFsJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZXZhbHVhdGUoYXJncykubWFwKGV2YWx1YXRlKS5qb2luKHNlcGFyYXRvcik7XG4gICAgfSxcblxuICAgICdGbjo6U3BsaXQnKHNlcGFyYXRvcjogc3RyaW5nLCBhcmdzOiBhbnkpIHtcbiAgICAgIGlmICh0eXBlb2Ygc2VwYXJhdG9yICE9PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBDRk4gZG9lcyBub3Qgc3VwcG9ydCBleHByZXNzaW9ucyBoZXJlIVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1xcJ3NlcGFyYXRvclxcJyBhcmd1bWVudCBvZiB7IEZuOjpTcGxpdCB9IG11c3QgYmUgYSBzdHJpbmcgbGl0ZXJhbCcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGV2YWx1YXRlKGFyZ3MpLnNwbGl0KHNlcGFyYXRvcik7XG4gICAgfSxcblxuICAgICdGbjo6U2VsZWN0JyhpbmRleDogbnVtYmVyLCBhcmdzOiBhbnkpIHtcbiAgICAgIHJldHVybiBldmFsdWF0ZShhcmdzKS5tYXAoZXZhbHVhdGUpW2luZGV4XTtcbiAgICB9LFxuXG4gICAgJ1JlZicobG9naWNhbElkOiBzdHJpbmcpIHtcbiAgICAgIGlmICghKGxvZ2ljYWxJZCBpbiBjb250ZXh0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRyeWluZyB0byBldmFsdWF0ZSBSZWYgb2YgJyR7bG9naWNhbElkfScgYnV0IG5vdCBpbiBjb250ZXh0IWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRleHRbbG9naWNhbElkXTtcbiAgICB9LFxuXG4gICAgJ0ZuOjpHZXRBdHQnKGxvZ2ljYWxJZDogc3RyaW5nLCBhdHRyaWJ1dGVOYW1lOiBzdHJpbmcpIHtcbiAgICAgIGNvbnN0IGtleSA9IGAke2xvZ2ljYWxJZH0uJHthdHRyaWJ1dGVOYW1lfWA7XG4gICAgICBpZiAoIShrZXkgaW4gY29udGV4dCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUcnlpbmcgdG8gZXZhbHVhdGUgRm46OkdldEF0dCBvZiAnJHtsb2dpY2FsSWR9LiR7YXR0cmlidXRlTmFtZX0nIGJ1dCBub3QgaW4gY29udGV4dCFgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZXh0W2tleV07XG4gICAgfSxcblxuICAgICdGbjo6U3ViJyh0ZW1wbGF0ZTogc3RyaW5nLCBleHBsaWNpdFBsYWNlaG9sZGVycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pIHtcbiAgICAgIGNvbnN0IHBsYWNlaG9sZGVycyA9IGV4cGxpY2l0UGxhY2Vob2xkZXJzID8gZXZhbHVhdGUoZXhwbGljaXRQbGFjZWhvbGRlcnMpIDogY29udGV4dDtcblxuICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZmlyc3QgYXJndW1lbnQgdG8ge0ZuOjpTdWJ9IG11c3QgYmUgYSBzdHJpbmcgbGl0ZXJhbCAoY2Fubm90IGJlIHRoZSByZXN1bHQgb2YgYW4gZXhwcmVzc2lvbiknKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRlbXBsYXRlLnJlcGxhY2UoL1xcJFxceyhbYS16QS1aMC05LjotXSopXFx9L2csIChfOiBzdHJpbmcsIGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmIChrZXkgaW4gcGxhY2Vob2xkZXJzKSB7IHJldHVybiBwbGFjZWhvbGRlcnNba2V5XTsgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gcGxhY2Vob2xkZXIgaW4gRm46OlN1YjogJHtrZXl9YCk7XG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiBldmFsdWF0ZShvYmplY3QpO1xuXG4gIGZ1bmN0aW9uIGV2YWx1YXRlKG9iajogYW55KTogYW55IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgICByZXR1cm4gb2JqLm1hcChldmFsdWF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zdCBpbnRyaW5zaWMgPSBwYXJzZUludHJpbnNpYyhvYmopO1xuICAgICAgaWYgKGludHJpbnNpYykge1xuICAgICAgICByZXR1cm4gZXZhbHVhdGVJbnRyaW5zaWMoaW50cmluc2ljKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmV0OiB7W2tleTogc3RyaW5nXTogYW55fSA9IHt9O1xuICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMob2JqKSkge1xuICAgICAgICByZXRba2V5XSA9IGV2YWx1YXRlKG9ialtrZXldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIGZ1bmN0aW9uIGV2YWx1YXRlSW50cmluc2ljKGludHJpbnNpYzogSW50cmluc2ljKSB7XG4gICAgaWYgKCEoaW50cmluc2ljLm5hbWUgaW4gaW50cmluc2ljRm5zKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnRyaW5zaWMgJHtpbnRyaW5zaWMubmFtZX0gbm90IHN1cHBvcnRlZCBoZXJlYCk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJnc0FzQXJyYXkgPSBBcnJheS5pc0FycmF5KGludHJpbnNpYy5hcmdzKSA/IGludHJpbnNpYy5hcmdzIDogW2ludHJpbnNpYy5hcmdzXTtcblxuICAgIHJldHVybiBpbnRyaW5zaWNGbnNbaW50cmluc2ljLm5hbWVdLmFwcGx5KGludHJpbnNpY0ZucywgYXJnc0FzQXJyYXkpO1xuICB9XG59XG5cbmludGVyZmFjZSBJbnRyaW5zaWMge1xuICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG4gIHJlYWRvbmx5IGFyZ3M6IGFueTtcbn1cblxuZnVuY3Rpb24gcGFyc2VJbnRyaW5zaWMoeDogYW55KTogSW50cmluc2ljIHwgdW5kZWZpbmVkIHtcbiAgaWYgKHR5cGVvZiB4ICE9PSAnb2JqZWN0JyB8fCB4ID09PSBudWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHgpO1xuICBpZiAoa2V5cy5sZW5ndGggPT09IDEgJiYgKGlzTmFtZU9mQ2xvdWRGb3JtYXRpb25JbnRyaW5zaWMoa2V5c1swXSkgfHwga2V5c1swXSA9PT0gJ1JlZicpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IGtleXNbMF0sXG4gICAgICBhcmdzOiB4W2tleXNbMF1dLFxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn0iXX0=