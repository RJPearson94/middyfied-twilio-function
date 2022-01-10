import middy from '@middy/core';
import validator from '@middy/validator';

import { inputSchema } from './schema';
import { twilioMiddyWrapper } from './utils';
import { FunctionContext, FunctionRequest, FunctionResponse } from './types';
import { phoneNumberValidator, twilioResponse } from './middleware';

const twilioHandler = async (event: FunctionRequest, context: FunctionContext): Promise<FunctionResponse> => {
  const { sid } = await context.getTwilioClient().api.v2010.messages.create({
    to: event.to,
    messagingServiceSid: context.TWILIO_MESSAGING_SERVICE_SID,
    body: event.message
  });

  return {
    sid
  };
};

export const handler = twilioMiddyWrapper<FunctionRequest, FunctionContext>(
  middy(twilioHandler)
    .use(twilioResponse({ successStatusCode: 200 }))
    .use(
      validator({
        inputSchema,
        ajvOptions: {
          discriminator: true
        }
      })
    )
    .use(phoneNumberValidator())
);
