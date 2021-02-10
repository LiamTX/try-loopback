import {UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {User} from './models';
import {IHasherProvider} from './providers/IHasherProvider';
import {ITokenProvider} from './providers/ITokenProvider';
import {Credentials} from './repositories';
import {IMyCarService} from './services/car-service';
import {IAuthUserUseCase} from './useCases/authUser/AuthUserUseCase';
import {ICreateCarUseCase} from './useCases/createCar/CreateCarUseCase';
import {ICreateUserUseCase} from './useCases/createUser/CreateUserUseCase';

export namespace UseCasesBindings {
  export const CREATE_USER = BindingKey.create<ICreateUserUseCase>(
    'useCase.user.create'
  );
  export const AUTH_USER = BindingKey.create<IAuthUserUseCase>(
    'useCase.user.auth'
  );
  export const CREATE_CAR = BindingKey.create<ICreateCarUseCase>(
    'useCase.car.create'
  )
}

export namespace ProvidersBindings {
  export const HASHER_PROVIDER = BindingKey.create<IHasherProvider>(
    'provider.hasher'
  );
  export const TOKEN_PROVIDER = BindingKey.create<ITokenProvider>(
    'provider.token'
  )
}

export namespace ServicesBindings {
  export const USER_SERVICE = BindingKey.create<UserService<Credentials, User>>(
    'service.user'
  );
  export const CAR_SERVICE = BindingKey.create<IMyCarService>(
    'service.car'
  )
}
