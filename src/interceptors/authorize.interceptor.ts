import {AuthenticationBindings, AuthenticationMetadata} from '@loopback/authentication';
import {
  Getter,
  globalInterceptor,
  inject,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {intersection} from 'lodash';
import {UserRepository} from '../repositories';
import {IRequiredPermissions} from '../types';
/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', {tags: {name: 'authorize'}})
export class AuthorizeInterceptor implements Provider<Interceptor> {

  constructor(
    @inject(AuthenticationBindings.METADATA)
    public metadata: AuthenticationMetadata[],
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<{id: number}>,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }


  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    // eslint-disable-next-line no-useless-catch
    try {
      /* Log do metadata */console.log(this.metadata);

      //Caso não tenha opções no @authenticate siga a linha abaixo
      if (!this.metadata) {
        // eslint-disable-next-line @typescript-eslint/return-await
        return await next();
      }

      /* Intercepta as opções do metatada caso exista */const [{options}] = this.metadata;

      const result = await next();

      const requiredPermissions = options as IRequiredPermissions;
      /* Log das permissões para o endpoint caso exista -> */console.log(requiredPermissions);

      /*
        Intercepta as informações do usuario que chamou a rota e efetua um log
      */
      const userId = await this.getCurrentUser();
      const user = await this.userRepository.findById(userId.id);
      console.log(user);

      /*
        compara as permissões do user com as permissões da rota
      */
      const results = intersection(user.permissions, requiredPermissions.required).length;

      console.log(results)
      console.log(requiredPermissions.required.length);

      /* Verifica se o acesso é valido case */
      if (results !== requiredPermissions.required.length) {
        throw new HttpErrors.Forbidden('Invalid access');
      }

      return result;
    } catch (err) {
      throw err;
    }
  }
}
