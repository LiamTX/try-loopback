import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Car} from '../../models';
import {CarRepository, UserRepository} from '../../repositories';
import {IUpdateCarDTO} from './IUpdateCarDTO';

export interface IUpdateCarUseCase {
  execute(data: IUpdateCarDTO): Promise<void>
}

export class UpdateCarUseCase implements IUpdateCarUseCase {
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
    @repository(CarRepository)
    private carRepositsory: CarRepository
  ) { }

  async execute(data: IUpdateCarDTO): Promise<void> {
    const user = await this.userRepository.findOne({where: {id: data.userId}});
    const car = await this.carRepositsory.findOne({where: {id: data.id}});

    if (!user) throw new HttpErrors.NotFound('User not found.');
    if (!car) throw new HttpErrors.NotFound('Car not found.');
    if (user.id !== car.userId) throw new HttpErrors.Unauthorized('This car is not yours');

    const updatedCar = new Car(data.car);

    const patched = await this.carRepositsory.updateById(car.id, updatedCar);

    return patched;
  }

}
