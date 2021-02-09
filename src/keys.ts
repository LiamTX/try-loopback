import {BindingKey} from '@loopback/core';
import {IHasherProvider} from './providers/IHasherProvider';
import {ITokenProvider} from './providers/ITokenProvider';

export namespace ProvidersBindings {
  export const ENCRYPT_PROVIDER = BindingKey.create<IHasherProvider>(
    'providers.hasher'
  );

  export const TOKEN_PROVIDER = BindingKey.create<ITokenProvider>(
    'providers.token'
  )
}
