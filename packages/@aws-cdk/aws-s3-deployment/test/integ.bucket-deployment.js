"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ec2 = require("@aws-cdk/aws-ec2");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const s3deploy = require("../lib");
class TestBucketDeployment extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const destinationBucket = new s3.Bucket(this, 'Destination', {
            websiteIndexDocument: 'index.html',
            publicReadAccess: false,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        new s3deploy.BucketDeployment(this, 'DeployMe', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
            destinationBucket,
            retainOnDelete: false,
        });
        new s3deploy.BucketDeployment(this, 'DeployMeWithEfsStorage', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
            destinationBucket,
            destinationKeyPrefix: 'efs/',
            useEfs: true,
            vpc: new ec2.Vpc(this, 'InlineVpc'),
            retainOnDelete: false,
        });
        const bucket2 = new s3.Bucket(this, 'Destination2', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        new s3deploy.BucketDeployment(this, 'DeployWithPrefix', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
            destinationBucket: bucket2,
            destinationKeyPrefix: 'deploy/here/',
            retainOnDelete: false,
        });
        const bucket3 = new s3.Bucket(this, 'Destination3', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        new s3deploy.BucketDeployment(this, 'DeployWithMetadata', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
            destinationBucket: bucket3,
            retainOnDelete: false,
            cacheControl: [s3deploy.CacheControl.setPublic(), s3deploy.CacheControl.maxAge(cdk.Duration.minutes(1))],
            contentType: 'text/html',
            metadata: { A: 'aaa', B: 'bbb', C: 'ccc' },
        });
        new s3deploy.BucketDeployment(this, 'DeployMeWithoutDeletingFilesOnDestination', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
            destinationBucket,
            prune: false,
            retainOnDelete: false,
        });
        new s3deploy.BucketDeployment(this, 'DeployMeWithExcludedFilesOnDestination', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
            destinationBucket,
            exclude: ['*.gif'],
            retainOnDelete: false,
        });
        const bucket4 = new s3.Bucket(this, 'Destination4', {
            publicReadAccess: false,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        new s3deploy.BucketDeployment(this, 'DeployMeWithoutExtractingFilesOnDestination', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
            destinationBucket: bucket4,
            extract: false,
            retainOnDelete: false,
        });
        this.bucket5 = new s3.Bucket(this, 'Destination5', {
            publicReadAccess: false,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        const deploy5 = new s3deploy.BucketDeployment(this, 'DeployMe5', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website-second'))],
            destinationBucket: this.bucket5,
            retainOnDelete: false,
        });
        deploy5.addSource(s3deploy.Source.data('some-key', 'helloworld'));
    }
}
const app = new cdk.App();
const testCase = new TestBucketDeployment(app, 'test-bucket-deployments-2');
// Assert that DeployMeWithoutExtractingFilesOnDestination deploys a zip file to bucket4
const integTest = new integ.IntegTest(app, 'integ-test-bucket-deployments', {
    testCases: [testCase],
});
const listObjectsCall = integTest.assertions.awsApiCall('S3', 'listObjects', {
    Bucket: testCase.bucket5.bucketName,
});
listObjectsCall.provider.addToRolePolicy({
    Effect: 'Allow',
    Action: ['s3:GetObject', 's3:ListBucket'],
    Resource: ['*'],
});
listObjectsCall.expect(integ.ExpectedResult.objectLike({
    Contents: integ_tests_1.Match.arrayWith([
        integ_tests_1.Match.objectLike({
            Key: '403.html',
        }),
        integ_tests_1.Match.objectLike({
            Key: 'some-key',
        }),
    ]),
}));
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnVja2V0LWRlcGxveW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5idWNrZXQtZGVwbG95bWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3Qix3Q0FBd0M7QUFDeEMsc0NBQXNDO0FBQ3RDLHFDQUFxQztBQUNyQyw4Q0FBOEM7QUFDOUMsc0RBQTZDO0FBRTdDLG1DQUFtQztBQUVuQyxNQUFNLG9CQUFxQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBRTFDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUMzRCxvQkFBb0IsRUFBRSxZQUFZO1lBQ2xDLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztZQUN4QyxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztRQUVILElBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDOUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNwRSxpQkFBaUI7WUFDakIsY0FBYyxFQUFFLEtBQUs7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUFFO1lBQzVELE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDcEUsaUJBQWlCO1lBQ2pCLG9CQUFvQixFQUFFLE1BQU07WUFDNUIsTUFBTSxFQUFFLElBQUk7WUFDWixHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUM7WUFDbkMsY0FBYyxFQUFFLEtBQUs7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDbEQsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztZQUN4QyxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztRQUVILElBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUN0RCxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLGlCQUFpQixFQUFFLE9BQU87WUFDMUIsb0JBQW9CLEVBQUUsY0FBYztZQUNwQyxjQUFjLEVBQUUsS0FBSztTQUN0QixDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNsRCxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1lBQ3hDLGlCQUFpQixFQUFFLElBQUk7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQ3hELE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDcEUsaUJBQWlCLEVBQUUsT0FBTztZQUMxQixjQUFjLEVBQUUsS0FBSztZQUNyQixZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEcsV0FBVyxFQUFFLFdBQVc7WUFDeEIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUU7U0FDM0MsQ0FBQyxDQUFDO1FBRUgsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLDJDQUEyQyxFQUFFO1lBQy9FLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDcEUsaUJBQWlCO1lBQ2pCLEtBQUssRUFBRSxLQUFLO1lBQ1osY0FBYyxFQUFFLEtBQUs7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLHdDQUF3QyxFQUFFO1lBQzVFLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDcEUsaUJBQWlCO1lBQ2pCLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQztZQUNsQixjQUFjLEVBQUUsS0FBSztTQUN0QixDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNsRCxnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7UUFFSCxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsNkNBQTZDLEVBQUU7WUFDakYsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNwRSxpQkFBaUIsRUFBRSxPQUFPO1lBQzFCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsY0FBYyxFQUFFLEtBQUs7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNqRCxnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQy9ELE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLG1CQUFtQixDQUFDLENBQUMsQ0FBQztZQUMzRSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsT0FBTztZQUMvQixjQUFjLEVBQUUsS0FBSztTQUN0QixDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO0tBQ25FO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLFFBQVEsR0FBRyxJQUFJLG9CQUFvQixDQUFDLEdBQUcsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO0FBRTVFLHdGQUF3RjtBQUN4RixNQUFNLFNBQVMsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLCtCQUErQixFQUFFO0lBQzFFLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztDQUN0QixDQUFDLENBQUM7QUFDSCxNQUFNLGVBQWUsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO0lBQzNFLE1BQU0sRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVU7Q0FDcEMsQ0FBQyxDQUFDO0FBQ0gsZUFBZSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUM7SUFDdkMsTUFBTSxFQUFFLE9BQU87SUFDZixNQUFNLEVBQUUsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDO0lBQ3pDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQztDQUNoQixDQUFDLENBQUM7QUFDSCxlQUFlLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDO0lBQ3JELFFBQVEsRUFBRSxtQkFBSyxDQUFDLFNBQVMsQ0FDdkI7UUFDRSxtQkFBSyxDQUFDLFVBQVUsQ0FBQztZQUNmLEdBQUcsRUFBRSxVQUFVO1NBQ2hCLENBQUM7UUFDRixtQkFBSyxDQUFDLFVBQVUsQ0FBQztZQUNmLEdBQUcsRUFBRSxVQUFVO1NBQ2hCLENBQUM7S0FDSCxDQUNGO0NBQ0YsQ0FBQyxDQUFDLENBQUM7QUFFSixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCB7IE1hdGNoIH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBzM2RlcGxveSBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBUZXN0QnVja2V0RGVwbG95bWVudCBleHRlbmRzIGNkay5TdGFjayB7XG4gIHB1YmxpYyByZWFkb25seSBidWNrZXQ1OiBzMy5JQnVja2V0O1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBkZXN0aW5hdGlvbkJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ0Rlc3RpbmF0aW9uJywge1xuICAgICAgd2Vic2l0ZUluZGV4RG9jdW1lbnQ6ICdpbmRleC5odG1sJyxcbiAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IGZhbHNlLFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLCAvLyBuZWVkZWQgZm9yIGludGVncmF0aW9uIHRlc3QgY2xlYW51cFxuICAgIH0pO1xuXG4gICAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcywgJ0RlcGxveU1lJywge1xuICAgICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZScpKV0sXG4gICAgICBkZXN0aW5hdGlvbkJ1Y2tldCxcbiAgICAgIHJldGFpbk9uRGVsZXRlOiBmYWxzZSwgLy8gZGVmYXVsdCBpcyB0cnVlLCB3aGljaCB3aWxsIGJsb2NrIHRoZSBpbnRlZ3JhdGlvbiB0ZXN0IGNsZWFudXBcbiAgICB9KTtcblxuICAgIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHRoaXMsICdEZXBsb3lNZVdpdGhFZnNTdG9yYWdlJywge1xuICAgICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZScpKV0sXG4gICAgICBkZXN0aW5hdGlvbkJ1Y2tldCxcbiAgICAgIGRlc3RpbmF0aW9uS2V5UHJlZml4OiAnZWZzLycsXG4gICAgICB1c2VFZnM6IHRydWUsXG4gICAgICB2cGM6IG5ldyBlYzIuVnBjKHRoaXMsICdJbmxpbmVWcGMnKSxcbiAgICAgIHJldGFpbk9uRGVsZXRlOiBmYWxzZSwgLy8gZGVmYXVsdCBpcyB0cnVlLCB3aGljaCB3aWxsIGJsb2NrIHRoZSBpbnRlZ3JhdGlvbiB0ZXN0IGNsZWFudXBcbiAgICB9KTtcblxuICAgIGNvbnN0IGJ1Y2tldDIgPSBuZXcgczMuQnVja2V0KHRoaXMsICdEZXN0aW5hdGlvbjInLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsIC8vIG5lZWRlZCBmb3IgaW50ZWdyYXRpb24gdGVzdCBjbGVhbnVwXG4gICAgfSk7XG5cbiAgICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudCh0aGlzLCAnRGVwbG95V2l0aFByZWZpeCcsIHtcbiAgICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IGJ1Y2tldDIsXG4gICAgICBkZXN0aW5hdGlvbktleVByZWZpeDogJ2RlcGxveS9oZXJlLycsXG4gICAgICByZXRhaW5PbkRlbGV0ZTogZmFsc2UsIC8vIGRlZmF1bHQgaXMgdHJ1ZSwgd2hpY2ggd2lsbCBibG9jayB0aGUgaW50ZWdyYXRpb24gdGVzdCBjbGVhbnVwXG4gICAgfSk7XG5cbiAgICBjb25zdCBidWNrZXQzID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnRGVzdGluYXRpb24zJywge1xuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLCAvLyBuZWVkZWQgZm9yIGludGVncmF0aW9uIHRlc3QgY2xlYW51cFxuICAgIH0pO1xuXG4gICAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcywgJ0RlcGxveVdpdGhNZXRhZGF0YScsIHtcbiAgICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IGJ1Y2tldDMsXG4gICAgICByZXRhaW5PbkRlbGV0ZTogZmFsc2UsIC8vIGRlZmF1bHQgaXMgdHJ1ZSwgd2hpY2ggd2lsbCBibG9jayB0aGUgaW50ZWdyYXRpb24gdGVzdCBjbGVhbnVwXG4gICAgICBjYWNoZUNvbnRyb2w6IFtzM2RlcGxveS5DYWNoZUNvbnRyb2wuc2V0UHVibGljKCksIHMzZGVwbG95LkNhY2hlQ29udHJvbC5tYXhBZ2UoY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMSkpXSxcbiAgICAgIGNvbnRlbnRUeXBlOiAndGV4dC9odG1sJyxcbiAgICAgIG1ldGFkYXRhOiB7IEE6ICdhYWEnLCBCOiAnYmJiJywgQzogJ2NjYycgfSxcbiAgICB9KTtcblxuICAgIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHRoaXMsICdEZXBsb3lNZVdpdGhvdXREZWxldGluZ0ZpbGVzT25EZXN0aW5hdGlvbicsIHtcbiAgICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgICAgZGVzdGluYXRpb25CdWNrZXQsXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgICByZXRhaW5PbkRlbGV0ZTogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudCh0aGlzLCAnRGVwbG95TWVXaXRoRXhjbHVkZWRGaWxlc09uRGVzdGluYXRpb24nLCB7XG4gICAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlJykpXSxcbiAgICAgIGRlc3RpbmF0aW9uQnVja2V0LFxuICAgICAgZXhjbHVkZTogWycqLmdpZiddLFxuICAgICAgcmV0YWluT25EZWxldGU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYnVja2V0NCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ0Rlc3RpbmF0aW9uNCcsIHtcbiAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IGZhbHNlLFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLCAvLyBuZWVkZWQgZm9yIGludGVncmF0aW9uIHRlc3QgY2xlYW51cFxuICAgIH0pO1xuXG4gICAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcywgJ0RlcGxveU1lV2l0aG91dEV4dHJhY3RpbmdGaWxlc09uRGVzdGluYXRpb24nLCB7XG4gICAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlJykpXSxcbiAgICAgIGRlc3RpbmF0aW9uQnVja2V0OiBidWNrZXQ0LFxuICAgICAgZXh0cmFjdDogZmFsc2UsXG4gICAgICByZXRhaW5PbkRlbGV0ZTogZmFsc2UsXG4gICAgfSk7XG5cbiAgICB0aGlzLmJ1Y2tldDUgPSBuZXcgczMuQnVja2V0KHRoaXMsICdEZXN0aW5hdGlvbjUnLCB7XG4gICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSwgLy8gbmVlZGVkIGZvciBpbnRlZ3JhdGlvbiB0ZXN0IGNsZWFudXBcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlcGxveTUgPSBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudCh0aGlzLCAnRGVwbG95TWU1Jywge1xuICAgICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZS1zZWNvbmQnKSldLFxuICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IHRoaXMuYnVja2V0NSxcbiAgICAgIHJldGFpbk9uRGVsZXRlOiBmYWxzZSwgLy8gZGVmYXVsdCBpcyB0cnVlLCB3aGljaCB3aWxsIGJsb2NrIHRoZSBpbnRlZ3JhdGlvbiB0ZXN0IGNsZWFudXBcbiAgICB9KTtcbiAgICBkZXBsb3k1LmFkZFNvdXJjZShzM2RlcGxveS5Tb3VyY2UuZGF0YSgnc29tZS1rZXknLCAnaGVsbG93b3JsZCcpKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3QgdGVzdENhc2UgPSBuZXcgVGVzdEJ1Y2tldERlcGxveW1lbnQoYXBwLCAndGVzdC1idWNrZXQtZGVwbG95bWVudHMtMicpO1xuXG4vLyBBc3NlcnQgdGhhdCBEZXBsb3lNZVdpdGhvdXRFeHRyYWN0aW5nRmlsZXNPbkRlc3RpbmF0aW9uIGRlcGxveXMgYSB6aXAgZmlsZSB0byBidWNrZXQ0XG5jb25zdCBpbnRlZ1Rlc3QgPSBuZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ2ludGVnLXRlc3QtYnVja2V0LWRlcGxveW1lbnRzJywge1xuICB0ZXN0Q2FzZXM6IFt0ZXN0Q2FzZV0sXG59KTtcbmNvbnN0IGxpc3RPYmplY3RzQ2FsbCA9IGludGVnVGVzdC5hc3NlcnRpb25zLmF3c0FwaUNhbGwoJ1MzJywgJ2xpc3RPYmplY3RzJywge1xuICBCdWNrZXQ6IHRlc3RDYXNlLmJ1Y2tldDUuYnVja2V0TmFtZSxcbn0pO1xubGlzdE9iamVjdHNDYWxsLnByb3ZpZGVyLmFkZFRvUm9sZVBvbGljeSh7XG4gIEVmZmVjdDogJ0FsbG93JyxcbiAgQWN0aW9uOiBbJ3MzOkdldE9iamVjdCcsICdzMzpMaXN0QnVja2V0J10sXG4gIFJlc291cmNlOiBbJyonXSxcbn0pO1xubGlzdE9iamVjdHNDYWxsLmV4cGVjdChpbnRlZy5FeHBlY3RlZFJlc3VsdC5vYmplY3RMaWtlKHtcbiAgQ29udGVudHM6IE1hdGNoLmFycmF5V2l0aChcbiAgICBbXG4gICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgS2V5OiAnNDAzLmh0bWwnLFxuICAgICAgfSksXG4gICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgS2V5OiAnc29tZS1rZXknLFxuICAgICAgfSksXG4gICAgXSxcbiAgKSxcbn0pKTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=