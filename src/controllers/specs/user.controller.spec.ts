import {RequestBodyObject, ResponseObject} from '@loopback/rest';

export const CredentialResponseBody: ResponseObject = {
  description: 'User authenticated',
  content: {
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string'
        }
      }
    }
  }
}

export const CredentialRequestBody: RequestBodyObject = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['nickname', 'password'],
        properties: {
          email: {
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
}
