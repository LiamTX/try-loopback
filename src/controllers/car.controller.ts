// Uncomment these imports to begin using these cool features!

import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {del, get, getJsonSchemaRef, getModelSchemaRef, param, post, requestBody, response} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {UseCasesBindings} from '../keys';
import {Car} from '../models';
import {CarRepository} from '../repositories';
import {CreateCarUseCase} from '../useCases/createCar/CreateCarUseCase';
import {DelCarUseCase} from '../useCases/delCar/DelCarUseCase';

// import {inject} from '@loopback/core';


export class CarController {
  constructor(
    @inject(UseCasesBindings.CREATE_CAR)
    private createCarUseCase: CreateCarUseCase,
    @inject(UseCasesBindings.DEL_CAR)
    private delCarUseCase: DelCarUseCase,
    @repository(CarRepository)
    private carRepository: CarRepository,
  ) { }

  /*
    --Cadastra um novo carro--

    Recebe um json :
    {
      brand*: string,
      model*: string,
      fab_date*: date - ex. "2011-07-14T19:43:37+0100",
      price*: number,
      color*: string
    }
    É necessario enviar um "Authorization" junto ao header da requisição com:
      Bearer "token recebido ao efetuar a autenticação"*

    Retorna um json:
    {
      "CarSchema"
    }
  */
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

  /*
    --Lista todos os carros--

    Retorna um Array com:
    {
      "CarJsonSchema"
    }
  */
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


  /*
    --Deleta um carro--

    Recebe um id nos Params da Requisição.
    É necessario enviar um "Authorization" junto ao header da requisição com:
      Bearer "token recebido ao efetuar a autenticação"*

    Retorna "204"
  */
  @del('/api/cars/{id}/del')
  @response(204, {
    description: 'Car deleted'
  })
  @authenticate('jwt')
  async delete(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.path.number('id') id: number
  ) {
    try {
      return await this.delCarUseCase.execute({id: id, userId: currentUser.id});
    } catch (error) {
      return {message: error.message || 'Internal error'};
    }
  }
}
