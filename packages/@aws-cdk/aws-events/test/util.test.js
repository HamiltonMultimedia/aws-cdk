"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../lib/util");
describe('util', () => {
    describe('mergeEventPattern', () => {
        test('happy case', () => {
            expect(util_1.mergeEventPattern({
                bar: [1, 2],
                hey: ['happy'],
                hello: {
                    world: ['hi', 'dude'],
                    case: [1],
                },
            }, {
                hey: ['day', 'today'],
                hello: {
                    world: ['you'],
                },
            })).toEqual({
                bar: [1, 2],
                hey: ['happy', 'day', 'today'],
                hello: {
                    world: ['hi', 'dude', 'you'],
                    case: [1],
                },
            });
        });
        test('merge into an empty destination', () => {
            expect(util_1.mergeEventPattern(undefined, { foo: ['123'] })).toEqual({ foo: ['123'] });
            expect(util_1.mergeEventPattern(undefined, { foo: { bar: ['123'] } })).toEqual({ foo: { bar: ['123'] } });
            expect(util_1.mergeEventPattern({}, { foo: { bar: ['123'] } })).toEqual({ foo: { bar: ['123'] } });
        });
        test('fails if a field is not an array', () => {
            expect(() => util_1.mergeEventPattern(undefined, 123)).toThrow(/Invalid event pattern '123', expecting an object or an array/);
            expect(() => util_1.mergeEventPattern(undefined, 'Hello')).toThrow(/Invalid event pattern '"Hello"', expecting an object or an array/);
            expect(() => util_1.mergeEventPattern(undefined, { foo: '123' })).toThrow(/Invalid event pattern field { foo: "123" }. All fields must be arrays/);
        });
        test('fails if mismatch between dest and src', () => {
            expect(() => util_1.mergeEventPattern({
                obj: {
                    array: [1],
                },
            }, {
                obj: {
                    array: {
                        value: ['hello'],
                    },
                },
            })).toThrow(/Invalid event pattern field array. Type mismatch between existing pattern \[1\] and added pattern \{"value":\["hello"\]\}/);
        });
        test('deduplicate match values in pattern array', () => {
            expect(util_1.mergeEventPattern({
                'detail-type': ['AWS API Call via CloudTrail'],
            }, {
                'detail-type': ['AWS API Call via CloudTrail'],
            })).toEqual({
                'detail-type': ['AWS API Call via CloudTrail'],
            });
            expect(util_1.mergeEventPattern({
                time: [{ prefix: '2017-10-02' }],
            }, {
                time: [{ prefix: '2017-10-02' }, { prefix: '2017-10-03' }],
            })).toEqual({
                time: [{ prefix: '2017-10-02' }, { prefix: '2017-10-03' }],
            });
            expect(util_1.mergeEventPattern({
                'detail-type': ['AWS API Call via CloudTrail'],
                'time': [{ prefix: '2017-10-02' }],
            }, {
                'detail-type': ['AWS API Call via CloudTrail'],
                'time': [{ prefix: '2017-10-02' }, { prefix: '2017-10-03' }],
            })).toEqual({
                'detail-type': ['AWS API Call via CloudTrail'],
                'time': [{ prefix: '2017-10-02' }, { prefix: '2017-10-03' }],
            });
            expect(util_1.mergeEventPattern({
                'detail-type': ['AWS API Call via CloudTrail', 'AWS API Call via CloudTrail'],
                'time': [{ prefix: '2017-10-02' }],
            }, {
                'detail-type': ['AWS API Call via CloudTrail', 'AWS API Call via CloudTrail'],
                'time': [{ prefix: '2017-10-02' }, { prefix: '2017-10-03' }, { prefix: '2017-10-02' }],
            })).toEqual({
                'detail-type': ['AWS API Call via CloudTrail'],
                'time': [{ prefix: '2017-10-02' }, { prefix: '2017-10-03' }],
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXRpbC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWdEO0FBRWhELFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0lBQ3BCLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7UUFDakMsSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7WUFDdEIsTUFBTSxDQUFDLHdCQUFpQixDQUFDO2dCQUN2QixHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNYLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztnQkFDZCxLQUFLLEVBQUU7b0JBQ0wsS0FBSyxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztvQkFDckIsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUNWO2FBQ0YsRUFBRTtnQkFDRCxHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDO2dCQUNyQixLQUFLLEVBQUU7b0JBQ0wsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDO2lCQUNmO2FBQ0YsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNWLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ1gsR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUM7Z0JBQzlCLEtBQUssRUFBRTtvQkFDTCxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQztvQkFDNUIsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUNWO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFO1lBQzNDLE1BQU0sQ0FBQyx3QkFBaUIsQ0FBQyxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxD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O2dCQUM5QyxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsQ0FBQzthQUM3RCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ1YsYUFBYSxFQUFFLENBQUMsNkJBQTZCLENBQUM7Z0JBQzlDLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxDQUFDO2FBQzdELENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyx3QkFBaUIsQ0FBQztnQkFDdkIsYUFBYSxFQUFFLENBQUMsNkJBQTZCLEVBQUUsNkJBQTZCLENBQUM7Z0JBQzdFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxDQUFDO2FBQ25DLEVBQUU7Z0JBQ0QsYUFBYSxFQUFFLENBQUMsNkJBQTZCLEVBQUUsNkJBQTZCLENBQUM7Z0JBQzdFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxDQUFDO2FBQ3ZGLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDVixhQUFhLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQztnQkFDOUMsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLENBQUM7YUFDN0QsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbWVyZ2VFdmVudFBhdHRlcm4gfSBmcm9tICcuLi9saWIvdXRpbCc7XG5cbmRlc2NyaWJlKCd1dGlsJywgKCkgPT4ge1xuICBkZXNjcmliZSgnbWVyZ2VFdmVudFBhdHRlcm4nLCAoKSA9PiB7XG4gICAgdGVzdCgnaGFwcHkgY2FzZScsICgpID0+IHtcbiAgICAgIGV4cGVjdChtZXJnZUV2ZW50UGF0dGVybih7XG4gICAgICAgIGJhcjogWzEsIDJdLFxuICAgICAgICBoZXk6IFsnaGFwcHknXSxcbiAgICAgICAgaGVsbG86IHtcbiAgICAgICAgICB3b3JsZDogWydoaScsICdkdWRlJ10sXG4gICAgICAgICAgY2FzZTogWzFdLFxuICAgICAgICB9LFxuICAgICAgfSwge1xuICAgICAgICBoZXk6IFsnZGF5JywgJ3RvZGF5J10sXG4gICAgICAgIGhlbGxvOiB7XG4gICAgICAgICAgd29ybGQ6IFsneW91J10sXG4gICAgICAgIH0sXG4gICAgICB9KSkudG9FcXVhbCh7XG4gICAgICAgIGJhcjogWzEsIDJdLFxuICAgICAgICBoZXk6IFsnaGFwcHknLCAnZGF5JywgJ3RvZGF5J10sXG4gICAgICAgIGhlbGxvOiB7XG4gICAgICAgICAgd29ybGQ6IFsnaGknLCAnZHVkZScsICd5b3UnXSxcbiAgICAgICAgICBjYXNlOiBbMV0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ21lcmdlIGludG8gYW4gZW1wdHkgZGVzdGluYXRpb24nLCAoKSA9PiB7XG4gICAgICBleHBlY3QobWVyZ2VFdmVudFBhdHRlcm4odW5kZWZpbmVkLCB7IGZvbzogWycxMjMnXSB9KSkudG9FcXVhbCh7IGZvbzogWycxMjMnXSB9KTtcbiAgICAgIGV4cGVjdChtZXJnZUV2ZW50UGF0dGVybih1bmRlZmluZWQsIHsgZm9vOiB7IGJhcjogWycxMjMnXSB9IH0pKS50b0VxdWFsKHsgZm9vOiB7IGJhcjogWycxMjMnXSB9IH0pO1xuICAgICAgZXhwZWN0KG1lcmdlRXZlbnRQYXR0ZXJuKHsgfSwgeyBmb286IHsgYmFyOiBbJzEyMyddIH0gfSkpLnRvRXF1YWwoeyBmb286IHsgYmFyOiBbJzEyMyddIH0gfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmYWlscyBpZiBhIGZpZWxkIGlzIG5vdCBhbiBhcnJheScsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiBtZXJnZUV2ZW50UGF0dGVybih1bmRlZmluZWQsIDEyMykpLnRvVGhyb3coL0ludmFsaWQgZXZlbnQgcGF0dGVybiAnMTIzJywgZXhwZWN0aW5nIGFuIG9iamVjdCBvciBhbiBhcnJheS8pO1xuICAgICAgZXhwZWN0KCgpID0+IG1lcmdlRXZlbnRQYXR0ZXJuKHVuZGVmaW5lZCwgJ0hlbGxvJykpLnRvVGhyb3coL0ludmFsaWQgZXZlbnQgcGF0dGVybiAnXCJIZWxsb1wiJywgZXhwZWN0aW5nIGFuIG9iamVjdCBvciBhbiBhcnJheS8pO1xuICAgICAgZXhwZWN0KCgpID0+IG1lcmdlRXZlbnRQYXR0ZXJuKHVuZGVmaW5lZCwgeyBmb286ICcxMjMnIH0pKS50b1Rocm93KC9JbnZhbGlkIGV2ZW50IHBhdHRlcm4gZmllbGQgeyBmb286IFwiMTIzXCIgfS4gQWxsIGZpZWxkcyBtdXN0IGJlIGFycmF5cy8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZmFpbHMgaWYgbWlzbWF0Y2ggYmV0d2VlbiBkZXN0IGFuZCBzcmMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4gbWVyZ2VFdmVudFBhdHRlcm4oe1xuICAgICAgICBvYmo6IHtcbiAgICAgICAgICBhcnJheTogWzFdLFxuICAgICAgICB9LFxuICAgICAgfSwge1xuICAgICAgICBvYmo6IHtcbiAgICAgICAgICBhcnJheToge1xuICAgICAgICAgICAgdmFsdWU6IFsnaGVsbG8nXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSkpLnRvVGhyb3coL0ludmFsaWQgZXZlbnQgcGF0dGVybiBmaWVsZCBhcnJheS4gVHlwZSBtaXNtYXRjaCBiZXR3ZWVuIGV4aXN0aW5nIHBhdHRlcm4gXFxbMVxcXSBhbmQgYWRkZWQgcGF0dGVybiBcXHtcInZhbHVlXCI6XFxbXCJoZWxsb1wiXFxdXFx9Lyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkZWR1cGxpY2F0ZSBtYXRjaCB2YWx1ZXMgaW4gcGF0dGVybiBhcnJheScsICgpID0+IHtcbiAgICAgIGV4cGVjdChtZXJnZUV2ZW50UGF0dGVybih7XG4gICAgICAgICdkZXRhaWwtdHlwZSc6IFsnQVdTIEFQSSBDYWxsIHZpYSBDbG91ZFRyYWlsJ10sXG4gICAgICB9LCB7XG4gICAgICAgICdkZXRhaWwtdHlwZSc6IFsnQVdTIEFQSSBDYWxsIHZpYSBDbG91ZFRyYWlsJ10sXG4gICAgICB9KSkudG9FcXVhbCh7XG4gICAgICAgICdkZXRhaWwtdHlwZSc6IFsnQVdTIEFQSSBDYWxsIHZpYSBDbG91ZFRyYWlsJ10sXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdChtZXJnZUV2ZW50UGF0dGVybih7XG4gICAgICAgIHRpbWU6IFt7IHByZWZpeDogJzIwMTctMTAtMDInIH1dLFxuICAgICAgfSwge1xuICAgICAgICB0aW1lOiBbeyBwcmVmaXg6ICcyMDE3LTEwLTAyJyB9LCB7IHByZWZpeDogJzIwMTctMTAtMDMnIH1dLFxuICAgICAgfSkpLnRvRXF1YWwoe1xuICAgICAgICB0aW1lOiBbeyBwcmVmaXg6ICcyMDE3LTEwLTAyJyB9LCB7IHByZWZpeDogJzIwMTctMTAtMDMnIH1dLFxuICAgICAgfSk7XG4gICAgICBleHBlY3QobWVyZ2VFdmVudFBhdHRlcm4oe1xuICAgICAgICAnZGV0YWlsLXR5cGUnOiBbJ0FXUyBBUEkgQ2FsbCB2aWEgQ2xvdWRUcmFpbCddLFxuICAgICAgICAndGltZSc6IFt7IHByZWZpeDogJzIwMTctMTAtMDInIH1dLFxuICAgICAgfSwge1xuICAgICAgICAnZGV0YWlsLXR5cGUnOiBbJ0FXUyBBUEkgQ2FsbCB2aWEgQ2xvdWRUcmFpbCddLFxuICAgICAgICAndGltZSc6IFt7IHByZWZpeDogJzIwMTctMTAtMDInIH0sIHsgcHJlZml4OiAnMjAxNy0xMC0wMycgfV0sXG4gICAgICB9KSkudG9FcXVhbCh7XG4gICAgICAgICdkZXRhaWwtdHlwZSc6IFsnQVdTIEFQSSBDYWxsIHZpYSBDbG91ZFRyYWlsJ10sXG4gICAgICAgICd0aW1lJzogW3sgcHJlZml4OiAnMjAxNy0xMC0wMicgfSwgeyBwcmVmaXg6ICcyMDE3LTEwLTAzJyB9XSxcbiAgICAgIH0pO1xuICAgICAgZXhwZWN0KG1lcmdlRXZlbnRQYXR0ZXJuKHtcbiAgICAgICAgJ2RldGFpbC10eXBlJzogWydBV1MgQVBJIENhbGwgdmlhIENsb3VkVHJhaWwnLCAnQVdTIEFQSSBDYWxsIHZpYSBDbG91ZFRyYWlsJ10sXG4gICAgICAgICd0aW1lJzogW3sgcHJlZml4OiAnMjAxNy0xMC0wMicgfV0sXG4gICAgICB9LCB7XG4gICAgICAgICdkZXRhaWwtdHlwZSc6IFsnQVdTIEFQSSBDYWxsIHZpYSBDbG91ZFRyYWlsJywgJ0FXUyBBUEkgQ2FsbCB2aWEgQ2xvdWRUcmFpbCddLFxuICAgICAgICAndGltZSc6IFt7IHByZWZpeDogJzIwMTctMTAtMDInIH0sIHsgcHJlZml4OiAnMjAxNy0xMC0wMycgfSwgeyBwcmVmaXg6ICcyMDE3LTEwLTAyJyB9XSxcbiAgICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICAgJ2RldGFpbC10eXBlJzogWydBV1MgQVBJIENhbGwgdmlhIENsb3VkVHJhaWwnXSxcbiAgICAgICAgJ3RpbWUnOiBbeyBwcmVmaXg6ICcyMDE3LTEwLTAyJyB9LCB7IHByZWZpeDogJzIwMTctMTAtMDMnIH1dLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=