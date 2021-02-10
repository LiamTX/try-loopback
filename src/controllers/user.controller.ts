// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {getJsonSchemaRef, post, requestBody, response} from '@loopback/rest';
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


  /*
    --Cadastra um novo usuario--

    Recebe um json :
    {
      nickname*: string,
      password*: string
    }

    Retorna um json:
    {
      "UserSchema"
    }
  */
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

  /*
    --Efetua a autenticação do usuario--

    Recebe um json :
    {
      nickname*: string,
      password*: string
    }

    Retorna um json :
    {
      token: ....
    }
  */
  @post('/api/users/auth')
  @response(200, CredentialResponseBody)
  async login(@requestBody(CredentialRequestBody) credentials: Credentials) {
    try {
      return await this.authUserUseCase.execute(credentials);
    } catch (error) {
      return {message: error.message || 'Internal error'};
    }
  }
}
