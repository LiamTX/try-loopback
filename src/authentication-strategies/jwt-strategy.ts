import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {ProvidersBindings} from '../keys';
import {JwtProvider} from '../providers/implementations/JwtProvider';

export class JwtStrategy implements AuthenticationStrategy {
  constructor(
    @inject(ProvidersBindings.TOKEN_PROVIDER)
    private tokenProvider: JwtProvider,
  ) { }

  name = 'jwt';

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(request);

    const id = await this.tokenProvider.verify(token);

    const object = Object.assign({id: id});

    return Promise.resolve(object);
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization header is missing.');
    }

    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue?.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized('Authorization header is not type of Bearer');
    }

    const parts = authHeaderValue.split(' ');

    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized('Authorization header dont follow this pattern: "Bearer xxx.yyy.zzz"');
    }

    const token = parts[1];

    return token;
  }
}
