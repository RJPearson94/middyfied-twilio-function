import { Channel } from '../types';

export const inputSchema = {
  type: 'object',
  properties: {
    channel: { type: 'string', enum: [Channel.SMS] },
    to: { type: 'string' },
    message: { type: 'string' }
  },
  required: ['channel', 'to', 'message'],
  discriminator: { propertyName: 'channel' },
  oneOf: [
    {
      properties: {
        channel: { const: Channel.SMS },
        to: { type: 'string', pattern: '^\\+[1-9]\\d{1,14}$' }
      }
    }
  ]
};
