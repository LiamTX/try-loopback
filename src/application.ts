import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {JwtStrategy} from './authentication-strategies/jwt-strategy';
import {ProvidersBindings, ServicesBindings, UseCasesBindings} from './keys';
import {BcryptProvider} from './providers/implementations/BcryptProvider';
import {JwtProvider} from './providers/implementations/JwtProvider';
import {MySequence} from './sequence';
import {MyCarService} from './services/car-service';
import {MyUserService} from './services/user-service';
import {AuthUserUseCase} from './useCases/authUser/AuthUserUseCase';
import {CreateCarUseCase} from './useCases/createCar/CreateCarUseCase';
import {CreateUserUseCase} from './useCases/createUser/CreateUserUseCase';

export {ApplicationConfig};

export class TryLoopbackApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.setBindings();

    this.component(AuthenticationComponent)
    registerAuthenticationStrategy(this, JwtStrategy);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setBindings(): void {
    //UseCases
    this.bind(UseCasesBindings.CREATE_USER).toClass(CreateUserUseCase);
    this.bind(UseCasesBindings.AUTH_USER).toClass(AuthUserUseCase);
    this.bind(UseCasesBindings.CREATE_CAR).toClass(CreateCarUseCase);
    //Providers
    this.bind(ProvidersBindings.HASHER_PROVIDER).toClass(BcryptProvider);
    this.bind(ProvidersBindings.TOKEN_PROVIDER).toClass(JwtProvider);
    //Services
    this.bind(ServicesBindings.USER_SERVICE).toClass(MyUserService);
    this.bind(ServicesBindings.CAR_SERVICE).toClass(MyCarService);
  }
}
