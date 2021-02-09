// Uncomment these imports to begin using these cool features!


import {inject} from '@loopback/core';
import {getJsonSchemaRef, post, requestBody, response} from '@loopback/rest';
import {User} from '../models';
import {AuthUserUseCase} from '../useCases/authUser/AuthUserUseCase';
import {IAuthUserDTO} from '../useCases/authUser/IAuthUserDTO';
import {CreateUserUseCase} from '../useCases/createUser/CreateUserUseCase';
import {CredentialsRequestBody} from './specs/user.controller.spec';


export class UserController {
  constructor(
    @inject('useCase.user.create')
    private createUserUseCase: CreateUserUseCase,
    @inject('useCase.user.auth')
    private authUserUseCase: AuthUserUseCase,
  ) { }

  @post('/api/users/signup')
  @response(200, {
    description: 'user created',
    content: {
      schema: getJsonSchemaRef(User)
    }
  })
  async signup(@requestBody() userData: User) {
    try {
      return await this.createUserUseCase.execute(userData);
    } catch (error) {
      return {message: error.message || 'Internal error'};
    }
  }

  @post('/api/users/login')
  @response(200, {
    description: 'user logged',
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
  })
  async login(@requestBody(CredentialsRequestBody) credentials: IAuthUserDTO) {
    try {
      return await this.authUserUseCase.execute(credentials);
    } catch (error) {
      return {message: error.message || 'Internal error'};
    }
  }
}
