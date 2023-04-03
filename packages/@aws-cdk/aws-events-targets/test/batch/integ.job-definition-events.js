"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const batch = require("@aws-cdk/aws-batch");
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const events = require("@aws-cdk/aws-events");
const sqs = require("@aws-cdk/aws-sqs");
const cdk = require("@aws-cdk/core");
const targets = require("../../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'batch-events');
const queue = new batch.JobQueue(stack, 'MyQueue', {
    computeEnvironments: [
        {
            computeEnvironment: new batch.ComputeEnvironment(stack, 'ComputeEnvironment', {
                managed: false,
            }),
            order: 1,
        },
    ],
});
const job = new batch.JobDefinition(stack, 'MyJob', {
    container: {
        image: aws_ecs_1.ContainerImage.fromRegistry('test-repo'),
    },
});
const timer = new events.Rule(stack, 'Timer', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});
timer.addTarget(new targets.BatchJob(queue.jobQueueArn, queue, job.jobDefinitionArn, job));
const timer2 = new events.Rule(stack, 'Timer2', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
});
const dlq = new sqs.Queue(stack, 'Queue');
timer2.addTarget(new targets.BatchJob(queue.jobQueueArn, queue, job.jobDefinitionArn, job, {
    deadLetterQueue: dlq,
    retryAttempts: 2,
    maxEventAge: cdk.Duration.hours(2),
}));
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuam9iLWRlZmluaXRpb24tZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuam9iLWRlZmluaXRpb24tZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQTRDO0FBQzVDLDhDQUFrRDtBQUNsRCw4Q0FBOEM7QUFDOUMsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyxxQ0FBcUM7QUFFckMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUVqRCxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtJQUNqRCxtQkFBbUIsRUFBRTtRQUNuQjtZQUNFLGtCQUFrQixFQUFFLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxvQkFBb0IsRUFBRTtnQkFDNUUsT0FBTyxFQUFFLEtBQUs7YUFDZixDQUFDO1lBQ0YsS0FBSyxFQUFFLENBQUM7U0FDVDtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7SUFDbEQsU0FBUyxFQUFFO1FBQ1QsS0FBSyxFQUFFLHdCQUFjLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztLQUNoRDtDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO0lBQzVDLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN4RCxDQUFDLENBQUM7QUFDSCxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUUzRixNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtJQUM5QyxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDeEQsQ0FBQyxDQUFDO0FBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUUxQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO0lBQ3pGLGVBQWUsRUFBRSxHQUFHO0lBQ3BCLGFBQWEsRUFBRSxDQUFDO0lBQ2hCLFdBQVcsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Q0FDbkMsQ0FBQyxDQUFDLENBQUM7QUFFSixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBiYXRjaCBmcm9tICdAYXdzLWNkay9hd3MtYmF0Y2gnO1xuaW1wb3J0IHsgQ29udGFpbmVySW1hZ2UgfSBmcm9tICdAYXdzLWNkay9hd3MtZWNzJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIHNxcyBmcm9tICdAYXdzLWNkay9hd3Mtc3FzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHRhcmdldHMgZnJvbSAnLi4vLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2JhdGNoLWV2ZW50cycpO1xuXG5jb25zdCBxdWV1ZSA9IG5ldyBiYXRjaC5Kb2JRdWV1ZShzdGFjaywgJ015UXVldWUnLCB7XG4gIGNvbXB1dGVFbnZpcm9ubWVudHM6IFtcbiAgICB7XG4gICAgICBjb21wdXRlRW52aXJvbm1lbnQ6IG5ldyBiYXRjaC5Db21wdXRlRW52aXJvbm1lbnQoc3RhY2ssICdDb21wdXRlRW52aXJvbm1lbnQnLCB7XG4gICAgICAgIG1hbmFnZWQ6IGZhbHNlLFxuICAgICAgfSksXG4gICAgICBvcmRlcjogMSxcbiAgICB9LFxuICBdLFxufSk7XG5jb25zdCBqb2IgPSBuZXcgYmF0Y2guSm9iRGVmaW5pdGlvbihzdGFjaywgJ015Sm9iJywge1xuICBjb250YWluZXI6IHtcbiAgICBpbWFnZTogQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0LXJlcG8nKSxcbiAgfSxcbn0pO1xuXG5jb25zdCB0aW1lciA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1RpbWVyJywge1xuICBzY2hlZHVsZTogZXZlbnRzLlNjaGVkdWxlLnJhdGUoY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMSkpLFxufSk7XG50aW1lci5hZGRUYXJnZXQobmV3IHRhcmdldHMuQmF0Y2hKb2IocXVldWUuam9iUXVldWVBcm4sIHF1ZXVlLCBqb2Iuam9iRGVmaW5pdGlvbkFybiwgam9iKSk7XG5cbmNvbnN0IHRpbWVyMiA9IG5ldyBldmVudHMuUnVsZShzdGFjaywgJ1RpbWVyMicsIHtcbiAgc2NoZWR1bGU6IGV2ZW50cy5TY2hlZHVsZS5yYXRlKGNkay5EdXJhdGlvbi5taW51dGVzKDIpKSxcbn0pO1xuXG5jb25zdCBkbHEgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnUXVldWUnKTtcblxudGltZXIyLmFkZFRhcmdldChuZXcgdGFyZ2V0cy5CYXRjaEpvYihxdWV1ZS5qb2JRdWV1ZUFybiwgcXVldWUsIGpvYi5qb2JEZWZpbml0aW9uQXJuLCBqb2IsIHtcbiAgZGVhZExldHRlclF1ZXVlOiBkbHEsXG4gIHJldHJ5QXR0ZW1wdHM6IDIsXG4gIG1heEV2ZW50QWdlOiBjZGsuRHVyYXRpb24uaG91cnMoMiksXG59KSk7XG5cbmFwcC5zeW50aCgpO1xuIl19