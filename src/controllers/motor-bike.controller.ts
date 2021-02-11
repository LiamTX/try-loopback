import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,


  patch, post,




  put,

  requestBody,
  response
} from '@loopback/rest';
import {PermissionKeys} from '../authorization/permission-keys';
import {MotorBike} from '../models';
import {MotorBikeRepository} from '../repositories';

export class MotorBikeController {
  constructor(
    @repository(MotorBikeRepository)
    public motorBikeRepository: MotorBikeRepository,
  ) { }

  /*
    Só o admin pode acessar essa rota
    Ele deve estar autenticado
  */
  @post('/motor-bikes')
  @response(200, {
    description: 'MotorBike model instance',
    content: {'application/json': {schema: getModelSchemaRef(MotorBike)}},
  })
  @authenticate({strategy: 'jwt', options: {required: [PermissionKeys.CreateMotorBike]}})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MotorBike, {
            title: 'NewMotorBike',
            exclude: ['id'],
          }),
        },
      },
    })
    motorBike: Omit<MotorBike, 'id'>,
  ): Promise<MotorBike> {
    return this.motorBikeRepository.create(motorBike);
  }

  @get('/motor-bikes/count')
  @response(200, {
    description: 'MotorBike model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MotorBike) where?: Where<MotorBike>,
  ): Promise<Count> {
    return this.motorBikeRepository.count(where);
  }

  @get('/motor-bikes')
  @response(200, {
    description: 'Array of MotorBike model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MotorBike, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MotorBike) filter?: Filter<MotorBike>,
  ): Promise<MotorBike[]> {
    return this.motorBikeRepository.find(filter);
  }

  /*
    Só o admin pode acessar essa rota
    Ele deve estar autenticado
  */
  @patch('/motor-bikes')
  @response(200, {
    description: 'MotorBike PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MotorBike, {partial: true}),
        },
      },
    })
    motorBike: MotorBike,
    @param.where(MotorBike) where?: Where<MotorBike>,
  ): Promise<Count> {
    return this.motorBikeRepository.updateAll(motorBike, where);
  }

  @get('/motor-bikes/{id}')
  @response(200, {
    description: 'MotorBike model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MotorBike, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MotorBike, {exclude: 'where'}) filter?: FilterExcludingWhere<MotorBike>
  ): Promise<MotorBike> {
    return this.motorBikeRepository.findById(id, filter);
  }

  /*
    Só o admin pode acessar essa rota
    Ele deve estar autenticado
  */
  @patch('/motor-bikes/{id}')
  @response(204, {
    description: 'MotorBike PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MotorBike, {partial: true}),
        },
      },
    })
    motorBike: MotorBike,
  ): Promise<void> {
    await this.motorBikeRepository.updateById(id, motorBike);
  }

  /*
    Só o admin pode acessar essa rota
    Ele deve estar autenticado
  */
  @put('/motor-bikes/{id}')
  @response(204, {
    description: 'MotorBike PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() motorBike: MotorBike,
  ): Promise<void> {
    await this.motorBikeRepository.replaceById(id, motorBike);
  }

  /*
    Só o admin pode acessar essa rota
    Ele deve estar autenticado
  */
  @del('/motor-bikes/{id}')
  @response(204, {
    description: 'MotorBike DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.motorBikeRepository.deleteById(id);
  }
}
