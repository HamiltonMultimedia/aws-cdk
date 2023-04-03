import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * An SSM Parameter reference.
 */
export interface IParameter extends IResource {
    /**
     * The ARN of the SSM Parameter resource.
     * @attribute
     */
    readonly parameterArn: string;
    /**
     * The name of the SSM Parameter resource.
     * @attribute
     */
    readonly parameterName: string;
    /**
     * The type of the SSM Parameter resource.
     * @attribute
     */
    readonly parameterType: string;
    /**
     * Grants read (DescribeParameter, GetParameter, GetParameterHistory) permissions on the SSM Parameter.
     *
     * @param grantee the role to be granted read-only access to the parameter.
     */
    grantRead(grantee: iam.IGrantable): iam.Grant;
    /**
     * Grants write (PutParameter) permissions on the SSM Parameter.
     *
     * @param grantee the role to be granted write access to the parameter.
     */
    grantWrite(grantee: iam.IGrantable): iam.Grant;
}
/**
 * A String SSM Parameter.
 */
export interface IStringParameter extends IParameter {
    /**
     * The parameter value. Value must not nest another parameter. Do not use {{}} in the value.
     *
     * @attribute Value
     */
    readonly stringValue: string;
}
/**
 * A StringList SSM Parameter.
 */
export interface IStringListParameter extends IParameter {
    /**
     * The parameter value. Value must not nest another parameter. Do not use {{}} in the value. Values in the array
     * cannot contain commas (``,``).
     *
     * @attribute Value
     */
    readonly stringListValue: string[];
}
/**
 * Properties needed to create a new SSM Parameter.
 */
export interface ParameterOptions {
    /**
     * A regular expression used to validate the parameter value. For example, for String types with values restricted to
     * numbers, you can specify the following: ``^\d+$``
     *
     * @default no validation is performed
     */
    readonly allowedPattern?: string;
    /**
     * Information about the parameter that you want to add to the system.
     *
     * @default none
     */
    readonly description?: string;
    /**
     * The name of the parameter.
     *
     * @default - a name will be generated by CloudFormation
     */
    readonly parameterName?: string;
    /**
     * Indicates of the parameter name is a simple name (i.e. does not include "/"
     * separators).
     *
     * This is only required only if `parameterName` is a token, which means we
     * are unable to detect if the name is simple or "path-like" for the purpose
     * of rendering SSM parameter ARNs.
     *
     * If `parameterName` is not specified, `simpleName` must be `true` (or
     * undefined) since the name generated by AWS CloudFormation is always a
     * simple name.
     *
     * @default - auto-detect based on `parameterName`
     */
    readonly simpleName?: boolean;
    /**
     * The tier of the string parameter
     *
     * @default - undefined
     */
    readonly tier?: ParameterTier;
}
/**
 * Properties needed to create a String SSM parameter.
 */
export interface StringParameterProps extends ParameterOptions {
    /**
     * The value of the parameter. It may not reference another parameter and ``{{}}`` cannot be used in the value.
     */
    readonly stringValue: string;
    /**
     * The type of the string parameter
     *
     * @default ParameterType.STRING
     * @deprecated - type will always be 'String'
     */
    readonly type?: ParameterType;
    /**
     * The data type of the parameter, such as `text` or `aws:ec2:image`.
     *
     * @default ParameterDataType.TEXT
     */
    readonly dataType?: ParameterDataType;
}
/**
 * Properties needed to create a StringList SSM Parameter
 */
export interface StringListParameterProps extends ParameterOptions {
    /**
     * The values of the parameter. It may not reference another parameter and ``{{}}`` cannot be used in the value.
     */
    readonly stringListValue: string[];
}
/**
 * Basic features shared across all types of SSM Parameters.
 */
declare abstract class ParameterBase extends Resource implements IParameter {
    abstract readonly parameterArn: string;
    abstract readonly parameterName: string;
    abstract readonly parameterType: string;
    /**
     * The encryption key that is used to encrypt this parameter.
     *
     * * @default - default master key
     */
    readonly encryptionKey?: kms.IKey;
    grantRead(grantee: iam.IGrantable): iam.Grant;
    grantWrite(grantee: iam.IGrantable): iam.Grant;
}
/**
 * The type of CFN SSM Parameter
 *
 * Using specific types can be helpful in catching invalid values
 * at the start of creating or updating a stack. CloudFormation validates
 * the values against existing values in the account.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html#aws-ssm-parameter-types
 */
