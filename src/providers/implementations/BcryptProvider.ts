import bcrypt from 'bcrypt';
import {IHasherProvider} from '../IHasherProvider';

export class BcryptProvider implements IHasherProvider {
  async encrypt(data: string): Promise<string> {
    return bcrypt.hashSync(data, 12);
  }
  async decrypt(provided: string, stored: string): Promise<boolean> {
    return bcrypt.compareSync(provided, stored);
  }

}
