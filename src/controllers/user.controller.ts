// Uncomment these imports to begin using these cool features!

import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {get, getJsonSchemaRef, post, requestBody, response} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {UseCasesBindings} from '../keys';
import {User} from '../models';
import {Credentials} from '../repositories';
import {AuthUserUseCase} from '../useCases/authUser/AuthUserUseCase';
import {CreateUserUseCase} from '../useCases/createUser/CreateUserUseCase';
import {CredentialRequestBody, CredentialResponseBody} from './specs/user.controller.spec';

// import {inject} from '@loopback/core';


export class UserController {
  constructor(
    @inject(UseCasesBindings.CREATE_USER)
    private createUserUseCase: CreateUserUseCase,
    @inject(UseCasesBindings.AUTH_USER)
    private authUserUseCase: AuthUserUseCase,
  ) { }

  @post('/api/users/create')
  @response(200, {
    description: 'User Created',
    content: {
      schema: getJsonSchemaRef(User)
    }
  })
  async create(@requestBody() user: User) {
    try {
      return await this.createUserUseCase.execute(user);
    } catch (error) {
      return {message: error.message || 'Internal error'};
    }
  }

  @post('/api/users/auth')
  @response(200, CredentialResponseBody)
  async login(@requestBody(CredentialRequestBody) credentials: Credentials) {
    try {
      return await this.authUserUseCase.execute(credentials);
    } catch (error) {
      return {message: error.message || 'Internal error'};
    }
  }

  @get('/api/users/me')
  // @response(200, {
  //   description: 'My profile',
  //   content: getJsonSchemaRef(User)
  // })
  @authenticate('jwt')
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ) {
    return Promise.resolve(currentUser);
  }
}
