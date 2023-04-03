"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const assets = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-assets-tarball');
const asset = new assets.TarballImageAsset(stack, 'DockerImage', {
    tarballFile: path.join(__dirname, 'demo-tarball-hello-world/hello-world.tar'),
});
const asset2 = new assets.TarballImageAsset(stack, 'DockerImage2', {
    tarballFile: path.join(__dirname, 'demo-tarball-hello-world/hello-world.tar'),
});
const user = new iam.User(stack, 'MyUser');
asset.repository.grantPull(user);
asset2.repository.grantPull(user);
new cdk.CfnOutput(stack, 'ImageUri', { value: asset.imageUri });
new cdk.CfnOutput(stack, 'ImageUri2', { value: asset2.imageUri });
new integ_tests_1.IntegTest(app, 'LoadFromTarball', {
    testCases: [
        stack,
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXNzZXRzLXRhcmJhbGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5hc3NldHMtdGFyYmFsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3Qix3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLHNEQUFpRDtBQUNqRCxpQ0FBaUM7QUFFakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBRXpELE1BQU0sS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7SUFDL0QsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLDBDQUEwQyxDQUFDO0NBQzlFLENBQUMsQ0FBQztBQUVILE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7SUFDakUsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLDBDQUEwQyxDQUFDO0NBQzlFLENBQUMsQ0FBQztBQUVILE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDM0MsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFbEMsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDaEUsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFbEUsSUFBSSx1QkFBUyxDQUFDLEdBQUcsRUFBRSxpQkFBaUIsRUFBRTtJQUNwQyxTQUFTLEVBQUU7UUFDVCxLQUFLO0tBQ047Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0ICogYXMgYXNzZXRzIGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnaW50ZWctYXNzZXRzLXRhcmJhbGwnKTtcblxuY29uc3QgYXNzZXQgPSBuZXcgYXNzZXRzLlRhcmJhbGxJbWFnZUFzc2V0KHN0YWNrLCAnRG9ja2VySW1hZ2UnLCB7XG4gIHRhcmJhbGxGaWxlOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZGVtby10YXJiYWxsLWhlbGxvLXdvcmxkL2hlbGxvLXdvcmxkLnRhcicpLFxufSk7XG5cbmNvbnN0IGFzc2V0MiA9IG5ldyBhc3NldHMuVGFyYmFsbEltYWdlQXNzZXQoc3RhY2ssICdEb2NrZXJJbWFnZTInLCB7XG4gIHRhcmJhbGxGaWxlOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZGVtby10YXJiYWxsLWhlbGxvLXdvcmxkL2hlbGxvLXdvcmxkLnRhcicpLFxufSk7XG5cbmNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdNeVVzZXInKTtcbmFzc2V0LnJlcG9zaXRvcnkuZ3JhbnRQdWxsKHVzZXIpO1xuYXNzZXQyLnJlcG9zaXRvcnkuZ3JhbnRQdWxsKHVzZXIpO1xuXG5uZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ0ltYWdlVXJpJywgeyB2YWx1ZTogYXNzZXQuaW1hZ2VVcmkgfSk7XG5uZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ0ltYWdlVXJpMicsIHsgdmFsdWU6IGFzc2V0Mi5pbWFnZVVyaSB9KTtcblxubmV3IEludGVnVGVzdChhcHAsICdMb2FkRnJvbVRhcmJhbGwnLCB7XG4gIHRlc3RDYXNlczogW1xuICAgIHN0YWNrLFxuICBdLFxufSk7XG4iXX0=