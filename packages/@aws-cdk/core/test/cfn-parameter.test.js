"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
describe('cfn parameter', () => {
    test('valueAsString supports both string and number types', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        const numberParam = new lib_1.CfnParameter(stack, 'numberParam', { type: 'Number', default: 10 });
        const stringParam = new lib_1.CfnParameter(stack, 'stringParam', { type: 'String', default: 'a-default' });
        // WHEN
        const numVal = numberParam.valueAsString;
        const strVal = stringParam.valueAsString;
        // THEN
        expect(stack.resolve(numVal)).toEqual({ Ref: 'numberParam' });
        expect(stack.resolve(strVal)).toEqual({ Ref: 'stringParam' });
    });
    test('valueAsString fails for unsupported types', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        const listParam = new lib_1.CfnParameter(stack, 'listParam', { type: 'List', default: 10 });
        // WHEN - THEN
        expect(() => listParam.valueAsList).toThrow(/Parameter type \(List\)/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLXBhcmFtZXRlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLXBhcmFtZXRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0NBQTZDO0FBRTdDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO0lBQzdCLElBQUksQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7UUFDL0QsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxXQUFXLEdBQUcsSUFBSSxrQkFBWSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzVGLE1BQU0sV0FBVyxHQUFHLElBQUksa0JBQVksQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUVyRyxPQUFPO1FBQ1AsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQztRQUN6QyxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDO1FBRXpDLE9BQU87UUFDUCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDO1FBQzlELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDaEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxFQUFFO1FBQ3JELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sU0FBUyxHQUFHLElBQUksa0JBQVksQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUV0RixjQUFjO1FBQ2QsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUN6RSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2ZuUGFyYW1ldGVyLCBTdGFjayB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdjZm4gcGFyYW1ldGVyJywgKCkgPT4ge1xuICB0ZXN0KCd2YWx1ZUFzU3RyaW5nIHN1cHBvcnRzIGJvdGggc3RyaW5nIGFuZCBudW1iZXIgdHlwZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IG51bWJlclBhcmFtID0gbmV3IENmblBhcmFtZXRlcihzdGFjaywgJ251bWJlclBhcmFtJywgeyB0eXBlOiAnTnVtYmVyJywgZGVmYXVsdDogMTAgfSk7XG4gICAgY29uc3Qgc3RyaW5nUGFyYW0gPSBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnc3RyaW5nUGFyYW0nLCB7IHR5cGU6ICdTdHJpbmcnLCBkZWZhdWx0OiAnYS1kZWZhdWx0JyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBudW1WYWwgPSBudW1iZXJQYXJhbS52YWx1ZUFzU3RyaW5nO1xuICAgIGNvbnN0IHN0clZhbCA9IHN0cmluZ1BhcmFtLnZhbHVlQXNTdHJpbmc7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUobnVtVmFsKSkudG9FcXVhbCh7IFJlZjogJ251bWJlclBhcmFtJyB9KTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzdHJWYWwpKS50b0VxdWFsKHsgUmVmOiAnc3RyaW5nUGFyYW0nIH0pO1xuICB9KTtcblxuICB0ZXN0KCd2YWx1ZUFzU3RyaW5nIGZhaWxzIGZvciB1bnN1cHBvcnRlZCB0eXBlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgbGlzdFBhcmFtID0gbmV3IENmblBhcmFtZXRlcihzdGFjaywgJ2xpc3RQYXJhbScsIHsgdHlwZTogJ0xpc3QnLCBkZWZhdWx0OiAxMCB9KTtcblxuICAgIC8vIFdIRU4gLSBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGxpc3RQYXJhbS52YWx1ZUFzTGlzdCkudG9UaHJvdygvUGFyYW1ldGVyIHR5cGUgXFwoTGlzdFxcKS8pO1xuICB9KTtcbn0pO1xuIl19