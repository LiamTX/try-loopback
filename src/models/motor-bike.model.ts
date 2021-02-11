import {Entity, model, property} from '@loopback/repository';

@model()
export class MotorBike extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  brand: string;

  @property({
    type: 'string',
    required: true,
  })
  model: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;


  constructor(data?: Partial<MotorBike>) {
    super(data);
  }
}

export interface MotorBikeRelations {
  // describe navigational properties here
}

export type MotorBikeWithRelations = MotorBike & MotorBikeRelations;
