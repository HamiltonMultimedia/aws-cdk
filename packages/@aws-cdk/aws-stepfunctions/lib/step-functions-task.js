"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceIntegrationPattern = void 0;
/**
 * Three ways to call an integrated service: Request Response, Run a Job and Wait for a Callback with Task Token.
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html
 *
 * Here, they are named as FIRE_AND_FORGET, SYNC and WAIT_FOR_TASK_TOKEN respectfully.
 *
 * @default FIRE_AND_FORGET
 */
var ServiceIntegrationPattern;
(function (ServiceIntegrationPattern) {
    /**
     * Call a service and progress to the next state immediately after the API call completes
     */
    ServiceIntegrationPattern["FIRE_AND_FORGET"] = "FIRE_AND_FORGET";
    /**
     * Call a service and wait for a job to complete.
     */
    ServiceIntegrationPattern["SYNC"] = "SYNC";
    /**
     * Call a service with a task token and wait until that token is returned by SendTaskSuccess/SendTaskFailure with payload.
     */
    ServiceIntegrationPattern["WAIT_FOR_TASK_TOKEN"] = "WAIT_FOR_TASK_TOKEN";
})(ServiceIntegrationPattern = exports.ServiceIntegrationPattern || (exports.ServiceIntegrationPattern = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcC1mdW5jdGlvbnMtdGFzay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0ZXAtZnVuY3Rpb25zLXRhc2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBb0ZBOzs7Ozs7O0dBT0c7QUFDSCxJQUFZLHlCQWVYO0FBZkQsV0FBWSx5QkFBeUI7SUFDbkM7O09BRUc7SUFDSCxnRUFBbUMsQ0FBQTtJQUVuQzs7T0FFRztJQUNILDBDQUFhLENBQUE7SUFFYjs7T0FFRztJQUNILHdFQUEyQyxDQUFBO0FBQzdDLENBQUMsRUFmVyx5QkFBeUIsR0FBekIsaUNBQXlCLEtBQXpCLGlDQUF5QixRQWVwQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgRHVyYXRpb24gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFRhc2sgfSBmcm9tICcuL3N0YXRlcy90YXNrJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHJlc291cmNlcyB0aGF0IGNhbiBiZSB1c2VkIGFzIHRhc2tzXG4gKiBAZGVwcmVjYXRlZCByZXBsYWNlZCBieSBgVGFza1N0YXRlQmFzZWAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVN0ZXBGdW5jdGlvbnNUYXNrIHtcbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSB0YXNrIG9iamVjdCBpcyB1c2VkIGluIGEgd29ya2Zsb3dcbiAgICovXG4gIGJpbmQodGFzazogVGFzayk6IFN0ZXBGdW5jdGlvbnNUYXNrQ29uZmlnO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgdGhhdCBkZWZpbmUgd2hhdCBraW5kIG9mIHRhc2sgc2hvdWxkIGJlIGNyZWF0ZWRcbiAqIEBkZXByZWNhdGVkIHVzZWQgYnkgYElTdGVwRnVuY3Rpb25zVGFza2AuIGBJU3RlcEZ1bmN0aW9uc1Rhc2tgIGlzIGRlcHJlY2F0ZWQgYW5kIHJlcGxhY2VkIGJ5IGBUYXNrU3RhdGVCYXNlYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdGVwRnVuY3Rpb25zVGFza0NvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgcmVzb3VyY2UgdGhhdCByZXByZXNlbnRzIHRoZSB3b3JrIHRvIGJlIGV4ZWN1dGVkXG4gICAqXG4gICAqIEVpdGhlciB0aGUgQVJOIG9mIGEgTGFtYmRhIEZ1bmN0aW9uIG9yIEFjdGl2aXR5LCBvciBhIHNwZWNpYWxcbiAgICogQVJOLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VBcm46IHN0cmluZztcblxuICAvKipcbiAgICogUGFyYW1ldGVycyBwYXNzIGEgY29sbGVjdGlvbiBvZiBrZXktdmFsdWUgcGFpcnMsIGVpdGhlciBzdGF0aWMgdmFsdWVzIG9yIEpTT05QYXRoIGV4cHJlc3Npb25zIHRoYXQgc2VsZWN0IGZyb20gdGhlIGlucHV0LlxuICAgKlxuICAgKiBUaGUgbWVhbmluZyBvZiB0aGVzZSBwYXJhbWV0ZXJzIGlzIHRhc2stZGVwZW5kZW50LlxuICAgKlxuICAgKiBJdHMgdmFsdWVzIHdpbGwgYmUgbWVyZ2VkIHdpdGggdGhlIGBwYXJhbWV0ZXJzYCBwcm9wZXJ0eSB3aGljaCBpcyBjb25maWd1cmVkIGRpcmVjdGx5XG4gICAqIG9uIHRoZSBUYXNrIHN0YXRlLlxuICAgKlxuICAgKiBAc2VlXG4gICAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvaW5wdXQtb3V0cHV0LWlucHV0cGF0aC1wYXJhbXMuaHRtbCNpbnB1dC1vdXRwdXQtcGFyYW1ldGVyc1xuICAgKlxuICAgKiBAZGVmYXVsdCBObyBwYXJhbWV0ZXJzXG4gICAqL1xuICByZWFkb25seSBwYXJhbWV0ZXJzPzogeyBbbmFtZTogc3RyaW5nXTogYW55IH07XG5cbiAgLyoqXG4gICAqIE1heGltdW0gdGltZSBiZXR3ZWVuIGhlYXJ0IGJlYXRzXG4gICAqXG4gICAqIElmIHRoZSB0aW1lIGJldHdlZW4gaGVhcnQgYmVhdHMgdGFrZXMgbG9uZ2VyIHRoYW4gdGhpcywgYSAnVGltZW91dCcgZXJyb3IgaXMgcmFpc2VkLlxuICAgKlxuICAgKiBUaGlzIGlzIG9ubHkgcmVsZXZhbnQgd2hlbiB1c2luZyBhbiBBY3Rpdml0eSB0eXBlIGFzIHJlc291cmNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBObyBoZWFydCBiZWF0IHRpbWVvdXRcbiAgICovXG4gIHJlYWRvbmx5IGhlYXJ0YmVhdD86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIHBvbGljeSBzdGF0ZW1lbnRzIHRvIGFkZCB0byB0aGUgZXhlY3V0aW9uIHJvbGVcbiAgICpcbiAgICogQGRlZmF1bHQgTm8gcG9saWN5IHJvbGVzXG4gICAqL1xuICByZWFkb25seSBwb2xpY3lTdGF0ZW1lbnRzPzogaWFtLlBvbGljeVN0YXRlbWVudFtdO1xuXG4gIC8qKlxuICAgKiBQcmVmaXggZm9yIHNpbmd1bGFyIG1ldHJpYyBuYW1lcyBvZiBhY3Rpdml0eSBhY3Rpb25zXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIHN1Y2ggbWV0cmljc1xuICAgKi9cbiAgcmVhZG9ubHkgbWV0cmljUHJlZml4U2luZ3VsYXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFByZWZpeCBmb3IgcGx1cmFsIG1ldHJpYyBuYW1lcyBvZiBhY3Rpdml0eSBhY3Rpb25zXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIHN1Y2ggbWV0cmljc1xuICAgKi9cbiAgcmVhZG9ubHkgbWV0cmljUHJlZml4UGx1cmFsPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGltZW5zaW9ucyB0byBhdHRhY2ggdG8gbWV0cmljc1xuICAgKlxuICAgKiBAZGVmYXVsdCBObyBtZXRyaWNzXG4gICAqL1xuICByZWFkb25seSBtZXRyaWNEaW1lbnNpb25zPzogY2xvdWR3YXRjaC5EaW1lbnNpb25IYXNoO1xufVxuXG4vKipcbiAqIFRocmVlIHdheXMgdG8gY2FsbCBhbiBpbnRlZ3JhdGVkIHNlcnZpY2U6IFJlcXVlc3QgUmVzcG9uc2UsIFJ1biBhIEpvYiBhbmQgV2FpdCBmb3IgYSBDYWxsYmFjayB3aXRoIFRhc2sgVG9rZW4uXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zdGVwLWZ1bmN0aW9ucy9sYXRlc3QvZGcvY29ubmVjdC10by1yZXNvdXJjZS5odG1sXG4gKlxuICogSGVyZSwgdGhleSBhcmUgbmFtZWQgYXMgRklSRV9BTkRfRk9SR0VULCBTWU5DIGFuZCBXQUlUX0ZPUl9UQVNLX1RPS0VOIHJlc3BlY3RmdWxseS5cbiAqXG4gKiBAZGVmYXVsdCBGSVJFX0FORF9GT1JHRVRcbiAqL1xuZXhwb3J0IGVudW0gU2VydmljZUludGVncmF0aW9uUGF0dGVybiB7XG4gIC8qKlxuICAgKiBDYWxsIGEgc2VydmljZSBhbmQgcHJvZ3Jlc3MgdG8gdGhlIG5leHQgc3RhdGUgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIEFQSSBjYWxsIGNvbXBsZXRlc1xuICAgKi9cbiAgRklSRV9BTkRfRk9SR0VUID0gJ0ZJUkVfQU5EX0ZPUkdFVCcsXG5cbiAgLyoqXG4gICAqIENhbGwgYSBzZXJ2aWNlIGFuZCB3YWl0IGZvciBhIGpvYiB0byBjb21wbGV0ZS5cbiAgICovXG4gIFNZTkMgPSAnU1lOQycsXG5cbiAgLyoqXG4gICAqIENhbGwgYSBzZXJ2aWNlIHdpdGggYSB0YXNrIHRva2VuIGFuZCB3YWl0IHVudGlsIHRoYXQgdG9rZW4gaXMgcmV0dXJuZWQgYnkgU2VuZFRhc2tTdWNjZXNzL1NlbmRUYXNrRmFpbHVyZSB3aXRoIHBheWxvYWQuXG4gICAqL1xuICBXQUlUX0ZPUl9UQVNLX1RPS0VOID0gJ1dBSVRfRk9SX1RBU0tfVE9LRU4nXG59XG4iXX0=