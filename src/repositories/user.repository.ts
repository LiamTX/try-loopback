import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {LocalDbDataSource} from '../datasources';
import {User, UserRelations} from '../models';

export type Credentials = {
  nickname: string;
  password: string;
}

// export type UserProfile = {
//   id: number;
//   nickname: string;
// }

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
  > {
  constructor(
    @inject('datasources.localDb') dataSource: LocalDbDataSource,
  ) {
    super(User, dataSource);
  }
}
