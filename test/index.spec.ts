import { handler } from '../src';
import { Channel, FunctionContext, FunctionRequest } from '../src/types';
import { Response } from '@twilio/runtime-handler/dist/dev-runtime/internal/response';
import { GlobalTwilio } from '@twilio-labs/serverless-runtime-types/types';

global.Twilio = {
  Response
} as Partial<GlobalTwilio> as GlobalTwilio;

console.error = jest.fn();

describe('Given the middyfied Twilio function', () => {
  describe('When the function is called with a valid mobile number and payload', () => {
    let error: string | object | Error;
    let response: string | number | boolean | object;
    const fetchLookupMock = jest.fn();
    const lookupPhoneNumbersMock = jest.fn();
    const createMessageMock = jest.fn();

    beforeEach(done => {
      fetchLookupMock.mockImplementation(() =>
        Promise.resolve({
          carrier: {
            type: 'mobile'
          },
          countryCode: 'GB'
        })
      );
      lookupPhoneNumbersMock.mockImplementation(() => ({
        fetch: fetchLookupMock
      }));
      createMessageMock.mockImplementation(() => Promise.resolve({ sid: 'SMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }));

      const functionRequest: FunctionRequest = {
        channel: Channel.SMS,
        message: 'Hello World',
        to: '+4471234567890',
        request: {
          cookies: {},
          headers: {}
        }
      };

      const functionContext: FunctionContext = {
        SUPPORTED_COUNTRY_CODES: 'GB',
        SUPPORTED_CARRIER_TYPES: 'mobile',
        TWILIO_MESSAGING_SERVICE_SID: 'MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        getTwilioClient: () => ({
          api: {
            v2010: {
              // @ts-ignore
              messages: {
                create: createMessageMock
              }
            }
          },
          lookups: {
            v1: {
              // @ts-ignore
              phoneNumbers: lookupPhoneNumbersMock
            }
          }
        })
      };

      handler(functionContext, functionRequest, (functionError, functionResponse) => {
        error = functionError;
        response = functionResponse;
        done();
      });
    });

    test('Then the phone number carrier should have been looked up', () => {
      expect(lookupPhoneNumbersMock).toHaveBeenCalledWith('+4471234567890');
      expect(fetchLookupMock).toHaveBeenCalledWith({ type: ['carrier'] });
    });

    test('Then the message should have been created', () => {
      expect(createMessageMock).toHaveBeenCalledWith({
        to: '+4471234567890',
        messagingServiceSid: 'MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        body: 'Hello World'
      });
    });

    test('Then there should be no error', () => {
      expect(error).toBeNull();
    });

    test('Then the sid of the created message should be returned', () => {
      expect(response).toEqual({
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': []
        },
        body: {
          sid: 'SMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        }
      });
    });
  });

  describe('When the function is called with a local US number', () => {
    let error: string | object | Error;
    let response: string | number | boolean | object;
    const fetchLookupMock = jest.fn();
    const lookupPhoneNumbersMock = jest.fn();
    const createMessageMock = jest.fn();

    beforeEach(done => {
      fetchLookupMock.mockImplementation(() =>
        Promise.resolve({
          carrier: {
            type: 'local'
          },
          countryCode: 'US'
        })
      );
      lookupPhoneNumbersMock.mockImplementation(() => ({
        fetch: fetchLookupMock
      }));

      const functionRequest: FunctionRequest = {
        channel: Channel.SMS,
        message: 'Hello World',
        to: '+111234567890',
        request: {
          cookies: {},
          headers: {}
        }
      };

      const functionContext: FunctionContext = {
        SUPPORTED_COUNTRY_CODES: 'GB',
        SUPPORTED_CARRIER_TYPES: 'mobile',
        TWILIO_MESSAGING_SERVICE_SID: 'MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        getTwilioClient: () => ({
          api: {
            v2010: {
              // @ts-ignore
              messages: {
                create: createMessageMock
              }
            }
          },
          lookups: {
            v1: {
              // @ts-ignore
              phoneNumbers: lookupPhoneNumbersMock
            }
          }
        })
      };

      handler(functionContext, functionRequest, (functionError, functionResponse) => {
        error = functionError;
        response = functionResponse;
        done();
      });
    });

    test('Then the phone number carrier should have been looked up', () => {
      expect(lookupPhoneNumbersMock).toHaveBeenCalledWith('+111234567890');
      expect(fetchLookupMock).toHaveBeenCalledWith({ type: ['carrier'] });
    });

    test('Then the message should not have been created', () => {
      expect(createMessageMock).not.toHaveBeenCalled();
    });

    test('Then there should be no error', () => {
      expect(error).toBeNull();
    });

    test('Then an bad request error should be returned', () => {
      expect(response).toEqual({
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': []
        },
        body: {
          message: 'The phone number provided is not valid',
          details: [
            {
              instancePath: '/countryCode',
              schemaPath: '#/properties/countryCode/enum',
              keyword: 'enum',
              params: { allowedValues: ['GB'] },
              message: 'must be equal to one of the allowed values'
            },
            {
              instancePath: '/carrier/type',
              schemaPath: '#/properties/carrier/properties/type/enum',
              keyword: 'enum',
              params: { allowedValues: ['mobile'] },
              message: 'must be equal to one of the allowed values'
            }
          ]
        }
      });
    });
  });

  describe('When the function is called with an invalid payload', () => {
    let error: string | object | Error;
    let response: string | number | boolean | object;
    const lookupPhoneNumbersMock = jest.fn();
    const createMessageMock = jest.fn();

    beforeEach(done => {
      const functionRequest = {} as FunctionRequest;

      const functionContext: FunctionContext = {
        SUPPORTED_COUNTRY_CODES: 'GB',
        SUPPORTED_CARRIER_TYPES: 'mobile',
        TWILIO_MESSAGING_SERVICE_SID: 'MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        getTwilioClient: () => ({
          api: {
            v2010: {
              // @ts-ignore
              messages: {
                create: createMessageMock
              }
            }
          },
          lookups: {
            v1: {
              // @ts-ignore
              phoneNumbers: lookupPhoneNumbersMock
            }
          }
        })
      };

      handler(functionContext, functionRequest, (functionError, functionResponse) => {
        error = functionError;
        response = functionResponse;
        done();
      });
    });

    test('Then the phone number carrier should not have been looked up', () => {
      expect(lookupPhoneNumbersMock).not.toHaveBeenCalled();
    });

    test('Then the message should not have been created', () => {
      expect(createMessageMock).not.toHaveBeenCalled();
    });

    test('Then there should be no error', () => {
      expect(error).toBeNull();
    });

    test('Then an bad request error should be returned', () => {
      expect(response).toEqual({
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': []
        },
        body: {
          message: 'Event object failed validation',
          details: [
            {
              instancePath: '',
              schemaPath: '#/required',
              keyword: 'required',
              params: { missingProperty: 'channel' },
              message: 'must have required property channel'
            },
            {
              instancePath: '',
              schemaPath: '#/required',
              keyword: 'required',
              params: { missingProperty: 'to' },
              message: 'must have required property to'
            },
            {
              instancePath: '',
              schemaPath: '#/required',
              keyword: 'required',
              params: { missingProperty: 'message' },
              message: 'must have required property message'
            },
            {
              instancePath: '',
              schemaPath: '#/discriminator',
              keyword: 'discriminator',
              params: { error: 'tag', tag: 'channel' },
              message: 'tag "channel" must be string'
            }
          ]
        }
      });
    });
  });

  describe('When the function is called with an the channel set as SMS but an email address is supplied', () => {
    let error: string | object | Error;
    let response: string | number | boolean | object;
    const lookupPhoneNumbersMock = jest.fn();
    const createMessageMock = jest.fn();

    beforeEach(done => {
      const functionRequest = {
        channel: Channel.SMS,
        message: 'Hello World',
        to: 'test@test.com',
        request: {
          cookies: {},
          headers: {}
        }
      };

      const functionContext: FunctionContext = {
        SUPPORTED_COUNTRY_CODES: 'GB',
        SUPPORTED_CARRIER_TYPES: 'mobile',
        TWILIO_MESSAGING_SERVICE_SID: 'MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        getTwilioClient: () => ({
          api: {
            v2010: {
              // @ts-ignore
              messages: {
                create: createMessageMock
              }
            }
          },
          lookups: {
            v1: {
              // @ts-ignore
              phoneNumbers: lookupPhoneNumbersMock
            }
          }
        })
      };

      handler(functionContext, functionRequest, (functionError, functionResponse) => {
        error = functionError;
        response = functionResponse;
        done();
      });
    });

    test('Then the phone number carrier should not have been looked up', () => {
      expect(lookupPhoneNumbersMock).not.toHaveBeenCalled();
    });

    test('Then the message should not have been created', () => {
      expect(createMessageMock).not.toHaveBeenCalled();
    });

    test('Then there should be no error', () => {
      expect(error).toBeNull();
    });

    test('Then an bad request error should be returned', () => {
      expect(response).toEqual({
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': []
        },
        body: {
          message: 'Event object failed validation',
          details: [
            {
              instancePath: '/to',
              schemaPath: '#/oneOf/0/properties/to/pattern',
              keyword: 'pattern',
              params: { pattern: '^\\+[1-9]\\d{1,14}$' },
              message: 'must match pattern "^\\+[1-9]\\d{1,14}$"'
            }
          ]
        }
      });
    });
  });
});
