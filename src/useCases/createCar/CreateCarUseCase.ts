import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ServicesBindings} from '../../keys';
import {Car} from '../../models';
import {CarRepository} from '../../repositories';
import {MyCarService} from '../../services/car-service';
import {ICreateCarDTO} from './ICreateCarDTO';

export interface ICreateCarUseCase {
  execute(data: ICreateCarDTO): Promise<Car>;
}

export class CreateCarUseCase implements ICreateCarUseCase {
  constructor(
    @repository(CarRepository)
    private carRepository: CarRepository,
    @inject(ServicesBindings.CAR_SERVICE)
    private carService: MyCarService,
  ) { }

  async execute(data: ICreateCarDTO): Promise<Car> {
    await this.carService.validateFields(data);

    const car = new Car(data);

    const saved = await this.carRepository.save(car);

    return saved;
  }
}
