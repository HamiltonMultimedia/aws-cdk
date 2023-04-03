"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('hosted zone provider', () => {
    describe('Hosted Zone Provider', () => {
        test('HostedZoneProvider will return context values if available', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'TestStack', {
                env: { account: '12345', region: 'us-east-1' },
            });
            const filter = { domainName: 'test.com' };
            lib_1.HostedZone.fromLookup(stack, 'Ref', filter);
            const assembly = app.synth().getStackArtifact(stack.artifactId);
            const missing = assembly.assembly.manifest.missing;
            expect(missing && missing.length === 1).toEqual(true);
            const fakeZoneId = '11111111111111';
            const fakeZone = {
                Id: `/hostedzone/${fakeZoneId}`,
                Name: 'example.com.',
                CallerReference: 'TestLates-PublicZo-OESZPDFV7G6A',
                Config: {
                    Comment: 'CDK created',
                    PrivateZone: false,
                },
                ResourceRecordSetCount: 3,
            };
            const stack2 = new cdk.Stack(undefined, 'TestStack', {
                env: { account: '12345', region: 'us-east-1' },
            });
            stack2.node.setContext(missing[0].key, fakeZone);
            // WHEN
            const zoneRef = lib_1.HostedZone.fromLookup(stack2, 'MyZoneProvider', filter);
            // THEN
            expect(zoneRef.hostedZoneId).toEqual(fakeZoneId);
        });
        test('HostedZoneProvider will return context values if available when using plain hosted zone id', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'TestStack', {
                env: { account: '12345', region: 'us-east-1' },
            });
            const filter = { domainName: 'test.com' };
            lib_1.HostedZone.fromLookup(stack, 'Ref', filter);
            const assembly = app.synth().getStackArtifact(stack.artifactId);
            const missing = assembly.assembly.manifest.missing;
            expect(missing && missing.length === 1).toEqual(true);
            const fakeZoneId = '11111111111111';
            const fakeZone = {
                Id: `/hostedzone/${fakeZoneId}`,
                Name: 'example.com.',
                CallerReference: 'TestLates-PublicZo-OESZPDFV7G6A',
                Config: {
                    Comment: 'CDK created',
                    PrivateZone: false,
                },
                ResourceRecordSetCount: 3,
            };
            const stack2 = new cdk.Stack(undefined, 'TestStack', {
                env: { account: '12345', region: 'us-east-1' },
            });
            stack2.node.setContext(missing[0].key, fakeZone);
            const zone = lib_1.HostedZone.fromLookup(stack2, 'MyZoneProvider', filter);
            // WHEN
            const zoneId = zone.hostedZoneId;
            // THEN
            expect(fakeZoneId).toEqual(zoneId);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdGVkLXpvbmUtcHJvdmlkZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhvc3RlZC16b25lLXByb3ZpZGVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBcUM7QUFDckMsZ0NBQW9DO0FBRXBDLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7SUFDcEMsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtRQUNwQyxJQUFJLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFO1lBQ3RFLFFBQVE7WUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRTtnQkFDNUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFO2FBQy9DLENBQUMsQ0FBQztZQUNILE1BQU0sTUFBTSxHQUFHLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxDQUFDO1lBRTFDLGdCQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFNUMsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoRSxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFRLENBQUM7WUFDcEQsTUFBTSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV0RCxNQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQztZQUNwQyxNQUFNLFFBQVEsR0FBRztnQkFDZixFQUFFLEVBQUUsZUFBZSxVQUFV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QyxDQUFDO1FBRXJDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEhvc3RlZFpvbmUgfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnaG9zdGVkIHpvbmUgcHJvdmlkZXInLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdIb3N0ZWQgWm9uZSBQcm92aWRlcicsICgpID0+IHtcbiAgICB0ZXN0KCdIb3N0ZWRab25lUHJvdmlkZXIgd2lsbCByZXR1cm4gY29udGV4dCB2YWx1ZXMgaWYgYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnVGVzdFN0YWNrJywge1xuICAgICAgICBlbnY6IHsgYWNjb3VudDogJzEyMzQ1JywgcmVnaW9uOiAndXMtZWFzdC0xJyB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCBmaWx0ZXIgPSB7IGRvbWFpbk5hbWU6ICd0ZXN0LmNvbScgfTtcblxuICAgICAgSG9zdGVkWm9uZS5mcm9tTG9va3VwKHN0YWNrLCAnUmVmJywgZmlsdGVyKTtcblxuICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKS5nZXRTdGFja0FydGlmYWN0KHN0YWNrLmFydGlmYWN0SWQpO1xuICAgICAgY29uc3QgbWlzc2luZyA9IGFzc2VtYmx5LmFzc2VtYmx5Lm1hbmlmZXN0Lm1pc3NpbmchO1xuICAgICAgZXhwZWN0KG1pc3NpbmcgJiYgbWlzc2luZy5sZW5ndGggPT09IDEpLnRvRXF1YWwodHJ1ZSk7XG5cbiAgICAgIGNvbnN0IGZha2Vab25lSWQgPSAnMTExMTExMTExMTExMTEnO1xuICAgICAgY29uc3QgZmFrZVpvbmUgPSB7XG4gICAgICAgIElkOiBgL2hvc3RlZHpvbmUvJHtmYWtlWm9uZUlkfWAsXG4gICAgICAgIE5hbWU6ICdleGFtcGxlLmNvbS4nLFxuICAgICAgICBDYWxsZXJSZWZlcmVuY2U6ICdUZXN0TGF0ZXMtUHVibGljWm8tT0VTWlBERlY3RzZBJyxcbiAgICAgICAgQ29uZmlnOiB7XG4gICAgICAgICAgQ29tbWVudDogJ0NESyBjcmVhdGVkJyxcbiAgICAgICAgICBQcml2YXRlWm9uZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIFJlc291cmNlUmVjb3JkU2V0Q291bnQ6IDMsXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBzdGFjazIgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycsIHtcbiAgICAgICAgZW52OiB7IGFjY291bnQ6ICcxMjM0NScsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgICAgIH0pO1xuICAgICAgc3RhY2syLm5vZGUuc2V0Q29udGV4dChtaXNzaW5nWzBdLmtleSwgZmFrZVpvbmUpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB6b25lUmVmID0gSG9zdGVkWm9uZS5mcm9tTG9va3VwKHN0YWNrMiwgJ015Wm9uZVByb3ZpZGVyJywgZmlsdGVyKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHpvbmVSZWYuaG9zdGVkWm9uZUlkKS50b0VxdWFsKGZha2Vab25lSWQpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnSG9zdGVkWm9uZVByb3ZpZGVyIHdpbGwgcmV0dXJuIGNvbnRleHQgdmFsdWVzIGlmIGF2YWlsYWJsZSB3aGVuIHVzaW5nIHBsYWluIGhvc3RlZCB6b25lIGlkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnVGVzdFN0YWNrJywge1xuICAgICAgICBlbnY6IHsgYWNjb3VudDogJzEyMzQ1JywgcmVnaW9uOiAndXMtZWFzdC0xJyB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCBmaWx0ZXIgPSB7IGRvbWFpbk5hbWU6ICd0ZXN0LmNvbScgfTtcblxuICAgICAgSG9zdGVkWm9uZS5mcm9tTG9va3VwKHN0YWNrLCAnUmVmJywgZmlsdGVyKTtcblxuICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKS5nZXRTdGFja0FydGlmYWN0KHN0YWNrLmFydGlmYWN0SWQpO1xuICAgICAgY29uc3QgbWlzc2luZyA9IGFzc2VtYmx5LmFzc2VtYmx5Lm1hbmlmZXN0Lm1pc3NpbmchO1xuICAgICAgZXhwZWN0KG1pc3NpbmcgJiYgbWlzc2luZy5sZW5ndGggPT09IDEpLnRvRXF1YWwodHJ1ZSk7XG5cbiAgICAgIGNvbnN0IGZha2Vab25lSWQgPSAnMTExMTExMTExMTExMTEnO1xuICAgICAgY29uc3QgZmFrZVpvbmUgPSB7XG4gICAgICAgIElkOiBgL2hvc3RlZHpvbmUvJHtmYWtlWm9uZUlkfWAsXG4gICAgICAgIE5hbWU6ICdleGFtcGxlLmNvbS4nLFxuICAgICAgICBDYWxsZXJSZWZlcmVuY2U6ICdUZXN0TGF0ZXMtUHVibGljWm8tT0VTWlBERlY3RzZBJyxcbiAgICAgICAgQ29uZmlnOiB7XG4gICAgICAgICAgQ29tbWVudDogJ0NESyBjcmVhdGVkJyxcbiAgICAgICAgICBQcml2YXRlWm9uZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIFJlc291cmNlUmVjb3JkU2V0Q291bnQ6IDMsXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBzdGFjazIgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycsIHtcbiAgICAgICAgZW52OiB7IGFjY291bnQ6ICcxMjM0NScsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgICAgIH0pO1xuICAgICAgc3RhY2syLm5vZGUuc2V0Q29udGV4dChtaXNzaW5nWzBdLmtleSwgZmFrZVpvbmUpO1xuXG4gICAgICBjb25zdCB6b25lID0gSG9zdGVkWm9uZS5mcm9tTG9va3VwKHN0YWNrMiwgJ015Wm9uZVByb3ZpZGVyJywgZmlsdGVyKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgem9uZUlkID0gem9uZS5ob3N0ZWRab25lSWQ7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChmYWtlWm9uZUlkKS50b0VxdWFsKHpvbmVJZCk7XG5cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==