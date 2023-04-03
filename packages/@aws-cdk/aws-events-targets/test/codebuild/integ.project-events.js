#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codebuild = require("@aws-cdk/aws-codebuild");
const codecommit = require("@aws-cdk/aws-codecommit");
const events = require("@aws-cdk/aws-events");
const sns = require("@aws-cdk/aws-sns");
const subs = require("@aws-cdk/aws-sns-subscriptions");
const sqs = require("@aws-cdk/aws-sqs");
const cdk = require("@aws-cdk/core");
const targets = require("../../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codebuild-events');
const repo = new codecommit.Repository(stack, 'MyRepo', {
    repositoryName: 'aws-cdk-codebuild-events',
});
const project = new codebuild.Project(stack, 'MyProject', {
    source: codebuild.Source.codeCommit({ repository: repo }),
});
const queue = new sqs.Queue(stack, 'MyQueue');
const deadLetterQueue = new sqs.Queue(stack, 'DeadLetterQueue');
const topic = new sns.Topic(stack, 'MyTopic');
topic.addSubscription(new subs.SqsSubscription(queue));
// this will send an email with the JSON event for every state change of this
// build project.
project.onStateChange('StateChange', { target: new targets.SnsTopic(topic) });
// this will send an email with the message "Build phase changed to <phase>".
// The phase will be extracted from the "completed-phase" field of the event
// details.
project.onPhaseChange('PhaseChange', {
    target: new targets.SnsTopic(topic, {
        message: events.RuleTargetInput.fromText(`Build phase changed to ${codebuild.PhaseChangeEvent.completedPhase}`),
    }),
});
// trigger a build when a commit is pushed to the repo
const onCommitRule = repo.onCommit('OnCommit', {
    target: new targets.CodeBuildProject(project, {
        deadLetterQueue: deadLetterQueue,
        maxEventAge: cdk.Duration.hours(2),
        retryAttempts: 2,
    }),
    branches: ['master'],
});
onCommitRule.addTarget(new targets.SnsTopic(topic, {
    message: events.RuleTargetInput.fromText(`A commit was pushed to the repository ${codecommit.ReferenceEvent.repositoryName} on branch ${codecommit.ReferenceEvent.referenceName}`),
}));
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHJvamVjdC1ldmVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5wcm9qZWN0LWV2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxvREFBb0Q7QUFDcEQsc0RBQXNEO0FBQ3RELDhDQUE4QztBQUM5Qyx3Q0FBd0M7QUFDeEMsdURBQXVEO0FBQ3ZELHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFDckMscUNBQXFDO0FBRXJDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztBQUU3RCxNQUFNLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtJQUN0RCxjQUFjLEVBQUUsMEJBQTBCO0NBQzNDLENBQUMsQ0FBQztBQUNILE1BQU0sT0FBTyxHQUFHLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO0lBQ3hELE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQztDQUMxRCxDQUFDLENBQUM7QUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sZUFBZSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUVoRSxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzlDLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFFdkQsNkVBQTZFO0FBQzdFLGlCQUFpQjtBQUNqQixPQUFPLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBRTlFLDZFQUE2RTtBQUM3RSw0RUFBNEU7QUFDNUUsV0FBVztBQUNYLE9BQU8sQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFO0lBQ25DLE1BQU0sRUFBRSxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO1FBQ2xDLE9BQU8sRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQywwQkFBMEIsU0FBUyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQ2hILENBQUM7Q0FDSCxDQUFDLENBQUM7QUFFSCxzREFBc0Q7QUFDdEQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7SUFDN0MsTUFBTSxFQUFFLElBQUksT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRTtRQUM1QyxlQUFlLEVBQUUsZUFBZTtRQUNoQyxXQUFXLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLGFBQWEsRUFBRSxDQUFDO0tBQ2pCLENBQUM7SUFDRixRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUM7Q0FDckIsQ0FBQyxDQUFDO0FBRUgsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO0lBQ2pELE9BQU8sRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FDdEMseUNBQXlDLFVBQVUsQ0FBQyxjQUFjLENBQUMsY0FBYyxjQUFjLFVBQVUsQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLENBQ3pJO0NBQ0YsQ0FBQyxDQUFDLENBQUM7QUFFSixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVidWlsZCc7XG5pbXBvcnQgKiBhcyBjb2RlY29tbWl0IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlY29tbWl0JztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zJztcbmltcG9ydCAqIGFzIHN1YnMgZnJvbSAnQGF3cy1jZGsvYXdzLXNucy1zdWJzY3JpcHRpb25zJztcbmltcG9ydCAqIGFzIHNxcyBmcm9tICdAYXdzLWNkay9hd3Mtc3FzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHRhcmdldHMgZnJvbSAnLi4vLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY29kZWJ1aWxkLWV2ZW50cycpO1xuXG5jb25zdCByZXBvID0gbmV3IGNvZGVjb21taXQuUmVwb3NpdG9yeShzdGFjaywgJ015UmVwbycsIHtcbiAgcmVwb3NpdG9yeU5hbWU6ICdhd3MtY2RrLWNvZGVidWlsZC1ldmVudHMnLFxufSk7XG5jb25zdCBwcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jywge1xuICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuY29kZUNvbW1pdCh7IHJlcG9zaXRvcnk6IHJlcG8gfSksXG59KTtcblxuY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnTXlRdWV1ZScpO1xuY29uc3QgZGVhZExldHRlclF1ZXVlID0gbmV3IHNxcy5RdWV1ZShzdGFjaywgJ0RlYWRMZXR0ZXJRdWV1ZScpO1xuXG5jb25zdCB0b3BpYyA9IG5ldyBzbnMuVG9waWMoc3RhY2ssICdNeVRvcGljJyk7XG50b3BpYy5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuU3FzU3Vic2NyaXB0aW9uKHF1ZXVlKSk7XG5cbi8vIHRoaXMgd2lsbCBzZW5kIGFuIGVtYWlsIHdpdGggdGhlIEpTT04gZXZlbnQgZm9yIGV2ZXJ5IHN0YXRlIGNoYW5nZSBvZiB0aGlzXG4vLyBidWlsZCBwcm9qZWN0LlxucHJvamVjdC5vblN0YXRlQ2hhbmdlKCdTdGF0ZUNoYW5nZScsIHsgdGFyZ2V0OiBuZXcgdGFyZ2V0cy5TbnNUb3BpYyh0b3BpYykgfSk7XG5cbi8vIHRoaXMgd2lsbCBzZW5kIGFuIGVtYWlsIHdpdGggdGhlIG1lc3NhZ2UgXCJCdWlsZCBwaGFzZSBjaGFuZ2VkIHRvIDxwaGFzZT5cIi5cbi8vIFRoZSBwaGFzZSB3aWxsIGJlIGV4dHJhY3RlZCBmcm9tIHRoZSBcImNvbXBsZXRlZC1waGFzZVwiIGZpZWxkIG9mIHRoZSBldmVudFxuLy8gZGV0YWlscy5cbnByb2plY3Qub25QaGFzZUNoYW5nZSgnUGhhc2VDaGFuZ2UnLCB7XG4gIHRhcmdldDogbmV3IHRhcmdldHMuU25zVG9waWModG9waWMsIHtcbiAgICBtZXNzYWdlOiBldmVudHMuUnVsZVRhcmdldElucHV0LmZyb21UZXh0KGBCdWlsZCBwaGFzZSBjaGFuZ2VkIHRvICR7Y29kZWJ1aWxkLlBoYXNlQ2hhbmdlRXZlbnQuY29tcGxldGVkUGhhc2V9YCksXG4gIH0pLFxufSk7XG5cbi8vIHRyaWdnZXIgYSBidWlsZCB3aGVuIGEgY29tbWl0IGlzIHB1c2hlZCB0byB0aGUgcmVwb1xuY29uc3Qgb25Db21taXRSdWxlID0gcmVwby5vbkNvbW1pdCgnT25Db21taXQnLCB7XG4gIHRhcmdldDogbmV3IHRhcmdldHMuQ29kZUJ1aWxkUHJvamVjdChwcm9qZWN0LCB7XG4gICAgZGVhZExldHRlclF1ZXVlOiBkZWFkTGV0dGVyUXVldWUsXG4gICAgbWF4RXZlbnRBZ2U6IGNkay5EdXJhdGlvbi5ob3VycygyKSxcbiAgICByZXRyeUF0dGVtcHRzOiAyLFxuICB9KSxcbiAgYnJhbmNoZXM6IFsnbWFzdGVyJ10sXG59KTtcblxub25Db21taXRSdWxlLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5TbnNUb3BpYyh0b3BpYywge1xuICBtZXNzYWdlOiBldmVudHMuUnVsZVRhcmdldElucHV0LmZyb21UZXh0KFxuICAgIGBBIGNvbW1pdCB3YXMgcHVzaGVkIHRvIHRoZSByZXBvc2l0b3J5ICR7Y29kZWNvbW1pdC5SZWZlcmVuY2VFdmVudC5yZXBvc2l0b3J5TmFtZX0gb24gYnJhbmNoICR7Y29kZWNvbW1pdC5SZWZlcmVuY2VFdmVudC5yZWZlcmVuY2VOYW1lfWAsXG4gICksXG59KSk7XG5cbmFwcC5zeW50aCgpO1xuIl19