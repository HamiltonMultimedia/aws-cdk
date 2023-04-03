import * as iam from '@aws-cdk/aws-iam';
import { Duration, IResource, RemovalPolicy, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAliasRecordTarget } from './alias-record-target';
import { IHostedZone } from './hosted-zone-ref';
/**
 * A record set
 */
export interface IRecordSet extends IResource {
    /**
     * The domain name of the record
     */
    readonly domainName: string;
}
/**
 * The record type.
 */
export declare enum RecordType {
    /**
     * route traffic to a resource, such as a web server, using an IPv4 address in dotted decimal
     * notation
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#AFormat
     */
    A = "A",
    /**
     * route traffic to a resource, such as a web server, using an IPv6 address in colon-separated
     * hexadecimal format
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#AAAAFormat
     */
    AAAA = "AAAA",
    /**
     * A CAA record specifies which certificate authorities (CAs) are allowed to issue certificates
     * for a domain or subdomain
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#CAAFormat
     */
    CAA = "CAA",
    /**
     * A CNAME record maps DNS queries for the name of the current record, such as acme.example.com,
     * to another domain (example.com or example.net) or subdomain (acme.example.com or zenith.example.org).
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#CNAMEFormat
     */
    CNAME = "CNAME",
    /**
     * A delegation signer (DS) record refers a zone key for a delegated subdomain zone.
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#DSFormat
     */
    DS = "DS",
    /**
     * An MX record specifies the names of your mail servers and, if you have two or more mail servers,
     * the priority order.
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#MXFormat
     */
    MX = "MX",
    /**
     * A Name Authority Pointer (NAPTR) is a type of record that is used by Dynamic Delegation Discovery
     * System (DDDS) applications to convert one value to another or to replace one value with another.
     * For example, one common use is to convert phone numbers into SIP URIs.
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#NAPTRFormat
     */
    NAPTR = "NAPTR",
    /**
     * An NS record identifies the name servers for the hosted zone
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#NSFormat
     */
    NS = "NS",
    /**
     * A PTR record maps an IP address to the corresponding domain name.
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#PTRFormat
     */
    PTR = "PTR",
    /**
     * A start of authority (SOA) record provides information about a domain and the corresponding Amazon
     * Route 53 hosted zone
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#SOAFormat
     */
    SOA = "SOA",
    /**
     * SPF records were formerly used to verify the identity of the sender of email messages.
     * Instead of an SPF record, we recommend that you create a TXT record that contains the applicable value.
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#SPFFormat
     */
    SPF = "SPF",
    /**
     * An SRV record Value element consists of four space-separated values. The first three values are
     * decimal numbers representing priority, weight, and port. The fourth value is a domain name.
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#SRVFormat
     */
    SRV = "SRV",
    /**
     * A TXT record contains one or more strings that are enclosed in double quotation marks (").
     *
     * @see https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#TXTFormat
     */
    TXT = "TXT"
}
/**
 * Options for a RecordSet.
 */
export interface RecordSetOptions {
    /**
     * The hosted zone in which to define the new record.
     */
    readonly zone: IHostedZone;
    /**
     * The domain name for this record.
     *
     * @default zone root
     */
    readonly recordName?: string;
    /**
     * The resource record cache time to live (TTL).
     *
     * @default Duration.minutes(30)
     */
    readonly ttl?: Duration;
    /**
     * A comment to add on the record.
     *
     * @default no comment
     */
    readonly comment?: string;
    /**
     * Whether to delete the same record set in the hosted zone if it already exists (dangerous!)
     *
     * This allows to deploy a new record set while minimizing the downtime because the
     * new record set will be created immediately after the existing one is deleted. It
     * also avoids "manual" actions to delete existing record sets.
     *
     * > **N.B.:** this feature is dangerous, use with caution! It can only be used safely when
     * > `deleteExisting` is set to `true` as soon as the resource is added to the stack. Changing
     * > an existing Record Set's `deleteExisting` property from `false -> true` after deployment
     * > will delete the record!
     *
     * @default false
     */
    readonly deleteExisting?: boolean;
}
/**
 * Type union for a record that accepts multiple types of target.
 */
