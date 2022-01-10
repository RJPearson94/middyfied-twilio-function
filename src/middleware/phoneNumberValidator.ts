import { MiddlewareObj } from '@middy/core';
import Ajv, { ValidateFunction } from 'ajv';
import { BadRequest } from 'http-errors';

import { FunctionRequest, FunctionResponse, FunctionContext } from '../types';

const SEPARATOR = ',';

const getSchemaEnumOrDefault = (enumValues: string[], defaultValue = {}) => {
  if (enumValues.length === 1 && enumValues[0] === 'ALL') {
    return defaultValue;
  }
  return { enum: enumValues };
};

const compileSchema = (countryCodes: string[], carrierTypes: string[]) => {
  const ajv = new Ajv({ allErrors: true });
  return ajv.compile({
    type: 'object',
    properties: {
      countryCode: { type: 'string', ...getSchemaEnumOrDefault(countryCodes) },
      carrier: {
        type: 'object',
        properties: {
          type: { type: 'string', ...getSchemaEnumOrDefault(carrierTypes) }
        },
        required: ['type'],
        additionalProperties: true
      }
    },
    required: ['countryCode', 'carrier'],
    additionalProperties: true
  });
};

let validateFunction: ValidateFunction;

export const phoneNumberValidator = (): MiddlewareObj<FunctionRequest, FunctionResponse, Error, FunctionContext> => ({
  before: async ({ event, context }) => {
    validateFunction =
      validateFunction || compileSchema(context.SUPPORTED_COUNTRY_CODES.split(SEPARATOR), context.SUPPORTED_CARRIER_TYPES.split(SEPARATOR));

    const response = await context
      .getTwilioClient()
      .lookups.v1.phoneNumbers(event.to)
      .fetch({ type: ['carrier'] });

    if (!validateFunction(response)) {
      const badRequest = new BadRequest('The phone number provided is not valid');
      badRequest.details = validateFunction.errors;
      throw badRequest;
    }
  }
});
