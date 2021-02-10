import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Car,
  User,
} from '../models';
import {CarRepository} from '../repositories';

export class CarUserController {
  constructor(
    @repository(CarRepository)
    public carRepository: CarRepository,
  ) { }

  @get('/cars/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Car',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Car.prototype.id,
  ): Promise<User> {
    return this.carRepository.user(id);
  }
}
