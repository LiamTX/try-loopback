import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {LocalDbDataSource} from '../datasources';
import {MotorBike, MotorBikeRelations} from '../models';

export class MotorBikeRepository extends DefaultCrudRepository<
  MotorBike,
  typeof MotorBike.prototype.id,
  MotorBikeRelations
> {
  constructor(
    @inject('datasources.localDb') dataSource: LocalDbDataSource,
  ) {
    super(MotorBike, dataSource);
  }
}
