"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const md5_1 = require("../../lib/private/md5");
test.each([
    '',
    'asdf',
    'hello',
    '🤠',
    'x'.repeat(54),
    'y'.repeat(63),
    'z'.repeat(64),
    'a'.repeat(64) + 'y',
    'b'.repeat(115),
    'c'.repeat(128),
])('test md5 equality for %p', s => {
    expect(md5_1.jsMd5(s)).toEqual(md5_1.cryptoMd5(s));
});
// eslint-disable-next-line jest/no-disabled-tests
test.skip('test md5 equality for a giant string (larger than 512MB)', () => {
    const s = 'x'.repeat(515000000);
    expect(md5_1.jsMd5(s)).toEqual(md5_1.cryptoMd5(s));
});
describe('timing', () => {
    const s = 'x'.repeat(352321);
    const N = 100;
    // On my machine:
    // - crypto: 73ms
    // - native: 1187ms
    test('crypto', () => {
        for (let i = 0; i < N; i++) {
            md5_1.cryptoMd5(s);
        }
    });
    test('native', () => {
        for (let i = 0; i < N; i++) {
            md5_1.jsMd5(s);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWQ1LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtZDUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtDQUF5RDtBQUV6RCxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ1IsRUFBRTtJQUNGLE1BQU07SUFDTixPQUFPO0lBQ1AsSUFBSTtJQUNKLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNkLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRztJQUNwQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNmLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0NBQ2hCLENBQUMsQ0FBQywwQkFBMEIsRUFBRSxDQUFDLENBQUMsRUFBRTtJQUNqQyxNQUFNLENBQUMsV0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pDLENBQUMsQ0FBQyxDQUFDO0FBRUgsa0RBQWtEO0FBQ2xELElBQUksQ0FBQyxJQUFJLENBQUMsMERBQTBELEVBQUUsR0FBRyxFQUFFO0lBQ3pFLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBVyxDQUFDLENBQUM7SUFDbEMsTUFBTSxDQUFDLFdBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QyxDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ3RCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0IsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBRWQsaUJBQWlCO0lBQ2pCLGlCQUFpQjtJQUNqQixtQkFBbUI7SUFFbkIsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7UUFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMxQixlQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDZDtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7UUFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMxQixXQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDVjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBqc01kNSwgY3J5cHRvTWQ1IH0gZnJvbSAnLi4vLi4vbGliL3ByaXZhdGUvbWQ1JztcblxudGVzdC5lYWNoKFtcbiAgJycsXG4gICdhc2RmJyxcbiAgJ2hlbGxvJyxcbiAgJ/CfpKAnLFxuICAneCcucmVwZWF0KDU0KSxcbiAgJ3knLnJlcGVhdCg2MyksXG4gICd6Jy5yZXBlYXQoNjQpLFxuICAnYScucmVwZWF0KDY0KSArICd5JyxcbiAgJ2InLnJlcGVhdCgxMTUpLFxuICAnYycucmVwZWF0KDEyOCksXG5dKSgndGVzdCBtZDUgZXF1YWxpdHkgZm9yICVwJywgcyA9PiB7XG4gIGV4cGVjdChqc01kNShzKSkudG9FcXVhbChjcnlwdG9NZDUocykpO1xufSk7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBqZXN0L25vLWRpc2FibGVkLXRlc3RzXG50ZXN0LnNraXAoJ3Rlc3QgbWQ1IGVxdWFsaXR5IGZvciBhIGdpYW50IHN0cmluZyAobGFyZ2VyIHRoYW4gNTEyTUIpJywgKCkgPT4ge1xuICBjb25zdCBzID0gJ3gnLnJlcGVhdCg1MTVfMDAwXzAwMCk7XG4gIGV4cGVjdChqc01kNShzKSkudG9FcXVhbChjcnlwdG9NZDUocykpO1xufSk7XG5cbmRlc2NyaWJlKCd0aW1pbmcnLCAoKSA9PiB7XG4gIGNvbnN0IHMgPSAneCcucmVwZWF0KDM1MjMyMSk7XG4gIGNvbnN0IE4gPSAxMDA7XG5cbiAgLy8gT24gbXkgbWFjaGluZTpcbiAgLy8gLSBjcnlwdG86IDczbXNcbiAgLy8gLSBuYXRpdmU6IDExODdtc1xuXG4gIHRlc3QoJ2NyeXB0bycsICgpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE47IGkrKykge1xuICAgICAgY3J5cHRvTWQ1KHMpO1xuICAgIH1cbiAgfSk7XG5cbiAgdGVzdCgnbmF0aXZlJywgKCkgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTjsgaSsrKSB7XG4gICAgICBqc01kNShzKTtcbiAgICB9XG4gIH0pO1xufSk7Il19