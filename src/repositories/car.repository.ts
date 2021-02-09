import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MySqlDataDataSource} from '../datasources';
import {Car, CarRelations} from '../models';

export class CarRepository extends DefaultCrudRepository<
  Car,
  typeof Car.prototype.id,
  CarRelations
> {
  constructor(
    @inject('datasources.MySqlData') dataSource: MySqlDataDataSource,
  ) {
    super(Car, dataSource);
  }
}
