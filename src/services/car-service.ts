import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserRepository} from '../repositories';
import {CarCredentials} from '../repositories/car.repository';

export interface IMyCarService {
  validateFields(credentials: CarCredentials): void;
}

export class MyCarService implements IMyCarService {
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
  ) { }

  async validateFields(credentials: CarCredentials) {
    const user = await this.userRepository.findOne({where: {id: credentials.userId}});

    if (!user) throw new HttpErrors.NotFound('User not found.');

    if (credentials.brand.length < 5) throw new HttpErrors.UnprocessableEntity('Brand length should be greater than 5')
    if (credentials.model.length < 5) throw new HttpErrors.UnprocessableEntity('Model length should be greater than 5')
    if (credentials.color.length < 5) throw new HttpErrors.UnprocessableEntity('Color length should be greater than 5')
    if (!credentials.fab_date) throw new HttpErrors.UnprocessableEntity('Fabrication Date cannot be null')
    if (!credentials.price) throw new HttpErrors.UnprocessableEntity('Price Date cannot be null');

    return;
  }
}
