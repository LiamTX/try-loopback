// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {getJsonSchemaRef, post, requestBody, response} from '@loopback/rest';
import {PermissionKeys} from '../authorization/permission-keys';
import {UseCasesBindings} from '../keys';
import {User} from '../models';
import {CreateUserUseCase} from '../useCases/createUser/CreateUserUseCase';

// import {inject} from '@loopback/core';


export class AdminController {
  constructor(
    @inject(UseCasesBindings.CREATE_USER)
    private createUserUseCase: CreateUserUseCase,
  ) { }

  @post('/api/admins/create')
  @response(200, {
    description: 'Admin Created',
    content: {
      schema: getJsonSchemaRef(User)
    }
  })
  async create(@requestBody() admin: User) {
    try {
      admin.permissions = [
        PermissionKeys.UpdateMotorBike,
        PermissionKeys.CreateMotorBike,
        PermissionKeys.DeleteMotorBike
      ]
      return await this.createUserUseCase.execute(admin);
    } catch (error) {
      return {message: error.message || 'Internal error'};
    }
  }
}
