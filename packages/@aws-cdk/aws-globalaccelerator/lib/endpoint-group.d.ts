import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IEndpoint } from './endpoint';
import { IListener } from './listener';
/**
 * The interface of the EndpointGroup
 */
export interface IEndpointGroup extends cdk.IResource {
    /**
     * EndpointGroup ARN
     * @attribute
     */
    readonly endpointGroupArn: string;
}
/**
 * Basic options for creating a new EndpointGroup
 */
export interface EndpointGroupOptions {
    /**
     * Name of the endpoint group
     *
     * @default - logical ID of the resource
     */
    readonly endpointGroupName?: string;
    /**
     * The AWS Region where the endpoint group is located.
     *
     * @default - region of the first endpoint in this group, or the stack region if that region can't be determined
     */
    readonly region?: string;
    /**
     * The time between health checks for each endpoint
     *
     * Must be either 10 or 30 seconds.
     *
     * @default Duration.seconds(30)
     */
    readonly healthCheckInterval?: cdk.Duration;
    /**
     * The ping path for health checks (if the protocol is HTTP(S)).
     *
     * @default '/'
     */
    readonly healthCheckPath?: string;
    /**
     * The port used to perform health checks
     *
     * @default - The listener's port
     */
    readonly healthCheckPort?: number;
    /**
     * The protocol used to perform health checks
     *
     * @default HealthCheckProtocol.TCP
     */
    readonly healthCheckProtocol?: HealthCheckProtocol;
    /**
     * The number of consecutive health checks required to set the state of a
     * healthy endpoint to unhealthy, or to set an unhealthy endpoint to healthy.
     *
     * @default 3
     */
    readonly healthCheckThreshold?: number;
    /**
     * The percentage of traffic to send to this AWS Region.
     *
     * The percentage is applied to the traffic that would otherwise have been
     * routed to the Region based on optimal routing. Additional traffic is
     * distributed to other endpoint groups for this listener.
     *
     * @default 100
     */
    readonly trafficDialPercentage?: number;
    /**
     * Override the destination ports used to route traffic to an endpoint.
     *
     * Unless overridden, the port used to hit the endpoint will be the same as the port
     * that traffic arrives on at the listener.
     *
     * @default - No overrides
     */
    readonly portOverrides?: PortOverride[];
    /**
     * Initial list of endpoints for this group
     *
     * @default - Group is initially empty
     */
    readonly endpoints?: IEndpoint[];
}
/**
 * Override specific listener ports used to route traffic to endpoints that are part of an endpoint group.
 */
export interface PortOverride {
    /**
     * The listener port that you want to map to a specific endpoint port.
     *
     * This is the port that user traffic arrives to the Global Accelerator on.
     */
    readonly listenerPort: number;
    /**
     * The endpoint port that you want a listener port to be mapped to.
     *
     * This is the port on the endpoint, such as the Application Load Balancer or Amazon EC2 instance.
     */
    readonly endpointPort: number;
}
/**
 * The protocol for the connections from clients to the accelerator.
 */
export declare enum HealthCheckProtocol {
    /**
     * TCP
     */
    TCP = "TCP",
    /**
     * HTTP
     */
    HTTP = "HTTP",
    /**
     * HTTPS
     */
    HTTPS = "HTTPS"
}
/**
 * Property of the EndpointGroup
 */
export interface EndpointGroupProps extends EndpointGroupOptions {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    readonly listener: IListener;
}
/**
 * EndpointGroup construct
 */
export declare class EndpointGroup extends cdk.Resource implements IEndpointGroup {
    /**
     * import from ARN
     */
    static fromEndpointGroupArn(scope: Construct, id: string, endpointGroupArn: string): IEndpointGroup;
    readonly endpointGroupArn: string;
    /**
     *
     * The name of the endpoint group
     *
     * @attribute
     */
    readonly endpointGroupName: string;
    /**
     * The array of the endpoints in this endpoint group
     */
    protected readonly endpoints: IEndpoint[];
    constructor(scope: Construct, id: string, props: EndpointGroupProps);
    /**
     * Add an endpoint
     */
    addEndpoint(endpoint: IEndpoint): void;
    /**
     * Return an object that represents the Accelerator's Security Group
     *
     * Uses a Custom Resource to look up the Security Group that Accelerator
     * creates at deploy time. Requires your VPC ID to perform the lookup.
     *
     * The Security Group will only be created if you enable **Client IP
     * Preservation** on any of the endpoints.
     *
     * You cannot manipulate the rules inside this security group, but you can
     * use this security group as a Peer in Connections rules on other
     * constructs.
     */
    connectionsPeer(id: string, vpc: ec2.IVpc): ec2.IPeer;
    private renderEndpoints;
    /**
     * Return the first (readable) region of the endpoints in this group
     */
    private firstEndpointRegion;
}
