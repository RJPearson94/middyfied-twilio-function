import { Context } from '@twilio-labs/serverless-runtime-types/types';

export type FunctionContext = Context<{
  TWILIO_MESSAGING_SERVICE_SID: string;
  SUPPORTED_CARRIER_TYPES: string;
  SUPPORTED_COUNTRY_CODES: string;
}>;
