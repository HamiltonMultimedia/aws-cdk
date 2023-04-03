"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('Messages', () => {
    let stack;
    let annotations;
    beforeAll(() => {
        stack = new core_1.Stack();
        new core_1.CfnResource(stack, 'Foo', {
            type: 'Foo::Bar',
            properties: {
                Fred: 'Thud',
            },
        });
        new core_1.CfnResource(stack, 'Bar', {
            type: 'Foo::Bar',
            properties: {
                Baz: 'Qux',
            },
        });
        new core_1.CfnResource(stack, 'Fred', {
            type: 'Baz::Qux',
            properties: {
                Foo: 'Bar',
            },
        });
        new core_1.CfnResource(stack, 'Qux', {
            type: 'Fred::Thud',
            properties: {
                Fred: 'Bar',
            },
        });
        core_1.Aspects.of(stack).add(new MyAspect());
        annotations = lib_1.Annotations.fromStack(stack);
    });
    describe('hasError', () => {
        test('match', () => {
            annotations.hasError('/Default/Foo', 'this is an error');
        });
        test('no match', () => {
            expect(() => annotations.hasError('/Default/Fred', lib_1.Match.anyValue()))
                .toThrowError(/Stack has 1 messages.*but none match as expected./);
        });
    });
    describe('hasNoError', () => {
        test('match', () => {
            annotations.hasNoError('/Default/Fred', lib_1.Match.anyValue());
        });
        test('no match', () => {
            expect(() => annotations.hasNoError('/Default/Foo', 'this is an error'))
                .toThrowError(/Expected no matches, but stack has 1 messages as follows:/);
        });
    });
    describe('findError', () => {
        test('match', () => {
            const result = annotations.findError('*', lib_1.Match.anyValue());
            expect(result.length).toEqual(2);
        });
        test('no match', () => {
            const result = annotations.findError('*', 'no message looks like this');
            expect(result.length).toEqual(0);
        });
    });
    describe('hasWarning', () => {
        test('match', () => {
            annotations.hasWarning('/Default/Fred', 'this is a warning');
        });
        test('no match', () => {
            expect(() => annotations.hasWarning('/Default/Foo', lib_1.Match.anyValue())).toThrowError(/Stack has 1 messages.*but none match as expected./);
        });
    });
    describe('hasNoWarning', () => {
        test('match', () => {
            annotations.hasNoWarning('/Default/Foo', lib_1.Match.anyValue());
        });
        test('no match', () => {
            expect(() => annotations.hasNoWarning('/Default/Fred', 'this is a warning'))
                .toThrowError(/Expected no matches, but stack has 1 messages as follows:/);
        });
    });
    describe('findWarning', () => {
        test('match', () => {
            const result = annotations.findWarning('*', lib_1.Match.anyValue());
            expect(result.length).toEqual(1);
        });
        test('no match', () => {
            const result = annotations.findWarning('*', 'no message looks like this');
            expect(result.length).toEqual(0);
        });
    });
    describe('hasInfo', () => {
        test('match', () => {
            annotations.hasInfo('/Default/Qux', 'this is an info');
        });
        test('no match', () => {
            expect(() => annotations.hasInfo('/Default/Qux', 'this info is incorrect')).toThrowError(/Stack has 1 messages.*but none match as expected./);
        });
    });
    describe('hasNoInfo', () => {
        test('match', () => {
            annotations.hasNoInfo('/Default/Qux', 'this info is incorrect');
        });
        test('no match', () => {
            expect(() => annotations.hasNoInfo('/Default/Qux', 'this is an info'))
                .toThrowError(/Expected no matches, but stack has 1 messages as follows:/);
        });
    });
    describe('findInfo', () => {
        test('match', () => {
            const result = annotations.findInfo('/Default/Qux', 'this is an info');
            expect(result.length).toEqual(1);
        });
        test('no match', () => {
            const result = annotations.findInfo('*', 'no message looks like this');
            expect(result.length).toEqual(0);
        });
    });
    describe('with matchers', () => {
        test('anyValue', () => {
            const result = annotations.findError('*', lib_1.Match.anyValue());
            expect(result.length).toEqual(2);
        });
        test('not', () => {
            expect(() => annotations.hasError('/Default/Foo', lib_1.Match.not('this is an error')))
                .toThrowError(/Found unexpected match: "this is an error"/);
        });
        test('stringLikeRegEx', () => {
            annotations.hasError('/Default/Foo', lib_1.Match.stringLikeRegexp('.*error'));
        });
    });
});
describe('Multiple Messages on the Resource', () => {
    let stack;
    let annotations;
    beforeAll(() => {
        stack = new core_1.Stack();
        new core_1.CfnResource(stack, 'Foo', {
            type: 'Foo::Bar',
            properties: {
                Fred: 'Thud',
            },
        });
        const bar = new core_1.CfnResource(stack, 'Bar', {
            type: 'Foo::Bar',
            properties: {
                Baz: 'Qux',
            },
        });
        bar.node.setContext('disable-stack-trace', false);
        core_1.Aspects.of(stack).add(new MultipleAspectsPerNode());
        annotations = lib_1.Annotations.fromStack(stack);
    });
    test('succeeds on hasXxx APIs', () => {
        annotations.hasError('/Default/Foo', 'error: this is an error');
        annotations.hasError('/Default/Foo', 'error: unsupported type Foo::Bar');
        annotations.hasWarning('/Default/Foo', 'warning: Foo::Bar is deprecated');
    });
    test('succeeds on findXxx APIs', () => {
        const result1 = annotations.findError('*', lib_1.Match.stringLikeRegexp('error:.*'));
        expect(result1.length).toEqual(4);
        const result2 = annotations.findError('/Default/Bar', lib_1.Match.stringLikeRegexp('error:.*'));
        expect(result2.length).toEqual(2);
        const result3 = annotations.findWarning('/Default/Bar', 'warning: Foo::Bar is deprecated');
        expect(result3[0].entry.data).toEqual('warning: Foo::Bar is deprecated');
    });
});
class MyAspect {
    visit(node) {
        if (node instanceof core_1.CfnResource) {
            if (node.cfnResourceType === 'Foo::Bar') {
                this.error(node, 'this is an error');
            }
            else if (node.cfnResourceType === 'Baz::Qux') {
                this.warn(node, 'this is a warning');
            }
            else {
                this.info(node, 'this is an info');
            }
        }
    }
    ;
    warn(node, message) {
        core_1.Annotations.of(node).addWarning(message);
    }
    error(node, message) {
        core_1.Annotations.of(node).addError(message);
    }
    info(node, message) {
        core_1.Annotations.of(node).addInfo(message);
    }
}
class MultipleAspectsPerNode {
    visit(node) {
        if (node instanceof core_1.CfnResource) {
            this.error(node, 'error: this is an error');
            this.error(node, `error: unsupported type ${node.cfnResourceType}`);
            this.warn(node, `warning: ${node.cfnResourceType} is deprecated`);
        }
    }
    warn(node, message) {
        core_1.Annotations.of(node).addWarning(message);
    }
    error(node, message) {
        core_1.Annotations.of(node).addError(message);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ub3RhdGlvbnMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFubm90YXRpb25zLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBa0Y7QUFFbEYsZ0NBQTREO0FBRTVELFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLElBQUksS0FBWSxDQUFDO0lBQ2pCLElBQUksV0FBeUIsQ0FBQztJQUM5QixTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ2IsS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDcEIsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDNUIsSUFBSSxFQUFFLFVBQVU7WUFDaEIsVUFBVSxFQUFFO2dCQUNWLElBQUksRUFBRSxNQUFNO2FBQ2I7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLGtCQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUM1QixJQUFJLEVBQUUsVUFBVTtZQUNoQixVQUFVLEVBQUU7Z0JBQ1YsR0FBRyxFQUFFLEtBQUs7YUFDWDtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQzdCLElBQUksRUFBRSxVQUFVO1lBQ2hCLFVBQVUsRUFBRTtnQkFDVixHQUFHLEVBQUUsS0FBSzthQUNYO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDNUIsSUFBSSxFQUFFLFlBQVk7WUFDbEIsVUFBVSxFQUFFO2dCQUNWLElBQUksRUFBRSxLQUFLO2FBQ1o7U0FDRixDQUFDLENBQUM7UUFFSCxjQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDdEMsV0FBVyxHQUFHLGlCQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FB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LGdCQUFnQixDQUFDLENBQUM7U0FDbkU7S0FDRjtJQUVTLElBQUksQ0FBQyxJQUFnQixFQUFFLE9BQWU7UUFDOUMsa0JBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzFDO0lBRVMsS0FBSyxDQUFDLElBQWdCLEVBQUUsT0FBZTtRQUMvQyxrQkFBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDeEM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFubm90YXRpb25zLCBBc3BlY3RzLCBDZm5SZXNvdXJjZSwgSUFzcGVjdCwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFubm90YXRpb25zIGFzIF9Bbm5vdGF0aW9ucywgTWF0Y2ggfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnTWVzc2FnZXMnLCAoKSA9PiB7XG4gIGxldCBzdGFjazogU3RhY2s7XG4gIGxldCBhbm5vdGF0aW9uczogX0Fubm90YXRpb25zO1xuICBiZWZvcmVBbGwoKCkgPT4ge1xuICAgIHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vJywge1xuICAgICAgdHlwZTogJ0Zvbzo6QmFyJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgRnJlZDogJ1RodWQnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ0JhcicsIHtcbiAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIEJhejogJ1F1eCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRnJlZCcsIHtcbiAgICAgIHR5cGU6ICdCYXo6OlF1eCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIEZvbzogJ0JhcicsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnUXV4Jywge1xuICAgICAgdHlwZTogJ0ZyZWQ6OlRodWQnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBGcmVkOiAnQmFyJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBBc3BlY3RzLm9mKHN0YWNrKS5hZGQobmV3IE15QXNwZWN0KCkpO1xuICAgIGFubm90YXRpb25zID0gX0Fubm90YXRpb25zLmZyb21TdGFjayhzdGFjayk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdoYXNFcnJvcicsICgpID0+IHtcbiAgICB0ZXN0KCdtYXRjaCcsICgpID0+IHtcbiAgICAgIGFubm90YXRpb25zLmhhc0Vycm9yKCcvRGVmYXVsdC9Gb28nLCAndGhpcyBpcyBhbiBlcnJvcicpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbm8gbWF0Y2gnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4gYW5ub3RhdGlvbnMuaGFzRXJyb3IoJy9EZWZhdWx0L0ZyZWQnLCBNYXRjaC5hbnlWYWx1ZSgpKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvU3RhY2sgaGFzIDEgbWVzc2FnZXMuKmJ1dCBub25lIG1hdGNoIGFzIGV4cGVjdGVkLi8pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaGFzTm9FcnJvcicsICgpID0+IHtcbiAgICB0ZXN0KCdtYXRjaCcsICgpID0+IHtcbiAgICAgIGFubm90YXRpb25zLmhhc05vRXJyb3IoJy9EZWZhdWx0L0ZyZWQnLCBNYXRjaC5hbnlWYWx1ZSgpKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ25vIG1hdGNoJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IGFubm90YXRpb25zLmhhc05vRXJyb3IoJy9EZWZhdWx0L0ZvbycsICd0aGlzIGlzIGFuIGVycm9yJykpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0V4cGVjdGVkIG5vIG1hdGNoZXMsIGJ1dCBzdGFjayBoYXMgMSBtZXNzYWdlcyBhcyBmb2xsb3dzOi8pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZmluZEVycm9yJywgKCkgPT4ge1xuICAgIHRlc3QoJ21hdGNoJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYW5ub3RhdGlvbnMuZmluZEVycm9yKCcqJywgTWF0Y2guYW55VmFsdWUoKSk7XG4gICAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ25vIG1hdGNoJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYW5ub3RhdGlvbnMuZmluZEVycm9yKCcqJywgJ25vIG1lc3NhZ2UgbG9va3MgbGlrZSB0aGlzJyk7XG4gICAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hhc1dhcm5pbmcnLCAoKSA9PiB7XG4gICAgdGVzdCgnbWF0Y2gnLCAoKSA9PiB7XG4gICAgICBhbm5vdGF0aW9ucy5oYXNXYXJuaW5nKCcvRGVmYXVsdC9GcmVkJywgJ3RoaXMgaXMgYSB3YXJuaW5nJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdubyBtYXRjaCcsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiBhbm5vdGF0aW9ucy5oYXNXYXJuaW5nKCcvRGVmYXVsdC9Gb28nLCBNYXRjaC5hbnlWYWx1ZSgpKSkudG9UaHJvd0Vycm9yKC9TdGFjayBoYXMgMSBtZXNzYWdlcy4qYnV0IG5vbmUgbWF0Y2ggYXMgZXhwZWN0ZWQuLyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdoYXNOb1dhcm5pbmcnLCAoKSA9PiB7XG4gICAgdGVzdCgnbWF0Y2gnLCAoKSA9PiB7XG4gICAgICBhbm5vdGF0aW9ucy5oYXNOb1dhcm5pbmcoJy9EZWZhdWx0L0ZvbycsIE1hdGNoLmFueVZhbHVlKCkpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbm8gbWF0Y2gnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4gYW5ub3RhdGlvbnMuaGFzTm9XYXJuaW5nKCcvRGVmYXVsdC9GcmVkJywgJ3RoaXMgaXMgYSB3YXJuaW5nJykpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0V4cGVjdGVkIG5vIG1hdGNoZXMsIGJ1dCBzdGFjayBoYXMgMSBtZXNzYWdlcyBhcyBmb2xsb3dzOi8pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZmluZFdhcm5pbmcnLCAoKSA9PiB7XG4gICAgdGVzdCgnbWF0Y2gnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhbm5vdGF0aW9ucy5maW5kV2FybmluZygnKicsIE1hdGNoLmFueVZhbHVlKCkpO1xuICAgICAgZXhwZWN0KHJlc3VsdC5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdubyBtYXRjaCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGFubm90YXRpb25zLmZpbmRXYXJuaW5nKCcqJywgJ25vIG1lc3NhZ2UgbG9va3MgbGlrZSB0aGlzJyk7XG4gICAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hhc0luZm8nLCAoKSA9PiB7XG4gICAgdGVzdCgnbWF0Y2gnLCAoKSA9PiB7XG4gICAgICBhbm5vdGF0aW9ucy5oYXNJbmZvKCcvRGVmYXVsdC9RdXgnLCAndGhpcyBpcyBhbiBpbmZvJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdubyBtYXRjaCcsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiBhbm5vdGF0aW9ucy5oYXNJbmZvKCcvRGVmYXVsdC9RdXgnLCAndGhpcyBpbmZvIGlzIGluY29ycmVjdCcpKS50b1Rocm93RXJyb3IoL1N0YWNrIGhhcyAxIG1lc3NhZ2VzLipidXQgbm9uZSBtYXRjaCBhcyBleHBlY3RlZC4vKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hhc05vSW5mbycsICgpID0+IHtcbiAgICB0ZXN0KCdtYXRjaCcsICgpID0+IHtcbiAgICAgIGFubm90YXRpb25zLmhhc05vSW5mbygnL0RlZmF1bHQvUXV4JywgJ3RoaXMgaW5mbyBpcyBpbmNvcnJlY3QnKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ25vIG1hdGNoJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IGFubm90YXRpb25zLmhhc05vSW5mbygnL0RlZmF1bHQvUXV4JywgJ3RoaXMgaXMgYW4gaW5mbycpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9FeHBlY3RlZCBubyBtYXRjaGVzLCBidXQgc3RhY2sgaGFzIDEgbWVzc2FnZXMgYXMgZm9sbG93czovKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2ZpbmRJbmZvJywgKCkgPT4ge1xuICAgIHRlc3QoJ21hdGNoJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYW5ub3RhdGlvbnMuZmluZEluZm8oJy9EZWZhdWx0L1F1eCcsICd0aGlzIGlzIGFuIGluZm8nKTtcbiAgICAgIGV4cGVjdChyZXN1bHQubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbm8gbWF0Y2gnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhbm5vdGF0aW9ucy5maW5kSW5mbygnKicsICdubyBtZXNzYWdlIGxvb2tzIGxpa2UgdGhpcycpO1xuICAgICAgZXhwZWN0KHJlc3VsdC5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIG1hdGNoZXJzJywgKCkgPT4ge1xuICAgIHRlc3QoJ2FueVZhbHVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYW5ub3RhdGlvbnMuZmluZEVycm9yKCcqJywgTWF0Y2guYW55VmFsdWUoKSk7XG4gICAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ25vdCcsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiBhbm5vdGF0aW9ucy5oYXNFcnJvcignL0RlZmF1bHQvRm9vJywgTWF0Y2gubm90KCd0aGlzIGlzIGFuIGVycm9yJykpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9Gb3VuZCB1bmV4cGVjdGVkIG1hdGNoOiBcInRoaXMgaXMgYW4gZXJyb3JcIi8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc3RyaW5nTGlrZVJlZ0V4JywgKCkgPT4ge1xuICAgICAgYW5ub3RhdGlvbnMuaGFzRXJyb3IoJy9EZWZhdWx0L0ZvbycsIE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJy4qZXJyb3InKSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdNdWx0aXBsZSBNZXNzYWdlcyBvbiB0aGUgUmVzb3VyY2UnLCAoKSA9PiB7XG4gIGxldCBzdGFjazogU3RhY2s7XG4gIGxldCBhbm5vdGF0aW9uczogX0Fubm90YXRpb25zO1xuICBiZWZvcmVBbGwoKCkgPT4ge1xuICAgIHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnRm9vJywge1xuICAgICAgdHlwZTogJ0Zvbzo6QmFyJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgRnJlZDogJ1RodWQnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGJhciA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ0JhcicsIHtcbiAgICAgIHR5cGU6ICdGb286OkJhcicsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIEJhejogJ1F1eCcsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGJhci5ub2RlLnNldENvbnRleHQoJ2Rpc2FibGUtc3RhY2stdHJhY2UnLCBmYWxzZSk7XG5cbiAgICBBc3BlY3RzLm9mKHN0YWNrKS5hZGQobmV3IE11bHRpcGxlQXNwZWN0c1Blck5vZGUoKSk7XG4gICAgYW5ub3RhdGlvbnMgPSBfQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKTtcbiAgfSk7XG5cbiAgdGVzdCgnc3VjY2VlZHMgb24gaGFzWHh4IEFQSXMnLCAoKSA9PiB7XG4gICAgYW5ub3RhdGlvbnMuaGFzRXJyb3IoJy9EZWZhdWx0L0ZvbycsICdlcnJvcjogdGhpcyBpcyBhbiBlcnJvcicpO1xuICAgIGFubm90YXRpb25zLmhhc0Vycm9yKCcvRGVmYXVsdC9Gb28nLCAnZXJyb3I6IHVuc3VwcG9ydGVkIHR5cGUgRm9vOjpCYXInKTtcbiAgICBhbm5vdGF0aW9ucy5oYXNXYXJuaW5nKCcvRGVmYXVsdC9Gb28nLCAnd2FybmluZzogRm9vOjpCYXIgaXMgZGVwcmVjYXRlZCcpO1xuICB9KTtcblxuICB0ZXN0KCdzdWNjZWVkcyBvbiBmaW5kWHh4IEFQSXMnLCAoKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0MSA9IGFubm90YXRpb25zLmZpbmRFcnJvcignKicsIE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJ2Vycm9yOi4qJykpO1xuICAgIGV4cGVjdChyZXN1bHQxLmxlbmd0aCkudG9FcXVhbCg0KTtcbiAgICBjb25zdCByZXN1bHQyID0gYW5ub3RhdGlvbnMuZmluZEVycm9yKCcvRGVmYXVsdC9CYXInLCBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCdlcnJvcjouKicpKTtcbiAgICBleHBlY3QocmVzdWx0Mi5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgY29uc3QgcmVzdWx0MyA9IGFubm90YXRpb25zLmZpbmRXYXJuaW5nKCcvRGVmYXVsdC9CYXInLCAnd2FybmluZzogRm9vOjpCYXIgaXMgZGVwcmVjYXRlZCcpO1xuICAgIGV4cGVjdChyZXN1bHQzWzBdLmVudHJ5LmRhdGEpLnRvRXF1YWwoJ3dhcm5pbmc6IEZvbzo6QmFyIGlzIGRlcHJlY2F0ZWQnKTtcbiAgfSk7XG59KTtcbmNsYXNzIE15QXNwZWN0IGltcGxlbWVudHMgSUFzcGVjdCB7XG4gIHB1YmxpYyB2aXNpdChub2RlOiBJQ29uc3RydWN0KTogdm9pZCB7XG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBDZm5SZXNvdXJjZSkge1xuICAgICAgaWYgKG5vZGUuY2ZuUmVzb3VyY2VUeXBlID09PSAnRm9vOjpCYXInKSB7XG4gICAgICAgIHRoaXMuZXJyb3Iobm9kZSwgJ3RoaXMgaXMgYW4gZXJyb3InKTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5jZm5SZXNvdXJjZVR5cGUgPT09ICdCYXo6OlF1eCcpIHtcbiAgICAgICAgdGhpcy53YXJuKG5vZGUsICd0aGlzIGlzIGEgd2FybmluZycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pbmZvKG5vZGUsICd0aGlzIGlzIGFuIGluZm8nKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcHJvdGVjdGVkIHdhcm4obm9kZTogSUNvbnN0cnVjdCwgbWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgQW5ub3RhdGlvbnMub2Yobm9kZSkuYWRkV2FybmluZyhtZXNzYWdlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBlcnJvcihub2RlOiBJQ29uc3RydWN0LCBtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBBbm5vdGF0aW9ucy5vZihub2RlKS5hZGRFcnJvcihtZXNzYWdlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbmZvKG5vZGU6IElDb25zdHJ1Y3QsIG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICAgIEFubm90YXRpb25zLm9mKG5vZGUpLmFkZEluZm8obWVzc2FnZSk7XG4gIH1cbn1cblxuY2xhc3MgTXVsdGlwbGVBc3BlY3RzUGVyTm9kZSBpbXBsZW1lbnRzIElBc3BlY3Qge1xuICBwdWJsaWMgdmlzaXQobm9kZTogSUNvbnN0cnVjdCk6IHZvaWQge1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgQ2ZuUmVzb3VyY2UpIHtcbiAgICAgIHRoaXMuZXJyb3Iobm9kZSwgJ2Vycm9yOiB0aGlzIGlzIGFuIGVycm9yJyk7XG4gICAgICB0aGlzLmVycm9yKG5vZGUsIGBlcnJvcjogdW5zdXBwb3J0ZWQgdHlwZSAke25vZGUuY2ZuUmVzb3VyY2VUeXBlfWApO1xuICAgICAgdGhpcy53YXJuKG5vZGUsIGB3YXJuaW5nOiAke25vZGUuY2ZuUmVzb3VyY2VUeXBlfSBpcyBkZXByZWNhdGVkYCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHdhcm4obm9kZTogSUNvbnN0cnVjdCwgbWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgQW5ub3RhdGlvbnMub2Yobm9kZSkuYWRkV2FybmluZyhtZXNzYWdlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBlcnJvcihub2RlOiBJQ29uc3RydWN0LCBtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBBbm5vdGF0aW9ucy5vZihub2RlKS5hZGRFcnJvcihtZXNzYWdlKTtcbiAgfVxufSJdfQ==