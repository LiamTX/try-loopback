import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ProvidersBindings} from '../../keys';
import {User} from '../../models';
import {BcryptProvider} from '../../providers/implementations/BcryptProvider';
import {UserRepository} from '../../repositories';
import {ICreateUserDTO} from './ICreateUserDTO';

export class CreateUserUseCase {
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
    @inject(ProvidersBindings.ENCRYPT_PROVIDER)
    private passwordHasher: BcryptProvider,
  ) { }

  async execute(data: ICreateUserDTO) {
    const userAlreadyExists = await this.userRepository.findOne({where: {nickname: data.nickname}});

    if (userAlreadyExists) {
      throw new HttpErrors.Unauthorized('Nickname already in use.');
    }

    data.password = await this.passwordHasher.encrypt(data.password);

    const user = new User(data);

    const saved = await this.userRepository.create(user);

    return saved;
  }
}
