import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {LocalDbDataSource} from '../datasources';
import {Car, CarRelations, User} from '../models';
import {UserRepository} from './user.repository';

export type CarCredentials = {
  brand: string;
  model: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  fab_date: string;
  price: number;
  color: string;
  userId: number;
}

export class CarRepository extends DefaultCrudRepository<
  Car,
  typeof Car.prototype.id,
  CarRelations
  > {

  public readonly user: BelongsToAccessor<User, typeof Car.prototype.id>;

  constructor(
    @inject('datasources.localDb') dataSource: LocalDbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Car, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
