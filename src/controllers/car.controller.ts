// Uncomment these imports to begin using these cool features!

import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getJsonSchemaRef, getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {UseCasesBindings} from '../keys';
import {Car} from '../models';
import {CarRepository} from '../repositories';
import {CreateCarUseCase} from '../useCases/createCar/CreateCarUseCase';

// import {inject} from '@loopback/core';


export class CarController {
  constructor(
    @inject(UseCasesBindings.CREATE_CAR)
    private createCarUseCase: CreateCarUseCase,
    @repository(CarRepository)
    private carRepository: CarRepository,
  ) { }

  @post('/api/cars/create')
  @response(200, {
    description: 'Car Created',
    content: {
      schema: getJsonSchemaRef(Car)
    }
  })
  @authenticate('jwt')
  async create(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @requestBody() car: Car
  ) {
    try {
      car.userId = currentUser.id;

      return await this.createCarUseCase.execute(car);
    } catch (error) {
      return {message: error.message || 'Internal error'};
    }
  }

  @get('/api/cars/all')
  @response(200, {
    description: 'All cars',
    content: {
      schema: getModelSchemaRef(Car)
    }
  })
  async findAll() {
    try {
      return await this.carRepository.find();
    } catch (error) {
      return {message: error.message || 'Internal error'};
    }
  }
}
