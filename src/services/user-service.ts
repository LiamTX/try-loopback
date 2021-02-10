import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {ProvidersBindings} from '../keys';
import {User} from '../models';
import {BcryptProvider} from '../providers/implementations/BcryptProvider';
import {Credentials, UserRepository} from '../repositories';

export class MyUserService implements UserService<User, Credentials>{
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
    @inject(ProvidersBindings.HASHER_PROVIDER)
    private passwordHasher: BcryptProvider,
  ) { }

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const foundUser = await this.userRepository.findOne({where: {nickname: credentials.nickname}});

    if (!foundUser) throw new HttpErrors.NotFound('User not found.');

    if (! await this.passwordHasher.decrypt(credentials.password, foundUser.password)) {
      throw new HttpErrors.Unauthorized('Password is not valid');
    }

    return foundUser;
  }
  convertToUserProfile(user: User): UserProfile {
    throw new Error('Method not implemented.');
  }
  validateCredentials(credentials: Credentials) {
    if (credentials.nickname.length < 5) {
      throw new HttpErrors.UnprocessableEntity('Nickname length should be greater than 5');
    }

    if (credentials.password.length < 8) {
      throw new HttpErrors.UnprocessableEntity('Password length should be greater than 8');
    }
  }
}
