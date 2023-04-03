"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
const physical_name_generator_1 = require("../../lib/private/physical-name-generator");
describe('physical name generator', () => {
    describe('generatePhysicalName', () => {
        test('generates correct physical names', () => {
            const app = new lib_1.App();
            const stack = new lib_1.Stack(app, 'TestStack', { env: { account: '012345678912', region: 'bermuda-triangle-1' } });
            const testResourceA = new TestResource(stack, 'A');
            const testResourceB = new TestResource(testResourceA, 'B');
            expect(physical_name_generator_1.generatePhysicalName(testResourceA)).toEqual('teststackteststackaa164c141d59b37c1b663');
            expect(physical_name_generator_1.generatePhysicalName(testResourceB)).toEqual('teststackteststackab27595cd34d8188283a1f');
        });
        test('generates different names in different accounts', () => {
            const appA = new lib_1.App();
            const stackA = new lib_1.Stack(appA, 'TestStack', { env: { account: '012345678912', region: 'bermuda-triangle-1' } });
            const resourceA = new TestResource(stackA, 'Resource');
            const appB = new lib_1.App();
            const stackB = new lib_1.Stack(appB, 'TestStack', { env: { account: '012345678913', region: 'bermuda-triangle-1' } });
            const resourceB = new TestResource(stackB, 'Resource');
            expect(physical_name_generator_1.generatePhysicalName(resourceA)).not.toEqual(physical_name_generator_1.generatePhysicalName(resourceB));
        });
        test('generates different names in different regions', () => {
            const appA = new lib_1.App();
            const stackA = new lib_1.Stack(appA, 'TestStack', { env: { account: '012345678912', region: 'bermuda-triangle-1' } });
            const resourceA = new TestResource(stackA, 'Resource');
            const appB = new lib_1.App();
            const stackB = new lib_1.Stack(appB, 'TestStack', { env: { account: '012345678912', region: 'bermuda-triangle-2' } });
            const resourceB = new TestResource(stackB, 'Resource');
            expect(physical_name_generator_1.generatePhysicalName(resourceA)).not.toEqual(physical_name_generator_1.generatePhysicalName(resourceB));
        });
        test('fails when the region is an unresolved token', () => {
            const app = new lib_1.App();
            const stack = new lib_1.Stack(app, 'TestStack', { env: { account: '012345678912', region: lib_1.Aws.REGION } });
            const testResource = new TestResource(stack, 'A');
            expect(() => physical_name_generator_1.generatePhysicalName(testResource)).toThrow(/Cannot generate a physical name for TestStack\/A, because the region is un-resolved or missing/);
        });
        test('fails when the region is not provided', () => {
            const app = new lib_1.App();
            const stack = new lib_1.Stack(app, 'TestStack', { env: { account: '012345678912' } });
            const testResource = new TestResource(stack, 'A');
            expect(() => physical_name_generator_1.generatePhysicalName(testResource)).toThrow(/Cannot generate a physical name for TestStack\/A, because the region is un-resolved or missing/);
        });
        test('fails when the account is an unresolved token', () => {
            const app = new lib_1.App();
            const stack = new lib_1.Stack(app, 'TestStack', { env: { account: lib_1.Aws.ACCOUNT_ID, region: 'bermuda-triangle-1' } });
            const testResource = new TestResource(stack, 'A');
            expect(() => physical_name_generator_1.generatePhysicalName(testResource)).toThrow(/Cannot generate a physical name for TestStack\/A, because the account is un-resolved or missing/);
        });
        test('fails when the account is not provided', () => {
            const app = new lib_1.App();
            const stack = new lib_1.Stack(app, 'TestStack', { env: { region: 'bermuda-triangle-1' } });
            const testResource = new TestResource(stack, 'A');
            expect(() => physical_name_generator_1.generatePhysicalName(testResource)).toThrow(/Cannot generate a physical name for TestStack\/A, because the account is un-resolved or missing/);
        });
    });
    describe('GeneratedWhenNeededMarker', () => {
        test('is correctly recognized', () => {
            const marker = new physical_name_generator_1.GeneratedWhenNeededMarker();
            const asString = lib_1.Token.asString(marker);
            expect(physical_name_generator_1.isGeneratedWhenNeededMarker(asString)).toEqual(true);
        });
        test('throws when resolved', () => {
            const marker = new physical_name_generator_1.GeneratedWhenNeededMarker();
            const asString = lib_1.Token.asString(marker);
            expect(() => new lib_1.Stack().resolve(asString)).toThrow(/Use "this.physicalName" instead/);
        });
    });
    describe('isGeneratedWhenNeededMarker', () => {
        test('correctly response for other tokens', () => {
            expect(physical_name_generator_1.isGeneratedWhenNeededMarker('this is not even a token!')).toEqual(false);
            expect(physical_name_generator_1.isGeneratedWhenNeededMarker(lib_1.Lazy.string({ produce: () => 'Bazinga!' }))).toEqual(false);
        });
    });
});
class TestResource extends lib_1.Resource {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGh5c2ljYWwtbmFtZS1nZW5lcmF0b3IudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBoeXNpY2FsLW5hbWUtZ2VuZXJhdG9yLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUU7QUFDbkUsdUZBQXlJO0FBRXpJLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7SUFDdkMsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtRQUNwQyxJQUFJLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1lBQzVDLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxFQUFFLENBQUM7WUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLG9CQUFvQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRTlHLE1BQU0sYUFBYSxHQUFHLElBQUksWUFBWSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNuRCxNQUFNLGFBQWEsR0FBRyxJQUFJLFlBQVksQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFM0QsTUFBTSxDQUFDLDhDQUFvQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7WUFDL0YsTUFBTSxDQUFDLDhDQUFvQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7UUFHbEcsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO1lBQzNELE1BQU0sSUFBSSxHQUFHLElBQUksU0FBRyxFQUFFLENBQUM7WUFDdkIsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFLLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFF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IExhenksIFJlc291cmNlLCBTdGFjaywgVG9rZW4gfSBmcm9tICcuLi8uLi9saWInO1xuaW1wb3J0IHsgR2VuZXJhdGVkV2hlbk5lZWRlZE1hcmtlciwgZ2VuZXJhdGVQaHlzaWNhbE5hbWUsIGlzR2VuZXJhdGVkV2hlbk5lZWRlZE1hcmtlciB9IGZyb20gJy4uLy4uL2xpYi9wcml2YXRlL3BoeXNpY2FsLW5hbWUtZ2VuZXJhdG9yJztcblxuZGVzY3JpYmUoJ3BoeXNpY2FsIG5hbWUgZ2VuZXJhdG9yJywgKCkgPT4ge1xuICBkZXNjcmliZSgnZ2VuZXJhdGVQaHlzaWNhbE5hbWUnLCAoKSA9PiB7XG4gICAgdGVzdCgnZ2VuZXJhdGVzIGNvcnJlY3QgcGh5c2ljYWwgbmFtZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdUZXN0U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMDEyMzQ1Njc4OTEyJywgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS0xJyB9IH0pO1xuXG4gICAgICBjb25zdCB0ZXN0UmVzb3VyY2VBID0gbmV3IFRlc3RSZXNvdXJjZShzdGFjaywgJ0EnKTtcbiAgICAgIGNvbnN0IHRlc3RSZXNvdXJjZUIgPSBuZXcgVGVzdFJlc291cmNlKHRlc3RSZXNvdXJjZUEsICdCJyk7XG5cbiAgICAgIGV4cGVjdChnZW5lcmF0ZVBoeXNpY2FsTmFtZSh0ZXN0UmVzb3VyY2VBKSkudG9FcXVhbCgndGVzdHN0YWNrdGVzdHN0YWNrYWExNjRjMTQxZDU5YjM3YzFiNjYzJyk7XG4gICAgICBleHBlY3QoZ2VuZXJhdGVQaHlzaWNhbE5hbWUodGVzdFJlc291cmNlQikpLnRvRXF1YWwoJ3Rlc3RzdGFja3Rlc3RzdGFja2FiMjc1OTVjZDM0ZDgxODgyODNhMWYnKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdnZW5lcmF0ZXMgZGlmZmVyZW50IG5hbWVzIGluIGRpZmZlcmVudCBhY2NvdW50cycsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcEEgPSBuZXcgQXBwKCk7XG4gICAgICBjb25zdCBzdGFja0EgPSBuZXcgU3RhY2soYXBwQSwgJ1Rlc3RTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcwMTIzNDU2Nzg5MTInLCByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTEnIH0gfSk7XG4gICAgICBjb25zdCByZXNvdXJjZUEgPSBuZXcgVGVzdFJlc291cmNlKHN0YWNrQSwgJ1Jlc291cmNlJyk7XG5cbiAgICAgIGNvbnN0IGFwcEIgPSBuZXcgQXBwKCk7XG4gICAgICBjb25zdCBzdGFja0IgPSBuZXcgU3RhY2soYXBwQiwgJ1Rlc3RTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcwMTIzNDU2Nzg5MTMnLCByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTEnIH0gfSk7XG4gICAgICBjb25zdCByZXNvdXJjZUIgPSBuZXcgVGVzdFJlc291cmNlKHN0YWNrQiwgJ1Jlc291cmNlJyk7XG5cbiAgICAgIGV4cGVjdChnZW5lcmF0ZVBoeXNpY2FsTmFtZShyZXNvdXJjZUEpKS5ub3QudG9FcXVhbChnZW5lcmF0ZVBoeXNpY2FsTmFtZShyZXNvdXJjZUIpKTtcblxuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdnZW5lcmF0ZXMgZGlmZmVyZW50IG5hbWVzIGluIGRpZmZlcmVudCByZWdpb25zJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwQSA9IG5ldyBBcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrQSA9IG5ldyBTdGFjayhhcHBBLCAnVGVzdFN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzAxMjM0NTY3ODkxMicsIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtMScgfSB9KTtcbiAgICAgIGNvbnN0IHJlc291cmNlQSA9IG5ldyBUZXN0UmVzb3VyY2Uoc3RhY2tBLCAnUmVzb3VyY2UnKTtcblxuICAgICAgY29uc3QgYXBwQiA9IG5ldyBBcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrQiA9IG5ldyBTdGFjayhhcHBCLCAnVGVzdFN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzAxMjM0NTY3ODkxMicsIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtMicgfSB9KTtcbiAgICAgIGNvbnN0IHJlc291cmNlQiA9IG5ldyBUZXN0UmVzb3VyY2Uoc3RhY2tCLCAnUmVzb3VyY2UnKTtcblxuICAgICAgZXhwZWN0KGdlbmVyYXRlUGh5c2ljYWxOYW1lKHJlc291cmNlQSkpLm5vdC50b0VxdWFsKGdlbmVyYXRlUGh5c2ljYWxOYW1lKHJlc291cmNlQikpO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2ZhaWxzIHdoZW4gdGhlIHJlZ2lvbiBpcyBhbiB1bnJlc29sdmVkIHRva2VuJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnVGVzdFN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzAxMjM0NTY3ODkxMicsIHJlZ2lvbjogQXdzLlJFR0lPTiB9IH0pO1xuICAgICAgY29uc3QgdGVzdFJlc291cmNlID0gbmV3IFRlc3RSZXNvdXJjZShzdGFjaywgJ0EnKTtcblxuICAgICAgZXhwZWN0KCgpID0+IGdlbmVyYXRlUGh5c2ljYWxOYW1lKHRlc3RSZXNvdXJjZSkpLnRvVGhyb3coXG4gICAgICAgIC9DYW5ub3QgZ2VuZXJhdGUgYSBwaHlzaWNhbCBuYW1lIGZvciBUZXN0U3RhY2tcXC9BLCBiZWNhdXNlIHRoZSByZWdpb24gaXMgdW4tcmVzb2x2ZWQgb3IgbWlzc2luZy8pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2ZhaWxzIHdoZW4gdGhlIHJlZ2lvbiBpcyBub3QgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdUZXN0U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMDEyMzQ1Njc4OTEyJyB9IH0pO1xuICAgICAgY29uc3QgdGVzdFJlc291cmNlID0gbmV3IFRlc3RSZXNvdXJjZShzdGFjaywgJ0EnKTtcblxuICAgICAgZXhwZWN0KCgpID0+IGdlbmVyYXRlUGh5c2ljYWxOYW1lKHRlc3RSZXNvdXJjZSkpLnRvVGhyb3coXG4gICAgICAgIC9DYW5ub3QgZ2VuZXJhdGUgYSBwaHlzaWNhbCBuYW1lIGZvciBUZXN0U3RhY2tcXC9BLCBiZWNhdXNlIHRoZSByZWdpb24gaXMgdW4tcmVzb2x2ZWQgb3IgbWlzc2luZy8pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2ZhaWxzIHdoZW4gdGhlIGFjY291bnQgaXMgYW4gdW5yZXNvbHZlZCB0b2tlbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6IEF3cy5BQ0NPVU5UX0lELCByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTEnIH0gfSk7XG4gICAgICBjb25zdCB0ZXN0UmVzb3VyY2UgPSBuZXcgVGVzdFJlc291cmNlKHN0YWNrLCAnQScpO1xuXG4gICAgICBleHBlY3QoKCkgPT4gZ2VuZXJhdGVQaHlzaWNhbE5hbWUodGVzdFJlc291cmNlKSkudG9UaHJvdyhcbiAgICAgICAgL0Nhbm5vdCBnZW5lcmF0ZSBhIHBoeXNpY2FsIG5hbWUgZm9yIFRlc3RTdGFja1xcL0EsIGJlY2F1c2UgdGhlIGFjY291bnQgaXMgdW4tcmVzb2x2ZWQgb3IgbWlzc2luZy8pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2ZhaWxzIHdoZW4gdGhlIGFjY291bnQgaXMgbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnVGVzdFN0YWNrJywgeyBlbnY6IHsgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS0xJyB9IH0pO1xuICAgICAgY29uc3QgdGVzdFJlc291cmNlID0gbmV3IFRlc3RSZXNvdXJjZShzdGFjaywgJ0EnKTtcblxuICAgICAgZXhwZWN0KCgpID0+IGdlbmVyYXRlUGh5c2ljYWxOYW1lKHRlc3RSZXNvdXJjZSkpLnRvVGhyb3coXG4gICAgICAgIC9DYW5ub3QgZ2VuZXJhdGUgYSBwaHlzaWNhbCBuYW1lIGZvciBUZXN0U3RhY2tcXC9BLCBiZWNhdXNlIHRoZSBhY2NvdW50IGlzIHVuLXJlc29sdmVkIG9yIG1pc3NpbmcvKTtcblxuXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdHZW5lcmF0ZWRXaGVuTmVlZGVkTWFya2VyJywgKCkgPT4ge1xuICAgIHRlc3QoJ2lzIGNvcnJlY3RseSByZWNvZ25pemVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWFya2VyID0gbmV3IEdlbmVyYXRlZFdoZW5OZWVkZWRNYXJrZXIoKTtcbiAgICAgIGNvbnN0IGFzU3RyaW5nID0gVG9rZW4uYXNTdHJpbmcobWFya2VyKTtcblxuICAgICAgZXhwZWN0KGlzR2VuZXJhdGVkV2hlbk5lZWRlZE1hcmtlcihhc1N0cmluZykpLnRvRXF1YWwodHJ1ZSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIHdoZW4gcmVzb2x2ZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtYXJrZXIgPSBuZXcgR2VuZXJhdGVkV2hlbk5lZWRlZE1hcmtlcigpO1xuICAgICAgY29uc3QgYXNTdHJpbmcgPSBUb2tlbi5hc1N0cmluZyhtYXJrZXIpO1xuXG4gICAgICBleHBlY3QoKCkgPT4gbmV3IFN0YWNrKCkucmVzb2x2ZShhc1N0cmluZykpLnRvVGhyb3coL1VzZSBcInRoaXMucGh5c2ljYWxOYW1lXCIgaW5zdGVhZC8pO1xuXG5cbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2lzR2VuZXJhdGVkV2hlbk5lZWRlZE1hcmtlcicsICgpID0+IHtcbiAgICB0ZXN0KCdjb3JyZWN0bHkgcmVzcG9uc2UgZm9yIG90aGVyIHRva2VucycsICgpID0+IHtcbiAgICAgIGV4cGVjdChpc0dlbmVyYXRlZFdoZW5OZWVkZWRNYXJrZXIoJ3RoaXMgaXMgbm90IGV2ZW4gYSB0b2tlbiEnKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICBleHBlY3QoaXNHZW5lcmF0ZWRXaGVuTmVlZGVkTWFya2VyKExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ0JhemluZ2EhJyB9KSkpLnRvRXF1YWwoZmFsc2UpO1xuXG5cbiAgICB9KTtcbiAgfSk7XG59KTtcblxuY2xhc3MgVGVzdFJlc291cmNlIGV4dGVuZHMgUmVzb3VyY2Uge31cbiJdfQ==