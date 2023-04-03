"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const s3 = require("../lib");
class TestStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const bucket = new s3.Bucket(this, 'MyBucket', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        new cdk.CfnOutput(this, 'BucketURL', { value: bucket.bucketWebsiteUrl });
        new cdk.CfnOutput(this, 'ObjectURL', { value: bucket.urlForObject('myfolder/myfile.txt') });
        new cdk.CfnOutput(this, 'VirtualHostedObjectURL', { value: bucket.virtualHostedUrlForObject('myfolder/myfile.txt') });
        new cdk.CfnOutput(this, 'VirtualHostedObjectURLNonRegional', { value: bucket.virtualHostedUrlForObject('myfolder/myfile.txt', { regional: false }) });
        new cdk.CfnOutput(this, 'S3ObjectURL', { value: bucket.s3UrlForObject('myfolder/myfile.txt') });
    }
}
const app = new cdk.App();
new integ_tests_1.IntegTest(app, 'cdk-integ-s3-urls', {
    testCases: [new TestStack(app, 'aws-cdk-s3-urls')],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnVja2V0LnVybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmJ1Y2tldC51cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBcUM7QUFDckMsc0RBQWlEO0FBQ2pELDZCQUE2QjtBQUU3QixNQUFNLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQixZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDN0MsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztTQUN6QyxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1FBQ3pFLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUYsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMseUJBQXlCLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxtQ0FBbUMsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMseUJBQXlCLENBQUMscUJBQXFCLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEosSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNqRztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSx1QkFBUyxDQUFDLEdBQUcsRUFBRSxtQkFBbUIsRUFBRTtJQUN0QyxTQUFTLEVBQUUsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztDQUNuRCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdNeUJ1Y2tldCcsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQnVja2V0VVJMJywgeyB2YWx1ZTogYnVja2V0LmJ1Y2tldFdlYnNpdGVVcmwgfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ09iamVjdFVSTCcsIHsgdmFsdWU6IGJ1Y2tldC51cmxGb3JPYmplY3QoJ215Zm9sZGVyL215ZmlsZS50eHQnKSB9KTtcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnVmlydHVhbEhvc3RlZE9iamVjdFVSTCcsIHsgdmFsdWU6IGJ1Y2tldC52aXJ0dWFsSG9zdGVkVXJsRm9yT2JqZWN0KCdteWZvbGRlci9teWZpbGUudHh0JykgfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1ZpcnR1YWxIb3N0ZWRPYmplY3RVUkxOb25SZWdpb25hbCcsIHsgdmFsdWU6IGJ1Y2tldC52aXJ0dWFsSG9zdGVkVXJsRm9yT2JqZWN0KCdteWZvbGRlci9teWZpbGUudHh0JywgeyByZWdpb25hbDogZmFsc2UgfSkgfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1MzT2JqZWN0VVJMJywgeyB2YWx1ZTogYnVja2V0LnMzVXJsRm9yT2JqZWN0KCdteWZvbGRlci9teWZpbGUudHh0JykgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxubmV3IEludGVnVGVzdChhcHAsICdjZGstaW50ZWctczMtdXJscycsIHtcbiAgdGVzdENhc2VzOiBbbmV3IFRlc3RTdGFjayhhcHAsICdhd3MtY2RrLXMzLXVybHMnKV0sXG59KTsiXX0=