export declare enum ParameterValueType {
    /**
     * String
     */
    STRING = "String",
    /**
     * An Availability Zone, such as us-west-2a.
     */
    AWS_EC2_AVAILABILITYZONE_NAME = "AWS::EC2::AvailabilityZone::Name",
    /**
     * An Amazon EC2 image ID, such as ami-0ff8a91507f77f867.
     */
    AWS_EC2_IMAGE_ID = "AWS::EC2::Image::Id",
    /**
     * An Amazon EC2 instance ID, such as i-1e731a32.
     */
    AWS_EC2_INSTANCE_ID = "AWS::EC2::Instance::Id",
    /**
     * An Amazon EC2 key pair name.
     */
    AWS_EC2_KEYPAIR_KEYNAME = "AWS::EC2::KeyPair::KeyName",
    /**
     * An EC2-Classic or default VPC security group name, such as my-sg-abc.
     */
    AWS_EC2_SECURITYGROUP_GROUPNAME = "AWS::EC2::SecurityGroup::GroupName",
    /**
     * A security group ID, such as sg-a123fd85.
     */
    AWS_EC2_SECURITYGROUP_ID = "AWS::EC2::SecurityGroup::Id",
    /**
     * A subnet ID, such as subnet-123a351e.
     */
    AWS_EC2_SUBNET_ID = "AWS::EC2::Subnet::Id",
    /**
     * An Amazon EBS volume ID, such as vol-3cdd3f56.
     */
    AWS_EC2_VOLUME_ID = "AWS::EC2::Volume::Id",
    /**
     * A VPC ID, such as vpc-a123baa3.
     */
    AWS_EC2_VPC_ID = "AWS::EC2::VPC::Id",
    /**
     * An Amazon Route 53 hosted zone ID, such as Z23YXV4OVPL04A.
     */
    AWS_ROUTE53_HOSTEDZONE_ID = "AWS::Route53::HostedZone::Id"
}
/**
 * SSM parameter type
 * @deprecated these types are no longer used
 */
export declare enum ParameterType {
    /**
     * String
     */
    STRING = "String",
    /**
     * Secure String
     *
     * Parameter Store uses an AWS Key Management Service (KMS) customer master key (CMK) to encrypt the parameter value.
     * Parameters of type SecureString cannot be created directly from a CDK application.
     */
    SECURE_STRING = "SecureString",
    /**
     * String List
     */
    STRING_LIST = "StringList",
    /**
     * An Amazon EC2 image ID, such as ami-0ff8a91507f77f867
     */
    AWS_EC2_IMAGE_ID = "AWS::EC2::Image::Id"
}
/**
 * SSM parameter data type
 */
export declare enum ParameterDataType {
    /**
     * Text
     */
    TEXT = "text",
    /**
     * Aws Ec2 Image
     */
    AWS_EC2_IMAGE = "aws:ec2:image"
}
/**
 * SSM parameter tier
 */
export declare enum ParameterTier {
    /**
     * String
     */
    ADVANCED = "Advanced",
    /**
     * String
     */
    INTELLIGENT_TIERING = "Intelligent-Tiering",
    /**
     * String
     */
    STANDARD = "Standard"
}
/**
 * Common attributes for string parameters.
 */
export interface CommonStringParameterAttributes {
    /**
     * The name of the parameter store value.
     *
     * This value can be a token or a concrete string. If it is a concrete string
     * and includes "/" it must also be prefixed with a "/" (fully-qualified).
     */
    readonly parameterName: string;
    /**
     * Indicates of the parameter name is a simple name (i.e. does not include "/"
     * separators).
     *
     * This is only required only if `parameterName` is a token, which means we
     * are unable to detect if the name is simple or "path-like" for the purpose
     * of rendering SSM parameter ARNs.
     *
     * If `parameterName` is not specified, `simpleName` must be `true` (or
     * undefined) since the name generated by AWS CloudFormation is always a
     * simple name.
     *
     * @default - auto-detect based on `parameterName`
     */
    readonly simpleName?: boolean;
}
/**
 * Attributes for parameters of various types of string.
 *
 * @see ParameterType
 */
export interface StringParameterAttributes extends CommonStringParameterAttributes {
    /**
     * The version number of the value you wish to retrieve.
     *
     * @default The latest version will be retrieved.
     */
    readonly version?: number;
    /**
     * The type of the string parameter
     *
     * @default ParameterType.STRING
     * @deprecated - use valueType instead
     */
    readonly type?: ParameterType;
    /**
     * The type of the string parameter value
     *
     * Using specific types can be helpful in catching invalid values
     * at the start of creating or updating a stack. CloudFormation validates
     * the values against existing values in the account.
     *
     * Note - if you want to allow values from different AWS accounts, use
     * ParameterValueType.STRING
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html#aws-ssm-parameter-types
     *
     * @default ParameterValueType.STRING
     */
    readonly valueType?: ParameterValueType;
}
/**
 * Attributes for parameters of string list type.
 *
 * @see ParameterType
 */
export interface ListParameterAttributes extends CommonStringParameterAttributes {
    /**
     * The version number of the value you wish to retrieve.
     *
     * @default The latest version will be retrieved.
     */
    readonly version?: number;
    /**
     * The type of the string list parameter value.
     *
     * Using specific types can be helpful in catching invalid values
     * at the start of creating or updating a stack. CloudFormation validates
     * the values against existing values in the account.
     *
     * Note - if you want to allow values from different AWS accounts, use
     * ParameterValueType.STRING
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html#aws-ssm-parameter-types
     *
     * @default ParameterValueType.STRING
     */
    readonly elementType?: ParameterValueType;
}
/**
 * Attributes for secure string parameters.
 */
