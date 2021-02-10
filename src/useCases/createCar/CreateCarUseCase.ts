import {repository} from '@loopback/repository';
import {UserRepository} from '../../repositories';
import {ICreateCarDTO} from './ICreateCarDTO';

export class CreateCarUseCase {
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
  ) { }

  async execute(data: ICreateCarDTO) {


    return;
  }
}
