import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ProvidersBindings, ServicesBindings} from '../../keys';
import {JwtProvider} from '../../providers/implementations/JwtProvider';
import {UserRepository} from '../../repositories';
import {MyUserService} from '../../services/user-service';
import {IAuthUserDTO} from './IAuthUserDTO';

export interface IAuthUserUseCase {
  execute(data: IAuthUserDTO): Promise<{token: string}>;
}

export class AuthUserUseCase implements IAuthUserUseCase {
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
    @inject(ServicesBindings.USER_SERVICE)
    private userService: MyUserService,
    @inject(ProvidersBindings.TOKEN_PROVIDER)
    private tokenProvider: JwtProvider,
  ) { }

  async execute(data: IAuthUserDTO): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(data);

    const token = await this.tokenProvider.generate(user.id);

    return Promise.resolve({token});
  }
}