export declare class RecordTarget {
    readonly values?: string[] | undefined;
    readonly aliasTarget?: IAliasRecordTarget | undefined;
    /**
     * Use string values as target.
     */
    static fromValues(...values: string[]): RecordTarget;
    /**
     * Use an alias as target.
     */
    static fromAlias(aliasTarget: IAliasRecordTarget): RecordTarget;
    /**
     * Use ip addresses as target.
     */
    static fromIpAddresses(...ipAddresses: string[]): RecordTarget;
    /**
     *
     * @param values correspond with the chosen record type (e.g. for 'A' Type, specify one or more IP addresses)
     * @param aliasTarget alias for targets such as CloudFront distribution to route traffic to
     */
    protected constructor(values?: string[] | undefined, aliasTarget?: IAliasRecordTarget | undefined);
}
/**
 * Construction properties for a RecordSet.
 */
export interface RecordSetProps extends RecordSetOptions {
    /**
     * The record type.
     */
    readonly recordType: RecordType;
    /**
     * The target for this record, either `RecordTarget.fromValues()` or
     * `RecordTarget.fromAlias()`.
     */
    readonly target: RecordTarget;
}
/**
 * A record set.
 */
export declare class RecordSet extends Resource implements IRecordSet {
    readonly domainName: string;
    constructor(scope: Construct, id: string, props: RecordSetProps);
}
/**
 * Target for a DNS A Record
 *
 * @deprecated Use RecordTarget
 */
export declare class AddressRecordTarget extends RecordTarget {
}
/**
 * Construction properties for a ARecord.
 */
export interface ARecordProps extends RecordSetOptions {
    /**
     * The target.
     */
    readonly target: RecordTarget;
}
/**
 * A DNS A record
 *
 * @resource AWS::Route53::RecordSet
 */
export declare class ARecord extends RecordSet {
    constructor(scope: Construct, id: string, props: ARecordProps);
}
/**
 * Construction properties for a AaaaRecord.
 */
export interface AaaaRecordProps extends RecordSetOptions {
    /**
     * The target.
     */
    readonly target: RecordTarget;
}
/**
 * A DNS AAAA record
 *
 * @resource AWS::Route53::RecordSet
 */
export declare class AaaaRecord extends RecordSet {
    constructor(scope: Construct, id: string, props: AaaaRecordProps);
}
/**
 * Construction properties for a CnameRecord.
 */
export interface CnameRecordProps extends RecordSetOptions {
    /**
     * The domain name.
     */
    readonly domainName: string;
}
/**
 * A DNS CNAME record
 *
 * @resource AWS::Route53::RecordSet
 */
export declare class CnameRecord extends RecordSet {
    constructor(scope: Construct, id: string, props: CnameRecordProps);
}
/**
 * Construction properties for a TxtRecord.
 */
export interface TxtRecordProps extends RecordSetOptions {
    /**
     * The text values.
     */
    readonly values: string[];
}
/**
 * A DNS TXT record
 *
 * @resource AWS::Route53::RecordSet
 */
export declare class TxtRecord extends RecordSet {
    constructor(scope: Construct, id: string, props: TxtRecordProps);
}
/**
 * Properties for a SRV record value.
 */
export interface SrvRecordValue {
    /**
     * The priority.
     */
    readonly priority: number;
    /**
     * The weight.
     */
    readonly weight: number;
    /**
     * The port.
     */
    readonly port: number;
    /**
     * The server host name.
     */
    readonly hostName: string;
}
/**
 * Construction properties for a SrvRecord.
 */
export interface SrvRecordProps extends RecordSetOptions {
    /**
     * The values.
     */
    readonly values: SrvRecordValue[];
}
/**
 * A DNS SRV record
 *
 * @resource AWS::Route53::RecordSet
 */
export declare class SrvRecord extends RecordSet {
    constructor(scope: Construct, id: string, props: SrvRecordProps);
}
/**
 * The CAA tag.
 */
export declare enum CaaTag {
    /**
     * Explicity authorizes a single certificate authority to issue a
     * certificate (any type) for the hostname.
     */
    ISSUE = "issue",
    /**
     * Explicity authorizes a single certificate authority to issue a
     * wildcard certificate (and only wildcard) for the hostname.
     */
    ISSUEWILD = "issuewild",
    /**
     * Specifies a URL to which a certificate authority may report policy
     * violations.
     */
    IODEF = "iodef"
}
/**
 * Properties for a CAA record value.
 */
