import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {ProvidersBindings} from '../../keys';
import {BcryptProvider} from '../../providers/implementations/BcryptProvider';
import {JwtProvider} from '../../providers/implementations/JwtProvider';
import {UserRepository} from '../../repositories';
import {IAuthUserDTO} from './IAuthUserDTO';

export class AuthUserUseCase {
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
    @inject(ProvidersBindings.TOKEN_PROVIDER)
    private tokenProvider: JwtProvider,
    @inject(ProvidersBindings.ENCRYPT_PROVIDER)
    private passwordHasher: BcryptProvider,
  ) { }

  async execute(data: IAuthUserDTO) {
    const foundUser = await this.userRepository.findOne({where: {nickname: data.nickname}});

    if (!foundUser) {
      throw new HttpErrors.NotFound('User not found with this nickname: ' + data.nickname);
    }

    if (!await this.passwordHasher.decrypt(data.password, foundUser.password)) {
      throw new HttpErrors.Unauthorized('Password is not valid');
    }

    const token = await this.tokenProvider.generate(data.nickname);

    return {token};
  }
}
