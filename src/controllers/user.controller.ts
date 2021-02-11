// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getJsonSchemaRef, getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {PermissionKeys} from '../authorization/permission-keys';
import {UseCasesBindings} from '../keys';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories';
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
    @repository(UserRepository)
    private userRepository: UserRepository,
  ) { }

  @get('/api/users/all')
  @response(200, {
    description: 'All Users',
    content: {
      schema: getModelSchemaRef(User)
    }
  })
  async findAll() {
    try {
      return await this.userRepository.find();
    } catch (error) {
      return {message: error.message || 'Internal error'};
    }
  }

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
      user.permissions = [PermissionKeys.AccessAuthFeature];
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
