import {BindingKey} from '@loopback/core';
import {IHasherProvider} from './providers/IHasherProvider';

export namespace ProvidersBindings {
  export const ENCRYPT_PROVIDER = BindingKey.create<IHasherProvider>(
    'providers.hasher'
  )
}
