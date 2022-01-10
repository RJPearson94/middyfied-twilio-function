import { ServerlessEventObject } from '@twilio-labs/serverless-runtime-types/types';

export enum Channel {
  SMS = 'sms'
}

export type FunctionRequest = {
  channel: Channel;
  to: string;
  message: string;
} & ServerlessEventObject;
