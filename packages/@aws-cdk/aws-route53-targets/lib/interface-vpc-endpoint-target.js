"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceVpcEndpointTarget = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
/**
 * Set an InterfaceVpcEndpoint as a target for an ARecord
 */
class InterfaceVpcEndpointTarget {
    constructor(vpcEndpoint) {
        this.vpcEndpoint = vpcEndpoint;
        this.cfnVpcEndpoint = this.vpcEndpoint.node.findChild('Resource');
    }
    bind(_record, _zone) {
        return {
            dnsName: cdk.Fn.select(1, cdk.Fn.split(':', cdk.Fn.select(0, this.cfnVpcEndpoint.attrDnsEntries))),
            hostedZoneId: cdk.Fn.select(0, cdk.Fn.split(':', cdk.Fn.select(0, this.cfnVpcEndpoint.attrDnsEntries))),
        };
    }
}
exports.InterfaceVpcEndpointTarget = InterfaceVpcEndpointTarget;
_a = JSII_RTTI_SYMBOL_1;
InterfaceVpcEndpointTarget[_a] = { fqn: "@aws-cdk/aws-route53-targets.InterfaceVpcEndpointTarget", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlLXZwYy1lbmRwb2ludC10YXJnZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlcmZhY2UtdnBjLWVuZHBvaW50LXRhcmdldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVBLHFDQUFxQztBQUVyQzs7R0FFRztBQUNILE1BQWEsMEJBQTBCO0lBRXJDLFlBQTZCLFdBQXFDO1FBQXJDLGdCQUFXLEdBQVgsV0FBVyxDQUEwQjtRQUNoRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQXVCLENBQUM7S0FDekY7SUFFTSxJQUFJLENBQUMsT0FBMkIsRUFBRSxLQUEyQjtRQUNsRSxPQUFPO1lBQ0wsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNsRyxZQUFZLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1NBQ3hHLENBQUM7S0FDSDs7QUFYSCxnRUFZQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIHJvdXRlNTMgZnJvbSAnQGF3cy1jZGsvYXdzLXJvdXRlNTMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuXG4vKipcbiAqIFNldCBhbiBJbnRlcmZhY2VWcGNFbmRwb2ludCBhcyBhIHRhcmdldCBmb3IgYW4gQVJlY29yZFxuICovXG5leHBvcnQgY2xhc3MgSW50ZXJmYWNlVnBjRW5kcG9pbnRUYXJnZXQgaW1wbGVtZW50cyByb3V0ZTUzLklBbGlhc1JlY29yZFRhcmdldCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgY2ZuVnBjRW5kcG9pbnQ6IGVjMi5DZm5WUENFbmRwb2ludDtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB2cGNFbmRwb2ludDogZWMyLkludGVyZmFjZVZwY0VuZHBvaW50KSB7XG4gICAgdGhpcy5jZm5WcGNFbmRwb2ludCA9IHRoaXMudnBjRW5kcG9pbnQubm9kZS5maW5kQ2hpbGQoJ1Jlc291cmNlJykgYXMgZWMyLkNmblZQQ0VuZHBvaW50O1xuICB9XG5cbiAgcHVibGljIGJpbmQoX3JlY29yZDogcm91dGU1My5JUmVjb3JkU2V0LCBfem9uZT86IHJvdXRlNTMuSUhvc3RlZFpvbmUpOiByb3V0ZTUzLkFsaWFzUmVjb3JkVGFyZ2V0Q29uZmlnIHtcbiAgICByZXR1cm4ge1xuICAgICAgZG5zTmFtZTogY2RrLkZuLnNlbGVjdCgxLCBjZGsuRm4uc3BsaXQoJzonLCBjZGsuRm4uc2VsZWN0KDAsIHRoaXMuY2ZuVnBjRW5kcG9pbnQuYXR0ckRuc0VudHJpZXMpKSksXG4gICAgICBob3N0ZWRab25lSWQ6IGNkay5Gbi5zZWxlY3QoMCwgY2RrLkZuLnNwbGl0KCc6JywgY2RrLkZuLnNlbGVjdCgwLCB0aGlzLmNmblZwY0VuZHBvaW50LmF0dHJEbnNFbnRyaWVzKSkpLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==