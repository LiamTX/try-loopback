import {RequestBodyObject} from '@loopback/rest';

export const CredentialsRequestBody: RequestBodyObject = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['nickname', 'password'],
        properties: {
          nickname: {
            type: 'string',
          },
          password: {
            type: 'string',
            minLength: 8,
          },
        },
      }
    },
  },
};
