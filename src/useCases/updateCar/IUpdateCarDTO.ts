import {Car} from '../../models';

export interface IUpdateCarDTO {
  id: number;
  userId: number;
  car: Car
}
