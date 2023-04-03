"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const elasticbeanstalk = require("@aws-cdk/aws-elasticbeanstalk");
const iam = require("@aws-cdk/aws-iam");
const s3 = require("@aws-cdk/aws-s3");
const deploy = require("@aws-cdk/aws-s3-deployment");
const core_1 = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const cpactions = require("../lib");
/**
 * To validate that the deployment actually succeeds, perform the following actions:
 *
 * 1. Delete the snapshot
 * 2. Run `yarn integ --update-on-failed --no-clean`
 * 3. Navigate to CodePipeline in the console and click 'Release change'
 *      - Before releasing the change, the pipeline will show a failure because it
 *        attempts to run on creation but the elastic beanstalk environment is not yet ready
 * 4. Navigate to Elastic Beanstalk and click on the URL for the application just deployed
 *      - You should see 'Congratulations' message
 * 5. Manually delete the 'aws-cdk-codepipeline-elastic-beanstalk-deploy' stack
 */
const app = new core_1.App();
const stack = new core_1.Stack(app, 'aws-cdk-codepipeline-elastic-beanstalk-deploy');
const bucket = new s3.Bucket(stack, 'PipelineBucket', {
    versioned: true,
    removalPolicy: core_1.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
});
const artifact = new deploy.BucketDeployment(stack, 'DeployApp', {
    sources: [deploy.Source.asset(path.join(__dirname, 'assets/nodejs.zip'))],
    destinationBucket: bucket,
    extract: false,
});
const serviceRole = new iam.Role(stack, 'service-role', {
    roleName: 'codepipeline-elasticbeanstalk-action-test-serivce-role',
    assumedBy: new iam.ServicePrincipal('elasticbeanstalk.amazonaws.com'),
    managedPolicies: [
        {
            managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkEnhancedHealth',
        },
        {
            managedPolicyArn: 'arn:aws:iam::aws:policy/AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy',
        },
    ],
});
const instanceProfileRole = new iam.Role(stack, 'instance-profile-role', {
    roleName: 'codepipeline-elasticbeanstalk-action-test-instance-profile-role',
    assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    managedPolicies: [
        {
            managedPolicyArn: 'arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier',
        },
        {
            managedPolicyArn: 'arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker',
        },
        {
            managedPolicyArn: 'arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier',
        },
    ],
});
const instanceProfile = new iam.CfnInstanceProfile(stack, 'instance-profile', {
    roles: [instanceProfileRole.roleName],
    instanceProfileName: instanceProfileRole.roleName,
});
const beanstalkApp = new elasticbeanstalk.CfnApplication(stack, 'beastalk-app', {
    applicationName: 'codepipeline-test-app',
});
const beanstalkEnv = new elasticbeanstalk.CfnEnvironment(stack, 'beanstlk-env', {
    applicationName: beanstalkApp.applicationName,
    environmentName: 'codepipeline-test-env',
    solutionStackName: '64bit Amazon Linux 2 v5.5.6 running Node.js 16',
    optionSettings: [
        {
            namespace: 'aws:autoscaling:launchconfiguration',
            optionName: 'IamInstanceProfile',
            value: instanceProfile.instanceProfileName,
        },
        {
            namespace: 'aws:elasticbeanstalk:environment',
            optionName: 'ServiceRole',
            value: serviceRole.roleName,
        },
        {
            namespace: 'aws:elasticbeanstalk:environment',
            optionName: 'LoadBalancerType',
            value: 'application',
        },
        {
            namespace: 'aws:elasticbeanstalk:managedactions',
            optionName: 'ServiceRoleForManagedUpdates',
            value: 'AWSServiceRoleForElasticBeanstalkManagedUpdates',
        },
    ],
});
beanstalkEnv.addDependency(instanceProfile);
beanstalkEnv.addDependency(beanstalkApp);
const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
    artifactBucket: bucket,
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.S3SourceAction({
    actionName: 'Source',
    output: sourceOutput,
    bucket,
    bucketKey: core_1.Fn.select(0, artifact.objectKeys),
});
pipeline.addStage({
    stageName: 'Source',
    actions: [
        sourceAction,
    ],
});
const deployAction = new cpactions.ElasticBeanstalkDeployAction({
    actionName: 'Deploy',
    input: sourceOutput,
    environmentName: beanstalkEnv.environmentName,
    applicationName: beanstalkApp.applicationName,
});
pipeline.addStage({
    stageName: 'Deploy',
    actions: [
        deployAction,
    ],
});
new integ.IntegTest(app, 'codepipeline-elastic-beanstalk-deploy', {
    testCases: [stack],
    stackUpdateWorkflow: false,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWlsbmUtZWxhc3RpYy1iZWFuc3RhbGstZGVwbG95LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucGlwZWlsbmUtZWxhc3RpYy1iZWFuc3RhbGstZGVwbG95LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLDBEQUEwRDtBQUMxRCxrRUFBa0U7QUFDbEUsd0NBQXdDO0FBQ3hDLHNDQUFzQztBQUN0QyxxREFBcUQ7QUFDckQsd0NBQThEO0FBQzlELDhDQUE4QztBQUM5QyxvQ0FBb0M7QUFFcEM7Ozs7Ozs7Ozs7O0dBV0c7QUFFSCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0FBRXRCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSwrQ0FBK0MsQ0FBQyxDQUFDO0FBRTlFLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7SUFDcEQsU0FBUyxFQUFFLElBQUk7SUFDZixhQUFhLEVBQUUsb0JBQWEsQ0FBQyxPQUFPO0lBQ3BDLGlCQUFpQixFQUFFLElBQUk7Q0FDeEIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtJQUMvRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7SUFDekUsaUJBQWlCLEVBQUUsTUFBTTtJQUN6QixPQUFPLEVBQUUsS0FBSztDQUNmLENBQUMsQ0FBQztBQUVILE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFO0lBQ3RELFFBQVEsRUFBRSx3REFBd0Q7SUFDbEUsU0FBUyxFQUFFLElBQUks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QixLQUFLLEVBQUUsWUFBWTtJQUNuQixlQUFlLEVBQUUsWUFBWSxDQUFDLGVBQWdCO0lBQzlDLGVBQWUsRUFBRSxZQUFZLENBQUMsZUFBZ0I7Q0FDL0MsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUNoQixTQUFTLEVBQUUsUUFBUTtJQUNuQixPQUFPLEVBQUU7UUFDUCxZQUFZO0tBQ2I7Q0FDRixDQUFDLENBQUM7QUFFSCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLHVDQUF1QyxFQUFFO0lBQ2hFLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNsQixtQkFBbUIsRUFBRSxLQUFLO0NBQzNCLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBlbGFzdGljYmVhbnN0YWxrIGZyb20gJ0Bhd3MtY2RrL2F3cy1lbGFzdGljYmVhbnN0YWxrJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBkZXBsb3kgZnJvbSAnQGF3cy1jZGsvYXdzLXMzLWRlcGxveW1lbnQnO1xuaW1wb3J0IHsgQXBwLCBGbiwgUmVtb3ZhbFBvbGljeSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICcuLi9saWInO1xuXG4vKipcbiAqIFRvIHZhbGlkYXRlIHRoYXQgdGhlIGRlcGxveW1lbnQgYWN0dWFsbHkgc3VjY2VlZHMsIHBlcmZvcm0gdGhlIGZvbGxvd2luZyBhY3Rpb25zOlxuICpcbiAqIDEuIERlbGV0ZSB0aGUgc25hcHNob3RcbiAqIDIuIFJ1biBgeWFybiBpbnRlZyAtLXVwZGF0ZS1vbi1mYWlsZWQgLS1uby1jbGVhbmBcbiAqIDMuIE5hdmlnYXRlIHRvIENvZGVQaXBlbGluZSBpbiB0aGUgY29uc29sZSBhbmQgY2xpY2sgJ1JlbGVhc2UgY2hhbmdlJ1xuICogICAgICAtIEJlZm9yZSByZWxlYXNpbmcgdGhlIGNoYW5nZSwgdGhlIHBpcGVsaW5lIHdpbGwgc2hvdyBhIGZhaWx1cmUgYmVjYXVzZSBpdFxuICogICAgICAgIGF0dGVtcHRzIHRvIHJ1biBvbiBjcmVhdGlvbiBidXQgdGhlIGVsYXN0aWMgYmVhbnN0YWxrIGVudmlyb25tZW50IGlzIG5vdCB5ZXQgcmVhZHlcbiAqIDQuIE5hdmlnYXRlIHRvIEVsYXN0aWMgQmVhbnN0YWxrIGFuZCBjbGljayBvbiB0aGUgVVJMIGZvciB0aGUgYXBwbGljYXRpb24ganVzdCBkZXBsb3llZFxuICogICAgICAtIFlvdSBzaG91bGQgc2VlICdDb25ncmF0dWxhdGlvbnMnIG1lc3NhZ2VcbiAqIDUuIE1hbnVhbGx5IGRlbGV0ZSB0aGUgJ2F3cy1jZGstY29kZXBpcGVsaW5lLWVsYXN0aWMtYmVhbnN0YWxrLWRlcGxveScgc3RhY2tcbiAqL1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ2F3cy1jZGstY29kZXBpcGVsaW5lLWVsYXN0aWMtYmVhbnN0YWxrLWRlcGxveScpO1xuXG5jb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnUGlwZWxpbmVCdWNrZXQnLCB7XG4gIHZlcnNpb25lZDogdHJ1ZSxcbiAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbn0pO1xuXG5jb25zdCBhcnRpZmFjdCA9IG5ldyBkZXBsb3kuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0RlcGxveUFwcCcsIHtcbiAgc291cmNlczogW2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2Fzc2V0cy9ub2RlanMuemlwJykpXSxcbiAgZGVzdGluYXRpb25CdWNrZXQ6IGJ1Y2tldCxcbiAgZXh0cmFjdDogZmFsc2UsXG59KTtcblxuY29uc3Qgc2VydmljZVJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdzZXJ2aWNlLXJvbGUnLCB7XG4gIHJvbGVOYW1lOiAnY29kZXBpcGVsaW5lLWVsYXN0aWNiZWFuc3RhbGstYWN0aW9uLXRlc3Qtc2VyaXZjZS1yb2xlJyxcbiAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VsYXN0aWNiZWFuc3RhbGsuYW1hem9uYXdzLmNvbScpLFxuICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICB7XG4gICAgICBtYW5hZ2VkUG9saWN5QXJuOiAnYXJuOmF3czppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FXU0VsYXN0aWNCZWFuc3RhbGtFbmhhbmNlZEhlYWx0aCcsXG4gICAgfSxcbiAgICB7XG4gICAgICBtYW5hZ2VkUG9saWN5QXJuOiAnYXJuOmF3czppYW06OmF3czpwb2xpY3kvQVdTRWxhc3RpY0JlYW5zdGFsa01hbmFnZWRVcGRhdGVzQ3VzdG9tZXJSb2xlUG9saWN5JyxcbiAgICB9LFxuICBdLFxufSk7XG5cbmNvbnN0IGluc3RhbmNlUHJvZmlsZVJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdpbnN0YW5jZS1wcm9maWxlLXJvbGUnLCB7XG4gIHJvbGVOYW1lOiAnY29kZXBpcGVsaW5lLWVsYXN0aWNiZWFuc3RhbGstYWN0aW9uLXRlc3QtaW5zdGFuY2UtcHJvZmlsZS1yb2xlJyxcbiAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VjMi5hbWF6b25hd3MuY29tJyksXG4gIG1hbmFnZWRQb2xpY2llczogW1xuICAgIHtcbiAgICAgIG1hbmFnZWRQb2xpY3lBcm46ICdhcm46YXdzOmlhbTo6YXdzOnBvbGljeS9BV1NFbGFzdGljQmVhbnN0YWxrV2ViVGllcicsXG4gICAgfSxcbiAgICB7XG4gICAgICBtYW5hZ2VkUG9saWN5QXJuOiAnYXJuOmF3czppYW06OmF3czpwb2xpY3kvQVdTRWxhc3RpY0JlYW5zdGFsa011bHRpY29udGFpbmVyRG9ja2VyJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIG1hbmFnZWRQb2xpY3lBcm46ICdhcm46YXdzOmlhbTo6YXdzOnBvbGljeS9BV1NFbGFzdGljQmVhbnN0YWxrV29ya2VyVGllcicsXG4gICAgfSxcbiAgXSxcbn0pO1xuXG5jb25zdCBpbnN0YW5jZVByb2ZpbGUgPSBuZXcgaWFtLkNmbkluc3RhbmNlUHJvZmlsZShzdGFjaywgJ2luc3RhbmNlLXByb2ZpbGUnLCB7XG4gIHJvbGVzOiBbaW5zdGFuY2VQcm9maWxlUm9sZS5yb2xlTmFtZV0sXG4gIGluc3RhbmNlUHJvZmlsZU5hbWU6IGluc3RhbmNlUHJvZmlsZVJvbGUucm9sZU5hbWUsXG59KTtcblxuY29uc3QgYmVhbnN0YWxrQXBwID0gbmV3IGVsYXN0aWNiZWFuc3RhbGsuQ2ZuQXBwbGljYXRpb24oc3RhY2ssICdiZWFzdGFsay1hcHAnLCB7XG4gIGFwcGxpY2F0aW9uTmFtZTogJ2NvZGVwaXBlbGluZS10ZXN0LWFwcCcsXG59KTtcblxuY29uc3QgYmVhbnN0YWxrRW52ID0gbmV3IGVsYXN0aWNiZWFuc3RhbGsuQ2ZuRW52aXJvbm1lbnQoc3RhY2ssICdiZWFuc3Rsay1lbnYnLCB7XG4gIGFwcGxpY2F0aW9uTmFtZTogYmVhbnN0YWxrQXBwLmFwcGxpY2F0aW9uTmFtZSEsXG4gIGVudmlyb25tZW50TmFtZTogJ2NvZGVwaXBlbGluZS10ZXN0LWVudicsXG4gIHNvbHV0aW9uU3RhY2tOYW1lOiAnNjRiaXQgQW1hem9uIExpbnV4IDIgdjUuNS42IHJ1bm5pbmcgTm9kZS5qcyAxNicsXG4gIG9wdGlvblNldHRpbmdzOiBbXG4gICAge1xuICAgICAgbmFtZXNwYWNlOiAnYXdzOmF1dG9zY2FsaW5nOmxhdW5jaGNvbmZpZ3VyYXRpb24nLFxuICAgICAgb3B0aW9uTmFtZTogJ0lhbUluc3RhbmNlUHJvZmlsZScsXG4gICAgICB2YWx1ZTogaW5zdGFuY2VQcm9maWxlLmluc3RhbmNlUHJvZmlsZU5hbWUsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lc3BhY2U6ICdhd3M6ZWxhc3RpY2JlYW5zdGFsazplbnZpcm9ubWVudCcsXG4gICAgICBvcHRpb25OYW1lOiAnU2VydmljZVJvbGUnLFxuICAgICAgdmFsdWU6IHNlcnZpY2VSb2xlLnJvbGVOYW1lLFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZXNwYWNlOiAnYXdzOmVsYXN0aWNiZWFuc3RhbGs6ZW52aXJvbm1lbnQnLFxuICAgICAgb3B0aW9uTmFtZTogJ0xvYWRCYWxhbmNlclR5cGUnLFxuICAgICAgdmFsdWU6ICdhcHBsaWNhdGlvbicsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lc3BhY2U6ICdhd3M6ZWxhc3RpY2JlYW5zdGFsazptYW5hZ2VkYWN0aW9ucycsXG4gICAgICBvcHRpb25OYW1lOiAnU2VydmljZVJvbGVGb3JNYW5hZ2VkVXBkYXRlcycsXG4gICAgICB2YWx1ZTogJ0FXU1NlcnZpY2VSb2xlRm9yRWxhc3RpY0JlYW5zdGFsa01hbmFnZWRVcGRhdGVzJyxcbiAgICB9LFxuICBdLFxufSk7XG5cbmJlYW5zdGFsa0Vudi5hZGREZXBlbmRlbmN5KGluc3RhbmNlUHJvZmlsZSk7XG5iZWFuc3RhbGtFbnYuYWRkRGVwZW5kZW5jeShiZWFuc3RhbGtBcHApO1xuXG5jb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgYXJ0aWZhY3RCdWNrZXQ6IGJ1Y2tldCxcbn0pO1xuXG5jb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdTb3VyY2VBcnRpZmFjdCcpO1xuY29uc3Qgc291cmNlQWN0aW9uID0gbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgYnVja2V0LFxuICBidWNrZXRLZXk6IEZuLnNlbGVjdCgwLCBhcnRpZmFjdC5vYmplY3RLZXlzKSxcbn0pO1xuXG5waXBlbGluZS5hZGRTdGFnZSh7XG4gIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gIGFjdGlvbnM6IFtcbiAgICBzb3VyY2VBY3Rpb24sXG4gIF0sXG59KTtcblxuY29uc3QgZGVwbG95QWN0aW9uID0gbmV3IGNwYWN0aW9ucy5FbGFzdGljQmVhbnN0YWxrRGVwbG95QWN0aW9uKHtcbiAgYWN0aW9uTmFtZTogJ0RlcGxveScsXG4gIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gIGVudmlyb25tZW50TmFtZTogYmVhbnN0YWxrRW52LmVudmlyb25tZW50TmFtZSEsXG4gIGFwcGxpY2F0aW9uTmFtZTogYmVhbnN0YWxrQXBwLmFwcGxpY2F0aW9uTmFtZSEsXG59KTtcblxucGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICBzdGFnZU5hbWU6ICdEZXBsb3knLFxuICBhY3Rpb25zOiBbXG4gICAgZGVwbG95QWN0aW9uLFxuICBdLFxufSk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnY29kZXBpcGVsaW5lLWVsYXN0aWMtYmVhbnN0YWxrLWRlcGxveScsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxuICBzdGFja1VwZGF0ZVdvcmtmbG93OiBmYWxzZSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==