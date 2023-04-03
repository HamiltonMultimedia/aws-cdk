"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentGroupBase = exports.ImportedDeploymentGroupBase = void 0;
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const predefined_deployment_config_1 = require("./predefined-deployment-config");
const utils_1 = require("./utils");
/**
 * @internal
 */
class ImportedDeploymentGroupBase extends core_1.Resource {
    constructor(scope, id, props) {
        const deploymentGroupName = props.deploymentGroupName;
        const deploymentGroupArn = core_1.Arn.format({
            partition: core_1.Aws.PARTITION,
            account: props.application.env.account,
            region: props.application.env.region,
            service: 'codedeploy',
            resource: 'deploymentgroup',
            resourceName: `${props.application.applicationName}/${deploymentGroupName}`,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        });
        super(scope, id, { environmentFromArn: deploymentGroupArn });
        this.deploymentGroupName = deploymentGroupName;
        this.deploymentGroupArn = deploymentGroupArn;
    }
    /**
     * Bind DeploymentGroupConfig to the current group, if supported
     *
     * @internal
     */
    _bindDeploymentConfig(config) {
        return predefined_deployment_config_1.isPredefinedDeploymentConfig(config) ? config.bindEnvironment(this) : config;
    }
}
exports.ImportedDeploymentGroupBase = ImportedDeploymentGroupBase;
/**
 * @internal
 */