export interface CaaRecordValue {
    /**
     * The flag.
     */
    readonly flag: number;
    /**
     * The tag.
     */
    readonly tag: CaaTag;
    /**
     * The value associated with the tag.
     */
    readonly value: string;
}
/**
 * Construction properties for a CaaRecord.
 */
export interface CaaRecordProps extends RecordSetOptions {
    /**
     * The values.
     */
    readonly values: CaaRecordValue[];
}
/**
 * A DNS CAA record
 *
 * @resource AWS::Route53::RecordSet
 */
export declare class CaaRecord extends RecordSet {
    constructor(scope: Construct, id: string, props: CaaRecordProps);
}
/**
 * Construction properties for a CaaAmazonRecord.
 */
export interface CaaAmazonRecordProps extends RecordSetOptions {
}
/**
 * A DNS Amazon CAA record.
 *
 * A CAA record to restrict certificate authorities allowed
 * to issue certificates for a domain to Amazon only.
 *
 * @resource AWS::Route53::RecordSet
 */
export declare class CaaAmazonRecord extends CaaRecord {
    constructor(scope: Construct, id: string, props: CaaAmazonRecordProps);
}
/**
 * Properties for a MX record value.
 */
export interface MxRecordValue {
    /**
     * The priority.
     */
    readonly priority: number;
    /**
     * The mail server host name.
     */
    readonly hostName: string;
}
/**
 * Construction properties for a MxRecord.
 */
export interface MxRecordProps extends RecordSetOptions {
    /**
     * The values.
     */
    readonly values: MxRecordValue[];
}
/**
 * A DNS MX record
 *
 * @resource AWS::Route53::RecordSet
 */
export declare class MxRecord extends RecordSet {
    constructor(scope: Construct, id: string, props: MxRecordProps);
}
/**
 * Construction properties for a NSRecord.
 */
export interface NsRecordProps extends RecordSetOptions {
    /**
     * The NS values.
     */
    readonly values: string[];
}
/**
 * A DNS NS record
 *
 * @resource AWS::Route53::RecordSet
 */
export declare class NsRecord extends RecordSet {
    constructor(scope: Construct, id: string, props: NsRecordProps);
}
/**
 * Construction properties for a DSRecord.
 */
export interface DsRecordProps extends RecordSetOptions {
    /**
     * The DS values.
     */
    readonly values: string[];
}
/**
 * A DNS DS record
 *
 * @resource AWS::Route53::RecordSet
 */
export declare class DsRecord extends RecordSet {
    constructor(scope: Construct, id: string, props: DsRecordProps);
}
/**
 * Construction properties for a ZoneDelegationRecord
 */
export interface ZoneDelegationRecordProps extends RecordSetOptions {
    /**
     * The name servers to report in the delegation records.
     */
    readonly nameServers: string[];
}
/**
 * A record to delegate further lookups to a different set of name servers.
 */
export declare class ZoneDelegationRecord extends RecordSet {
    constructor(scope: Construct, id: string, props: ZoneDelegationRecordProps);
}
/**
 * Construction properties for a CrossAccountZoneDelegationRecord
 */
export interface CrossAccountZoneDelegationRecordProps {
    /**
     * The zone to be delegated
     */
    readonly delegatedZone: IHostedZone;
    /**
     * The hosted zone name in the parent account
     *
     * @default - no zone name
     */
    readonly parentHostedZoneName?: string;
    /**
     * The hosted zone id in the parent account
     *
     * @default - no zone id
     */
    readonly parentHostedZoneId?: string;
    /**
     * The delegation role in the parent account
     */
    readonly delegationRole: iam.IRole;
    /**
     * The resource record cache time to live (TTL).
     *
     * @default Duration.days(2)
     */
    readonly ttl?: Duration;
    /**
     * The removal policy to apply to the record set.
     *
     * @default RemovalPolicy.DESTROY
     */
    readonly removalPolicy?: RemovalPolicy;
}
/**
 * A Cross Account Zone Delegation record
 */
export declare class CrossAccountZoneDelegationRecord extends Construct {
    constructor(scope: Construct, id: string, props: CrossAccountZoneDelegationRecordProps);
}
