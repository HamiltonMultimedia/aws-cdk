import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Stack, IResource } from '@aws-cdk/core';
import { IPredefinedDeploymentConfig } from './predefined-deployment-config';
import { IBaseDeploymentConfig } from '../base-deployment-config';
import { CfnDeploymentGroup } from '../codedeploy.generated';
import { AutoRollbackConfig } from '../rollback-config';
export declare function arnForApplication(stack: Stack, applicationName: string): string;
export declare function nameFromDeploymentGroupArn(deploymentGroupArn: string): string;
export declare function arnForDeploymentConfig(name: string, resource?: IResource): string;
export declare function renderAlarmConfiguration(alarms: cloudwatch.IAlarm[], ignorePollAlarmFailure: boolean | undefined, removeAlarms?: boolean): CfnDeploymentGroup.AlarmConfigurationProperty | undefined;
export declare function deploymentConfig(name: string): IBaseDeploymentConfig & IPredefinedDeploymentConfig;
export declare function renderAutoRollbackConfiguration(alarms: cloudwatch.IAlarm[], autoRollbackConfig?: AutoRollbackConfig): CfnDeploymentGroup.AutoRollbackConfigurationProperty | undefined;
export declare function validateName(type: 'Application' | 'Deployment group' | 'Deployment config', name: string): string[];
