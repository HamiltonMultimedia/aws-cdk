"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkListenerCertificate = void 0;
const constructs_1 = require("constructs");
const elasticloadbalancingv2_generated_1 = require("../elasticloadbalancingv2.generated");
/**
 * Add certificates to a listener
 */
class NetworkListenerCertificate extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const certificates = [
            ...(props.certificates || []).map(c => ({ certificateArn: c.certificateArn })),
        ];
        new elasticloadbalancingv2_generated_1.CfnListenerCertificate(this, 'Resource', {
            listenerArn: props.listener.listenerArn,
            certificates,
        });
    }
}
exports.NetworkListenerCertificate = NetworkListenerCertificate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay1saXN0ZW5lci1jZXJ0aWZpY2F0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5ldHdvcmstbGlzdGVuZXItY2VydGlmaWNhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXVDO0FBRXZDLDBGQUE2RTtBQW9CN0U7O0dBRUc7QUFDSCxNQUFhLDBCQUEyQixTQUFRLHNCQUFTO0lBQ3ZELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0M7UUFDOUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLFlBQVksR0FBRztZQUNuQixHQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1NBQy9FLENBQUM7UUFFRixJQUFJLHlEQUFzQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDM0MsV0FBVyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVztZQUN2QyxZQUFZO1NBQ2IsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQWJELGdFQWFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJTmV0d29ya0xpc3RlbmVyIH0gZnJvbSAnLi9uZXR3b3JrLWxpc3RlbmVyJztcbmltcG9ydCB7IENmbkxpc3RlbmVyQ2VydGlmaWNhdGUgfSBmcm9tICcuLi9lbGFzdGljbG9hZGJhbGFuY2luZ3YyLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBJTGlzdGVuZXJDZXJ0aWZpY2F0ZSB9IGZyb20gJy4uL3NoYXJlZC9saXN0ZW5lci1jZXJ0aWZpY2F0ZSc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYWRkaW5nIGEgc2V0IG9mIGNlcnRpZmljYXRlcyB0byBhIGxpc3RlbmVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya0xpc3RlbmVyQ2VydGlmaWNhdGVQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbGlzdGVuZXIgdG8gYXR0YWNoIHRoZSBydWxlIHRvXG4gICAqL1xuICByZWFkb25seSBsaXN0ZW5lcjogSU5ldHdvcmtMaXN0ZW5lcjtcblxuICAvKipcbiAgICogQ2VydGlmaWNhdGVzIHRvIGF0dGFjaFxuICAgKlxuICAgKiBEdXBsaWNhdGVzIGFyZSBub3QgYWxsb3dlZC5cbiAgICovXG4gIHJlYWRvbmx5IGNlcnRpZmljYXRlczogSUxpc3RlbmVyQ2VydGlmaWNhdGVbXTtcbn1cblxuLyoqXG4gKiBBZGQgY2VydGlmaWNhdGVzIHRvIGEgbGlzdGVuZXJcbiAqL1xuZXhwb3J0IGNsYXNzIE5ldHdvcmtMaXN0ZW5lckNlcnRpZmljYXRlIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE5ldHdvcmtMaXN0ZW5lckNlcnRpZmljYXRlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgY2VydGlmaWNhdGVzID0gW1xuICAgICAgLi4uKHByb3BzLmNlcnRpZmljYXRlcyB8fCBbXSkubWFwKGMgPT4gKHsgY2VydGlmaWNhdGVBcm46IGMuY2VydGlmaWNhdGVBcm4gfSkpLFxuICAgIF07XG5cbiAgICBuZXcgQ2ZuTGlzdGVuZXJDZXJ0aWZpY2F0ZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBsaXN0ZW5lckFybjogcHJvcHMubGlzdGVuZXIubGlzdGVuZXJBcm4sXG4gICAgICBjZXJ0aWZpY2F0ZXMsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==