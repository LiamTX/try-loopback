import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import lodash from 'lodash';
import {ProvidersBindings, ServicesBindings} from '../../keys';
import {User} from '../../models';
import {BcryptProvider} from '../../providers/implementations/BcryptProvider';
import {UserRepository} from '../../repositories';
import {MyUserService} from '../../services/user-service';
import {ICreateUserDTO} from './ICreateUserDTO';

export interface ICreateUserUseCase {
  execute(data: ICreateUserDTO): Promise<User>;
}

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
    @inject(ProvidersBindings.HASHER_PROVIDER)
    private passwordHasher: BcryptProvider,
    @inject(ServicesBindings.USER_SERVICE)
    private userService: MyUserService,
  ) { }

  async execute(data: ICreateUserDTO): Promise<User> {
    this.userService.validateCredentials(lodash.pick(data, ['nickname', 'password']));

    const userAlreadyExists = await this.userRepository.findOne({where: {nickname: data.nickname}});

    if (userAlreadyExists) throw new HttpErrors.Unauthorized('Nickname already in use.');

    data.password = await this.passwordHasher.encrypt(data.password);

    const user = new User(data);

    const saved = await this.userRepository.save(user);

    return Promise.resolve(saved);
  }
}
