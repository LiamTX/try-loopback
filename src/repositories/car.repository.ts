import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {LocalDbDataSource} from '../datasources';
import {Car, CarRelations, User} from '../models';
import {UserRepository} from './user.repository';

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
