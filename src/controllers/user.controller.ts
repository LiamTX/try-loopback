// Uncomment these imports to begin using these cool features!


import {inject} from '@loopback/core';
import {getJsonSchemaRef, post, requestBody, response} from '@loopback/rest';
import {User} from '../models';
import {CreateUserUseCase} from '../useCases/createUser/CreateUserUseCase';


export class UserController {
  constructor(
    @inject('useCase.user.create')
    private createUserUseCase: CreateUserUseCase,
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
}
