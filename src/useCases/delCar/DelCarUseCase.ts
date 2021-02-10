import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {CarRepository, UserRepository} from '../../repositories';
import {IDelCarDTO} from './IDelCarDTO';

export interface IDelCarUseCase {
  execute(data: IDelCarDTO): Promise<void>
}

export class DelCarUseCase implements IDelCarUseCase {
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
    @repository(CarRepository)
    private carRepository: CarRepository,
  ) { }

  async execute(data: IDelCarDTO): Promise<void> {
    const user = await this.userRepository.findOne({where: {id: data.userId}});
    const car = await this.carRepository.findOne({where: {id: data.id}});

    if (!user) throw new HttpErrors.NotFound('User not found.');
    if (!car) throw new HttpErrors.NotFound('Car not found.');
    if (user.id !== car.userId) throw new HttpErrors.Unauthorized('This car is not yours');

    const deleted = await this.carRepository.deleteById(car.id);

    return deleted;
  }
}