class DeploymentGroupBase extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.deploymentGroupName,
        });
        this._role = props.role || new iam.Role(this, props.roleConstructId, {
            assumedBy: new iam.ServicePrincipal('codedeploy.amazonaws.com'),
        });
        this.node.addValidation({ validate: () => utils_1.validateName('Deployment group', this.physicalName) });
    }
    /**
     * Bind DeploymentGroupConfig to the current group, if supported
     *
     * @internal
     */
    _bindDeploymentConfig(config) {
        return predefined_deployment_config_1.isPredefinedDeploymentConfig(config) ? config.bindEnvironment(this) : config;
    }
    /**
     * Set name and ARN properties.
     *
     * Must be called in the child constructor.
     *
     * @internal
     */
    _setNameAndArn(resource, application) {
        this.deploymentGroupName = this.getResourceNameAttribute(resource.ref);
        this.deploymentGroupArn = this.getResourceArnAttribute(this.stack.formatArn({
            service: 'codedeploy',
            resource: 'deploymentgroup',
            resourceName: `${application.applicationName}/${resource.ref}`,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        }), {
            service: 'codedeploy',
            resource: 'deploymentgroup',
            resourceName: `${application.applicationName}/${this.physicalName}`,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        });
    }
}
exports.DeploymentGroupBase = DeploymentGroupBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1kZXBsb3ltZW50LWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFzZS1kZXBsb3ltZW50LWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUF3QztBQUN4Qyx3Q0FBeUU7QUFFekUsaUZBQThFO0FBQzlFLG1DQUF1QztBQTZCdkM7O0dBRUc7QUFDSCxNQUFhLDJCQUE0QixTQUFRLGVBQVE7SUFJdkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF1QztRQUMvRSxNQUFNLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQztRQUN0RCxNQUFNLGtCQUFrQixHQUFHLFVBQUcsQ0FBQyxNQUFNLENBQUM7WUFDcEMsU0FBUyxFQUFFLFVBQUcsQ0FBQyxTQUFTO1lBQ3hCLE9BQU8sRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPO1lBQ3RDLE1BQU0sRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNO1lBQ3BDLE9BQU8sRUFBRSxZQUFZO1lBQ3JCLFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsWUFBWSxFQUFFLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxlQUFlLElBQUksbUJBQW1CLEVBQUU7WUFDM0UsU0FBUyxFQUFFLGdCQUFTLENBQUMsbUJBQW1CO1NBQ3pDLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztRQUMvQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUM7S0FDOUM7SUFFRDs7OztPQUlHO0lBQ08scUJBQXFCLENBQUMsTUFBNkI7UUFDM0QsT0FBTywyREFBNEIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0tBQ3JGO0NBQ0Y7QUE3QkQsa0VBNkJDO0FBMEJEOztHQUVHO0FBQ0gsTUFBYSxtQkFBb0IsU0FBUSxlQUFRO0lBcUIvQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQStCO1FBQ3ZFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxtQkFBbUI7U0FDeEMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLGVBQWUsRUFBRTtZQUNuRSxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsMEJBQTBCLENBQUM7U0FDaEUsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsb0JBQVksQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2xHO0lBRUQ7Ozs7T0FJRztJQUNPLHFCQUFxQixDQUFDLE1BQTZCO1FBQzNELE9BQU8sMkRBQTRCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztLQUNyRjtJQUVEOzs7Ozs7T0FNRztJQUNPLGNBQWMsQ0FBQyxRQUE0QixFQUFFLFdBQTZCO1FBQ2pGLElBQVksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9FLElBQVksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDbkYsT0FBTyxFQUFFLFlBQVk7WUFDckIsUUFBUSxFQUFFLGlCQUFpQjtZQUMzQixZQUFZLEVBQUUsR0FBRyxXQUFXLENBQUMsZUFBZSxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDOUQsU0FBUyxFQUFFLGdCQUFTLENBQUMsbUJBQW1CO1NBQ3pDLENBQUMsRUFBRTtZQUNGLE9BQU8sRUFBRSxZQUFZO1lBQ3JCLFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsWUFBWSxFQUFFLEdBQUcsV0FBVyxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ25FLFNBQVMsRUFBRSxnQkFBUyxDQUFDLG1CQUFtQjtTQUN6QyxDQUFDLENBQUM7S0FDSjtDQUNGO0FBL0RELGtEQStEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IFJlc291cmNlLCBJUmVzb3VyY2UsIEFybkZvcm1hdCwgQXJuLCBBd3MgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgaXNQcmVkZWZpbmVkRGVwbG95bWVudENvbmZpZyB9IGZyb20gJy4vcHJlZGVmaW5lZC1kZXBsb3ltZW50LWNvbmZpZyc7XG5pbXBvcnQgeyB2YWxpZGF0ZU5hbWUgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IElCYXNlRGVwbG95bWVudENvbmZpZyB9IGZyb20gJy4uL2Jhc2UtZGVwbG95bWVudC1jb25maWcnO1xuaW1wb3J0IHsgQ2ZuRGVwbG95bWVudEdyb3VwIH0gZnJvbSAnLi4vY29kZWRlcGxveS5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIFN0cnVjdHVyYWwgdHlwaW5nLCBub3QganNpaSBjb21wYXRpYmxlIGJ1dCBkb2Vzbid0IG5lZWQgdG8gYmVcbiAqL1xuaW50ZXJmYWNlIElBcHBsaWNhdGlvbkxpa2UgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICByZWFkb25seSBhcHBsaWNhdGlvbkFybjogc3RyaW5nO1xuICByZWFkb25seSBhcHBsaWNhdGlvbk5hbWU6IHN0cmluZztcbn1cblxuLyoqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSW1wb3J0ZWREZXBsb3ltZW50R3JvdXBCYXNlUHJvcHMge1xuICAvKipcbiAgICogVGhlIHJlZmVyZW5jZSB0byB0aGUgQ29kZURlcGxveSBBcHBsaWNhdGlvbiB0aGF0IHRoaXMgRGVwbG95bWVudCBHcm91cCBiZWxvbmdzIHRvLlxuICAgKi9cbiAgcmVhZG9ubHkgYXBwbGljYXRpb246IElBcHBsaWNhdGlvbkxpa2U7XG5cbiAgLyoqXG4gICAqIFRoZSBwaHlzaWNhbCwgaHVtYW4tcmVhZGFibGUgbmFtZSBvZiB0aGUgQ29kZURlcGxveSBEZXBsb3ltZW50IEdyb3VwXG4gICAqIHRoYXQgd2UgYXJlIHJlZmVyZW5jaW5nLlxuICAgKlxuICAgKiBAZGVmYXVsdCBFaXRoZXIgZGVwbG95bWVudEdyb3VwTmFtZSBvciBkZXBsb3ltZW50R3JvdXBBcm4gaXMgcmVxdWlyZWRcbiAgICovXG4gIHJlYWRvbmx5IGRlcGxveW1lbnRHcm91cE5hbWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGNsYXNzIEltcG9ydGVkRGVwbG95bWVudEdyb3VwQmFzZSBleHRlbmRzIFJlc291cmNlIHtcbiAgcHVibGljIHJlYWRvbmx5IGRlcGxveW1lbnRHcm91cE5hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGRlcGxveW1lbnRHcm91cEFybjogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJbXBvcnRlZERlcGxveW1lbnRHcm91cEJhc2VQcm9wcykge1xuICAgIGNvbnN0IGRlcGxveW1lbnRHcm91cE5hbWUgPSBwcm9wcy5kZXBsb3ltZW50R3JvdXBOYW1lO1xuICAgIGNvbnN0IGRlcGxveW1lbnRHcm91cEFybiA9IEFybi5mb3JtYXQoe1xuICAgICAgcGFydGl0aW9uOiBBd3MuUEFSVElUSU9OLFxuICAgICAgYWNjb3VudDogcHJvcHMuYXBwbGljYXRpb24uZW52LmFjY291bnQsXG4gICAgICByZWdpb246IHByb3BzLmFwcGxpY2F0aW9uLmVudi5yZWdpb24sXG4gICAgICBzZXJ2aWNlOiAnY29kZWRlcGxveScsXG4gICAgICByZXNvdXJjZTogJ2RlcGxveW1lbnRncm91cCcsXG4gICAgICByZXNvdXJjZU5hbWU6IGAke3Byb3BzLmFwcGxpY2F0aW9uLmFwcGxpY2F0aW9uTmFtZX0vJHtkZXBsb3ltZW50R3JvdXBOYW1lfWAsXG4gICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FLFxuICAgIH0pO1xuXG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7IGVudmlyb25tZW50RnJvbUFybjogZGVwbG95bWVudEdyb3VwQXJuIH0pO1xuICAgIHRoaXMuZGVwbG95bWVudEdyb3VwTmFtZSA9IGRlcGxveW1lbnRHcm91cE5hbWU7XG4gICAgdGhpcy5kZXBsb3ltZW50R3JvdXBBcm4gPSBkZXBsb3ltZW50R3JvdXBBcm47XG4gIH1cblxuICAvKipcbiAgICogQmluZCBEZXBsb3ltZW50R3JvdXBDb25maWcgdG8gdGhlIGN1cnJlbnQgZ3JvdXAsIGlmIHN1cHBvcnRlZFxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByb3RlY3RlZCBfYmluZERlcGxveW1lbnRDb25maWcoY29uZmlnOiBJQmFzZURlcGxveW1lbnRDb25maWcpIHtcbiAgICByZXR1cm4gaXNQcmVkZWZpbmVkRGVwbG95bWVudENvbmZpZyhjb25maWcpID8gY29uZmlnLmJpbmRFbnZpcm9ubWVudCh0aGlzKSA6IGNvbmZpZztcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIERlcGxveW1lbnRHcm91cEJhc2VQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgcGh5c2ljYWwsIGh1bWFuLXJlYWRhYmxlIG5hbWUgb2YgdGhlIENvZGVEZXBsb3kgRGVwbG95bWVudCBHcm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgQW4gYXV0by1nZW5lcmF0ZWQgbmFtZSB3aWxsIGJlIHVzZWQuXG4gICAqL1xuICByZWFkb25seSBkZXBsb3ltZW50R3JvdXBOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgc2VydmljZSBSb2xlIG9mIHRoaXMgRGVwbG95bWVudCBHcm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgQSBuZXcgUm9sZSB3aWxsIGJlIGNyZWF0ZWQuXG4gICAqL1xuICByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBJZCBvZiB0aGUgcm9sZSBjb25zdHJ1Y3QsIGlmIGNyZWF0ZWQgYnkgdGhpcyBjb25zdHJ1Y3RcbiAgICpcbiAgICogRXhpc3RzIGJlY2F1c2Ugd2hlbiB3ZSBmYWN0b3JlZCB0aGlzIG91dCwgdGhlcmUgd2FzIGEgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZVxuICAgKiAzIGRlcGxveW1lbnQgZ3JvdXBzLlxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZUNvbnN0cnVjdElkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBjbGFzcyBEZXBsb3ltZW50R3JvdXBCYXNlIGV4dGVuZHMgUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIERlcGxveW1lbnQgR3JvdXAuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVwbG95bWVudEdyb3VwTmFtZSE6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgRGVwbG95bWVudCBHcm91cC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZXBsb3ltZW50R3JvdXBBcm4hOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBzZXJ2aWNlIFJvbGUgb2YgdGhpcyBEZXBsb3ltZW50IEdyb3VwLlxuICAgKlxuICAgKiAoQ2FuJ3QgbWFrZSBgcm9sZWAgcHJvcGVybHkgcHVibGljIGhlcmUsIGFzIGl0J3MgdHlwZWQgYXMgb3B0aW9uYWwgaW4gb25lXG4gICAqIGludGVyZmFjZSBhbmQgdHlwaW5nIGl0IGhlcmUgYXMgZGVmaW5pdGVseSBzZXQgaW50ZXJmZXJlcyB3aXRoIHRoYXQuKVxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBfcm9sZTogaWFtLklSb2xlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBEZXBsb3ltZW50R3JvdXBCYXNlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuZGVwbG95bWVudEdyb3VwTmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMuX3JvbGUgPSBwcm9wcy5yb2xlIHx8IG5ldyBpYW0uUm9sZSh0aGlzLCBwcm9wcy5yb2xlQ29uc3RydWN0SWQsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdjb2RlZGVwbG95LmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHZhbGlkYXRlTmFtZSgnRGVwbG95bWVudCBncm91cCcsIHRoaXMucGh5c2ljYWxOYW1lKSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaW5kIERlcGxveW1lbnRHcm91cENvbmZpZyB0byB0aGUgY3VycmVudCBncm91cCwgaWYgc3VwcG9ydGVkXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIF9iaW5kRGVwbG95bWVudENvbmZpZyhjb25maWc6IElCYXNlRGVwbG95bWVudENvbmZpZykge1xuICAgIHJldHVybiBpc1ByZWRlZmluZWREZXBsb3ltZW50Q29uZmlnKGNvbmZpZykgPyBjb25maWcuYmluZEVudmlyb25tZW50KHRoaXMpIDogY29uZmlnO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBuYW1lIGFuZCBBUk4gcHJvcGVydGllcy5cbiAgICpcbiAgICogTXVzdCBiZSBjYWxsZWQgaW4gdGhlIGNoaWxkIGNvbnN0cnVjdG9yLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByb3RlY3RlZCBfc2V0TmFtZUFuZEFybihyZXNvdXJjZTogQ2ZuRGVwbG95bWVudEdyb3VwLCBhcHBsaWNhdGlvbjogSUFwcGxpY2F0aW9uTGlrZSkge1xuICAgICh0aGlzIGFzIGFueSkuZGVwbG95bWVudEdyb3VwTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHJlc291cmNlLnJlZik7XG4gICAgKHRoaXMgYXMgYW55KS5kZXBsb3ltZW50R3JvdXBBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHRoaXMuc3RhY2suZm9ybWF0QXJuKHtcbiAgICAgIHNlcnZpY2U6ICdjb2RlZGVwbG95JyxcbiAgICAgIHJlc291cmNlOiAnZGVwbG95bWVudGdyb3VwJyxcbiAgICAgIHJlc291cmNlTmFtZTogYCR7YXBwbGljYXRpb24uYXBwbGljYXRpb25OYW1lfS8ke3Jlc291cmNlLnJlZn1gLFxuICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICB9KSwge1xuICAgICAgc2VydmljZTogJ2NvZGVkZXBsb3knLFxuICAgICAgcmVzb3VyY2U6ICdkZXBsb3ltZW50Z3JvdXAnLFxuICAgICAgcmVzb3VyY2VOYW1lOiBgJHthcHBsaWNhdGlvbi5hcHBsaWNhdGlvbk5hbWV9LyR7dGhpcy5waHlzaWNhbE5hbWV9YCxcbiAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==