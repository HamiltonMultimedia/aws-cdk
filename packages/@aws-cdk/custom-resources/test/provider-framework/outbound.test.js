"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outbound_1 = require("../../lib/provider-framework/runtime/outbound");
jest.mock('aws-sdk', () => {
    return {
        Lambda: class {
            invoke() {
                return { promise: () => mockInvoke() };
            }
            waitFor() {
                return { promise: () => mockWaitFor() };
            }
        },
    };
});
let mockInvoke;
const req = {
    FunctionName: 'Whatever',
    Payload: {
        IsThisATest: 'Yes, this is a test',
        AreYouSure: 'Yes, I am sure',
    },
};
let invokeCount = 0;
let expectedFunctionStates = [];
let receivedFunctionStates = [];
const mockWaitFor = async () => {
    let state = expectedFunctionStates.pop();
    while (state !== 'Active') {
        receivedFunctionStates.push(state);
        // If it goes back to inactive it's failed
        if (state === 'Inactive')
            throw new Error('Not today');
        // If failed... it's failed
        if (state === 'Failed')
            throw new Error('Broken');
        // If pending, continue the loop, no other valid options
        if (state !== 'Pending')
            throw new Error('State is confused');
        state = expectedFunctionStates.pop();
    }
    receivedFunctionStates.push(state);
    return {
        Configuration: {
            State: 'Active',
        },
    };
};
describe('invokeFunction tests', () => {
    afterEach(() => {
        invokeCount = 0;
        expectedFunctionStates = [];
        receivedFunctionStates = [];
    });
    // Success cases
    test('Inactive function that reactivates does not throw error', async () => {
        mockInvoke = async () => {
            if (invokeCount == 0) {
                invokeCount++;
                throw new Error('Better luck next time');
            }
            invokeCount++;
            return { Payload: req.Payload };
        };
        expectedFunctionStates.push('Active');
        expectedFunctionStates.push('Pending');
        expect(await outbound_1.invokeFunction(req)).toEqual({ Payload: req.Payload });
        expect(invokeCount).toEqual(2);
        expect(receivedFunctionStates).toEqual(['Pending', 'Active']);
    });
    test('Active function does not run waitFor or retry invoke', async () => {
        mockInvoke = async () => {
            if (invokeCount == 1) {
                invokeCount++;
                throw new Error('This should not happen in this test');
            }
            invokeCount++;
            return { Payload: req.Payload };
        };
        expectedFunctionStates.push('Active');
        expect(await outbound_1.invokeFunction(req)).toEqual({ Payload: req.Payload });
        expect(invokeCount).toEqual(1);
        expect(receivedFunctionStates).toEqual([]);
    });
    // Failure cases
    test('Inactive function that goes back to inactive throws error', async () => {
        mockInvoke = async () => {
            if (invokeCount == 0) {
                invokeCount++;
                throw new Error('Better luck next time');
            }
            invokeCount++;
            return { Payload: req.Payload };
        };
        expectedFunctionStates.push('Inactive');
        expectedFunctionStates.push('Pending');
        expectedFunctionStates.push('Pending');
        await expect(outbound_1.invokeFunction(req)).rejects.toThrowError(new Error('Not today'));
        expect(invokeCount).toEqual(1);
        expect(receivedFunctionStates).toEqual(['Pending', 'Pending', 'Inactive']);
    });
    test('Inactive function that goes to failed throws error', async () => {
        mockInvoke = async () => {
            if (invokeCount == 0) {
                invokeCount++;
                throw new Error('Better luck next time');
            }
            invokeCount++;
            return { Payload: req.Payload };
        };
        expectedFunctionStates.push('Failed');
        expectedFunctionStates.push('Pending');
        expectedFunctionStates.push('Pending');
        await expect(outbound_1.invokeFunction(req)).rejects.toThrowError(new Error('Broken'));
        expect(invokeCount).toEqual(1);
        expect(receivedFunctionStates).toEqual(['Pending', 'Pending', 'Failed']);
    });
    test('Inactive function that returns other value throws error', async () => {
        mockInvoke = async () => {
            if (invokeCount == 0) {
                invokeCount++;
                throw new Error('Better luck next time');
            }
            invokeCount++;
            return { Payload: req.Payload };
        };
        expectedFunctionStates.push('NewFunctionWhoDis');
        expectedFunctionStates.push('Pending');
        expectedFunctionStates.push('Pending');
        await expect(outbound_1.invokeFunction(req)).rejects.toThrowError(new Error('State is confused'));
        expect(invokeCount).toEqual(1);
        expect(receivedFunctionStates).toEqual(['Pending', 'Pending', 'NewFunctionWhoDis']);
    });
    test('Wait for stops on terminal responses', async () => {
        mockInvoke = async () => {
            if (invokeCount == 0) {
                invokeCount++;
                throw new Error('Better luck next time');
            }
            invokeCount++;
            return { Payload: req.Payload };
        };
        expectedFunctionStates.push('SomethingElse');
        expectedFunctionStates.push('Pending');
        expectedFunctionStates.push('Inactive');
        expectedFunctionStates.push('Pending');
        expectedFunctionStates.push('Pending');
        await expect(outbound_1.invokeFunction(req)).rejects.toThrowError(new Error('Not today'));
        expect(invokeCount).toEqual(1);
        expect(receivedFunctionStates).toEqual(['Pending', 'Pending', 'Inactive']);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0Ym91bmQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm91dGJvdW5kLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw0RUFBK0U7QUFFL0UsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLE9BQU87UUFDTCxNQUFNLEVBQUU7WUFDQyxNQUFNO2dCQUNYLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQzthQUN4QztZQUVNLE9BQU87Z0JBQ1osT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO2FBQ3pDO1NBQ0Y7S0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLFVBQXdELENBQUM7QUFFN0QsTUFBTSxHQUFHLEdBQWlDO0lBQ3hDLFlBQVksRUFBRSxVQUFVO0lBQ3hCLE9BQU8sRUFBRTtRQUNQLFdBQVcsRUFBRSxxQkFBcUI7UUFDbEMsVUFBVSxFQUFFLGdCQUFnQjtLQUM3QjtDQUNGLENBQUM7QUFFRixJQUFJLFdBQVcsR0FBVyxDQUFDLENBQUM7QUFDNUIsSUFBSSxzQkFBc0IsR0FBYSxFQUFFLENBQUM7QUFDMUMsSUFBSSxzQkFBc0IsR0FBYSxFQUFFLENBQUM7QUFFMUMsTUFBTSxXQUFXLEdBQUcsS0FBSyxJQUE2QyxFQUFFO0lBQ3RFLElBQUksS0FBSyxHQUFHLHNCQUFzQixDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3pDLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtRQUN6QixzQkFBc0IsQ0FBQyxJQUFJLENBQUMsS0FBTSxDQUFDLENBQUM7UUFDcEMsMENBQTBDO1FBQzFDLElBQUksS0FBSyxLQUFLLFVBQVU7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZELDJCQUEyQjtRQUMzQixJQUFJLEtBQUssS0FBSyxRQUFRO1lB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QUN0RixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxzQ0FBc0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN0RCxVQUFVLEdBQUcsS0FBSyxJQUFJLEVBQUU7WUFDdEIsSUFBSSxXQUFXLElBQUksQ0FBQyxFQUFFO2dCQUNwQixXQUFXLEVBQUUsQ0FBQztnQkFDZCxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7YUFDMUM7WUFDRCxXQUFXLEVBQUUsQ0FBQztZQUNkLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2xDLENBQUMsQ0FBQztRQUVGLHNCQUFzQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM3QyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2QyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFdkMsTUFBTSxNQUFNLENBQUMseUJBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUMvRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXdzIGZyb20gJ2F3cy1zZGsnO1xuaW1wb3J0IHsgaW52b2tlRnVuY3Rpb24gfSBmcm9tICcuLi8uLi9saWIvcHJvdmlkZXItZnJhbWV3b3JrL3J1bnRpbWUvb3V0Ym91bmQnO1xuXG5qZXN0Lm1vY2soJ2F3cy1zZGsnLCAoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgTGFtYmRhOiBjbGFzcyB7XG4gICAgICBwdWJsaWMgaW52b2tlKCkge1xuICAgICAgICByZXR1cm4geyBwcm9taXNlOiAoKSA9PiBtb2NrSW52b2tlKCkgfTtcbiAgICAgIH1cblxuICAgICAgcHVibGljIHdhaXRGb3IoKSB7XG4gICAgICAgIHJldHVybiB7IHByb21pc2U6ICgpID0+IG1vY2tXYWl0Rm9yKCkgfTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xufSk7XG5cbmxldCBtb2NrSW52b2tlOiAoKSA9PiBQcm9taXNlPGF3cy5MYW1iZGEuSW52b2NhdGlvblJlc3BvbnNlPjtcblxuY29uc3QgcmVxOiBhd3MuTGFtYmRhLkludm9jYXRpb25SZXF1ZXN0ID0ge1xuICBGdW5jdGlvbk5hbWU6ICdXaGF0ZXZlcicsXG4gIFBheWxvYWQ6IHtcbiAgICBJc1RoaXNBVGVzdDogJ1llcywgdGhpcyBpcyBhIHRlc3QnLFxuICAgIEFyZVlvdVN1cmU6ICdZZXMsIEkgYW0gc3VyZScsXG4gIH0sXG59O1xuXG5sZXQgaW52b2tlQ291bnQ6IG51bWJlciA9IDA7XG5sZXQgZXhwZWN0ZWRGdW5jdGlvblN0YXRlczogc3RyaW5nW10gPSBbXTtcbmxldCByZWNlaXZlZEZ1bmN0aW9uU3RhdGVzOiBzdHJpbmdbXSA9IFtdO1xuXG5jb25zdCBtb2NrV2FpdEZvciA9IGFzeW5jICgpOiBQcm9taXNlPGF3cy5MYW1iZGEuR2V0RnVuY3Rpb25SZXNwb25zZT4gPT4ge1xuICBsZXQgc3RhdGUgPSBleHBlY3RlZEZ1bmN0aW9uU3RhdGVzLnBvcCgpO1xuICB3aGlsZSAoc3RhdGUgIT09ICdBY3RpdmUnKSB7XG4gICAgcmVjZWl2ZWRGdW5jdGlvblN0YXRlcy5wdXNoKHN0YXRlISk7XG4gICAgLy8gSWYgaXQgZ29lcyBiYWNrIHRvIGluYWN0aXZlIGl0J3MgZmFpbGVkXG4gICAgaWYgKHN0YXRlID09PSAnSW5hY3RpdmUnKSB0aHJvdyBuZXcgRXJyb3IoJ05vdCB0b2RheScpO1xuICAgIC8vIElmIGZhaWxlZC4uLiBpdCdzIGZhaWxlZFxuICAgIGlmIChzdGF0ZSA9PT0gJ0ZhaWxlZCcpIHRocm93IG5ldyBFcnJvcignQnJva2VuJyk7XG4gICAgLy8gSWYgcGVuZGluZywgY29udGludWUgdGhlIGxvb3AsIG5vIG90aGVyIHZhbGlkIG9wdGlvbnNcbiAgICBpZiAoc3RhdGUgIT09ICdQZW5kaW5nJykgdGhyb3cgbmV3IEVycm9yKCdTdGF0ZSBpcyBjb25mdXNlZCcpO1xuICAgIHN0YXRlID0gZXhwZWN0ZWRGdW5jdGlvblN0YXRlcy5wb3AoKTtcbiAgfVxuICByZWNlaXZlZEZ1bmN0aW9uU3RhdGVzLnB1c2goc3RhdGUpO1xuICByZXR1cm4ge1xuICAgIENvbmZpZ3VyYXRpb246IHtcbiAgICAgIFN0YXRlOiAnQWN0aXZlJyxcbiAgICB9LFxuICB9O1xufTtcblxuZGVzY3JpYmUoJ2ludm9rZUZ1bmN0aW9uIHRlc3RzJywgKCkgPT4ge1xuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIGludm9rZUNvdW50ID0gMDtcbiAgICBleHBlY3RlZEZ1bmN0aW9uU3RhdGVzID0gW107XG4gICAgcmVjZWl2ZWRGdW5jdGlvblN0YXRlcyA9IFtdO1xuICB9KTtcblxuICAvLyBTdWNjZXNzIGNhc2VzXG4gIHRlc3QoJ0luYWN0aXZlIGZ1bmN0aW9uIHRoYXQgcmVhY3RpdmF0ZXMgZG9lcyBub3QgdGhyb3cgZXJyb3InLCBhc3luYyAoKSA9PiB7XG4gICAgbW9ja0ludm9rZSA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmIChpbnZva2VDb3VudCA9PSAwKSB7XG4gICAgICAgIGludm9rZUNvdW50Kys7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQmV0dGVyIGx1Y2sgbmV4dCB0aW1lJyk7XG4gICAgICB9XG4gICAgICBpbnZva2VDb3VudCsrO1xuICAgICAgcmV0dXJuIHsgUGF5bG9hZDogcmVxLlBheWxvYWQgfTtcbiAgICB9O1xuXG4gICAgZXhwZWN0ZWRGdW5jdGlvblN0YXRlcy5wdXNoKCdBY3RpdmUnKTtcbiAgICBleHBlY3RlZEZ1bmN0aW9uU3RhdGVzLnB1c2goJ1BlbmRpbmcnKTtcblxuICAgIGV4cGVjdChhd2FpdCBpbnZva2VGdW5jdGlvbihyZXEpKS50b0VxdWFsKHsgUGF5bG9hZDogcmVxLlBheWxvYWQgfSk7XG4gICAgZXhwZWN0KGludm9rZUNvdW50KS50b0VxdWFsKDIpO1xuICAgIGV4cGVjdChyZWNlaXZlZEZ1bmN0aW9uU3RhdGVzKS50b0VxdWFsKFsnUGVuZGluZycsICdBY3RpdmUnXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0FjdGl2ZSBmdW5jdGlvbiBkb2VzIG5vdCBydW4gd2FpdEZvciBvciByZXRyeSBpbnZva2UnLCBhc3luYyAoKSA9PiB7XG4gICAgbW9ja0ludm9rZSA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmIChpbnZva2VDb3VudCA9PSAxKSB7XG4gICAgICAgIGludm9rZUNvdW50Kys7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBzaG91bGQgbm90IGhhcHBlbiBpbiB0aGlzIHRlc3QnKTtcbiAgICAgIH1cbiAgICAgIGludm9rZUNvdW50Kys7XG4gICAgICByZXR1cm4geyBQYXlsb2FkOiByZXEuUGF5bG9hZCB9O1xuICAgIH07XG5cbiAgICBleHBlY3RlZEZ1bmN0aW9uU3RhdGVzLnB1c2goJ0FjdGl2ZScpO1xuXG4gICAgZXhwZWN0KGF3YWl0IGludm9rZUZ1bmN0aW9uKHJlcSkpLnRvRXF1YWwoeyBQYXlsb2FkOiByZXEuUGF5bG9hZCB9KTtcbiAgICBleHBlY3QoaW52b2tlQ291bnQpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KHJlY2VpdmVkRnVuY3Rpb25TdGF0ZXMpLnRvRXF1YWwoW10pO1xuICB9KTtcblxuICAvLyBGYWlsdXJlIGNhc2VzXG4gIHRlc3QoJ0luYWN0aXZlIGZ1bmN0aW9uIHRoYXQgZ29lcyBiYWNrIHRvIGluYWN0aXZlIHRocm93cyBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICBtb2NrSW52b2tlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKGludm9rZUNvdW50ID09IDApIHtcbiAgICAgICAgaW52b2tlQ291bnQrKztcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCZXR0ZXIgbHVjayBuZXh0IHRpbWUnKTtcbiAgICAgIH1cbiAgICAgIGludm9rZUNvdW50Kys7XG4gICAgICByZXR1cm4geyBQYXlsb2FkOiByZXEuUGF5bG9hZCB9O1xuICAgIH07XG5cbiAgICBleHBlY3RlZEZ1bmN0aW9uU3RhdGVzLnB1c2goJ0luYWN0aXZlJyk7XG4gICAgZXhwZWN0ZWRGdW5jdGlvblN0YXRlcy5wdXNoKCdQZW5kaW5nJyk7XG4gICAgZXhwZWN0ZWRGdW5jdGlvblN0YXRlcy5wdXNoKCdQZW5kaW5nJyk7XG5cbiAgICBhd2FpdCBleHBlY3QoaW52b2tlRnVuY3Rpb24ocmVxKSkucmVqZWN0cy50b1Rocm93RXJyb3IobmV3IEVycm9yKCdOb3QgdG9kYXknKSk7XG4gICAgZXhwZWN0KGludm9rZUNvdW50KS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChyZWNlaXZlZEZ1bmN0aW9uU3RhdGVzKS50b0VxdWFsKFsnUGVuZGluZycsICdQZW5kaW5nJywgJ0luYWN0aXZlJ10pO1xuICB9KTtcblxuICB0ZXN0KCdJbmFjdGl2ZSBmdW5jdGlvbiB0aGF0IGdvZXMgdG8gZmFpbGVkIHRocm93cyBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICBtb2NrSW52b2tlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKGludm9rZUNvdW50ID09IDApIHtcbiAgICAgICAgaW52b2tlQ291bnQrKztcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCZXR0ZXIgbHVjayBuZXh0IHRpbWUnKTtcbiAgICAgIH1cbiAgICAgIGludm9rZUNvdW50Kys7XG4gICAgICByZXR1cm4geyBQYXlsb2FkOiByZXEuUGF5bG9hZCB9O1xuICAgIH07XG5cbiAgICBleHBlY3RlZEZ1bmN0aW9uU3RhdGVzLnB1c2goJ0ZhaWxlZCcpO1xuICAgIGV4cGVjdGVkRnVuY3Rpb25TdGF0ZXMucHVzaCgnUGVuZGluZycpO1xuICAgIGV4cGVjdGVkRnVuY3Rpb25TdGF0ZXMucHVzaCgnUGVuZGluZycpO1xuXG4gICAgYXdhaXQgZXhwZWN0KGludm9rZUZ1bmN0aW9uKHJlcSkpLnJlamVjdHMudG9UaHJvd0Vycm9yKG5ldyBFcnJvcignQnJva2VuJykpO1xuICAgIGV4cGVjdChpbnZva2VDb3VudCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QocmVjZWl2ZWRGdW5jdGlvblN0YXRlcykudG9FcXVhbChbJ1BlbmRpbmcnLCAnUGVuZGluZycsICdGYWlsZWQnXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0luYWN0aXZlIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBvdGhlciB2YWx1ZSB0aHJvd3MgZXJyb3InLCBhc3luYyAoKSA9PiB7XG4gICAgbW9ja0ludm9rZSA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmIChpbnZva2VDb3VudCA9PSAwKSB7XG4gICAgICAgIGludm9rZUNvdW50Kys7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQmV0dGVyIGx1Y2sgbmV4dCB0aW1lJyk7XG4gICAgICB9XG4gICAgICBpbnZva2VDb3VudCsrO1xuICAgICAgcmV0dXJuIHsgUGF5bG9hZDogcmVxLlBheWxvYWQgfTtcbiAgICB9O1xuXG4gICAgZXhwZWN0ZWRGdW5jdGlvblN0YXRlcy5wdXNoKCdOZXdGdW5jdGlvbldob0RpcycpO1xuICAgIGV4cGVjdGVkRnVuY3Rpb25TdGF0ZXMucHVzaCgnUGVuZGluZycpO1xuICAgIGV4cGVjdGVkRnVuY3Rpb25TdGF0ZXMucHVzaCgnUGVuZGluZycpO1xuXG4gICAgYXdhaXQgZXhwZWN0KGludm9rZUZ1bmN0aW9uKHJlcSkpLnJlamVjdHMudG9UaHJvd0Vycm9yKG5ldyBFcnJvcignU3RhdGUgaXMgY29uZnVzZWQnKSk7XG4gICAgZXhwZWN0KGludm9rZUNvdW50KS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChyZWNlaXZlZEZ1bmN0aW9uU3RhdGVzKS50b0VxdWFsKFsnUGVuZGluZycsICdQZW5kaW5nJywgJ05ld0Z1bmN0aW9uV2hvRGlzJ10pO1xuICB9KTtcblxuICB0ZXN0KCdXYWl0IGZvciBzdG9wcyBvbiB0ZXJtaW5hbCByZXNwb25zZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgbW9ja0ludm9rZSA9IGFzeW5jICgpID0+IHtcbiAgICAgIGlmIChpbnZva2VDb3VudCA9PSAwKSB7XG4gICAgICAgIGludm9rZUNvdW50Kys7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQmV0dGVyIGx1Y2sgbmV4dCB0aW1lJyk7XG4gICAgICB9XG4gICAgICBpbnZva2VDb3VudCsrO1xuICAgICAgcmV0dXJuIHsgUGF5bG9hZDogcmVxLlBheWxvYWQgfTtcbiAgICB9O1xuXG4gICAgZXhwZWN0ZWRGdW5jdGlvblN0YXRlcy5wdXNoKCdTb21ldGhpbmdFbHNlJyk7XG4gICAgZXhwZWN0ZWRGdW5jdGlvblN0YXRlcy5wdXNoKCdQZW5kaW5nJyk7XG4gICAgZXhwZWN0ZWRGdW5jdGlvblN0YXRlcy5wdXNoKCdJbmFjdGl2ZScpO1xuICAgIGV4cGVjdGVkRnVuY3Rpb25TdGF0ZXMucHVzaCgnUGVuZGluZycpO1xuICAgIGV4cGVjdGVkRnVuY3Rpb25TdGF0ZXMucHVzaCgnUGVuZGluZycpO1xuXG4gICAgYXdhaXQgZXhwZWN0KGludm9rZUZ1bmN0aW9uKHJlcSkpLnJlamVjdHMudG9UaHJvd0Vycm9yKG5ldyBFcnJvcignTm90IHRvZGF5JykpO1xuICAgIGV4cGVjdChpbnZva2VDb3VudCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QocmVjZWl2ZWRGdW5jdGlvblN0YXRlcykudG9FcXVhbChbJ1BlbmRpbmcnLCAnUGVuZGluZycsICdJbmFjdGl2ZSddKTtcbiAgfSk7XG59KTtcblxuIl19