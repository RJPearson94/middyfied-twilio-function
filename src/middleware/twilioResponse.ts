import '@twilio-labs/serverless-runtime-types';
import { MiddlewareObj } from '@middy/core';
import { TwilioResponse } from '@twilio-labs/serverless-runtime-types/types';

import { HttpError } from 'http-errors';

import { FunctionContext, FunctionRequest, FunctionResponse } from '../types';

const createResponse = (statusCode: number, body: any): TwilioResponse => {
  const twilioResponse = new Twilio.Response();
  twilioResponse.setStatusCode(statusCode);
  twilioResponse.appendHeader('Content-Type', 'application/json');
  twilioResponse.setBody(body);
  return twilioResponse;
};

const isHttpError = (error: Error | HttpError | TwilioResponse): error is HttpError => 'statusCode' in error;

export type TwilioResponseOptions = {
  successStatusCode: number;
};

export const twilioResponse = ({
  successStatusCode
}: TwilioResponseOptions): MiddlewareObj<FunctionRequest, FunctionResponse | TwilioResponse, Error | HttpError, FunctionContext> => ({
  after: async handler => {
    handler.response = createResponse(successStatusCode, handler.response);
  },
  onError: async handler => {
    console.error(JSON.stringify(handler.error));

    let statusCode = 500;
    let body: any = {
      message: 'An error occurred'
    };
    if (isHttpError(handler.error)) {
      statusCode = handler.error.statusCode;
      body = {
        message: handler.error.message,
        ...(handler.error.details ? { details: handler.error.details } : {})
      };
    }

    handler.response = createResponse(statusCode, body);
  }
});