export interface SecureStringParameterAttributes extends CommonStringParameterAttributes {
    /**
     * The version number of the value you wish to retrieve.
     *
     * @default - AWS CloudFormation uses the latest version of the parameter
     */
    readonly version?: number;
    /**
     * The encryption key that is used to encrypt this parameter
     *
     * @default - default master key
     */
    readonly encryptionKey?: kms.IKey;
}
/**
 * Creates a new String SSM Parameter.
 * @resource AWS::SSM::Parameter
 *
 * @example
 * const ssmParameter = new ssm.StringParameter(this, 'mySsmParameter', {
 *    parameterName: 'mySsmParameter',
 *    stringValue: 'mySsmParameterValue',
 * });
 */
export declare class StringParameter extends ParameterBase implements IStringParameter {
    /**
     * Imports an external string parameter by name.
     */
    static fromStringParameterName(scope: Construct, id: string, stringParameterName: string): IStringParameter;
    /**
     * Imports an external string parameter with name and optional version.
     */
    static fromStringParameterAttributes(scope: Construct, id: string, attrs: StringParameterAttributes): IStringParameter;
    /**
     * Imports a secure string parameter from the SSM parameter store.
     */
    static fromSecureStringParameterAttributes(scope: Construct, id: string, attrs: SecureStringParameterAttributes): IStringParameter;
    /**
     * Reads the value of an SSM parameter during synthesis through an
     * environmental context provider.
     *
     * Requires that the stack this scope is defined in will have explicit
     * account/region information. Otherwise, it will fail during synthesis.
     */
    static valueFromLookup(scope: Construct, parameterName: string): string;
    /**
     * Returns a token that will resolve (during deployment) to the string value of an SSM string parameter.
     * @param scope Some scope within a stack
     * @param parameterName The name of the SSM parameter.
     * @param version The parameter version (recommended in order to ensure that the value won't change during deployment)
     */
    static valueForStringParameter(scope: Construct, parameterName: string, version?: number): string;
    /**
     * Returns a token that will resolve (during deployment) to the string value of an SSM string parameter.
     * @param scope Some scope within a stack
     * @param parameterName The name of the SSM parameter.
     * @param type The type of the SSM parameter.
     * @param version The parameter version (recommended in order to ensure that the value won't change during deployment)
     */
    static valueForTypedStringParameterV2(scope: Construct, parameterName: string, type?: ParameterValueType, version?: number): string;
    /**
     * Returns a token that will resolve (during deployment) to the string value of an SSM string parameter.
     * @param scope Some scope within a stack
     * @param parameterName The name of the SSM parameter.
     * @param type The type of the SSM parameter.
     * @param version The parameter version (recommended in order to ensure that the value won't change during deployment)
     * @deprecated - use valueForTypedStringParameterV2 instead
     */
    static valueForTypedStringParameter(scope: Construct, parameterName: string, type?: ParameterType, version?: number): string;
    /**
     * Returns a token that will resolve (during deployment)
     * @param scope Some scope within a stack
     * @param parameterName The name of the SSM parameter
     * @param version The parameter version (required for secure strings)
     * @deprecated Use `SecretValue.ssmSecure()` instead, it will correctly type the imported value as a `SecretValue` and allow importing without version.
     */
    static valueForSecureStringParameter(scope: Construct, parameterName: string, version: number): string;
    readonly parameterArn: string;
    readonly parameterName: string;
    readonly parameterType: string;
    readonly stringValue: string;
    constructor(scope: Construct, id: string, props: StringParameterProps);
}
/**
 * Creates a new StringList SSM Parameter.
 * @resource AWS::SSM::Parameter
 */
export declare class StringListParameter extends ParameterBase implements IStringListParameter {
    /**
     * Imports an external parameter of type string list.
     * Returns a token and should not be parsed.
     */
    static fromStringListParameterName(scope: Construct, id: string, stringListParameterName: string): IStringListParameter;
    /**
     * Imports an external string list parameter with name and optional version.
     */
    static fromListParameterAttributes(scope: Construct, id: string, attrs: ListParameterAttributes): IStringListParameter;
    /**
     * Returns a token that will resolve (during deployment) to the list value of an SSM StringList parameter.
     * @param scope Some scope within a stack
     * @param parameterName The name of the SSM parameter.
     * @param type the type of the SSM list parameter
     * @param version The parameter version (recommended in order to ensure that the value won't change during deployment)
     */
    static valueForTypedListParameter(scope: Construct, parameterName: string, type?: ParameterValueType, version?: number): string[];
    readonly parameterArn: string;
    readonly parameterName: string;
    readonly parameterType: string;
    readonly stringListValue: string[];
    constructor(scope: Construct, id: string, props: StringListParameterProps);
}
export {};
