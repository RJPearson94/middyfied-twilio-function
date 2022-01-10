import { MiddyfiedHandler } from '@middy/core';
import { Context, ServerlessCallback, ServerlessEventObject } from '@twilio-labs/serverless-runtime-types/types';

export type TwilioMiddyWrapperSignature = <E extends ServerlessEventObject, C extends Context>(
  middyfiedHandler: MiddyfiedHandler
) => (context: C, event: E, callback: ServerlessCallback) => void;

export const twilioMiddyWrapper: TwilioMiddyWrapperSignature = middyfiedHandler => (context, event, callback) =>
  // @ts-ignore the typescript definition is incorrect for the middyfied handler
  // eslint-disable-next-line @typescript-eslint/ban-types
  (middyfiedHandler(event, context) as Promise<string | number | boolean | object>)
    .then(response => callback(null, response))
    .catch(error => callback(error));
