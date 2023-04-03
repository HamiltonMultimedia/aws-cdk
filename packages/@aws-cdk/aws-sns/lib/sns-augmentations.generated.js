"use strict";
// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const topic_base_1 = require("./topic-base");
topic_base_1.TopicBase.prototype.metric = function (metricName, props) {
    return new cloudwatch.Metric({
        namespace: 'AWS/SNS',
        metricName,
        dimensionsMap: { TopicName: this.topicName },
        ...props
    }).attachTo(this);
};
topic_base_1.TopicBase.prototype.metricPublishSize = function (props) {
    return this.metric('PublishSize', { statistic: 'Average', ...props });
};
topic_base_1.TopicBase.prototype.metricNumberOfMessagesPublished = function (props) {
    return this.metric('NumberOfMessagesPublished', { statistic: 'Sum', ...props });
};
topic_base_1.TopicBase.prototype.metricNumberOfNotificationsDelivered = function (props) {
    return this.metric('NumberOfNotificationsDelivered', { statistic: 'Sum', ...props });
};
topic_base_1.TopicBase.prototype.metricNumberOfNotificationsFailed = function (props) {
    return this.metric('NumberOfNotificationsFailed', { statistic: 'Sum', ...props });
};
topic_base_1.TopicBase.prototype.metricNumberOfNotificationsFilteredOut = function (props) {
    return this.metric('NumberOfNotificationsFilteredOut', { statistic: 'Sum', ...props });
};
topic_base_1.TopicBase.prototype.metricNumberOfNotificationsFilteredOutNoMessageAttributes = function (props) {
    return this.metric('NumberOfNotificationsFilteredOut-NoMessageAttributes', { statistic: 'Sum', ...props });
};
topic_base_1.TopicBase.prototype.metricNumberOfNotificationsFilteredOutInvalidAttributes = function (props) {
    return this.metric('NumberOfNotificationsFilteredOut-InvalidAttributes', { statistic: 'Sum', ...props });
};
topic_base_1.TopicBase.prototype.metricSMSMonthToDateSpentUSD = function (props) {
    return this.metric('SMSMonthToDateSpentUSD', { statistic: 'Maximum', ...props });
};
topic_base_1.TopicBase.prototype.metricSMSSuccessRate = function (props) {
    return this.metric('SMSSuccessRate', { statistic: 'Sum', ...props });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25zLWF1Z21lbnRhdGlvbnMuZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic25zLWF1Z21lbnRhdGlvbnMuZ2VuZXJhdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrRUFBK0U7O0FBRS9FLDRCQUE0QixDQUFDLGlFQUFpRTtBQUM5RixzREFBc0Q7QUFDdEQsNkNBQXlDO0FBMkh6QyxzQkFBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBUyxVQUFrQixFQUFFLEtBQWdDO0lBQ3hGLE9BQU8sSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQzNCLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFVBQVU7UUFDVixhQUFhLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUM1QyxHQUFHLEtBQUs7S0FDVCxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BCLENBQUMsQ0FBQztBQUNGLHNCQUFTLENBQUMsU0FBUyxDQUFDLGlCQUFpQixHQUFHLFVBQVMsS0FBZ0M7SUFDL0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ3hFLENBQUMsQ0FBQztBQUNGLHNCQUFTLENBQUMsU0FBUyxDQUFDLCtCQUErQixHQUFHLFVBQVMsS0FBZ0M7SUFDN0YsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLDJCQUEyQixFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDbEYsQ0FBQyxDQUFDO0FBQ0Ysc0JBQVMsQ0FBQyxTQUFTLENBQUMsb0NBQW9DLEdBQUcsVUFBUyxLQUFnQztJQUNsRyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsZ0NBQWdDLEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUN2RixDQUFDLENBQUM7QUFDRixzQkFBUyxDQUFDLFNBQVMsQ0FBQyxpQ0FBaUMsR0FBRyxVQUFTLEtBQWdDO0lBQy9GLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsRUFBRSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ3BGLENBQUMsQ0FBQztBQUNGLHNCQUFTLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxHQUFHLFVBQVMsS0FBZ0M7SUFDcEcsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGtDQUFrQyxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDekYsQ0FBQyxDQUFDO0FBQ0Ysc0JBQVMsQ0FBQyxTQUFTLENBQUMseURBQXlELEdBQUcsVUFBUyxLQUFnQztJQUN2SCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsc0RBQXNELEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUM3RyxDQUFDLENBQUM7QUFDRixzQkFBUyxDQUFDLFNBQVMsQ0FBQyx1REFBdUQsR0FBRyxVQUFTLEtBQWdDO0lBQ3JILE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxvREFBb0QsRUFBRSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQzNHLENBQUMsQ0FBQztBQUNGLHNCQUFTLENBQUMsU0FBUyxDQUFDLDRCQUE0QixHQUFHLFVBQVMsS0FBZ0M7SUFDMUYsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLHdCQUF3QixFQUFFLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDbkYsQ0FBQyxDQUFDO0FBQ0Ysc0JBQVMsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLEdBQUcsVUFBUyxLQUFnQztJQUNsRixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUN2RSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxMi0yMDIzIEFtYXpvbi5jb20sIEluYy4gb3IgaXRzIGFmZmlsaWF0ZXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcbmltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0IHsgVG9waWNCYXNlIH0gZnJvbSBcIi4vdG9waWMtYmFzZVwiO1xuZGVjbGFyZSBtb2R1bGUgXCIuL3RvcGljLWJhc2VcIiB7XG4gICAgaW50ZXJmYWNlIElUb3BpYyB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm4gdGhlIGdpdmVuIG5hbWVkIG1ldHJpYyBmb3IgdGhpcyBUb3BpY1xuICAgICAgICAgKi9cbiAgICAgICAgbWV0cmljKG1ldHJpY05hbWU6IHN0cmluZywgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1ldHJpYyBmb3IgdGhlIHNpemUgb2YgbWVzc2FnZXMgcHVibGlzaGVkIHRocm91Z2ggdGhpcyB0b3BpY1xuICAgICAgICAgKlxuICAgICAgICAgKiBBdmVyYWdlIG92ZXIgNSBtaW51dGVzXG4gICAgICAgICAqL1xuICAgICAgICBtZXRyaWNQdWJsaXNoU2l6ZShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG51bWJlciBvZiBtZXNzYWdlcyBwdWJsaXNoZWQgdG8geW91ciBBbWF6b24gU05TIHRvcGljcy5cbiAgICAgICAgICpcbiAgICAgICAgICogU3VtIG92ZXIgNSBtaW51dGVzXG4gICAgICAgICAqL1xuICAgICAgICBtZXRyaWNOdW1iZXJPZk1lc3NhZ2VzUHVibGlzaGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbnVtYmVyIG9mIG1lc3NhZ2VzIHN1Y2Nlc3NmdWxseSBkZWxpdmVyZWQgZnJvbSB5b3VyIEFtYXpvbiBTTlMgdG9waWNzIHRvIHN1YnNjcmliaW5nIGVuZHBvaW50cy5cbiAgICAgICAgICpcbiAgICAgICAgICogU3VtIG92ZXIgNSBtaW51dGVzXG4gICAgICAgICAqL1xuICAgICAgICBtZXRyaWNOdW1iZXJPZk5vdGlmaWNhdGlvbnNEZWxpdmVyZWQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBudW1iZXIgb2YgbWVzc2FnZXMgdGhhdCBBbWF6b24gU05TIGZhaWxlZCB0byBkZWxpdmVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICAgICAgICovXG4gICAgICAgIG1ldHJpY051bWJlck9mTm90aWZpY2F0aW9uc0ZhaWxlZChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG51bWJlciBvZiBtZXNzYWdlcyB0aGF0IHdlcmUgcmVqZWN0ZWQgYnkgc3Vic2NyaXB0aW9uIGZpbHRlciBwb2xpY2llcy5cbiAgICAgICAgICpcbiAgICAgICAgICogU3VtIG92ZXIgNSBtaW51dGVzXG4gICAgICAgICAqL1xuICAgICAgICBtZXRyaWNOdW1iZXJPZk5vdGlmaWNhdGlvbnNGaWx0ZXJlZE91dChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG51bWJlciBvZiBtZXNzYWdlcyB0aGF0IHdlcmUgcmVqZWN0ZWQgYnkgc3Vic2NyaXB0aW9uIGZpbHRlciBwb2xpY2llcyBiZWNhdXNlIHRoZSBtZXNzYWdlcyBoYXZlIG5vIGF0dHJpYnV0ZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIFN1bSBvdmVyIDUgbWludXRlc1xuICAgICAgICAgKi9cbiAgICAgICAgbWV0cmljTnVtYmVyT2ZOb3RpZmljYXRpb25zRmlsdGVyZWRPdXROb01lc3NhZ2VBdHRyaWJ1dGVzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbnVtYmVyIG9mIG1lc3NhZ2VzIHRoYXQgd2VyZSByZWplY3RlZCBieSBzdWJzY3JpcHRpb24gZmlsdGVyIHBvbGljaWVzIGJlY2F1c2UgdGhlIG1lc3NhZ2VzJyBhdHRyaWJ1dGVzIGFyZSBpbnZhbGlkXG4gICAgICAgICAqXG4gICAgICAgICAqIFN1bSBvdmVyIDUgbWludXRlc1xuICAgICAgICAgKi9cbiAgICAgICAgbWV0cmljTnVtYmVyT2ZOb3RpZmljYXRpb25zRmlsdGVyZWRPdXRJbnZhbGlkQXR0cmlidXRlcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGNoYXJnZXMgeW91IGhhdmUgYWNjcnVlZCBzaW5jZSB0aGUgc3RhcnQgb2YgdGhlIGN1cnJlbnQgY2FsZW5kYXIgbW9udGggZm9yIHNlbmRpbmcgU01TIG1lc3NhZ2VzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBNYXhpbXVtIG92ZXIgNSBtaW51dGVzXG4gICAgICAgICAqL1xuICAgICAgICBtZXRyaWNTTVNNb250aFRvRGF0ZVNwZW50VVNEKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcmF0ZSBvZiBzdWNjZXNzZnVsIFNNUyBtZXNzYWdlIGRlbGl2ZXJpZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIFN1bSBvdmVyIDUgbWludXRlc1xuICAgICAgICAgKi9cbiAgICAgICAgbWV0cmljU01TU3VjY2Vzc1JhdGUocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcbiAgICB9XG4gICAgaW50ZXJmYWNlIFRvcGljQmFzZSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm4gdGhlIGdpdmVuIG5hbWVkIG1ldHJpYyBmb3IgdGhpcyBUb3BpY1xuICAgICAgICAgKi9cbiAgICAgICAgbWV0cmljKG1ldHJpY05hbWU6IHN0cmluZywgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1ldHJpYyBmb3IgdGhlIHNpemUgb2YgbWVzc2FnZXMgcHVibGlzaGVkIHRocm91Z2ggdGhpcyB0b3BpY1xuICAgICAgICAgKlxuICAgICAgICAgKiBBdmVyYWdlIG92ZXIgNSBtaW51dGVzXG4gICAgICAgICAqL1xuICAgICAgICBtZXRyaWNQdWJsaXNoU2l6ZShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG51bWJlciBvZiBtZXNzYWdlcyBwdWJsaXNoZWQgdG8geW91ciBBbWF6b24gU05TIHRvcGljcy5cbiAgICAgICAgICpcbiAgICAgICAgICogU3VtIG92ZXIgNSBtaW51dGVzXG4gICAgICAgICAqL1xuICAgICAgICBtZXRyaWNOdW1iZXJPZk1lc3NhZ2VzUHVibGlzaGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbnVtYmVyIG9mIG1lc3NhZ2VzIHN1Y2Nlc3NmdWxseSBkZWxpdmVyZWQgZnJvbSB5b3VyIEFtYXpvbiBTTlMgdG9waWNzIHRvIHN1YnNjcmliaW5nIGVuZHBvaW50cy5cbiAgICAgICAgICpcbiAgICAgICAgICogU3VtIG92ZXIgNSBtaW51dGVzXG4gICAgICAgICAqL1xuICAgICAgICBtZXRyaWNOdW1iZXJPZk5vdGlmaWNhdGlvbnNEZWxpdmVyZWQocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBudW1iZXIgb2YgbWVzc2FnZXMgdGhhdCBBbWF6b24gU05TIGZhaWxlZCB0byBkZWxpdmVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBTdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICAgICAgICovXG4gICAgICAgIG1ldHJpY051bWJlck9mTm90aWZpY2F0aW9uc0ZhaWxlZChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG51bWJlciBvZiBtZXNzYWdlcyB0aGF0IHdlcmUgcmVqZWN0ZWQgYnkgc3Vic2NyaXB0aW9uIGZpbHRlciBwb2xpY2llcy5cbiAgICAgICAgICpcbiAgICAgICAgICogU3VtIG92ZXIgNSBtaW51dGVzXG4gICAgICAgICAqL1xuICAgICAgICBtZXRyaWNOdW1iZXJPZk5vdGlmaWNhdGlvbnNGaWx0ZXJlZE91dChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG51bWJlciBvZiBtZXNzYWdlcyB0aGF0IHdlcmUgcmVqZWN0ZWQgYnkgc3Vic2NyaXB0aW9uIGZpbHRlciBwb2xpY2llcyBiZWNhdXNlIHRoZSBtZXNzYWdlcyBoYXZlIG5vIGF0dHJpYnV0ZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIFN1bSBvdmVyIDUgbWludXRlc1xuICAgICAgICAgKi9cbiAgICAgICAgbWV0cmljTnVtYmVyT2ZOb3RpZmljYXRpb25zRmlsdGVyZWRPdXROb01lc3NhZ2VBdHRyaWJ1dGVzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbnVtYmVyIG9mIG1lc3NhZ2VzIHRoYXQgd2VyZSByZWplY3RlZCBieSBzdWJzY3JpcHRpb24gZmlsdGVyIHBvbGljaWVzIGJlY2F1c2UgdGhlIG1lc3NhZ2VzJyBhdHRyaWJ1dGVzIGFyZSBpbnZhbGlkXG4gICAgICAgICAqXG4gICAgICAgICAqIFN1bSBvdmVyIDUgbWludXRlc1xuICAgICAgICAgKi9cbiAgICAgICAgbWV0cmljTnVtYmVyT2ZOb3RpZmljYXRpb25zRmlsdGVyZWRPdXRJbnZhbGlkQXR0cmlidXRlcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGNoYXJnZXMgeW91IGhhdmUgYWNjcnVlZCBzaW5jZSB0aGUgc3RhcnQgb2YgdGhlIGN1cnJlbnQgY2FsZW5kYXIgbW9udGggZm9yIHNlbmRpbmcgU01TIG1lc3NhZ2VzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBNYXhpbXVtIG92ZXIgNSBtaW51dGVzXG4gICAgICAgICAqL1xuICAgICAgICBtZXRyaWNTTVNNb250aFRvRGF0ZVNwZW50VVNEKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcmF0ZSBvZiBzdWNjZXNzZnVsIFNNUyBtZXNzYWdlIGRlbGl2ZXJpZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIFN1bSBvdmVyIDUgbWludXRlc1xuICAgICAgICAgKi9cbiAgICAgICAgbWV0cmljU01TU3VjY2Vzc1JhdGUocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcbiAgICB9XG59XG5Ub3BpY0Jhc2UucHJvdG90eXBlLm1ldHJpYyA9IGZ1bmN0aW9uKG1ldHJpY05hbWU6IHN0cmluZywgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBjbG91ZHdhdGNoLk1ldHJpYyh7XG4gICAgbmFtZXNwYWNlOiAnQVdTL1NOUycsXG4gICAgbWV0cmljTmFtZSxcbiAgICBkaW1lbnNpb25zTWFwOiB7IFRvcGljTmFtZTogdGhpcy50b3BpY05hbWUgfSxcbiAgICAuLi5wcm9wc1xuICB9KS5hdHRhY2hUbyh0aGlzKTtcbn07XG5Ub3BpY0Jhc2UucHJvdG90eXBlLm1ldHJpY1B1Ymxpc2hTaXplID0gZnVuY3Rpb24ocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgcmV0dXJuIHRoaXMubWV0cmljKCdQdWJsaXNoU2l6ZScsIHsgc3RhdGlzdGljOiAnQXZlcmFnZScsIC4uLnByb3BzIH0pO1xufTtcblRvcGljQmFzZS5wcm90b3R5cGUubWV0cmljTnVtYmVyT2ZNZXNzYWdlc1B1Ymxpc2hlZCA9IGZ1bmN0aW9uKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gIHJldHVybiB0aGlzLm1ldHJpYygnTnVtYmVyT2ZNZXNzYWdlc1B1Ymxpc2hlZCcsIHsgc3RhdGlzdGljOiAnU3VtJywgLi4ucHJvcHMgfSk7XG59O1xuVG9waWNCYXNlLnByb3RvdHlwZS5tZXRyaWNOdW1iZXJPZk5vdGlmaWNhdGlvbnNEZWxpdmVyZWQgPSBmdW5jdGlvbihwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICByZXR1cm4gdGhpcy5tZXRyaWMoJ051bWJlck9mTm90aWZpY2F0aW9uc0RlbGl2ZXJlZCcsIHsgc3RhdGlzdGljOiAnU3VtJywgLi4ucHJvcHMgfSk7XG59O1xuVG9waWNCYXNlLnByb3RvdHlwZS5tZXRyaWNOdW1iZXJPZk5vdGlmaWNhdGlvbnNGYWlsZWQgPSBmdW5jdGlvbihwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICByZXR1cm4gdGhpcy5tZXRyaWMoJ051bWJlck9mTm90aWZpY2F0aW9uc0ZhaWxlZCcsIHsgc3RhdGlzdGljOiAnU3VtJywgLi4ucHJvcHMgfSk7XG59O1xuVG9waWNCYXNlLnByb3RvdHlwZS5tZXRyaWNOdW1iZXJPZk5vdGlmaWNhdGlvbnNGaWx0ZXJlZE91dCA9IGZ1bmN0aW9uKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gIHJldHVybiB0aGlzLm1ldHJpYygnTnVtYmVyT2ZOb3RpZmljYXRpb25zRmlsdGVyZWRPdXQnLCB7IHN0YXRpc3RpYzogJ1N1bScsIC4uLnByb3BzIH0pO1xufTtcblRvcGljQmFzZS5wcm90b3R5cGUubWV0cmljTnVtYmVyT2ZOb3RpZmljYXRpb25zRmlsdGVyZWRPdXROb01lc3NhZ2VBdHRyaWJ1dGVzID0gZnVuY3Rpb24ocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgcmV0dXJuIHRoaXMubWV0cmljKCdOdW1iZXJPZk5vdGlmaWNhdGlvbnNGaWx0ZXJlZE91dC1Ob01lc3NhZ2VBdHRyaWJ1dGVzJywgeyBzdGF0aXN0aWM6ICdTdW0nLCAuLi5wcm9wcyB9KTtcbn07XG5Ub3BpY0Jhc2UucHJvdG90eXBlLm1ldHJpY051bWJlck9mTm90aWZpY2F0aW9uc0ZpbHRlcmVkT3V0SW52YWxpZEF0dHJpYnV0ZXMgPSBmdW5jdGlvbihwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICByZXR1cm4gdGhpcy5tZXRyaWMoJ051bWJlck9mTm90aWZpY2F0aW9uc0ZpbHRlcmVkT3V0LUludmFsaWRBdHRyaWJ1dGVzJywgeyBzdGF0aXN0aWM6ICdTdW0nLCAuLi5wcm9wcyB9KTtcbn07XG5Ub3BpY0Jhc2UucHJvdG90eXBlLm1ldHJpY1NNU01vbnRoVG9EYXRlU3BlbnRVU0QgPSBmdW5jdGlvbihwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICByZXR1cm4gdGhpcy5tZXRyaWMoJ1NNU01vbnRoVG9EYXRlU3BlbnRVU0QnLCB7IHN0YXRpc3RpYzogJ01heGltdW0nLCAuLi5wcm9wcyB9KTtcbn07XG5Ub3BpY0Jhc2UucHJvdG90eXBlLm1ldHJpY1NNU1N1Y2Nlc3NSYXRlID0gZnVuY3Rpb24ocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgcmV0dXJuIHRoaXMubWV0cmljKCdTTVNTdWNjZXNzUmF0ZScsIHsgc3RhdGlzdGljOiAnU3VtJywgLi4ucHJvcHMgfSk7XG59O1xuIl19